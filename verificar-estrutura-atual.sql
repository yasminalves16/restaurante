-- =====================================================
-- VERIFICAR ESTRUTURA ATUAL DAS TABELAS
-- =====================================================
-- Execute este script primeiro para ver a estrutura atual
-- =====================================================

-- 1. VERIFICAR TABELAS EXISTENTES
-- =====================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = current_schema()
    AND table_name IN ('user', 'users', 'order', 'orders', 'customer', 'customers');

-- 2. VERIFICAR ESTRUTURA DA TABELA USER
-- =====================================================
-- Verificar se a tabela se chama 'user' ou 'users'
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = current_schema()
    AND table_name IN ('user', 'users')
ORDER BY table_name, ordinal_position;

-- 3. VERIFICAR ESTRUTURA DA TABELA ORDER
-- =====================================================
-- Verificar se a tabela se chama 'order' ou 'orders'
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = current_schema()
    AND table_name IN ('order', 'orders')
ORDER BY table_name, ordinal_position;

-- 4. VERIFICAR SE EXISTEM COLUNAS DE TELEFONE
-- =====================================================
-- Buscar por colunas que podem ser telefone
SELECT
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = current_schema()
    AND (
        column_name LIKE '%phone%'
        OR column_name LIKE '%telefone%'
        OR column_name LIKE '%tel%'
        OR column_name LIKE '%celular%'
        OR column_name LIKE '%mobile%'
    );

-- 5. VERIFICAR SE EXISTEM COLUNAS DE NOME
-- =====================================================
-- Buscar por colunas que podem ser nome
SELECT
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = current_schema()
    AND (
        column_name LIKE '%name%'
        OR column_name LIKE '%nome%'
        OR column_name LIKE '%customer%'
        OR column_name LIKE '%client%'
    );

-- 6. VERIFICAR DADOS EXISTENTES
-- =====================================================
-- Verificar se há dados nas tabelas
SELECT
    'user' as tabela,
    COUNT(*) as quantidade_registros
FROM "user"
UNION ALL
SELECT
    'users' as tabela,
    COUNT(*) as quantidade_registros
FROM "users"
UNION ALL
SELECT
    'order' as tabela,
    COUNT(*) as quantidade_registros
FROM "order"
UNION ALL
SELECT
    'orders' as tabela,
    COUNT(*) as quantidade_registros
FROM "orders";

-- 7. VERIFICAR EXEMPLO DE DADOS
-- =====================================================
-- Ver alguns registros para entender a estrutura
SELECT 'user' as tabela, * FROM "user" LIMIT 3;
SELECT 'users' as tabela, * FROM "users" LIMIT 3;
SELECT 'order' as tabela, * FROM "order" LIMIT 3;
SELECT 'orders' as tabela, * FROM "orders" LIMIT 3;