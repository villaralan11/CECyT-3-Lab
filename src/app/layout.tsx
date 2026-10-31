import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";
import { EmbedMode } from "@/components/site/embed-mode";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cecyt3-lab.vercel.app"),
  title: "CECyT No. 3 Lab · IPN — Laboratorio virtual de Física, Química e Inglés",
  description:
    "Plataforma educativa interactiva del CECyT No. 3 «Estanislao Ramírez Ruiz» (IPN): simuladores de Física, Química e Inglés con secuencia didáctica basada en evidencia — falla productiva → simulador → ejemplo resuelto.",
  keywords: [
    "CECyT 3", "IPN", "Física", "Química", "Inglés", "simuladores",
    "cinemática", "nomenclatura IUPAC", "estequiometría", "laboratorio virtual",
  ],
  authors: [{ name: "Alan Antonio Molina Villar" }],
  openGraph: {
    title: "CECyT No. 3 Lab · Física, Química e Inglés",
    description:
      "Simuladores, retos y ejemplos resueltos con la secuencia falla productiva → simulador → ejemplo resuelto.",
    locale: "es_MX",
    type: "website",
    siteName: "CECyT No. 3 Lab",
    images: [{ url: "/cecyt3-logo-full.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        {/* Modo embed: marca <html> antes del primer pintado para que el iframe no muestre un destello de barra/pie */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(new URLSearchParams(location.search).get("embed")==="1")document.documentElement.classList.add("embed")}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen flex flex-col">
          <EmbedMode />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <BackToTop />
        <Toaster />
      </body>
    </html>
  );
}
