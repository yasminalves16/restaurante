# 🚀 Deploy do Backend no Railway

## 🎯 Por que Railway?

- ✅ **Gratuito**: $5 de crédito/mês (suficiente para sempre ativo)
- ✅ **Fácil**: Deploy automático via GitHub
- ✅ **Rápido**: Setup em 5 minutos
- ✅ **Confiável**: Uptime de 99.9%
- ✅ **SSL**: HTTPS automático
- ✅ **Banco**: PostgreSQL gratuito incluído

## 📋 Pré-requisitos

1. Conta no [Railway](https://railway.app)
2. Conta no [GitHub](https://github.com)
3. Projeto no GitHub

## 🚀 Deploy em 5 Passos

### 1. Preparar o Projeto

Certifique-se de que seu projeto está no GitHub com esta estrutura:

```
restaurante/
├── backend/
│   ├── src/
│   ├── requirements.txt
│   ├── wsgi.py
│   └── gunicorn.conf.py
├── frontend/
│   ├── client/
│   └── restaurant/
└── README.md
```

### 2. Criar Conta no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em "Start a New Project"
3. Faça login com GitHub
4. Autorize o Railway

### 3. Deploy do Backend

1. **Conectar GitHub**:

   - Clique em "Deploy from GitHub repo"
   - Selecione seu repositório `restaurante`

2. **Configurar Deploy**:

   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --config gunicorn.conf.py wsgi:app`

3. **Variáveis de Ambiente**:
   ```
   FLASK_ENV=production
   SECRET_KEY=sua-chave-secreta-aqui
   PORT=5000
   ```

### 4. Configurar Banco de Dados (Opcional)

1. **Adicionar PostgreSQL**:

   - Clique em "New" > "Database" > "PostgreSQL"
   - Railway criará automaticamente a variável `DATABASE_URL`

2. **Atualizar requirements.txt**:
   ```txt
   Flask==3.1.1
   Flask-SQLAlchemy==3.1.1
   Flask-CORS==6.0.0
   gunicorn==21.2.0
   psycopg2-binary==2.9.9  # Para PostgreSQL
   ```

### 5. Obter URL da API

Após o deploy, Railway fornecerá uma URL como:

```
https://seu-projeto-backend.railway.app
```

## 🔧 Configurações Avançadas

### Railway.toml (Opcional)

Crie um arquivo `railway.toml` na raiz do projeto:

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "gunicorn --config gunicorn.conf.py wsgi:app"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
```

### Variáveis de Ambiente

No dashboard do Railway, configure:

```
FLASK_ENV=production
SECRET_KEY=sua-chave-super-secreta-aqui
DATABASE_URL=postgresql://...
CORS_ORIGINS=https://seu-client.vercel.app,https://seu-restaurant.vercel.app
```

## 🔄 Deploy Automático

O Railway faz deploy automático sempre que você fizer push para o GitHub:

```bash
git add .
git commit -m "Atualização da API"
git push origin main
```

## 📊 Monitoramento

### Logs em Tempo Real

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Ver logs
railway logs
```

### Métricas

- Acesse o dashboard do Railway
- Vá em "Metrics" para ver CPU, memória, requests

## 🔗 Atualizar Frontends

Após obter a URL da API, atualize os frontends:

### Client (frontend/client/src/App.jsx)

```javascript
const API_BASE_URL = 'https://seu-projeto-backend.railway.app/api';
```

### Restaurant (frontend/restaurant/src/App.jsx)

```javascript
const API_BASE_URL = 'https://seu-projeto-backend.railway.app/api';
```

## 🛠️ Troubleshooting

### Erro de Build

```bash
# Verificar logs
railway logs

# Build local para testar
cd backend
pip install -r requirements.txt
gunicorn --config gunicorn.conf.py wsgi:app
```

### Erro de CORS

Adicione no backend (`src/main.py`):

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=[
    "https://seu-client.vercel.app",
    "https://seu-restaurant.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
])
```

### Erro de Porta

Certifique-se de que o `gunicorn.conf.py` está configurado:

```python
bind = "0.0.0.0:5000"
```

## 💰 Custos

- **Gratuito**: $5 de crédito/mês
- **Backend**: ~$2-3/mês
- **PostgreSQL**: ~$1-2/mês
- **Total**: Dentro do limite gratuito

## 🎯 Próximos Passos

1. ✅ Deploy do backend no Railway
2. ✅ Atualizar URLs nos frontends
3. ✅ Testar o sistema completo
4. ✅ Configurar domínio customizado (opcional)

## 📞 Suporte

- **Documentação**: [docs.railway.app](https://docs.railway.app)
- **Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Email**: support@railway.app

---

**🎉 Parabéns!** Seu sistema de restaurante estará rodando em produção com:

- **Frontend Client**: Vercel
- **Frontend Restaurant**: Vercel
- **Backend API**: Railway
- **Banco de Dados**: PostgreSQL (Railway)
