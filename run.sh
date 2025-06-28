#!/bin/bash

echo "🚀 Iniciando o projeto do restaurante..."

# Carregar nvm se estiver instalado
if [ -d "$HOME/.nvm" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    echo "✅ nvm carregado - Node.js $(node --version)"
fi

# Função para limpar processos ao sair
cleanup() {
    echo "🛑 Parando todos os serviços..."
    kill $BACKEND_PID $CLIENT_PID $RESTAURANT_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT

# Iniciar backend
echo "🔧 Iniciando backend..."
cd backend
source venv/bin/activate
python3 src/main.py &
BACKEND_PID=$!
cd ..

# Aguardar um pouco para o backend inicializar
sleep 3

# Iniciar frontend client
echo "💻 Iniciando frontend client..."
cd frontend/client
pnpm dev &
CLIENT_PID=$!
cd ../..

# Aguardar um pouco
sleep 2

# Iniciar frontend restaurant
echo "🍽️ Iniciando frontend restaurant..."
cd frontend/restaurant
pnpm dev &
RESTAURANT_PID=$!
cd ../..

echo "✅ Todos os serviços iniciados!"
echo ""
echo "🌐 URLs disponíveis:"
echo "   - Backend API: http://localhost:5000"
echo "   - Frontend Client: http://localhost:5173"
echo "   - Frontend Restaurant: http://localhost:5174"
echo ""
echo "📝 Pressione Ctrl+C para parar todos os serviços"
echo ""

# Aguardar indefinidamente
wait