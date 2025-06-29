-- =====================================================
-- MIGRAÇÃO: ADICIONAR CAMPOS ESPECÍFICOS DE COMANDA
-- =====================================================
-- Execute estes comandos no DBeaver para adicionar os campos de comanda
-- =====================================================

-- 1. ADICIONAR COLUNA is_comanda NA TABELA "order"
ALTER TABLE "order"
ADD COLUMN is_comanda BOOLEAN DEFAULT false;

-- 2. ADICIONAR COLUNA mesa NA TABELA "order"
ALTER TABLE "order"
ADD COLUMN mesa INTEGER;

-- 3. ADICIONAR COLUNA status_comanda NA TABELA "order"
ALTER TABLE "order"
ADD COLUMN status_comanda VARCHAR(20) DEFAULT 'aberta';

-- 4. ATUALIZAR TODOS OS PEDIDOS EXISTENTES
-- Pedidos de comanda devem ter is_comanda = true
UPDATE "order"
SET is_comanda = true
WHERE order_type = 'comanda';

-- 5. VERIFICAR SE AS COLUNAS FORAM ADICIONADAS CORRETAMENTE
SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'order'
AND column_name IN ('is_comanda', 'mesa', 'status_comanda');

-- 6. VERIFICAR OS DADOS ATUALIZADOS
SELECT
    id,
    order_type,
    is_comanda,
    mesa,
    status_comanda,
    customer_name,
    total_amount
FROM "order"
WHERE is_comanda = true
LIMIT 10;

-- 7. VERIFICAR PEDIDOS POR TIPO
SELECT
    order_type,
    COUNT(*) as quantidade,
    SUM(total_amount) as valor_total
FROM "order"
GROUP BY order_type;

-- =====================================================
-- FIM DA MIGRAÇÃO
-- =====================================================