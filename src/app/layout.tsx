import type { Metadata } from "next";
import { Google_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const googleSans = Google_Sans({
  subsets: ["latin"],
  variable: "--font-google-sans",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "GestiónCTP27",
  description:
    "Sistema web de gestión para un Colegio Técnico Profesional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${googleSans.variable} h-full`}>
      <body className={`${googleSans.className} flex min-h-full flex-col antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
