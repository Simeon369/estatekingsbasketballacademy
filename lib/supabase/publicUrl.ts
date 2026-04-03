function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}

export function toSupabasePublicUrl(raw: string | null | undefined): string {
  const value = (raw || "").trim();
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) return value;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "media";
  if (!base) return value;

  // Already a storage-style absolute path.
  if (value.startsWith("/storage/v1/object/public/")) {
    return `${base}${value}`;
  }

  const cleanPath = trimSlashes(value);
  return `${base}/storage/v1/object/public/${trimSlashes(bucket)}/${cleanPath}`;
}
