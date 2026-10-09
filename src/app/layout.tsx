import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

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
    <html lang="es" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full flex-col font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var g=localStorage.getItem("theme");var o=g==="dark"||((g==null||g==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",o);r.style.colorScheme=o?"dark":"light";}catch(e){}})();`,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
