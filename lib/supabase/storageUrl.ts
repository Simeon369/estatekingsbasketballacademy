import type { SupabaseClient } from "@supabase/supabase-js";

function tryDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

type BucketPath = { bucket: string; path: string } | null;

export function parseStorageBucketPath(raw: string | null | undefined): BucketPath {
  const value = (raw || "").trim();
  if (!value) return null;

  // Full or relative public storage URL
  const publicMatch = value.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (publicMatch) {
    return { bucket: publicMatch[1], path: tryDecode(publicMatch[2]) };
  }

  // Raw "bucket/path" format
  const slash = value.indexOf("/");
  if (slash > 0 && !/^https?:\/\//i.test(value)) {
    return { bucket: value.slice(0, slash), path: value.slice(slash + 1) };
  }

  return null;
}

export async function toSignedOrRawUrl(
  supabase: SupabaseClient,
  raw: string | null | undefined,
  defaultBucket = process.env.SUPABASE_STORAGE_BUCKET || "media",
): Promise<string> {
  const value = (raw || "").trim();
  if (!value) return "";

  const parsed = parseStorageBucketPath(value);
  if (parsed) {
    try {
      const { bucket, path } = parsed;
      const { data, error } = await supabase.storage
        .from(bucket || defaultBucket)
        .createSignedUrl(path, 60 * 60 * 24 * 7);
      if (error) return value;
      return data?.signedUrl || value;
    } catch {
      return value;
    }
  }

  // Treat plain paths as default bucket objects.
  if (!/^https?:\/\//i.test(value)) {
    try {
      const { data, error } = await supabase.storage
        .from(defaultBucket)
        .createSignedUrl(value, 60 * 60 * 24 * 7);
      if (error) return value;
      return data?.signedUrl || value;
    } catch {
      return value;
    }
  }

  return value;
}
