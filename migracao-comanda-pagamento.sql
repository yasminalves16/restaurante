-- =====================================================
-- MIGRAÇÃO: ADICIONAR COMANDA E STATUS DE PAGAMENTO
-- =====================================================
-- Execute estes comandos no DBeaver para adicionar as novas funcionalidades
-- =====================================================

-- 1. ADICIONAR COLUNA available_for_comanda NA TABELA menu_item
ALTER TABLE menu_item
ADD COLUMN available_for_comanda BOOLEAN DEFAULT true;

-- 2. ATUALIZAR TODOS OS ITENS EXISTENTES PARA TER available_for_comanda = true
UPDATE menu_item
SET available_for_comanda = true
WHERE available_for_comanda IS NULL;

-- 3. ADICIONAR COLUNA payment_status NA TABELA "order"
ALTER TABLE "order"
ADD COLUMN payment_status VARCHAR(20) DEFAULT 'nao_pago';

-- 4. ATUALIZAR TODOS OS PEDIDOS EXISTENTES PARA TER payment_status = 'nao_pago'
UPDATE "order"
SET payment_status = 'nao_pago'
WHERE payment_status IS NULL;

-- 5. VERIFICAR SE AS COLUNAS FORAM ADICIONADAS CORRETAMENTE
SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'menu_item'
AND column_name = 'available_for_comanda';

SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'order'
AND column_name = 'payment_status';

-- 6. VERIFICAR OS DADOS ATUALIZADOS
SELECT
    id,
    name,
    available_for_delivery,
    available_for_local,
    available_for_comanda
FROM menu_item
LIMIT 5;

SELECT
    id,
    order_type,
    status,
    payment_status,
    total_amount
FROM "order"
LIMIT 5;

-- =====================================================
-- FIM DA MIGRAÇÃO
-- =====================================================