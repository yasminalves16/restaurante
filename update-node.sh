#!/bin/bash

echo "🔄 Atualizando Node.js..."

# Verificar se nvm está instalado
if [ ! -d "$HOME/.nvm" ]; then
    echo "📦 Instalando nvm (Node Version Manager)..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

    # Carregar nvm no shell atual
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

    echo "✅ nvm instalado com sucesso!"
else
    echo "✅ nvm já está instalado"
    # Carregar nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
fi

# Instalar a versão LTS mais recente do Node.js
echo "📦 Instalando Node.js LTS..."
nvm install --lts

# Usar a versão LTS
nvm use --lts

# Definir como padrão
nvm alias default node

# Verificar a versão
echo "✅ Node.js atualizado!"
echo "📊 Versão atual:"
node --version
npm --version

echo ""
echo "🎯 Agora você pode executar o setup do projeto:"
echo "   ./setup.sh"