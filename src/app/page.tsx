import { getAllArticles } from "@/lib/articles";
import { amazonImage, amazonLink } from "@/lib/amazon";
import { SITE } from "@/lib/config";
import { AnimatedCounter, ScrollRevealInit, UpdatedBadge } from "@/components/HomeAnimations";

const catEmoji: Record<string, string> = {
  Hogar: "🏠",
  Tecnologia: "💻",
  Gaming: "🎮",
  Deporte: "⚡",
  Belleza: "✨",
  Bebe: "👶",
  Mascotas: "🐾",
};

const catGradient: Record<string, string> = {
  Hogar: "from-orange-500 to-red-500",
  Tecnologia: "from-blue-500 to-indigo-600",
  Gaming: "from-purple-500 to-pink-500",
  Deporte: "from-green-500 to-teal-500",
  Belleza: "from-pink-400 to-rose-500",
  Bebe: "from-sky-400 to-blue-500",
  Mascotas: "from-amber-500 to-yellow-500",
};

export default function Home() {
  const articles = getAllArticles();
  const categories = Array.from(new Set(articles.map((a) => a.category)));

  // Best product from most recent article for hero
  const featured = articles[0];

  return (
    <div>
      {/* Scroll reveal observer */}
      <ScrollRevealInit />

      {/* Hero */}
      <div className="bg-gradient-to-br from-white via-blue-50 to-slate-50 py-20 border-b border-gray-100 relative overflow-hidden">
        {/* Subtle floating background orbs */}
        <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-blue-400/5 blur-[100px] animate-float pointer-events-none" />
        <div className="absolute bottom-[10%] right-[8%] w-[250px] h-[250px] rounded-full bg-indigo-400/5 blur-[100px] animate-float pointer-events-none" style={{ animationDelay: "2s" }} />

        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3 animate-fade-in-up">
            Actualizado {new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 text-gray-900 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Los mejores productos<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              comparados para ti
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Analizamos cientos de opciones en Amazon para recomendarte solo lo mejor.
            Guias de compra honestas y actualizadas.
          </p>
          <div className="animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
            <UpdatedBadge />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-6 animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
            {categories.map((cat) => (
              <a
                key={cat}
                href={`#${cat.toLowerCase()}`}
                className={`bg-gradient-to-r ${catGradient[cat] || "from-gray-500 to-gray-600"} text-white font-bold px-5 py-2 rounded-full text-sm hover:scale-105 transition shadow-sm`}
              >
                {catEmoji[cat] || "📦"} {cat}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Featured article */}
      {featured && (
        <div className="max-w-5xl mx-auto px-4 -mt-10 scroll-reveal">
          <a
            href={`/${featured.slug}/`}
            className="block bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 hover:shadow-2xl transition group"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              {featured.products[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={amazonImage(featured.products[0].asin)}
                  alt={featured.products[0].name}
                  className="w-32 h-32 object-contain"
                  loading="eager"
                  width={128}
                  height={128}
                />
              )}
              <div className="flex-1 text-center md:text-left">
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  DESTACADO
                </span>
                <h2 className="text-2xl font-black mt-2 mb-1 group-hover:text-blue-600 transition">
                  {featured.title}
                </h2>
                <p className="text-gray-500">{featured.metaDescription}</p>
              </div>
              <div className="shrink-0 text-blue-600 font-bold group-hover:translate-x-1 transition">
                Leer →
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Articles by category */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        {categories.map((cat) => {
          const catArticles = articles.filter((a) => a.category === cat);
          return (
            <section key={cat} id={cat.toLowerCase()} className="mb-16">
              <div className="flex items-center gap-3 mb-8 scroll-reveal">
                <span className="text-3xl">{catEmoji[cat] || "📦"}</span>
                <h2 className="text-2xl font-black capitalize">{cat}</h2>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">{catArticles.length} guias</span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catArticles.map((article, idx) => (
                  <a
                    key={article.slug}
                    href={`/${article.slug}/`}
                    className={`group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 scroll-reveal stagger-${Math.min(idx + 1, 6)}`}
                  >
                    {/* Product image preview */}
                    <div className="bg-gray-50 p-4 flex items-center justify-center h-40 border-b">
                      {article.products[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={amazonImage(article.products[0].asin)}
                          alt={article.products[0].name}
                          className="h-32 object-contain group-hover:scale-110 transition duration-500"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <span className={`text-xs font-bold uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-r ${catGradient[cat] || "from-gray-500 to-gray-600"}`}>
                        {cat}
                      </span>
                      <h3 className="text-lg font-bold mt-1 mb-2 group-hover:text-blue-600 transition leading-tight">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {article.metaDescription}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>
                          {new Date(article.updatedAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "short",
                          })}
                        </span>
                        <span className="font-bold text-blue-600 group-hover:translate-x-1 transition">
                          {article.products.length} productos →
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Trust bar */}
      <div className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="scroll-reveal stagger-1">
              <div className="text-3xl font-black text-blue-600"><AnimatedCounter end={articles.length} suffix="+" /></div>
              <div className="text-sm text-gray-500">Guias de compra</div>
            </div>
            <div className="scroll-reveal stagger-2">
              <div className="text-3xl font-black text-blue-600"><AnimatedCounter end={articles.length * 7} suffix="+" /></div>
              <div className="text-sm text-gray-500">Productos analizados</div>
            </div>
            <div className="scroll-reveal stagger-3">
              <div className="text-3xl font-black text-blue-600"><AnimatedCounter end={2026} /></div>
              <div className="text-sm text-gray-500">Precios actualizados</div>
            </div>
            <div className="scroll-reveal stagger-4">
              <div className="text-3xl font-black text-blue-600"><AnimatedCounter end={100} suffix="%" /></div>
              <div className="text-sm text-gray-500">Independiente</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
