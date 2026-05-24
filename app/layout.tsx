import type { Metadata } from "next";

import { SiteHeader } from "@/components/layout/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Engineer Skill Graph",
  description: "Mapa vivo para evolucionar hacia AI Engineering en español.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
