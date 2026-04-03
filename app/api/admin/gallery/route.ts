import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/admin/auth";
import { toSignedOrRawUrl } from "@/lib/supabase/storageUrl";
import type { GalleryItemRow } from "@/lib/types/content";

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
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to load gallery" }, { status: 500 });
  }

  const items = await Promise.all(((data || []) as GalleryItemRow[]).map(async (item) => ({
    ...item,
    image_url: await toSignedOrRawUrl(supabase, item.image_url),
  })));

  return NextResponse.json({ items });
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

  const image_url = (body as { image_url?: unknown })?.image_url;
  const description = (body as { description?: unknown })?.description;
  if (typeof image_url !== "string" || image_url.length === 0) {
    return NextResponse.json({ error: "image_url is required" }, { status: 400 });
  }
  const descStr = typeof description === "string" ? description : "";

  const { data: maxRow } = await supabase
    .from("gallery_items")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sort_order = (maxRow?.sort_order ?? -1) + 1;

  const { data: inserted, error } = await supabase
    .from("gallery_items")
    .insert({ image_url, description: descStr, sort_order })
    .select("*")
    .single();

  if (error || !inserted) {
    return NextResponse.json({ error: "Failed to add gallery item" }, { status: 500 });
  }

  return NextResponse.json({ item: inserted as GalleryItemRow });
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

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
