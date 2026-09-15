import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CECyT No. 3 Lab · IPN — Laboratorio virtual de Física, Química e Inglés",
  description:
    "Plataforma educativa interactiva del CECyT No. 3 «Estanislao Ramírez Ruiz» (IPN): simuladores de Física, Química e Inglés con secuencia didáctica basada en evidencia — falla productiva → simulador → ejemplo resuelto.",
  keywords: [
    "CECyT 3", "IPN", "Física", "Química", "Inglés", "simuladores",
    "cinemática", "nomenclatura IUPAC", "estequiometría", "laboratorio virtual",
  ],
  authors: [{ name: "Alan Antonio Molina Villar" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
