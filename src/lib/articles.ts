import fs from "fs";
import path from "path";

export interface Product {
  name: string;
  asin: string;
  price: string;
  pros: string[];
  cons: string[];
  verdict: string;
}

export interface Article {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keyword: string;
  category: string;
  intro: string;
  products: Product[];
  buyingGuide: string;
  faq: { q: string; a: string }[];
  conclusion: string;
  createdAt: string;
  updatedAt: string;
}

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));
  const articles: Article[] = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
      return JSON.parse(raw) as Article;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  return articles;
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as Article;
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

export function amazonLink(asin: string, tag: string): string {
  return `https://www.amazon.es/dp/${asin}?tag=${tag}&linkCode=ogi&th=1`;
}
