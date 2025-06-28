# 🚀 Deploy no Vercel - Frontends

Este guia explica como fazer deploy dos frontends no Vercel.

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Vercel CLI instalado
- Node.js e pnpm configurados

## 🚀 Deploy Automático

### 1. Preparar os builds

```bash
./deploy-vercel.sh
```

### 2. Fazer login no Vercel

```bash
vercel login
```

### 3. Deploy do Frontend Client

```bash
cd frontend/client
vercel --prod
```

### 4. Deploy do Frontend Restaurant

```bash
cd frontend/restaurant
vercel --prod
```

## 🔧 Deploy Manual

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Build dos frontends

```bash
# Client
cd frontend/client
pnpm build

# Restaurant
cd ../restaurant
pnpm build
```

### 3. Deploy

```bash
# Em cada diretório do frontend
vercel --prod
```

## ⚙️ Configurações

### Variáveis de Ambiente (Opcional)

No dashboard do Vercel, configure:

- `VITE_API_URL` - URL da sua API backend

### Domínios Customizados

1. Vá para o dashboard do projeto no Vercel
2. Settings > Domains
3. Adicione seu domínio customizado

## 🔗 URLs Após Deploy

Após o deploy, você terá URLs como:

- **Client**: `https://seu-projeto-client.vercel.app`
- **Restaurant**: `https://seu-projeto-restaurant.vercel.app`

## 🔄 Atualizações

### Deploy automático

```bash
# Push para o repositório conectado ao Vercel
git push origin main
```

### Deploy manual

```bash
vercel --prod
```

## 🛠️ Troubleshooting

### Erro de build

```bash
# Verificar logs
vercel logs

# Build local para testar
pnpm build
```

### Problemas de CORS

- Verifique se a API backend está configurada para aceitar o domínio do Vercel
- Atualize as configurações CORS no backend

### Variáveis de ambiente

```bash
# Listar variáveis
vercel env ls

# Adicionar variável
vercel env add VITE_API_URL
```

## 📊 Monitoramento

### Analytics

- Acesse o dashboard do Vercel
- Analytics > Overview

### Logs

```bash
vercel logs
```

## 🔒 Segurança

### Headers de Segurança

Os arquivos `vercel.json` já incluem headers básicos de segurança.

### CORS

Configure o backend para aceitar apenas os domínios necessários.

## 🎯 Próximos Passos

1. **Configurar domínio customizado**
2. **Configurar variáveis de ambiente**
3. **Conectar com repositório Git**
4. **Configurar deploy automático**
5. **Monitorar performance**

## 📞 Suporte

- [Documentação Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [Vite + Vercel](https://vercel.com/docs/frameworks/vite)
