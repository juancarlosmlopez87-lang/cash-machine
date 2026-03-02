#!/bin/bash
# ─────────────────────────────────────────────
# Setup Cash Machine en VPS (Contabo)
# Ejecutar UNA vez para configurar todo
# ─────────────────────────────────────────────

echo "=== Cash Machine — Setup VPS ==="

# 1. Clonar repo (cambiar URL por la real)
REPO_URL="${1:-git@github.com:TU_USUARIO/cash-machine.git}"
INSTALL_DIR="/root/cash-machine"

if [ -d "$INSTALL_DIR" ]; then
    echo "Ya existe $INSTALL_DIR — haciendo pull..."
    cd "$INSTALL_DIR" && git pull
else
    echo "Clonando repo..."
    git clone "$REPO_URL" "$INSTALL_DIR"
fi

cd "$INSTALL_DIR/generator"

# 2. Instalar dependencias Python
echo "Instalando dependencias..."
pip3 install -r requirements.txt

# 3. Configurar GROQ_API_KEY
if ! grep -q "GROQ_API_KEY" ~/.bashrc; then
    echo ""
    echo "IMPORTANTE: Añade tu GROQ_API_KEY a ~/.bashrc:"
    echo '  echo "export GROQ_API_KEY=gsk_TU_KEY_AQUI" >> ~/.bashrc'
    echo "  source ~/.bashrc"
fi

# 4. Configurar cron para ejecutar 2 veces al dia (6:00 y 18:00)
CRON_CMD="0 6,18 * * * cd $INSTALL_DIR/generator && /usr/bin/python3 generate.py >> /var/log/cash-machine.log 2>&1"

if crontab -l 2>/dev/null | grep -q "cash-machine"; then
    echo "Cron ya configurado"
else
    (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
    echo "Cron instalado: genera articulos a las 6:00 y 18:00 cada dia"
fi

echo ""
echo "=== Setup completo ==="
echo "  Directorio: $INSTALL_DIR"
echo "  Log: /var/log/cash-machine.log"
echo "  Cron: 2 ejecuciones/dia (6 articulos/dia)"
echo ""
echo "Para ejecutar manualmente:"
echo "  cd $INSTALL_DIR/generator && python3 generate.py"
