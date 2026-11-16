import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Paquetes de extracción de documentos que deben resolverse fuera del bundle
  // de servidor (pdf.js importa su worker dinámicamente).
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "mammoth", "jszip"],
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
        destination: "/simuladores/index.html",
        permanent: false,
      },
      {
        source: "/simuladores/",
        destination: "/simuladores/index.html",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
