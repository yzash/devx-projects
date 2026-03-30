import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;

function getKey() {
  const rawKey = process.env.ENCRYPTION_KEY || 'demo-encryption-key-32-chars-pad';
  // Pad or truncate to exactly 32 bytes
  return Buffer.from(rawKey.padEnd(KEY_LENGTH, '0').slice(0, KEY_LENGTH), 'utf8');
}

/**
 * Encrypts plaintext using AES-256-CBC.
 * Returns a colon-separated string: iv:encryptedData (both hex-encoded).
 */
export function encrypt(text) {
  if (!text) return null;
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts a string produced by encrypt().
 * Returns the original plaintext.
 */
export function decrypt(encryptedText) {
  if (!encryptedText) return null;
  const key = getKey();
  const [ivHex, encrypted] = encryptedText.split(':');
  if (!ivHex || !encrypted) {
    throw new Error('Invalid encrypted text format');
  }
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
