import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Paquetes de extracción de documentos que deben resolverse fuera del bundle
  // de servidor (pdf.js importa su worker dinámicamente).
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "mammoth", "jszip"],
  // pdf.js carga pdf.worker.mjs con un import() dinámico (string no estático),
  // invisible para el trazado de archivos del lambda; sin esto, Vercel no copia
  // el worker ni las fuentes estándar y la extracción de PDF falla en runtime.
  outputFileTracingIncludes: {
    "/api/documents": [
      "./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs",
      "./node_modules/pdfjs-dist/standard_fonts/**",
    ],
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
