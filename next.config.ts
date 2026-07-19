import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // เปิด WebP/AVIF optimization อัตโนมัติ
    formats: ["image/avif", "image/webp"],
    // ขนาด breakpoints สำหรับ responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      {
        protocol: "https",
        hostname: "zetta-joule.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // แก้ Turbopack root warning — ใช้ process.cwd() แทน __dirname
  turbopack: {
    root: process.cwd(),
  },
  // เปิด compression
  compress: true,
  // ปิด powered-by header
  poweredByHeader: false,
};

export default nextConfig;
