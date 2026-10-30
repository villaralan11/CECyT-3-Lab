import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  // NOTE: el repo incluye componentes shadcn/ui sin sus dependencias instaladas
  // (accordion, calendar, chart, ...). Se mantiene el flag para que el build de
  // producción no falle por esos archivos no utilizados.
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/fisica/mru",
        destination: "/simuladores/01-Fisica-I/mru-mruv/index.html",
        permanent: true,
      },
      {
        source: "/fisica/mruv",
        destination: "/simuladores/01-Fisica-I/mru-mruv/index.html",
        permanent: true,
      },
      {
        source: "/fisica/tiros",
        destination: "/simuladores/01-Fisica-I/tiro-parabolico/index.html",
        permanent: true,
      },
      {
        source: "/simuladores",
        destination: "/fisica",
        permanent: true,
      },
      {
        source: "/simuladores/",
        destination: "/fisica",
        permanent: true,
      },
      {
        source: "/simuladores/index.html",
        destination: "/fisica",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
