import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  async redirects() {
    return [
      {
        source: "/",
        destination: "/categories",
        permanent: false,
      },
    ];
  },
};

export default withPayload(nextConfig);
