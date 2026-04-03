import type { NextConfig } from "next";

function supabaseStorageHost(): string | undefined {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!u) return undefined;
  try {
    return new URL(u).hostname;
  } catch {
    return undefined;
  }
}

const host = supabaseStorageHost();
const remotePatterns = host
  ? [
      {
        protocol: "https" as const,
        hostname: host,
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https" as const,
        hostname: host,
        pathname: "/storage/v1/object/sign/**",
      },
    ]
  : [];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
