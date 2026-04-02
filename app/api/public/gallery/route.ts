import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json({ items: [] });
  }

  const supabase = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) return NextResponse.json({ items: [] });
  return NextResponse.json({ items: data || [] });
}
