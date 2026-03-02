import { getAllArticles } from "@/lib/articles";
import { SITE } from "@/lib/config";

export default function Home() {
  const articles = getAllArticles();

  const categories = Array.from(new Set(articles.map((a) => a.category)));

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Los mejores productos de {new Date().getFullYear()}
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          {SITE.tagline}. Analizamos cientos de opciones para recomendarte solo lo mejor.
        </p>
      </section>

      {/* Articles by category */}
      {categories.length === 0 && (
        <p className="text-center text-gray-400 py-20">
          Proximamente: articulos en camino...
        </p>
      )}

      {categories.map((cat) => (
        <section key={cat} id={cat.toLowerCase()} className="mb-16">
          <h2 className="text-2xl font-bold mb-6 capitalize border-b pb-2">
            {cat}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles
              .filter((a) => a.category === cat)
              .map((article) => (
                <a
                  key={article.slug}
                  href={`/${article.slug}/`}
                  className="group block rounded-xl border border-gray-200 p-6 hover:border-blue-400 hover:shadow-lg transition"
                >
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-bold mt-2 mb-2 group-hover:text-blue-600 transition">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {article.metaDescription}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                    <span>
                      {new Date(article.updatedAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span>{article.products.length} productos</span>
                  </div>
                </a>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
