// Helper to convert string to Uint8Array
function stringToUint8Array(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

// Helper to convert Uint8Array to base64
function uint8ArrayToBase64(arr: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < arr.byteLength; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary);
}

// Helper to convert base64 to Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Derive encryption key from password using PBKDF2
export async function deriveKeyFromPassword(
  password: string,
  salt: Uint8Array | null = null
): Promise<{ key: CryptoKey; salt: Uint8Array }> {
  // Generate or use provided salt
  if (!salt) {
    salt = crypto.getRandomValues(new Uint8Array(16));
  }

  // Import password as key material
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    stringToUint8Array(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive key using PBKDF2
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  return { key, salt };
}

// Encrypt data using AES-GCM (authenticated encryption)
export async function encryptData(data: string, password: string): Promise<string> {
  try {
    const { key, salt } = await deriveKeyFromPassword(password);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
    const plaintext = stringToUint8Array(data);

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      plaintext
    );

    // Combine salt, iv, and ciphertext
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    return uint8ArrayToBase64(combined);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

// Decrypt data using AES-GCM
export async function decryptData(encryptedData: string, password: string): Promise<string> {
  try {
    const combined = base64ToUint8Array(encryptedData);

    // Extract salt, iv, and ciphertext
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);

    const { key } = await deriveKeyFromPassword(password, salt);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data - invalid password or corrupted data');
  }
}

// Hash password for verification using SHA-256
export async function hashPassword(password: string): Promise<string> {
  const encoded = stringToUint8Array(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  return uint8ArrayToBase64(new Uint8Array(hashBuffer));
}

// Verify password hash
export async function verifyPasswordHash(password: string, hash: string): Promise<boolean> {
  try {
    const newHash = await hashPassword(password);
    return newHash === hash;
  } catch {
    return false;
  }
}
