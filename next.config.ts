import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["pwfxluewdlealedfbwgd.supabase.co", "images.squarespace-cdn.com", "www.vibe.com"],
  },
  typescript: {
    // Allow production builds even if there are type errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
