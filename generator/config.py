import os

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL = "llama-3.3-70b-versatile"

# Directorio donde se guardan los artículos JSON
ARTICLES_DIR = os.path.join(os.path.dirname(__file__), "..", "content", "articles")

# Cuántos artículos generar por ejecución
ARTICLES_PER_RUN = 5

# Tag de afiliado Amazon.es
AMAZON_TAG = "topactual-21"
