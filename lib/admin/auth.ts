import { verifyAdminJwt } from "@/lib/admin/jwt";

export async function requireAdminAuth(req: Request) {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return { ok: false as const, status: 500, error: "Server not configured" };

  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return { ok: false as const, status: 401, error: "Missing token" };

  const token = m[1];
  const payload = await verifyAdminJwt(token, secret);
  if (!payload) return { ok: false as const, status: 401, error: "Invalid token" };

  return { ok: true as const, payload };
}

