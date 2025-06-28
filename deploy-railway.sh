#!/bin/bash

echo "🚀 Deploy do Backend no Railway"
echo "================================"

# Verificar se o projeto está no GitHub
if ! git remote get-url origin 2>/dev/null | grep -q "github.com"; then
    echo "❌ Erro: Projeto não está conectado ao GitHub"
    echo ""
    echo "📝 Para conectar ao GitHub:"
    echo "1. Crie um repositório no GitHub"
    echo "2. Execute: git remote add origin https://github.com/seu-usuario/restaurante.git"
    echo "3. Execute: git push -u origin main"
    exit 1
fi

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "📦 Instalando Railway CLI..."
    npm install -g @railway/cli
fi

echo "✅ Railway CLI instalado"

# Verificar se está logado no Railway
if ! railway whoami &> /dev/null; then
    echo "🔐 Fazendo login no Railway..."
    railway login
fi

echo "✅ Logado no Railway"

# Verificar se o projeto está configurado
if [ ! -f "railway.toml" ]; then
    echo "📝 Criando arquivo de configuração do Railway..."
    cat > railway.toml << EOF
[build]
builder = "nixpacks"

[deploy]
startCommand = "gunicorn --config gunicorn.conf.py wsgi:app"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
EOF
    echo "✅ railway.toml criado"
fi

# Verificar se o backend tem as configurações necessárias
if [ ! -f "backend/wsgi.py" ]; then
    echo "❌ Erro: arquivo wsgi.py não encontrado no backend"
    exit 1
fi

if [ ! -f "backend/gunicorn.conf.py" ]; then
    echo "❌ Erro: arquivo gunicorn.conf.py não encontrado no backend"
    exit 1
fi

echo "✅ Configurações do backend verificadas"

# Fazer commit das mudanças
echo "📝 Fazendo commit das mudanças..."
git add .
git commit -m "Configuração para deploy no Railway" 2>/dev/null || echo "Nenhuma mudança para commitar"

# Push para o GitHub
echo "🚀 Fazendo push para o GitHub..."
git push origin main

echo ""
echo "🎯 Próximos passos:"
echo ""
echo "1. Acesse: https://railway.app"
echo "2. Clique em 'Start a New Project'"
echo "3. Selecione 'Deploy from GitHub repo'"
echo "4. Escolha seu repositório 'restaurante'"
echo "5. Configure:"
echo "   - Root Directory: backend"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: gunicorn --config gunicorn.conf.py wsgi:app"
echo ""
echo "6. Adicione as variáveis de ambiente:"
echo "   FLASK_ENV=production"
echo "   SECRET_KEY=sua-chave-secreta-aqui"
echo "   PORT=5000"
echo ""
echo "7. Após o deploy, você receberá uma URL como:"
echo "   https://seu-projeto-backend.railway.app"
echo ""
echo "8. Atualize os frontends com a nova URL da API"
echo ""
echo "📚 Para mais detalhes, consulte: DEPLOY-RAILWAY.md"