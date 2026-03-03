import { notFound } from "next/navigation";
import { getAllSlugs, getArticleBySlug } from "@/lib/articles";
import { amazonLink, amazonImage } from "@/lib/amazon";
import { SITE } from "@/lib/config";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      locale: SITE.locale,
    },
  };
}

// Category color map
const catColor: Record<string, string> = {
  Hogar: "from-orange-500 to-red-500",
  Tecnologia: "from-blue-500 to-indigo-600",
  Gaming: "from-purple-500 to-pink-500",
  Deporte: "from-green-500 to-teal-500",
  Belleza: "from-pink-400 to-rose-500",
};

export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const gradient = catColor[article.category] || "from-gray-600 to-gray-800";

  return (
    <article>
      {/* Hero banner */}
      <div className={`bg-gradient-to-r ${gradient} text-white py-16`}>
        <div className="max-w-3xl mx-auto px-4">
          <nav className="text-sm text-white/60 mb-4">
            <a href="/" className="hover:text-white">Inicio</a>
            <span className="mx-2">/</span>
            <span className="capitalize">{article.category}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <time>
              Actualizado:{" "}
              {new Date(article.updatedAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>·</span>
            <span>{article.products.length} productos analizados</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Intro */}
        <p className="text-lg text-gray-700 leading-relaxed mb-10 border-l-4 border-blue-500 pl-4">
          {article.intro}
        </p>

        {/* Winner highlight */}
        {article.products[0] && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 mb-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-400 text-black text-xs font-black px-4 py-1 rounded-bl-lg">
              GANADOR
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={amazonImage(article.products[0].asin)}
                alt={article.products[0].name}
                className="w-40 h-40 object-contain"
                loading="lazy"
              />
              <div className="flex-1">
                <h2 className="text-xl font-black mb-1">{article.products[0].name}</h2>
                <p className="text-amber-700 font-bold text-lg mb-2">{article.products[0].price}</p>
                <p className="text-gray-600 text-sm mb-3">{article.products[0].verdict}</p>
                <a
                  href={amazonLink(article.products[0].asin)}
                  target="_blank"
                  rel="nofollow noopener sponsored"
                  className="inline-block bg-amber-400 hover:bg-amber-500 text-black font-bold px-6 py-3 rounded-lg transition shadow-md"
                >
                  Ver precio en Amazon
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Quick comparison table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-10 shadow-sm">
          <div className="bg-gray-900 text-white px-6 py-3">
            <h2 className="font-bold">Comparativa rapida — Top {article.products.length}</h2>
          </div>
          <div className="divide-y">
            {article.products.map((p, i) => (
              <div key={p.asin} className="flex items-center gap-4 p-4 hover:bg-blue-50 transition">
                <span className={`text-xl font-black shrink-0 w-8 text-center ${i === 0 ? "text-amber-500" : "text-gray-400"}`}>
                  {i + 1}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={amazonImage(p.asin)}
                  alt={p.name}
                  className="w-16 h-16 object-contain shrink-0"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{p.name}</div>
                  <div className="text-xs text-gray-500 truncate">{p.verdict}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-blue-600">{p.price}</div>
                  <a
                    href={amazonLink(p.asin)}
                    target="_blank"
                    rel="nofollow noopener sponsored"
                    className="text-xs bg-amber-400 hover:bg-amber-500 text-black font-bold px-3 py-1 rounded-md inline-block mt-1 transition"
                  >
                    Ver oferta
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed product cards */}
        {article.products.map((p, i) => (
          <section key={p.asin} className="mb-10 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={amazonImage(p.asin)}
                  alt={p.name}
                  className="w-48 h-48 object-contain mx-auto md:mx-0"
                  loading="lazy"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-xl font-black">
                      <span className="text-blue-600">#{i + 1}</span> {p.name}
                    </h2>
                  </div>
                  <div className="text-2xl font-black text-blue-600 mb-3">{p.price}</div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-green-700 font-bold text-xs mb-2 uppercase">Pros</div>
                      {p.pros.map((pro, j) => (
                        <div key={j} className="text-sm text-green-800 flex gap-1 mb-1">
                          <span className="shrink-0">+</span> {pro}
                        </div>
                      ))}
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <div className="text-red-700 font-bold text-xs mb-2 uppercase">Contras</div>
                      {p.cons.map((con, j) => (
                        <div key={j} className="text-sm text-red-800 flex gap-1 mb-1">
                          <span className="shrink-0">-</span> {con}
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{p.verdict}</p>
                  <a
                    href={amazonLink(p.asin)}
                    target="_blank"
                    rel="nofollow noopener sponsored"
                    className="inline-block bg-amber-400 hover:bg-amber-500 text-black font-bold px-6 py-3 rounded-lg transition shadow-sm"
                  >
                    Ver en Amazon — {p.price}
                  </a>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Buying Guide */}
        <div className="bg-blue-50 rounded-xl p-8 mb-10 border border-blue-100">
          <h2 className="text-2xl font-black mb-4 text-blue-900">Guia de compra</h2>
          <p className="text-gray-700 leading-relaxed">{article.buyingGuide}</p>
        </div>

        {/* FAQ */}
        {article.faq.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-6">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {article.faq.map((item, i) => (
                <details key={i} className="border border-gray-200 rounded-xl overflow-hidden group">
                  <summary className="font-bold cursor-pointer p-4 hover:bg-gray-50 group-open:bg-blue-50 group-open:text-blue-700 transition">
                    {item.q}
                  </summary>
                  <p className="text-gray-600 p-4 pt-0 border-t">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Conclusion */}
        <div className="bg-gray-900 text-white rounded-xl p-8 mb-10">
          <h2 className="text-xl font-black mb-3">Nuestra recomendacion final</h2>
          <p className="text-gray-300 leading-relaxed">{article.conclusion}</p>
          {article.products[0] && (
            <a
              href={amazonLink(article.products[0].asin)}
              target="_blank"
              rel="nofollow noopener sponsored"
              className="inline-block bg-amber-400 hover:bg-amber-500 text-black font-bold px-8 py-3 rounded-lg mt-4 transition"
            >
              Ver {article.products[0].name} en Amazon
            </a>
          )}
        </div>

        {/* Disclaimer */}
        <div className="p-4 bg-gray-50 rounded-lg text-xs text-gray-400">
          Este articulo contiene enlaces de afiliado de Amazon. Si compras a traves de ellos,
          recibimos una pequena comision sin coste adicional para ti. Solo recomendamos
          productos que consideramos utiles. Ultima actualizacion:{" "}
          {new Date(article.updatedAt).toLocaleDateString("es-ES")}.
        </div>
      </div>
    </article>
  );
}
