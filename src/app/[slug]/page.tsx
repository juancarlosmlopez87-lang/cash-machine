import { notFound } from "next/navigation";
import { getAllSlugs, getArticleBySlug, amazonLink } from "@/lib/articles";
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

export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const tag = SITE.amazonTag;

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <a href="/" className="hover:text-blue-600">Inicio</a>
        <span className="mx-2">/</span>
        <span className="capitalize">{article.category}</span>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{article.title}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4">
        {article.title}
      </h1>

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
        <time>
          Actualizado:{" "}
          {new Date(article.updatedAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>

      {/* Intro */}
      <div className="prose mb-10">
        <p className="text-lg">{article.intro}</p>
      </div>

      {/* Quick picks table */}
      <div className="bg-blue-50 rounded-xl p-6 mb-10">
        <h2 className="text-xl font-bold mb-4">Nuestro Top {article.products.length}</h2>
        <div className="space-y-3">
          {article.products.map((p, i) => (
            <div
              key={p.asin}
              className="flex items-center justify-between bg-white rounded-lg p-4 border border-blue-100"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-blue-600">#{i + 1}</span>
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.verdict}</div>
                </div>
              </div>
              <a
                href={amazonLink(p.asin, tag)}
                target="_blank"
                rel="nofollow noopener sponsored"
                className="shrink-0 bg-amber-400 hover:bg-amber-500 text-black font-bold text-sm px-4 py-2 rounded-lg transition"
              >
                Ver en Amazon
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed reviews */}
      <div className="prose">
        {article.products.map((p, i) => (
          <section key={p.asin} className="mb-12">
            <h2>
              #{i + 1} — {p.name}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 my-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-green-700 font-bold text-sm mb-2">
                  Ventajas
                </h3>
                <ul className="text-sm space-y-1">
                  {p.pros.map((pro, j) => (
                    <li key={j} className="text-green-800">{pro}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="text-red-700 font-bold text-sm mb-2">
                  Inconvenientes
                </h3>
                <ul className="text-sm space-y-1">
                  {p.cons.map((con, j) => (
                    <li key={j} className="text-red-800">{con}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p>{p.verdict}</p>
            <a
              href={amazonLink(p.asin, tag)}
              target="_blank"
              rel="nofollow noopener sponsored"
              className="inline-block bg-amber-400 hover:bg-amber-500 text-black font-bold px-6 py-3 rounded-lg mt-2 no-underline transition"
            >
              Ver precio en Amazon
            </a>
          </section>
        ))}
      </div>

      {/* Buying Guide */}
      <div className="prose">
        <h2>Guia de compra</h2>
        <p>{article.buyingGuide}</p>
      </div>

      {/* FAQ — great for SEO */}
      {article.faq.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Preguntas frecuentes</h2>
          <div className="space-y-4">
            {article.faq.map((item, i) => (
              <details
                key={i}
                className="border border-gray-200 rounded-lg p-4 group"
              >
                <summary className="font-bold cursor-pointer group-open:text-blue-600">
                  {item.q}
                </summary>
                <p className="text-gray-600 mt-2">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Conclusion */}
      <div className="prose mt-10">
        <h2>Conclusion</h2>
        <p>{article.conclusion}</p>
      </div>

      {/* Affiliate disclaimer */}
      <div className="mt-12 p-4 bg-gray-50 rounded-lg text-xs text-gray-400">
        <p>
          Este articulo contiene enlaces de afiliado. Si compras a traves de ellos, recibimos
          una pequena comision sin coste adicional para ti. Esto nos ayuda a mantener {SITE.name}
          actualizado y gratuito. Solo recomendamos productos que consideramos utiles.
        </p>
      </div>
    </article>
  );
}
