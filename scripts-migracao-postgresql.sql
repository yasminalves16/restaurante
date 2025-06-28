-- =====================================================
-- SCRIPTS DE MIGRAÇÃO - POSTGRESQL
-- =====================================================
-- Execute estes scripts no DBeaver na ordem apresentada
-- =====================================================

-- 1. VERIFICAR ESTRUTURA ATUAL
-- =====================================================
-- Execute este script primeiro para ver a estrutura atual

-- Verificar tabelas existentes
SELECT
    schemaname,
    tablename
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('user', 'users', 'order', 'orders');

-- Verificar colunas da tabela user (se existir)
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'user'
ORDER BY ordinal_position;

-- Verificar colunas da tabela order (se existir)
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'order'
ORDER BY ordinal_position;

-- =====================================================
-- 2. CRIAR TABELAS SE NÃO EXISTIREM
-- =====================================================
-- Execute apenas se as tabelas não existirem

-- Criar tabela user se não existir
CREATE TABLE IF NOT EXISTS "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) UNIQUE,
    email VARCHAR(120) UNIQUE,
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20) NOT NULL UNIQUE,
    customer_email VARCHAR(120),
    delivery_address TEXT,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela order se não existir
CREATE TABLE IF NOT EXISTS "order" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    customer_name VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_email VARCHAR(120),
    order_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pendente',
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela order_item se não existir
CREATE TABLE IF NOT EXISTS order_item (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES "order"(id) ON DELETE CASCADE,
    menu_item_id INTEGER,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    notes TEXT
);

-- Criar tabela menu_item se não existir
CREATE TABLE IF NOT EXISTS menu_item (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50),
    available_for_delivery BOOLEAN DEFAULT true,
    available_for_local BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. VERIFICAR TELEFONES DUPLICADOS
-- =====================================================
-- Execute este script para ver se há telefones duplicados
SELECT
    customer_phone,
    COUNT(*) as quantidade,
    array_agg(id) as ids_usuarios
FROM "user"
WHERE customer_phone IS NOT NULL
    AND customer_phone != ''
    AND customer_phone != 'null'
GROUP BY customer_phone
HAVING COUNT(*) > 1;

-- =====================================================
-- 4. REMOVER USUÁRIOS DUPLICADOS (se houver)
-- =====================================================
-- ⚠️ ATENÇÃO: Execute apenas se o script anterior retornou resultados
-- ⚠️ Este script remove usuários duplicados, mantendo apenas o mais recente

-- Para cada telefone duplicado, execute um DELETE como este:
-- (Substitua os IDs pelos valores retornados no script anterior)

-- Exemplo (substitua pelos IDs reais):
-- DELETE FROM "user" WHERE id IN (2, 5, 8) AND customer_phone = '11912345678';

-- =====================================================
-- 5. ALTERAR TABELA USER - TORNAR NOME OPCIONAL
-- =====================================================
-- Tornar customer_name opcional na tabela user
ALTER TABLE "user" ALTER COLUMN customer_name DROP NOT NULL;

-- =====================================================
-- 6. ALTERAR TABELA ORDER - TORNAR NOME OPCIONAL
-- =====================================================
-- Tornar customer_name opcional na tabela order
ALTER TABLE "order" ALTER COLUMN customer_name DROP NOT NULL;

-- =====================================================
-- 7. ADICIONAR RESTRIÇÃO ÚNICA NO TELEFONE
-- =====================================================
-- Adicionar constraint única para customer_phone na tabela user
-- ⚠️ Se der erro de duplicados, resolva primeiro com os scripts 3 e 4

-- Opção 1: Adicionar constraint única
ALTER TABLE "user" ADD CONSTRAINT uk_user_customer_phone UNIQUE (customer_phone);

-- Opção 2: Se a opção 1 der erro, criar índice único
-- CREATE UNIQUE INDEX idx_user_customer_phone_unique ON "user" (customer_phone);

-- =====================================================
-- 8. VERIFICAR RESULTADO
-- =====================================================
-- Verificar se as mudanças foram aplicadas corretamente

-- Verificar estrutura da tabela user
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'user'
ORDER BY ordinal_position;

-- Verificar estrutura da tabela order
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'order'
ORDER BY ordinal_position;

-- Verificar usuários sem nome (agora permitido)
SELECT COUNT(*) as usuarios_sem_nome FROM "user" WHERE customer_name IS NULL;

-- Verificar pedidos sem nome (agora permitido)
SELECT COUNT(*) as pedidos_sem_nome FROM "order" WHERE customer_name IS NULL;

-- Verificar restrição única
SELECT
    constraint_name,
    constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
    AND table_name = 'user'
    AND constraint_name = 'uk_user_customer_phone';

-- =====================================================
-- 9. DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================
-- Inserir alguns dados de teste para verificar o funcionamento

-- Inserir usuário de teste
INSERT INTO "user" (customer_phone, customer_name, created_at, updated_at)
VALUES ('11912345678', 'Cliente Teste', NOW(), NOW())
ON CONFLICT (customer_phone) DO UPDATE SET updated_at = NOW();

-- Inserir pedido de teste
INSERT INTO "order" (
    user_id,
    customer_name,
    customer_phone,
    order_type,
    total_amount,
    status,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM "user" WHERE customer_phone = '11912345678'),
    'Cliente Teste',
    '11912345678',
    'local',
    25.50,
    'pendente',
    NOW(),
    NOW()
);

-- =====================================================
-- 10. LIMPEZA (OPCIONAL)
-- =====================================================
-- Remover dados de teste se necessário
-- DELETE FROM "order" WHERE customer_phone = '11912345678';
-- DELETE FROM "user" WHERE customer_phone = '11912345678';

-- =====================================================
-- RESUMO DAS MUDANÇAS
-- =====================================================
/*
✅ MUDANÇAS APLICADAS:

1. TELEFONE COMO IDENTIFICADOR ÚNICO:
   - Restrição única adicionada em user.customer_phone
   - Telefone é agora obrigatório para identificação

2. NOME OPCIONAL:
   - user.customer_name agora permite NULL
   - order.customer_name agora permite NULL
   - Nome pode variar entre pedidos sem afetar histórico

3. FUNCIONALIDADES:
   - Histórico mantido pelo telefone
   - Nome usado apenas para identificação
   - Máscara de telefone: (DDD) 9XXXX-XXXX

4. EXEMPLO DE USO:
   - Telefone: 11912345678
   - Pedido 1: Nome "Yasmin"
   - Pedido 2: Nome "Yasmin Alves"
   - Histórico: Mostra ambos os pedidos com seus nomes

✅ PRÓXIMOS PASSOS:
1. Testar o frontend com as mudanças
2. Verificar se a máscara de telefone funciona
3. Testar criação de pedidos sem nome
4. Testar acesso ao histórico por telefone
*/