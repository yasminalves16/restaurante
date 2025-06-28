-- =====================================================
-- SCRIPT DE VERIFICAÇÃO - MIGRAÇÃO CONCLUÍDA
-- =====================================================
-- Execute este script após aplicar todos os scripts de migração
-- =====================================================

-- 1. VERIFICAR ESTRUTURA DAS TABELAS
-- =====================================================
-- Verificar se customer_name permite NULL
SELECT
    TABLE_NAME,
    COLUMN_NAME,
    IS_NULLABLE,
    DATA_TYPE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN ('user', 'order')
    AND COLUMN_NAME = 'customer_name';

-- 2. VERIFICAR RESTRIÇÃO ÚNICA NO TELEFONE
-- =====================================================
-- Verificar se a constraint única foi criada
SELECT
    TABLE_NAME,
    CONSTRAINT_NAME,
    CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'user'
    AND CONSTRAINT_NAME = 'uk_user_customer_phone';

-- 3. VERIFICAR DADOS EXISTENTES
-- =====================================================
-- Contar usuários sem nome
SELECT
    'Usuários sem nome' as tipo,
    COUNT(*) as quantidade
FROM user
WHERE customer_name IS NULL

UNION ALL

-- Contar pedidos sem nome
SELECT
    'Pedidos sem nome' as tipo,
    COUNT(*) as quantidade
FROM `order`
WHERE customer_name IS NULL

UNION ALL

-- Contar usuários com telefone
SELECT
    'Usuários com telefone' as tipo,
    COUNT(*) as quantidade
FROM user
WHERE customer_phone IS NOT NULL
    AND customer_phone != '';

-- 4. TESTAR FUNCIONALIDADE
-- =====================================================
-- Testar inserção de usuário sem nome
INSERT INTO user (customer_phone, created_at, updated_at)
VALUES ('11987654321', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Verificar se foi inserido
SELECT
    id,
    customer_phone,
    customer_name,
    created_at
FROM user
WHERE customer_phone = '11987654321';

-- 5. TESTAR INSERÇÃO DE PEDIDO SEM NOME
-- =====================================================
-- Primeiro, vamos ver se há itens no menu para criar um pedido
SELECT
    id,
    name,
    price
FROM menu_item
LIMIT 1;

-- Se houver itens, podemos testar inserção de pedido
-- (Descomente e ajuste conforme necessário)

/*
-- Inserir pedido de teste sem nome
INSERT INTO `order` (
    user_id,
    customer_phone,
    order_type,
    total_amount,
    status,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM user WHERE customer_phone = '11987654321'),
    '11987654321',
    'local',
    15.00,
    'pendente',
    NOW(),
    NOW()
);

-- Verificar pedido criado
SELECT
    id,
    customer_phone,
    customer_name,
    order_type,
    total_amount,
    status
FROM `order`
WHERE customer_phone = '11987654321';
*/

-- 6. VERIFICAR TELEFONES ÚNICOS
-- =====================================================
-- Verificar se não há telefones duplicados
SELECT
    customer_phone,
    COUNT(*) as quantidade
FROM user
WHERE customer_phone IS NOT NULL
    AND customer_phone != ''
GROUP BY customer_phone
HAVING COUNT(*) > 1;

-- 7. RESUMO FINAL
-- =====================================================
-- Resumo das verificações
SELECT
    'VERIFICAÇÃO FINAL' as status,
    CASE
        WHEN (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
              WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'user'
                AND COLUMN_NAME = 'customer_name'
                AND IS_NULLABLE = 'YES') > 0
        THEN '✅ OK'
        ELSE '❌ FALHOU'
    END as user_customer_name_nullable,

    CASE
        WHEN (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
              WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'order'
                AND COLUMN_NAME = 'customer_name'
                AND IS_NULLABLE = 'YES') > 0
        THEN '✅ OK'
        ELSE '❌ FALHOU'
    END as order_customer_name_nullable,

    CASE
        WHEN (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
              WHERE TABLE_SCHEMA = DATABASE()
                AND TABLE_NAME = 'user'
                AND CONSTRAINT_NAME = 'uk_user_customer_phone') > 0
        THEN '✅ OK'
        ELSE '❌ FALHOU'
    END as phone_unique_constraint;

-- =====================================================
-- INSTRUÇÕES FINAIS
-- =====================================================
/*
✅ SE TODOS OS CAMPOS MOSTRAREM "✅ OK":
   - A migração foi bem-sucedida
   - O sistema está pronto para uso
   - Teste o frontend com as novas funcionalidades

❌ SE ALGUM CAMPO MOSTRAR "❌ FALHOU":
   - Revise os scripts de migração
   - Execute novamente os scripts que falharam
   - Verifique se não há dados conflitantes

🔧 PRÓXIMOS PASSOS:
1. Testar o frontend do cliente
2. Verificar máscara de telefone
3. Testar criação de pedidos sem nome
4. Testar acesso ao histórico por telefone
5. Verificar se os pedidos antigos continuam funcionando
*/