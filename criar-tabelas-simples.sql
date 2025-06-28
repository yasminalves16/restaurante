-- =====================================================
-- CRIAR TABELAS BÁSICAS
-- =====================================================
-- Execute este script para criar as tabelas necessárias
-- =====================================================

-- 1. CRIAR TABELA USER
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

-- 2. CRIAR TABELA ORDER
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

-- 3. CRIAR TABELA MENU_ITEM
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

-- 4. CRIAR TABELA ORDER_ITEM
CREATE TABLE IF NOT EXISTS order_item (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES "order"(id) ON DELETE CASCADE,
    menu_item_id INTEGER,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    notes TEXT
);

-- 5. VERIFICAR SE AS TABELAS FORAM CRIADAS
SELECT
    tablename,
    'CRIADA COM SUCESSO' as status
FROM pg_tables
WHERE schemaname = 'public'
    AND tablename IN ('user', 'order', 'menu_item', 'order_item')
ORDER BY tablename;