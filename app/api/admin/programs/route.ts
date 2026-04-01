import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/admin/auth";

type ProgramRow = {
  id: number;
  title: string;
  age_group: string;
  description: string;
  price: string | null;
  features: string[];
  featured: boolean;
  updated_at: string;
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
    .from("programs")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to load programs" }, { status: 500 });
  }

  return NextResponse.json({ programs: (data || []) as ProgramRow[] });
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

  const program = (body as { program?: unknown })?.program as Partial<ProgramRow> | undefined;
  if (!program || typeof program.id !== "number") {
    return NextResponse.json({ error: "Program is required" }, { status: 400 });
  }

  const { error } = await supabase.from("programs").upsert({
    id: program.id,
    title: program.title ?? "",
    age_group: program.age_group ?? "",
    description: program.description ?? "",
    price: program.price ?? null,
    features: Array.isArray(program.features) ? program.features : [],
    featured: Boolean(program.featured),
  });

  if (error) {
    return NextResponse.json({ error: "Failed to save program" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

