import { NextResponse } from "next/server";
import { signAdminJwt } from "@/lib/admin/jwt";

export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.ADMIN_JWT_SECRET;

  if (!adminPassword || !jwtSecret) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = (body as { password?: unknown })?.password;
  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = await signAdminJwt(jwtSecret);
  return NextResponse.json({ ok: true, token });
}

