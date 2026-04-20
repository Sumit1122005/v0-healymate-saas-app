'use client';

import { useState, useCallback } from 'react';
import { encryptData, decryptData } from '@/lib/encryption';

export function useEncryptedData() {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const encrypt = useCallback(
    async (data: string, password: string): Promise<string | null> => {
      setIsEncrypting(true);
      setError(null);
      try {
        const encrypted = await encryptData(data, password);
        return encrypted;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Encryption failed';
        setError(message);
        return null;
      } finally {
        setIsEncrypting(false);
      }
    },
    []
  );

  const decrypt = useCallback(
    async (encryptedData: string, password: string): Promise<string | null> => {
      setIsDecrypting(true);
      setError(null);
      try {
        const decrypted = await decryptData(encryptedData, password);
        return decrypted;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Decryption failed';
        setError(message);
        return null;
      } finally {
        setIsDecrypting(false);
      }
    },
    []
  );

  return {
    encrypt,
    decrypt,
    isEncrypting,
    isDecrypting,
    error,
    clearError: () => setError(null),
  };
}
