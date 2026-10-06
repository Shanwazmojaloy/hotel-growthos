import type { NextConfig } from "next";
import { withMicrofrontends } from "@vercel/microfrontends/next/config";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "64kb",
    },
  },
};

export default withMicrofrontends(nextConfig);
