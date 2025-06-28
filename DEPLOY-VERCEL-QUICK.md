# 🚀 Deploy Rápido no Vercel

## ✅ Status Atual

- ✅ Vercel CLI instalado
- ✅ Builds dos frontends prontos
- ✅ Configurações do Vercel criadas

## 🚀 Deploy em 3 Passos

### 1. Login no Vercel

```bash
vercel login
```

### 2. Deploy do Client

```bash
cd frontend/client
vercel --prod
```

### 3. Deploy do Restaurant

```bash
cd frontend/restaurant
vercel --prod
```

## 🔗 URLs que você receberá

- **Client**: `https://seu-projeto-client.vercel.app`
- **Restaurant**: `https://seu-projeto-restaurant.vercel.app`

## ⚠️ Importante: Atualizar URL da API

Após o deploy, você precisará atualizar a URL da API nos frontends:

### No Client (frontend/client/src/App.jsx):

```javascript
const API_BASE_URL = 'https://sua-api-backend.com/api';
```

### No Restaurant (frontend/restaurant/src/App.jsx):

```javascript
const API_BASE_URL = 'https://sua-api-backend.com/api';
```

## 🔄 Para atualizações futuras

```bash
# Em qualquer diretório do frontend
vercel --prod
```

## 📞 Próximos passos

1. Fazer deploy do backend (Railway, Heroku, DigitalOcean, etc.)
2. Atualizar URLs da API nos frontends
3. Testar o sistema completo
4. Configurar domínio customizado (opcional)

## 🎯 Arquitetura Final

- **Frontend Client**: Vercel
- **Frontend Restaurant**: Vercel
- **Backend API**: Seu servidor escolhido
- **Banco de Dados**: SQLite (local) ou PostgreSQL (produção)
