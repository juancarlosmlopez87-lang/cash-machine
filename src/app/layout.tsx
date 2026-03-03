import type { Metadata } from "next";
import { SITE } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={SITE.lang}>
      <head>
        {SITE.adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="bg-white text-gray-900 antialiased">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" className="text-2xl font-black text-blue-600">
              {SITE.name}
            </a>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <a href="/" className="hover:text-gray-900">Inicio</a>
              <a href="/#tecnologia" className="hover:text-gray-900">Tecnologia</a>
              <a href="/#hogar" className="hover:text-gray-900">Hogar</a>
              <a href="/#deporte" className="hover:text-gray-900">Deporte</a>
            </nav>
          </div>
        </header>

        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-gray-50 py-12 mt-20">
          <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
            <p className="mb-2">
              {SITE.name} participa en el Programa de Afiliados de Amazon EU.
              Al comprar a traves de nuestros enlaces, ganamos una pequena comision sin coste adicional para ti.
            </p>
            <div className="flex justify-center gap-4 mb-3">
              <a href="/privacidad/" className="hover:text-gray-700 underline">Politica de Privacidad</a>
              <span>·</span>
              <a href="/contacto/" className="hover:text-gray-700 underline">Contacto</a>
            </div>
            <p>&copy; {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
