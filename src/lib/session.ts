// HMAC-signed session tokens. Uses Web Crypto so it runs in both middleware (edge) and Node.
export const SESSION_COOKIE = 'cms_session';
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

const encoder = new TextEncoder();

async function sign(value: string): Promise<string> {
  const secret = process.env.CMS_SESSION_SECRET;
  if (!secret) throw new Error('CMS_SESSION_SECRET is not set');
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  const expires = String(Date.now() + SESSION_MAX_AGE * 1000);
  return `${expires}.${await sign(expires)}`;
}

export async function verifySessionToken(token: string | null | undefined): Promise<boolean> {
  if (!token || typeof token !== 'string') return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  try {
    return safeEqual(signature, await sign(expires));
  } catch {
    return false; // missing secret => fail closed
  }
}
