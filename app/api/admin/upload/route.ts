import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { requireAdminAuth } from "@/lib/admin/auth";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "media";

export async function POST(req: Request) {
  const auth = await requireAdminAuth(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const file = form.get("file");
  const folderRaw = form.get("folder");
  const folder = folderRaw === "events" ? "events" : "gallery";

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  const original = file.name || "upload";
  const ext = original.includes(".") ? original.split(".").pop()!.toLowerCase().slice(0, 8) : "jpg";
  const safeExt = /^[a-z0-9]+$/i.test(ext) ? ext : "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${safeExt}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
