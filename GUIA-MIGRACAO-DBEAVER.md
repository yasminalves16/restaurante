# Guia de Migração - DBeaver

## 📋 Pré-requisitos

- DBeaver instalado e conectado ao banco de dados
- Backup do banco de dados (recomendado)
- Acesso de administrador ao banco

## 🚀 Passo a Passo

### 1. **FAZER BACKUP (OBRIGATÓRIO)**

```sql
-- Execute este comando para fazer backup das tabelas importantes
-- (Ajuste o caminho conforme seu sistema)

-- Para MySQL:
mysqldump -u seu_usuario -p seu_banco user `order` > backup_antes_migracao.sql

-- Para PostgreSQL:
pg_dump -U seu_usuario -t user -t order seu_banco > backup_antes_migracao.sql
```

### 2. **VERIFICAR TELEFONES DUPLICADOS**

- Abra o arquivo `scripts-migracao.sql`
- Execute apenas o **Script 1** (VERIFICAR TELEFONES DUPLICADOS)
- Se retornar resultados, anote os telefones e IDs

### 3. **REMOVER DUPLICADOS (se necessário)**

- Se o script anterior retornou duplicados, execute o **Script 2**
- Substitua os IDs pelos valores reais retornados
- Execute um DELETE para cada telefone duplicado

### 4. **ALTERAR TABELA USER**

- Execute o **Script 3**: `ALTER TABLE user MODIFY COLUMN customer_name VARCHAR(100) NULL;`

### 5. **ALTERAR TABELA ORDER**

- Execute o **Script 4**: `ALTER TABLE \`order\` MODIFY COLUMN customer_name VARCHAR(100) NULL;`

### 6. **ADICIONAR RESTRIÇÃO ÚNICA**

- Execute o **Script 5** (Opção 1): `ALTER TABLE user ADD CONSTRAINT uk_user_customer_phone UNIQUE (customer_phone);`
- Se der erro, use a Opção 2

### 7. **VERIFICAR RESULTADO**

- Execute o **Script 6** para verificar se tudo está correto
- Confirme que as estruturas foram alteradas

### 8. **TESTAR FUNCIONALIDADE**

- Execute o arquivo `verificacao-migracao.sql`
- Confirme que todos os testes passaram

## ⚠️ POSSÍVEIS ERROS E SOLUÇÕES

### Erro: "Duplicate entry for key"

```
ERROR 1062 (23000): Duplicate entry '11912345678' for key 'uk_user_customer_phone'
```

**Solução**: Execute primeiro os scripts 1 e 2 para remover duplicados

### Erro: "Column cannot be null"

```
ERROR 1048 (23000): Column 'customer_name' cannot be null
```

**Solução**: Verifique se executou corretamente os scripts 3 e 4

### Erro: "Table doesn't exist"

```
ERROR 1146 (42S02): Table 'seu_banco.order' doesn't exist
```

**Solução**: Verifique o nome da tabela. Pode ser `orders` em vez de `order`

## 🔍 VERIFICAÇÕES IMPORTANTES

### Após cada script, verifique:

1. **Estrutura da tabela user**:

```sql
DESCRIBE user;
```

- `customer_name` deve mostrar `YES` na coluna `Null`

2. **Estrutura da tabela order**:

```sql
DESCRIBE `order`;
```

- `customer_name` deve mostrar `YES` na coluna `Null`

3. **Restrição única**:

```sql
SHOW INDEX FROM user WHERE Key_name = 'uk_user_customer_phone';
```

- Deve retornar uma linha com a constraint

## 📊 DADOS DE TESTE

### Inserir usuário de teste:

```sql
INSERT INTO user (customer_phone, customer_name, created_at, updated_at)
VALUES ('11912345678', 'Cliente Teste', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();
```

### Inserir usuário sem nome:

```sql
INSERT INTO user (customer_phone, created_at, updated_at)
VALUES ('11987654321', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();
```

### Verificar inserções:

```sql
SELECT id, customer_phone, customer_name, created_at
FROM user
WHERE customer_phone IN ('11912345678', '11987654321');
```

## ✅ CHECKLIST FINAL

- [ ] Backup realizado
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
INSERT INTO user (customer_phone) VALUES ('11912345678');
```

2. **Criar pedidos sem nome**:

```sql
INSERT INTO `order` (customer_phone, order_type, total_amount)
VALUES ('11912345678', 'local', 25.50);
```

3. **Buscar usuário por telefone**:

```sql
SELECT * FROM user WHERE customer_phone = '11912345678';
```

4. **Ver histórico de pedidos por telefone**:

```sql
SELECT * FROM `order` WHERE customer_phone = '11912345678';
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
