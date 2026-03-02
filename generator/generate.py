#!/usr/bin/env python3
"""
Cash Machine — Generador automático de artículos SEO con afiliados Amazon.es
Usa Groq (Llama 3.3 70B) para generar artículos de "mejor X" con productos reales.
Diseñado para correr en VPS (cron) y auto-publicar.
"""

import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from groq import Groq

from config import GROQ_API_KEY, GROQ_MODEL, ARTICLES_DIR, ARTICLES_PER_RUN

# ── Setup ────────────────────────────────────────────────────

KEYWORDS_FILE = Path(__file__).parent / "keywords.json"


def load_keywords():
    with open(KEYWORDS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_keywords(data):
    with open(KEYWORDS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[áàä]", "a", text)
    text = re.sub(r"[éèë]", "e", text)
    text = re.sub(r"[íìï]", "i", text)
    text = re.sub(r"[óòö]", "o", text)
    text = re.sub(r"[úùü]", "u", text)
    text = re.sub(r"[ñ]", "n", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")


# ── Prompt para Groq ─────────────────────────────────────────

SYSTEM_PROMPT = """Eres un experto redactor SEO especializado en guias de compra y comparativas de productos para el mercado español (Amazon.es).

Tu trabajo es generar articulos completos, utiles y optimizados para posicionar en Google.

REGLAS:
- Escribe SIEMPRE en español de España (no latinoamericano)
- Los productos deben ser REALES y populares en Amazon.es en 2026
- Los ASIN deben ser formatos validos (B0 seguido de 8 caracteres alfanumericos)
- Los precios deben ser realistas en euros
- El tono es cercano, experto y directo — como un amigo que sabe mucho del tema
- Incluye datos especificos: medidas, vatios, capacidad, etc.
- Cada producto necesita al menos 3 pros y 2 contras REALES
- La guia de compra debe explicar que criterios importan al elegir
- Las FAQ deben ser preguntas que la gente realmente busca en Google
- NO uses emojis
- NO inventes marcas — usa marcas reales conocidas en España"""


def build_user_prompt(keyword: str, category: str) -> str:
    year = datetime.now().year
    return f"""Genera un articulo completo sobre: "{keyword}" para {year}.

Categoria: {category}

Devuelve SOLO un JSON valido con esta estructura exacta (sin texto adicional):
{{
  "title": "Mejor [producto] de {year}: Top 7 comparativa y guia de compra",
  "metaTitle": "[titulo SEO optimizado, max 60 caracteres]",
  "metaDescription": "[descripcion SEO, max 155 caracteres, incluye la keyword]",
  "keyword": "{keyword}",
  "category": "{category}",
  "intro": "[parrafo introductorio de 80-120 palabras que enganche y mencione la keyword]",
  "products": [
    {{
      "name": "[Marca Modelo completo]",
      "asin": "[ASIN real de Amazon.es, formato B0XXXXXXXXXX]",
      "price": "[precio orientativo, ej: 149€]",
      "pros": ["ventaja 1 con detalle", "ventaja 2 con detalle", "ventaja 3 con detalle"],
      "cons": ["inconveniente 1 real", "inconveniente 2 real"],
      "verdict": "[resumen en 1-2 frases de por que destaca este producto]"
    }}
  ],
  "buyingGuide": "[guia de compra de 150-250 palabras explicando criterios clave: potencia, calidad, precio, etc.]",
  "faq": [
    {{
      "q": "[pregunta frecuente real sobre {keyword}]",
      "a": "[respuesta concisa y util de 30-60 palabras]"
    }}
  ],
  "conclusion": "[conclusion de 60-100 palabras con recomendacion final clara]"
}}

IMPORTANTE:
- Incluye exactamente 7 productos reales y populares en Amazon.es
- Incluye exactamente 5 preguntas FAQ
- Los ASIN deben tener formato B0 + 8 caracteres (ejemplo: B0CHX1234Y)
- Devuelve SOLO el JSON, sin markdown ni backticks"""


# ── Generar un artículo ─────────────────────────────────────

def generate_article(client: Groq, keyword: str, category: str) -> dict | None:
    prompt = build_user_prompt(keyword, category)

    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=4000,
            response_format={"type": "json_object"},
        )

        text = response.choices[0].message.content or ""
        article = json.loads(text)

        # Validar campos requeridos
        required = ["title", "metaTitle", "metaDescription", "keyword", "intro", "products", "buyingGuide", "faq", "conclusion"]
        for field in required:
            if field not in article:
                print(f"  [!] Falta campo: {field}")
                return None

        if len(article["products"]) < 3:
            print(f"  [!] Solo {len(article['products'])} productos (minimo 3)")
            return None

        # Añadir metadatos
        now = datetime.now(timezone.utc).isoformat()
        article["slug"] = slugify(keyword)
        article["category"] = category
        article["createdAt"] = now
        article["updatedAt"] = now

        tokens = response.usage
        cost = 0
        if tokens:
            cost = (tokens.prompt_tokens * 0.05 + tokens.completion_tokens * 0.08) / 1_000_000
        print(f"  Tokens: {tokens.total_tokens if tokens else '?'} | Coste: ${cost:.4f}")

        return article

    except json.JSONDecodeError as e:
        print(f"  [!] JSON invalido de Groq: {e}")
        return None
    except Exception as e:
        print(f"  [!] Error Groq: {e}")
        return None


# ── Guardar artículo ────────────────────────────────────────

def save_article(article: dict):
    os.makedirs(ARTICLES_DIR, exist_ok=True)
    filepath = os.path.join(ARTICLES_DIR, f"{article['slug']}.json")
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(article, f, indent=2, ensure_ascii=False)
    print(f"  Guardado: {filepath}")


# ── Git auto-push ────────────────────────────────────────────

def git_push(articles_generated: list[str]):
    """Commit y push automático al repo para trigger Vercel deploy."""
    repo_dir = Path(__file__).parent.parent

    try:
        subprocess.run(["git", "add", "content/articles/", "generator/keywords.json"],
                       cwd=repo_dir, check=True, capture_output=True)

        msg = f"Auto: +{len(articles_generated)} articulos [{', '.join(articles_generated[:3])}]"
        subprocess.run(["git", "commit", "-m", msg],
                       cwd=repo_dir, check=True, capture_output=True)

        result = subprocess.run(["git", "push"],
                                cwd=repo_dir, check=True, capture_output=True, text=True)
        print(f"[Git] Push OK: {result.stdout.strip()}")
    except subprocess.CalledProcessError as e:
        print(f"[Git] Error: {e.stderr if hasattr(e, 'stderr') else e}")
    except FileNotFoundError:
        print("[Git] git no encontrado — skip push")


# ── Main ─────────────────────────────────────────────────────

def main():
    if not GROQ_API_KEY:
        print("[!] GROQ_API_KEY no configurada. Exportala con:")
        print('    export GROQ_API_KEY="gsk_..."')
        sys.exit(1)

    client = Groq(api_key=GROQ_API_KEY)
    kw_data = load_keywords()
    pending = kw_data.get("pending", [])
    done = kw_data.get("done", [])

    if not pending:
        print("[!] No quedan keywords pendientes. Añade mas a keywords.json")
        sys.exit(0)

    # Ordenar por prioridad (1 = mas importante)
    pending.sort(key=lambda x: x.get("priority", 99))

    # Generar N artículos
    generated = []
    to_generate = min(ARTICLES_PER_RUN, len(pending))

    print(f"\n{'='*60}")
    print(f"  CASH MACHINE — Generando {to_generate} articulos")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"  Keywords pendientes: {len(pending)}")
    print(f"{'='*60}\n")

    for i in range(to_generate):
        kw = pending[0]  # Siempre el primero (ya ordenado por prioridad)
        keyword = kw["keyword"]
        category = kw.get("category", "General")

        # Saltar si ya existe
        slug = slugify(keyword)
        filepath = os.path.join(ARTICLES_DIR, f"{slug}.json")
        if os.path.exists(filepath):
            print(f"[{i+1}/{to_generate}] SKIP (ya existe): {keyword}")
            pending.pop(0)
            done.append(kw)
            continue

        print(f"[{i+1}/{to_generate}] Generando: {keyword} ({category})...")

        article = generate_article(client, keyword, category)
        if article:
            save_article(article)
            generated.append(keyword)
            print(f"  OK: {article['title']}")
        else:
            print(f"  FAIL: {keyword}")

        # Mover de pending a done
        pending.pop(0)
        done.append(kw)

    # Guardar estado de keywords
    kw_data["pending"] = pending
    kw_data["done"] = done
    save_keywords(kw_data)

    print(f"\n{'='*60}")
    print(f"  Resultado: {len(generated)}/{to_generate} articulos generados")
    print(f"  Keywords restantes: {len(pending)}")
    print(f"{'='*60}\n")

    # Auto push si se generó algo
    if generated:
        git_push(generated)


if __name__ == "__main__":
    main()
