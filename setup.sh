#!/bin/bash

echo "🚀 Configurando o projeto do restaurante..."

# Carregar nvm se estiver instalado
if [ -d "$HOME/.nvm" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    echo "✅ nvm carregado - Node.js $(node --version)"
fi

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 não está instalado. Por favor, instale o Python3 primeiro."
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo "📦 Instalando pnpm..."
    npm install -g pnpm
fi

echo "📁 Configurando o backend..."

# Navegar para o backend
cd backend

# Criar ambiente virtual se não existir
if [ ! -d "venv" ]; then
    echo "🐍 Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativar ambiente virtual
echo "🔧 Ativando ambiente virtual..."
source venv/bin/activate

# Instalar dependências
echo "📦 Instalando dependências do backend..."
pip install -r requirements.txt

# Criar banco de dados se não existir
echo "🗄️ Configurando banco de dados..."
python3 -c "
import sys
sys.path.insert(0, 'src')
from main import app, db
from src.models.menu import MenuItem
from src.models.order import Order, OrderItem

with app.app_context():
    db.create_all()
    print('✅ Banco de dados criado com sucesso!')
"

# Voltar para o diretório raiz
cd ..

echo "📁 Configurando o frontend client..."

# Navegar para o frontend client
cd frontend/client

# Instalar dependências
echo "📦 Instalando dependências do client..."
pnpm install

# Voltar para o diretório raiz
cd ../..

echo "📁 Configurando o frontend restaurant..."

# Navegar para o frontend restaurant
cd frontend/restaurant

# Instalar dependências
echo "📦 Instalando dependências do restaurant..."
pnpm install

# Voltar para o diretório raiz
cd ../..

echo "✅ Configuração concluída!"
echo ""
echo "🎯 Para executar o projeto:"
echo ""
echo "1. Backend (API):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python3 src/main.py"
echo ""
echo "2. Frontend Client (em outro terminal):"
echo "   cd frontend/client"
echo "   pnpm dev"
echo ""
echo "3. Frontend Restaurant (em outro terminal):"
echo "   cd frontend/restaurant"
echo "   pnpm dev"
echo ""
echo "🌐 URLs:"
echo "   - Backend API: http://localhost:5000"
echo "   - Frontend Client: http://localhost:5173"
echo "   - Frontend Restaurant: http://localhost:5174"
echo ""
echo "📝 Para testar a API, acesse: http://localhost:5000"