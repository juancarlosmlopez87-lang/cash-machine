import { notFound } from "next/navigation";
import { getAllArticles, getAllSlugs, getArticleBySlug } from "@/lib/articles";
import { amazonLink, amazonImage } from "@/lib/amazon";
import { SITE } from "@/lib/config";
import ShareButtons from "@/components/ShareButtons";
import NewsletterForm from "@/components/NewsletterForm";
import ArticleAnimations from "@/components/ArticleAnimations";
import StickyBuyCTA from "@/components/StickyBuyCTA";
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
  const articleUrl = `${SITE.url}/${article.slug}/`;
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical: `/${article.slug}/` },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: articleUrl,
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
  Bebe: "from-sky-400 to-blue-500",
  Mascotas: "from-amber-500 to-yellow-500",
};

export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const gradient = catColor[article.category] || "from-gray-600 to-gray-800";
  const articleUrl = `${SITE.url}/${article.slug}/`;

  // Related articles: same category, exclude current, take 3
  const allArticles = getAllArticles();
  const relatedArticles = allArticles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  // JSON-LD: Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: amazonImage(article.products[0]?.asin || ""),
    author: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  // JSON-LD: FAQ schema
  const faqSchema =
    article.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null;

  // JSON-LD: Product schemas (ItemList for comparison)
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: article.title,
    numberOfItems: article.products.length,
    itemListElement: article.products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        description: p.verdict,
        url: amazonLink(p.asin),
        offers: {
          "@type": "Offer",
          price: p.price.replace(/[^0-9.,]/g, "").replace(",", "."),
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: amazonLink(p.asin),
        },
      },
    })),
  };

  return (
    <article>
      {/* Scroll animations + Sticky CTA */}
      <ArticleAnimations />
      {article.products[0] && (
        <StickyBuyCTA
          productName={article.products[0].name}
          price={article.products[0].price}
          amazonUrl={amazonLink(article.products[0].asin)}
        />
      )}

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 border-b border-gray-200 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <nav className="text-sm text-gray-400 mb-4">
            <a href="/" className="hover:text-blue-600 transition">Inicio</a>
            <span className="mx-2">/</span>
            <span className={`font-semibold capitalize text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>{article.category}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-black leading-tight mb-4 text-gray-900">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-5">
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
          {/* Share buttons in hero */}
          <ShareButtons
            title={article.title}
            url={articleUrl}
            description={article.metaDescription}
          />
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
                loading="eager"
                width={160}
                height={160}
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
          <div className="bg-slate-50 border-b border-gray-200 px-6 py-3">
            <h2 className="font-bold text-gray-900">Comparativa rapida — Top {article.products.length}</h2>
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
          <section key={p.asin} className="mb-10 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm scroll-reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
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
        <div className="bg-blue-50 rounded-xl p-8 mb-10 border border-blue-100 scroll-reveal">
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

        {/* Newsletter between FAQ and Conclusion */}
        <NewsletterForm />

        {/* Conclusion */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-gray-200 rounded-xl p-8 mb-10">
          <h2 className="text-xl font-black mb-3 text-gray-900">Nuestra recomendacion final</h2>
          <p className="text-gray-600 leading-relaxed">{article.conclusion}</p>
          {article.products[0] && (
            <a
              href={amazonLink(article.products[0].asin)}
              target="_blank"
              rel="nofollow noopener sponsored"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg mt-4 transition shadow-sm"
            >
              Ver {article.products[0].name} en Amazon
            </a>
          )}
        </div>

        {/* Share buttons after content */}
        <div className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm font-bold text-gray-700 mb-3">
            Te ha sido util esta guia? Compartela:
          </p>
          <ShareButtons
            title={article.title}
            url={articleUrl}
            description={article.metaDescription}
          />
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-black mb-6">Tambien te puede interesar</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedArticles.map((related, relIdx) => (
                <a
                  key={related.slug}
                  href={`/${related.slug}/`}
                  className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 scroll-reveal"
                  style={{ transitionDelay: `${relIdx * 0.1}s` }}
                >
                  <div className="bg-gray-50 p-4 flex items-center justify-center h-32 border-b">
                    {related.products[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={amazonImage(related.products[0].asin)}
                        alt={related.products[0].name}
                        className="h-24 object-contain group-hover:scale-110 transition"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm group-hover:text-blue-600 transition leading-tight mb-2">
                      {related.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>
                        {new Date(related.updatedAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span className="font-bold text-blue-600">
                        {related.products.length} productos
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

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
