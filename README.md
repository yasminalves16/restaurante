# 🍽️ Sistema de Restaurante

Um sistema completo de restaurante com backend Flask e frontends React para clientes e restaurante.

## 📋 Pré-requisitos

- **Python 3.8+**
- **Node.js 18+**
- **pnpm** (será instalado automaticamente se necessário)

## 🚀 Configuração Rápida

### Opção 1: Script Automático (Recomendado)

```bash
# Dar permissão de execução aos scripts
chmod +x setup.sh run.sh

# Configurar o projeto
./setup.sh

# Executar todos os serviços
./run.sh
```

### Opção 2: Configuração Manual

#### 1. Backend (Flask API)

```bash
cd backend

# Criar ambiente virtual
python3 -m venv venv

# Ativar ambiente virtual
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Instalar dependências
pip install -r requirements.txt

# Executar o servidor
python3 src/main.py
```

#### 2. Frontend Client

```bash
cd frontend/client

# Instalar dependências
pnpm install

# Executar servidor de desenvolvimento
pnpm dev
```

#### 3. Frontend Restaurant

```bash
cd frontend/restaurant

# Instalar dependências
pnpm install

# Executar servidor de desenvolvimento
pnpm dev
```

## 🌐 URLs dos Serviços

- **Backend API**: http://localhost:5000
- **Frontend Client**: http://localhost:5173
- **Frontend Restaurant**: http://localhost:5174

## 📁 Estrutura do Projeto

```
restaurante/
├── backend/                 # API Flask
│   ├── src/
│   │   ├── models/         # Modelos do banco de dados
│   │   ├── routes/         # Rotas da API
│   │   ├── static/         # Arquivos estáticos
│   │   └── main.py         # Aplicação principal
│   ├── requirements.txt    # Dependências Python
│   └── venv/              # Ambiente virtual
├── frontend/
│   ├── client/            # Frontend para clientes
│   └── restaurant/        # Frontend para restaurante
├── setup.sh              # Script de configuração
├── run.sh                # Script de execução
└── README.md             # Este arquivo
```

## 🗄️ Banco de Dados

O projeto usa SQLite como banco de dados. O arquivo `app.db` será criado automaticamente na primeira execução.

### Modelos

- **User**: Usuários do sistema
- **MenuItem**: Itens do cardápio
- **Order**: Pedidos
- **OrderItem**: Itens dos pedidos

## 🔧 API Endpoints

### Menu

- `GET /api/menu` - Listar cardápio
- `GET /api/menu/categories` - Listar categorias
- `POST /api/menu` - Criar item do cardápio
- `PUT /api/menu/<id>` - Atualizar item
- `DELETE /api/menu/<id>` - Remover item

### Orders

- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Criar pedido
- `PUT /api/orders/<id>` - Atualizar pedido
- `DELETE /api/orders/<id>` - Cancelar pedido

### Users

- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `GET /api/users/<id>` - Obter usuário
- `PUT /api/users/<id>` - Atualizar usuário
- `DELETE /api/users/<id>` - Remover usuário

## 🛠️ Tecnologias Utilizadas

### Backend

- **Flask**: Framework web
- **SQLAlchemy**: ORM para banco de dados
- **Flask-CORS**: Cross-origin resource sharing
- **SQLite**: Banco de dados

### Frontend

- **React 19**: Biblioteca JavaScript
- **Vite**: Build tool
- **Tailwind CSS**: Framework CSS
- **Radix UI**: Componentes de interface
- **React Router**: Roteamento
- **React Hook Form**: Gerenciamento de formulários

## 🐛 Solução de Problemas

### Erro de Porta em Uso

Se alguma porta estiver em uso, você pode:

1. Parar o processo que está usando a porta
2. Ou alterar a porta no arquivo de configuração

### Erro de Dependências

```bash
# Backend
cd backend
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Frontend
cd frontend/client  # ou restaurant
pnpm install --force
```

### Erro de Banco de Dados

```bash
cd backend
source venv/bin/activate
rm src/database/app.db  # Remove o banco
python3 -c "
import sys
sys.path.insert(0, 'src')
from main import app, db
with app.app_context():
    db.create_all()
"
```

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request
