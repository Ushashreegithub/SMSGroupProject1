import type { NextConfig } from "next";

// On server: Django backend runs on port 8001 (or process.env.BACKEND_URL). Locally: port 8000.
const backendUrl = 
  process.env.BACKEND_URL || 
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') || 
  (process.env.NODE_ENV === 'production' ? 'http://127.0.0.1:8001' : 'http://127.0.0.1:8000');

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
      {
        source: '/media/:path*',
        destination: `${backendUrl}/media/:path*`,
      },
    ];
  },
};

export default nextConfig;
