import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: "/", destination: "/ar", permanent: true },
      { source: "/products", destination: "/ar/parts", permanent: true },
      {
        source: "/products/toyota",
        destination: "/ar/parts",
        permanent: true,
      },
      {
        source: "/products/hyundai",
        destination: "/ar/parts",
        permanent: true,
      },
      {
        source: "/products/:slug",
        destination: "/ar/products/:slug",
        permanent: true,
      },
      { source: "/catalogs", destination: "/ar/catalogs", permanent: true },
      {
        source: "/private-label",
        destination: "/ar/private-label",
        permanent: true,
      },
      {
        source: "/quality-control",
        destination: "/ar/sourcing-services",
        permanent: true,
      },
      { source: "/about", destination: "/ar/about", permanent: true },
      { source: "/contact", destination: "/ar/contact", permanent: true },
      { source: "/rfq", destination: "/ar/rfq", permanent: true },
    ];
  },
};

export default nextConfig;
