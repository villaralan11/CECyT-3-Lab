import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { BackToTop } from "@/components/site/back-to-top";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoMono = Noto_Sans_Mono({
  variable: "--font-noto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

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
    images: [{ url: "/cecyt3-logo-full-optimized.webp", width: 1200, height: 630, alt: "CECyT No. 3 Lab" }],
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
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cecyt3-lab.vercel.app" />
      </head>
      <body
        className={`${notoSans.variable} ${notoMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen flex flex-col">
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
