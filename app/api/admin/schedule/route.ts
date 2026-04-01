import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/admin/auth";

type SessionRow = {
  id: number;
  day: string;
  time: string;
  program: string;
  sort_order: number;
};

export async function GET(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("schedule_sessions")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to load schedule" }, { status: 500 });
  }

  return NextResponse.json({ sessions: (data || []) as SessionRow[] });
}

export async function PUT(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const sessions = (body as { sessions?: unknown })?.sessions;
  if (!Array.isArray(sessions)) {
    return NextResponse.json({ error: "Sessions array is required" }, { status: 400 });
  }

  const rows = sessions.map((s, idx) => {
    const row = s as Partial<SessionRow>;
    return {
      id: typeof row.id === "number" ? row.id : undefined,
      day: row.day ?? "",
      time: row.time ?? "",
      program: row.program ?? "",
      sort_order: typeof row.sort_order === "number" ? row.sort_order : idx,
    };
  });

  // Replace all rows (simple + predictable)
  const { error: delErr } = await supabase.from("schedule_sessions").delete().neq("id", -1);
  if (delErr) {
    return NextResponse.json({ error: "Failed to save schedule" }, { status: 500 });
  }

  const { error: insErr } = await supabase.from("schedule_sessions").insert(
    rows.map((r, i) => ({
      day: r.day,
      time: r.time,
      program: r.program,
      sort_order: i,
    }))
  );

  if (insErr) {
    return NextResponse.json({ error: "Failed to save schedule" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

