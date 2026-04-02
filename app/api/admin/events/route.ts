import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/admin/auth";
import type { AnnouncementEventRow } from "@/lib/types/content";

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

  return NextResponse.json({ events: (data || []) as AnnouncementEventRow[] });
}

export async function POST(req: Request) {
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

  const b = body as {
    title?: unknown;
    description?: unknown;
    event_time?: unknown;
    location?: unknown;
    banner_url?: unknown;
  };

  if (typeof b.title !== "string" || b.title.trim().length === 0) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (typeof b.banner_url !== "string" || b.banner_url.length === 0) {
    return NextResponse.json({ error: "banner_url is required" }, { status: 400 });
  }

  const title = b.title.trim();
  const description = typeof b.description === "string" ? b.description : "";
  const event_time = typeof b.event_time === "string" ? b.event_time : "";
  const location = typeof b.location === "string" ? b.location : "";
  const banner_url = b.banner_url.trim();

  const { data: maxRow } = await supabase
    .from("upcoming_events")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sort_order = (maxRow?.sort_order ?? -1) + 1;
  const dateLabel = event_time || title;

  const { data: inserted, error } = await supabase
    .from("upcoming_events")
    .insert({
      title,
      description,
      date: dateLabel,
      banner_url,
      event_time,
      location,
      sort_order,
    })
    .select("*")
    .single();

  if (error || !inserted) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }

  return NextResponse.json({ event: inserted as AnnouncementEventRow });
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

  const b = body as {
    id?: unknown;
    title?: unknown;
    description?: unknown;
    event_time?: unknown;
    location?: unknown;
    banner_url?: unknown;
  };

  const id = typeof b.id === "number" ? b.id : Number(b.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  if (typeof b.title !== "string" || b.title.trim().length === 0) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const title = b.title.trim();
  const description = typeof b.description === "string" ? b.description : "";
  const event_time = typeof b.event_time === "string" ? b.event_time : "";
  const location = typeof b.location === "string" ? b.location : "";
  const banner_url =
    typeof b.banner_url === "string" && b.banner_url.length > 0 ? b.banner_url.trim() : null;

  const patch: Record<string, unknown> = {
    title,
    description,
    event_time,
    location,
    date: event_time || title,
  };
  if (banner_url) patch.banner_url = banner_url;

  const { data: updated, error } = await supabase
    .from("upcoming_events")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !updated) {
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }

  return NextResponse.json({ event: updated as AnnouncementEventRow });
}

export async function DELETE(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const idRaw = new URL(req.url).searchParams.get("id");
  const id = idRaw ? Number(idRaw) : NaN;
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const { error } = await supabase.from("upcoming_events").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
