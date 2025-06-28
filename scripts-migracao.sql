-- =====================================================
-- SCRIPTS DE MIGRAÇÃO - SISTEMA DE AUTENTICAÇÃO POR TELEFONE
-- =====================================================
-- Execute estes scripts no DBeaver na ordem apresentada
-- =====================================================

-- 1. VERIFICAR TELEFONES DUPLICADOS
-- =====================================================
-- Execute este script primeiro para ver se há telefones duplicados
SELECT
    customer_phone,
    COUNT(*) as quantidade,
    GROUP_CONCAT(id) as ids_usuarios
FROM user
WHERE customer_phone IS NOT NULL
    AND customer_phone != ''
    AND customer_phone != 'null'
GROUP BY customer_phone
HAVING COUNT(*) > 1;

-- =====================================================
-- 2. REMOVER USUÁRIOS DUPLICADOS (se houver)
-- =====================================================
-- ⚠️ ATENÇÃO: Execute apenas se o script anterior retornou resultados
-- ⚠️ Este script remove usuários duplicados, mantendo apenas o mais recente

-- Para cada telefone duplicado, execute um DELETE como este:
-- (Substitua os IDs pelos valores retornados no script anterior)

-- Exemplo (substitua pelos IDs reais):
-- DELETE FROM user WHERE id IN (2, 5, 8) AND customer_phone = '11912345678';

-- =====================================================
-- 3. ALTERAR TABELA USER - TORNAR NOME OPCIONAL
-- =====================================================
-- Tornar customer_name opcional na tabela user
ALTER TABLE user MODIFY COLUMN customer_name VARCHAR(100) NULL;

-- =====================================================
-- 4. ALTERAR TABELA ORDER - TORNAR NOME OPCIONAL
-- =====================================================
-- Tornar customer_name opcional na tabela order
ALTER TABLE `order` MODIFY COLUMN customer_name VARCHAR(100) NULL;

-- =====================================================
-- 5. ADICIONAR RESTRIÇÃO ÚNICA NO TELEFONE
-- =====================================================
-- Adicionar índice único para customer_phone na tabela user
-- ⚠️ Se der erro de duplicados, resolva primeiro com os scripts 1 e 2

-- Opção 1: Adicionar constraint única
ALTER TABLE user ADD CONSTRAINT uk_user_customer_phone UNIQUE (customer_phone);

-- Opção 2: Se a opção 1 der erro, criar índice único
-- CREATE UNIQUE INDEX idx_user_customer_phone_unique ON user (customer_phone);

-- =====================================================
-- 6. VERIFICAR RESULTADO
-- =====================================================
-- Verificar se as mudanças foram aplicadas corretamente

-- Verificar estrutura da tabela user
DESCRIBE user;

-- Verificar estrutura da tabela order
DESCRIBE `order`;

-- Verificar usuários sem nome (agora permitido)
SELECT COUNT(*) as usuarios_sem_nome FROM user WHERE customer_name IS NULL;

-- Verificar pedidos sem nome (agora permitido)
SELECT COUNT(*) as pedidos_sem_nome FROM `order` WHERE customer_name IS NULL;

-- Verificar restrição única
SHOW INDEX FROM user WHERE Key_name = 'uk_user_customer_phone';

-- =====================================================
-- 7. DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================
-- Inserir alguns dados de teste para verificar o funcionamento

-- Inserir usuário de teste
INSERT INTO user (customer_phone, customer_name, created_at, updated_at)
VALUES ('11912345678', 'Cliente Teste', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Inserir pedido de teste
INSERT INTO `order` (
    user_id,
    customer_name,
    customer_phone,
    order_type,
    total_amount,
    status,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM user WHERE customer_phone = '11912345678'),
    'Cliente Teste',
    '11912345678',
    'local',
    25.50,
    'pendente',
    NOW(),
    NOW()
);

-- =====================================================
-- 8. LIMPEZA (OPCIONAL)
-- =====================================================
-- Remover dados de teste se necessário
-- DELETE FROM `order` WHERE customer_phone = '11912345678';
-- DELETE FROM user WHERE customer_phone = '11912345678';

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