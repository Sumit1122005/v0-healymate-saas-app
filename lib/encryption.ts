import nacl from 'tweetnacl';
import { encode, decode } from 'js-base64';

// Derive encryption key from password using a deterministic approach
export function deriveKeyFromPassword(password: string, salt: Uint8Array = null): { key: Uint8Array; salt: Uint8Array } {
  // If no salt provided, generate a random one for this key derivation
  if (!salt) {
    salt = nacl.randomBytes(16);
  }

  // Simple key derivation: hash password with salt multiple times
  let keyMaterial = new TextEncoder().encode(password + Array.from(salt).join(''));
  
  // Use a simplified PBKDF2-like approach by hashing multiple times
  for (let i = 0; i < 1000; i++) {
    const hash = nacl.hash(keyMaterial);
    keyMaterial = hash.slice(0, 32);
  }

  return {
    key: keyMaterial.slice(0, 32),
    salt,
  };
}

// Encrypt data using secret box (authenticated encryption)
export function encryptData(data: string, password: string): string {
  try {
    const { key, salt } = deriveKeyFromPassword(password);
    const nonce = nacl.randomBytes(24);
    const plaintext = new TextEncoder().encode(data);

    const encrypted = nacl.secretbox(plaintext, nonce, key);

    // Combine salt, nonce, and ciphertext
    const combined = new Uint8Array(salt.length + nonce.length + encrypted.length);
    combined.set(salt, 0);
    combined.set(nonce, salt.length);
    combined.set(encrypted, salt.length + nonce.length);

    return encode(combined);
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

// Decrypt data using secret box
export function decryptData(encryptedData: string, password: string): string {
  try {
    const combined = new Uint8Array(decode(encryptedData).split('').map(c => c.charCodeAt(0)));

    // Extract salt, nonce, and ciphertext
    const salt = combined.slice(0, 16);
    const nonce = combined.slice(16, 40);
    const ciphertext = combined.slice(40);

    const { key } = deriveKeyFromPassword(password, salt);

    const plaintext = nacl.secretbox.open(ciphertext, nonce, key);

    if (!plaintext) {
      throw new Error('Decryption failed - invalid password or corrupted data');
    }

    return new TextDecoder().decode(plaintext);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data - invalid password or corrupted data');
  }
}

// Hash password for verification
export function hashPassword(password: string): string {
  const hashed = nacl.hash(new TextEncoder().encode(password));
  return encode(hashed);
}

// Verify password hash
export function verifyPasswordHash(password: string, hash: string): boolean {
  try {
    return hashPassword(password) === hash;
  } catch {
    return false;
  }
}
