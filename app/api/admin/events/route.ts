import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/admin/auth";

type EventRow = {
  id: number;
  title: string;
  date: string;
  description: string;
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
    .from("upcoming_events")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to load events" }, { status: 500 });
  }

  return NextResponse.json({ events: (data || []) as EventRow[] });
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

  const events = (body as { events?: unknown })?.events;
  if (!Array.isArray(events)) {
    return NextResponse.json({ error: "Events array is required" }, { status: 400 });
  }

  const rows = events.map((e, idx) => {
    const row = e as Partial<EventRow>;
    return {
      title: row.title ?? "",
      date: row.date ?? "",
      description: row.description ?? "",
      sort_order: idx,
    };
  });

  const { error: delErr } = await supabase.from("upcoming_events").delete().neq("id", -1);
  if (delErr) {
    return NextResponse.json({ error: "Failed to save events" }, { status: 500 });
  }

  if (rows.length > 0) {
    const { error: insErr } = await supabase.from("upcoming_events").insert(rows);
    if (insErr) {
      return NextResponse.json({ error: "Failed to save events" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}

