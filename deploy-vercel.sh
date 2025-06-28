#!/bin/bash

echo "🚀 Deploy dos Frontends no Vercel"

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Carregar nvm se estiver instalado
if [ -d "$HOME/.nvm" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    echo "✅ nvm carregado - Node.js $(node --version)"
fi

echo "🔨 Build dos frontends..."

# Build do client
echo "📦 Build do Client..."
cd frontend/client
pnpm build
cd ../..

# Build do restaurant
echo "📦 Build do Restaurant..."
cd frontend/restaurant
pnpm build
cd ../..

echo "✅ Builds concluídos!"
echo ""
echo "🎯 Para fazer deploy no Vercel:"
echo ""
echo "1. Frontend Client:"
echo "   cd frontend/client"
echo "   vercel --prod"
echo ""
echo "2. Frontend Restaurant:"
echo "   cd frontend/restaurant"
echo "   vercel --prod"
echo ""
echo "📝 Lembre-se de:"
echo "   - Fazer login no Vercel: vercel login"
echo "   - Configurar as variáveis de ambiente se necessário"
echo "   - Atualizar a URL da API nos frontends após o deploy"