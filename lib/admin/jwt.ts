type JwtPayload = {
  sub: string;
  role: "admin";
  iat: number;
  exp: number;
};

function b64urlEncodeBytes(bytes: Uint8Array) {
  const str = Buffer.from(bytes).toString("base64");
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function b64urlEncodeJson(obj: unknown) {
  return b64urlEncodeBytes(new TextEncoder().encode(JSON.stringify(obj)));
}

function b64urlDecodeToBytes(str: string) {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4 ? "=".repeat(4 - (base64.length % 4)) : "";
  return new Uint8Array(Buffer.from(base64 + pad, "base64"));
}

function safeJsonParse<T>(str: string): T | null {
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
}

async function hmacSha256(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message)
  );
  return new Uint8Array(sig);
}

export async function signAdminJwt(secret: string, maxAgeSeconds = 60 * 60 * 24 * 7) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    sub: "admin",
    role: "admin",
    iat: now,
    exp: now + maxAgeSeconds,
  };

  const encodedHeader = b64urlEncodeJson(header);
  const encodedPayload = b64urlEncodeJson(payload);
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const sigBytes = await hmacSha256(secret, signingInput);
  const signature = b64urlEncodeBytes(sigBytes);
  return `${signingInput}.${signature}`;
}

export async function verifyAdminJwt(token: string, secret: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const signingInput = `${h}.${p}`;

  // signature check
  const sigBytes = b64urlDecodeToBytes(s);
  const expected = await hmacSha256(secret, signingInput);
  if (sigBytes.length !== expected.length) return null;
  for (let i = 0; i < sigBytes.length; i++) {
    if (sigBytes[i] !== expected[i]) return null;
  }

  const payloadStr = new TextDecoder().decode(b64urlDecodeToBytes(p));
  const payload = safeJsonParse<JwtPayload>(payloadStr);
  if (!payload) return null;
  if (payload.role !== "admin") return null;
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== "number" || now > payload.exp) return null;
  return payload;
}

