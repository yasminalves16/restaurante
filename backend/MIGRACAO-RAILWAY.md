# 🚀 Migração de Dados no Railway

Este documento explica como executar a migração dos pedidos existentes para o novo modelo de usuários no Railway.

## 📋 O que o script faz

1. **Migra pedidos existentes** para o novo modelo de usuários
2. **Cria usuários** baseado em nome, telefone e email dos pedidos
3. **Associa pedidos** aos usuários corretos
4. **Atualiza estatísticas** (quantidade de pedidos e total gasto)
5. **Mostra relatório** final com estatísticas

## 🔧 Como executar no Railway

### Opção 1: Via Console do Railway (Recomendado)

1. **Acesse o Railway Dashboard**
2. **Vá para seu projeto** `restaurante-production-1f07`
3. **Clique na aba "Deployments"**
4. **Encontre o deployment mais recente** e clique nele
5. **Clique em "View Logs"**
6. **Clique em "Shell"** (ou "Terminal")
7. **Execute o comando:**
   ```bash
   python migrate_railway.py
   ```

### Opção 2: Via Railway CLI

1. **Instale o Railway CLI** (se não tiver):

   ```bash
   npm install -g @railway/cli
   ```

2. **Faça login:**

   ```bash
   railway login
   ```

3. **Conecte ao projeto:**

   ```bash
   railway link
   ```

4. **Execute o script:**
   ```bash
   railway run python migrate_railway.py
   ```

### Opção 3: Via Deploy com Comando

1. **Adicione o script ao seu projeto**
2. **Configure um comando de deploy** que execute a migração
3. **Faça deploy** e o script rodará automaticamente

## 📊 O que esperar

O script vai mostrar:

```
🚀 Script de Migração Railway
============================================================
⏰ Iniciado em: 28/06/2024 13:30:00
🌐 Ambiente: Produção
🗄️  Banco: postgresql://...
============================================================
🚀 Iniciando migração no Railway...
============================================================
📊 Total de pedidos no banco: 25
📋 Pedidos sem usuário: 25
🔄 Migrando 25 pedidos...
------------------------------------------------------------
📦 Processando pedido #1 - João Silva
  ✅ Novo usuário criado: João Silva
📦 Processando pedido #2 - Maria Santos
  ✅ Novo usuário criado: Maria Santos
...
------------------------------------------------------------
✅ Migração concluída!
📦 Pedidos migrados: 25
👤 Usuários criados: 20
👤 Usuários atualizados: 0

📊 Atualizando estatísticas dos usuários...
------------------------------------------------------------
  ✅ João Silva: 3 pedidos, R$ 45.50
  ✅ Maria Santos: 2 pedidos, R$ 32.80
...

📈 Estatísticas Finais do Sistema:
============================================================
👥 Total de usuários: 20
🛒 Usuários com pedidos: 20
📋 Total de pedidos: 25
🔗 Pedidos com usuário: 25
💰 Receita total: R$ 450.30

🏆 Top 5 Clientes por Valor Gasto:
  1. João Silva - R$ 45.50 (3 pedidos)
  2. Maria Santos - R$ 32.80 (2 pedidos)
  ...

✅ Migração concluída com sucesso!
🎉 Agora você pode usar o histórico de clientes no admin!
```

## ⚠️ Importante

- **Faça backup** antes de executar (se possível)
- **Execute apenas uma vez** - o script é seguro para rodar múltiplas vezes
- **Verifique os logs** se houver erros
- **Teste o admin** após a migração

## 🔍 Verificação

Após a migração, você pode verificar se funcionou:

1. **Acesse o admin do restaurante**
2. **Vá para "Histórico"**
3. **Deve aparecer a lista de clientes** com seus dados e estatísticas
4. **Clique em "Ver Pedidos"** para ver o histórico detalhado

## 🆘 Problemas Comuns

### "Nenhum pedido encontrado"

- Verifique se há pedidos no banco
- Confirme que está no ambiente correto

### "Erro de conexão"

- Verifique se o DATABASE_URL está correto
- Confirme se o Railway está rodando

### "Erro de permissão"

- Verifique se o usuário do banco tem permissões de escrita

## 📞 Suporte

Se tiver problemas, verifique:

1. **Logs do Railway**
2. **Configuração do banco**
3. **Permissões de usuário**

---

**✅ Após a migração, o histórico de clientes estará funcionando perfeitamente!**
