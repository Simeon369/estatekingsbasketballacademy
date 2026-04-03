import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { toSignedOrRawUrl } from "@/lib/supabase/storageUrl";

export async function GET() {
  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ items: [] });
  }

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) return NextResponse.json({ items: [] });

  const items = await Promise.all((data || []).map(async (item) => ({
    ...item,
    image_url: await toSignedOrRawUrl(supabase, item.image_url),
  })));

  return NextResponse.json({ items });
}
