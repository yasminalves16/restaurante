#!/bin/bash

echo "🚀 Deploy do Sistema de Restaurante para Produção"

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Remover imagens antigas
echo "🧹 Removendo imagens antigas..."
docker system prune -f

# Build da nova imagem
echo "🔨 Construindo nova imagem..."
docker-compose build --no-cache

# Iniciar containers
echo "🚀 Iniciando containers..."
docker-compose up -d

# Aguardar um pouco para o container inicializar
echo "⏳ Aguardando inicialização..."
sleep 10

# Verificar se está funcionando
echo "🔍 Verificando status..."
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Deploy realizado com sucesso!"
    echo ""
    echo "🌐 URLs disponíveis:"
    echo "   - API Backend: http://localhost:5000"
    echo "   - Health Check: http://localhost:5000/health"
    echo "   - Frontend Client: http://localhost:5000/client/"
    echo "   - Frontend Restaurant: http://localhost:5000/restaurant/"
    echo ""
    echo "📊 Status dos containers:"
    docker-compose ps
else
    echo "❌ Erro no deploy. Verifique os logs:"
    docker-compose logs
    exit 1
fi