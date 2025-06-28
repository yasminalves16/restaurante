# Guia de Migração - PostgreSQL (DBeaver)

## 📋 Pré-requisitos

- DBeaver instalado e conectado ao PostgreSQL
- Backup do banco de dados (recomendado)
- Acesso de administrador ao banco

## 🚀 Passo a Passo

### 1. **FAZER BACKUP (OBRIGATÓRIO)**

```bash
# Execute este comando para fazer backup das tabelas importantes
pg_dump -U seu_usuario -h localhost -d seu_banco -t "user" -t "order" -t "order_item" -t "menu_item" > backup_antes_migracao.sql
```

### 2. **VERIFICAR ESTRUTURA ATUAL**

- Abra o arquivo `scripts-migracao-postgresql.sql`
- Execute apenas o **Script 1** (VERIFICAR ESTRUTURA ATUAL)
- Anote quais tabelas existem e suas estruturas

### 3. **CRIAR TABELAS (se necessário)**

- Se as tabelas não existirem, execute o **Script 2**
- Este script cria todas as tabelas necessárias com a estrutura correta

### 4. **VERIFICAR TELEFONES DUPLICADOS**

- Execute o **Script 3** para ver se há telefones duplicados
- Se retornar resultados, anote os telefones e IDs

### 5. **REMOVER DUPLICADOS (se necessário)**

- Se o script anterior retornou duplicados, execute o **Script 4**
- Substitua os IDs pelos valores reais retornados
- Execute um DELETE para cada telefone duplicado

### 6. **ALTERAR TABELA USER**

- Execute o **Script 5**: `ALTER TABLE "user" ALTER COLUMN customer_name DROP NOT NULL;`

### 7. **ALTERAR TABELA ORDER**

- Execute o **Script 6**: `ALTER TABLE "order" ALTER COLUMN customer_name DROP NOT NULL;`

### 8. **ADICIONAR RESTRIÇÃO ÚNICA**

- Execute o **Script 7** (Opção 1): `ALTER TABLE "user" ADD CONSTRAINT uk_user_customer_phone UNIQUE (customer_phone);`
- Se der erro, use a Opção 2

### 9. **VERIFICAR RESULTADO**

- Execute o **Script 8** para verificar se tudo está correto
- Confirme que as estruturas foram alteradas

### 10. **TESTAR FUNCIONALIDADE**

- Execute o **Script 9** para inserir dados de teste
- Confirme que tudo está funcionando

## ⚠️ POSSÍVEIS ERROS E SOLUÇÕES

### Erro: "column does not exist"

```
ERROR: column "customer_phone" does not exist
```

**Solução**: Execute primeiro o Script 2 para criar as tabelas

### Erro: "duplicate key value violates unique constraint"

```
ERROR: duplicate key value violates unique constraint "uk_user_customer_phone"
```

**Solução**: Execute primeiro os scripts 3 e 4 para remover duplicados

### Erro: "column is not null"

```
ERROR: column "customer_name" is not null
```

**Solução**: Verifique se executou corretamente os scripts 5 e 6

### Erro: "table does not exist"

```
ERROR: relation "user" does not exist
```

**Solução**: Execute o Script 2 para criar as tabelas

## 🔍 VERIFICAÇÕES IMPORTANTES

### Após cada script, verifique:

1. **Estrutura da tabela user**:

```sql
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'user'
ORDER BY ordinal_position;
```

- `customer_name` deve mostrar `YES` na coluna `is_nullable`

2. **Estrutura da tabela order**:

```sql
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'order'
ORDER BY ordinal_position;
```

- `customer_name` deve mostrar `YES` na coluna `is_nullable`

3. **Restrição única**:

```sql
SELECT
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
    AND table_name = 'user'
    AND constraint_name = 'uk_user_customer_phone';
```

- Deve retornar uma linha com a constraint

## 📊 DADOS DE TESTE

### Inserir usuário de teste:

```sql
INSERT INTO "user" (customer_phone, customer_name, created_at, updated_at)
VALUES ('11912345678', 'Cliente Teste', NOW(), NOW())
ON CONFLICT (customer_phone) DO UPDATE SET updated_at = NOW();
```

### Inserir usuário sem nome:

```sql
INSERT INTO "user" (customer_phone, created_at, updated_at)
VALUES ('11987654321', NOW(), NOW())
ON CONFLICT (customer_phone) DO UPDATE SET updated_at = NOW();
```

### Verificar inserções:

```sql
SELECT id, customer_phone, customer_name, created_at
FROM "user"
WHERE customer_phone IN ('11912345678', '11987654321');
```

## ✅ CHECKLIST FINAL

- [ ] Backup realizado
- [ ] Tabelas criadas (se necessário)
- [ ] Telefones duplicados removidos
- [ ] Tabela user.customer_name permite NULL
- [ ] Tabela order.customer_name permite NULL
- [ ] Restrição única adicionada em user.customer_phone
- [ ] Script de verificação executado com sucesso
- [ ] Testes de inserção funcionando
- [ ] Frontend testado

## 🎯 RESULTADO ESPERADO

Após a migração, você deve conseguir:

1. **Criar usuários sem nome**:

```sql
INSERT INTO "user" (customer_phone) VALUES ('11912345678');
```

2. **Criar pedidos sem nome**:

```sql
INSERT INTO "order" (customer_phone, order_type, total_amount)
VALUES ('11912345678', 'local', 25.50);
```

3. **Buscar usuário por telefone**:

```sql
SELECT * FROM "user" WHERE customer_phone = '11912345678';
```

4. **Ver histórico de pedidos por telefone**:

```sql
SELECT * FROM "order" WHERE customer_phone = '11912345678';
```

## 🔧 COMANDOS ÚTEIS

### Verificar todas as tabelas:

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

### Verificar constraints:

```sql
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public'
    AND tc.table_name IN ('user', 'order');
```

### Verificar índices:

```sql
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
    AND tablename IN ('user', 'order');
```

## 🆘 EM CASO DE PROBLEMAS

1. **Restaure o backup** se algo der errado
2. **Verifique os logs** do DBeaver para erros específicos
3. **Execute os scripts um por vez** para identificar onde está o problema
4. **Teste em ambiente de desenvolvimento** primeiro

## 📞 SUPORTE

Se encontrar problemas:

1. Anote o erro exato
2. Verifique se todos os pré-requisitos foram atendidos
3. Confirme que o backup foi feito
4. Execute os scripts de verificação para diagnosticar
5. Verifique se está usando PostgreSQL (não MySQL)
