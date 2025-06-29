# 🍽️ Guia de Implementação - Sistema de Comandas

Este guia explica como implementar o sistema de comandas no restaurante.

## 📋 Pré-requisitos

1. Backend configurado e funcionando
2. Frontend do cliente configurado
3. Banco de dados PostgreSQL configurado

## 🔧 Passos para Implementação

### 1. Migração do Banco de Dados

#### Opção A: Usando o Script Python (Recomendado)

```bash
cd backend
python migrate_comanda_fields.py
```

#### Opção B: Usando SQL Manual

Execute o arquivo `migracao-comanda-campos.sql` no DBeaver ou no seu cliente SQL:

```sql
-- Adicionar coluna is_comanda
ALTER TABLE "order" ADD COLUMN is_comanda BOOLEAN DEFAULT false;

-- Adicionar coluna mesa
ALTER TABLE "order" ADD COLUMN mesa INTEGER;

-- Adicionar coluna status_comanda
ALTER TABLE "order" ADD COLUMN status_comanda VARCHAR(20) DEFAULT 'aberta';

-- Atualizar pedidos existentes
UPDATE "order" SET is_comanda = true WHERE order_type = 'comanda';
```

### 2. Verificar a Migração

Execute o script de verificação:

```sql
-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'order'
AND column_name IN ('is_comanda', 'mesa', 'status_comanda');
```

### 3. Atualizar o Backend

O modelo `Order` já foi atualizado com os novos campos:

- `is_comanda`: Boolean - indica se é uma comanda
- `mesa`: Integer - número da mesa
- `status_comanda`: String - 'aberta' ou 'encerrada'

### 4. Frontend do Cliente

O frontend já foi atualizado com:

- **ComandaPage**: Componente específico para comandas
- **Seleção de Mesa**: Interface para escolher o número da mesa
- **Carrinho de Comanda**: Funcionalidades específicas para comandas
- **Integração**: Fluxo completo de comandas

## 🎯 Funcionalidades Implementadas

### Para o Cliente

1. **Seleção de Tipo de Pedido**

   - Opção "Comanda" na tela inicial
   - Interface específica para comandas

2. **Seleção de Mesa**

   - Input para digitar o número da mesa
   - Validação de mesa

3. **Cardápio de Comanda**

   - Filtros por categoria
   - Adição de itens ao carrinho
   - Visualização do total da comanda

4. **Carrinho de Comanda**

   - Gerenciamento de quantidades
   - Adição à comanda existente
   - Criação de nova comanda

5. **Persistência**
   - Carregamento de comanda existente
   - Adição de novos itens
   - Cálculo automático do total

### Para o Administrador

1. **Gerenciamento de Comandas**

   - Visualização de comandas abertas
   - Encerramento de comandas
   - Histórico de comandas

2. **Controle de Mesa**
   - Status por mesa
   - Total por comanda
   - Pedidos por mesa

## 🔄 Fluxo de Uso

### Cliente

1. **Acessar o sistema**

   - Abrir o frontend do cliente
   - Escolher "Comanda" na tela inicial

2. **Selecionar Mesa**

   - Digitar o número da mesa
   - Sistema carrega comanda existente ou cria nova

3. **Fazer Pedidos**

   - Navegar pelo cardápio
   - Adicionar itens ao carrinho
   - Ajustar quantidades

4. **Finalizar**
   - Adicionar itens à comanda
   - Continuar fazendo pedidos
   - Comanda permanece aberta

### Administrador

1. **Acessar Painel**

   - Ir para a seção "Comandas"
   - Visualizar mesas ativas

2. **Gerenciar Comandas**
   - Ver detalhes por mesa
   - Encerrar comandas
   - Imprimir comandas

## 🛠️ Configurações Adicionais

### Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas:

```bash
# Backend
DATABASE_URL=postgresql://...
SECRET_KEY=...

# Frontend
VITE_API_BASE_URL=https://seu-backend.com/api
```

### Permissões de CORS

O backend já está configurado para aceitar requisições do frontend do cliente.

## 🧪 Testando a Implementação

### 1. Teste do Cliente

1. Acesse o frontend do cliente
2. Escolha "Comanda"
3. Digite um número de mesa (ex: 1)
4. Adicione itens ao carrinho
5. Finalize o pedido
6. Verifique se aparece no painel admin

### 2. Teste do Administrador

1. Acesse o painel administrativo
2. Vá para a seção "Comandas"
3. Verifique se a mesa aparece
4. Teste o encerramento da comanda

### 3. Teste de Persistência

1. Faça um pedido na mesa 1
2. Feche o navegador
3. Acesse novamente e selecione mesa 1
4. Verifique se os itens anteriores aparecem

## 🐛 Solução de Problemas

### Erro: "Coluna não existe"

Execute a migração novamente:

```bash
cd backend
python migrate_comanda_fields.py
```

### Erro: "Comanda não encontrada"

Verifique se:

1. A mesa foi digitada corretamente
2. O backend está funcionando
3. A API está acessível

### Erro: "Item não disponível para comanda"

Verifique se o item no cardápio tem `available_for_comanda = true`.

## 📊 Monitoramento

### Logs do Backend

Monitore os logs para verificar:

- Criação de comandas
- Adição de itens
- Encerramento de comandas

### Métricas

Acompanhe:

- Número de comandas ativas
- Tempo médio de comanda
- Itens mais pedidos

## 🔄 Próximos Passos

1. **Melhorias de UX**

   - QR Code para mesa
   - Notificações em tempo real
   - Histórico de comandas por mesa

2. **Funcionalidades Avançadas**

   - Divisão de conta
   - Pagamento por mesa
   - Reservas de mesa

3. **Integrações**
   - Sistema de pagamento
   - Impressora térmica
   - Display de cozinha

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os logs do sistema
2. Teste as funcionalidades básicas
3. Consulte este guia
4. Entre em contato com o suporte

---

**✅ Sistema de Comandas Implementado com Sucesso!**
