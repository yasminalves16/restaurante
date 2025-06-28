-- =====================================================
-- VERIFICAR ESTRUTURA REAL DAS TABELAS
-- =====================================================
-- Execute este script para ver a estrutura atual
-- =====================================================

-- 1. VERIFICAR ESTRUTURA DA TABELA USER
SELECT
    'user' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'user'
ORDER BY ordinal_position;

-- 2. VERIFICAR ESTRUTURA DA TABELA ORDER
SELECT
    'order' as tabela,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'order'
ORDER BY ordinal_position;

-- 3. VERIFICAR SE EXISTEM COLUNAS DE TELEFONE
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
    AND (
        column_name LIKE '%phone%'
        OR column_name LIKE '%telefone%'
        OR column_name LIKE '%tel%'
        OR column_name LIKE '%celular%'
        OR column_name LIKE '%mobile%'
    );

-- 4. VERIFICAR SE EXISTEM COLUNAS DE NOME
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
    AND (
        column_name LIKE '%name%'
        OR column_name LIKE '%nome%'
        OR column_name LIKE '%customer%'
        OR column_name LIKE '%client%'
    );

-- 5. VERIFICAR DADOS EXISTENTES
SELECT
    'user' as tabela,
    COUNT(*) as quantidade_registros
FROM "user"
UNION ALL
SELECT
    'order' as tabela,
    COUNT(*) as quantidade_registros
FROM "order"
UNION ALL
SELECT
    'menu_item' as tabela,
    COUNT(*) as quantidade_registros
FROM menu_item
UNION ALL
SELECT
    'order_item' as tabela,
    COUNT(*) as quantidade_registros
FROM order_item;

-- 6. VERIFICAR EXEMPLO DE DADOS (se houver)
SELECT 'user' as tabela, * FROM "user" LIMIT 3;
SELECT 'order' as tabela, * FROM "order" LIMIT 3;