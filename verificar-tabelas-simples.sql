-- =====================================================
-- VERIFICAR SE AS TABELAS EXISTEM
-- =====================================================
-- Execute este script no DBeaver para ver o que existe
-- =====================================================

-- 1. VERIFICAR TODAS AS TABELAS DO BANCO
SELECT
    tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. VERIFICAR SE EXISTEM TABELAS ESPECÍFICAS
SELECT
    CASE
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user' AND schemaname = 'public')
        THEN 'EXISTE'
        ELSE 'NÃO EXISTE'
    END as tabela_user,

    CASE
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'order' AND schemaname = 'public')
        THEN 'EXISTE'
        ELSE 'NÃO EXISTE'
    END as tabela_order,

    CASE
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'menu_item' AND schemaname = 'public')
        THEN 'EXISTE'
        ELSE 'NÃO EXISTE'
    END as tabela_menu_item;

-- 3. CONTAR QUANTAS TABELAS EXISTEM NO TOTAL
SELECT COUNT(*) as total_tabelas FROM pg_tables WHERE schemaname = 'public';