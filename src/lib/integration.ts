import crypto from "crypto";

/**
 * Vol-mart-next'dagi src/lib/integration.ts bilan BIR XIL algoritm
 * (HMAC-SHA256). Ikkala loyihada ham .env'da bir xil qiymat bo'lishi
 * shart: INTEGRATION_SECRET=...
 */
function getSecret(): string {
  const secret = process.env.INTEGRATION_SECRET;
  if (!secret) throw new Error("INTEGRATION_SECRET .env da o'rnatilmagan");
  return secret;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function signIntegrationToken(
  payload: Record<string, unknown>,
  expiresInSeconds = 60
): string {
  const body = { ...payload, exp: Math.floor(Date.now() / 1000) + expiresInSeconds };
  const encoded = base64url(JSON.stringify(body));
  const signature = base64url(
    crypto.createHmac("sha256", getSecret()).update(encoded).digest()
  );
  return `${encoded}.${signature}`;
}

export function getServerAuthHeader(): Record<string, string> {
  return { Authorization: `Bearer ${getSecret()}` };
}
