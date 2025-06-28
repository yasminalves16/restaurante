# Área do Cliente - Sistema de Autenticação por Telefone

## Funcionalidades Implementadas

### 1. Autenticação por Telefone

- **Telefone como identificador único**: Apenas o telefone é obrigatório
- **Nome opcional**: Pode variar entre pedidos sem afetar o histórico
- **Sistema de login simples**: Apenas telefone necessário
- **Criação automática de conta**: Se o telefone não existir
- **Manutenção do histórico**: Todos os pedidos ficam associados ao telefone
- **Máscara de telefone**: Formato (DDD) 9XXXX-XXXX

### 2. Histórico de Pedidos

- Visualização completa do histórico de pedidos do cliente
- **Nomes variáveis**: Mostra o nome usado em cada pedido específico
- Informações detalhadas de cada pedido (itens, valores, status, data)
- Ordenação por data (mais recentes primeiro)

### 3. Pedido Atual

- Destaque para pedidos em andamento (status "pendente" ou "preparando")
- Acompanhamento em tempo real do status do pedido
- Informações completas do pedido atual

### 4. Persistência de Sessão

- Dados salvos no localStorage do navegador
- Não é necessário fazer login novamente ao recarregar a página
- Botão de logout para limpar os dados

### 5. Integração com Sistema de Pedidos

- Botão "Meus Pedidos" na tela inicial do cliente
- Navegação fluida entre fazer pedidos e ver histórico
- Botão "Novo Pedido" no histórico para voltar a fazer pedidos

## Como Funciona

### Exemplo de Uso:

1. **Primeiro pedido**: Telefone `11912345678` com nome "Yasmin"
2. **Segundo pedido**: Mesmo telefone `11912345678` com nome "Yasmin Alves"
3. **Acesso ao histórico**: Digite `11912345678` na tela de autenticação
4. **Resultado**: Vê todos os pedidos, com "Yasmin" no pedido 1 e "Yasmin Alves" no pedido 2

### Vantagens:

- ✅ **Flexibilidade**: Nome pode variar sem perder histórico
- ✅ **Simplicidade**: Apenas telefone necessário para acesso
- ✅ **Rastreabilidade**: Todos os pedidos ficam associados ao telefone
- ✅ **Identificação**: Mostra qual nome foi usado em cada pedido
- ✅ **Máscara automática**: Telefone formatado automaticamente

## Como Usar

### Para o Cliente:

1. Acesse o site do restaurante (`frontend/client`)
2. Na tela inicial, clique no botão "Meus Pedidos" (canto inferior direito)
3. Digite apenas seu telefone no formato (DDD) 9XXXX-XXXX
4. Clique em "Acessar Pedidos"
5. Visualize seu histórico e pedido atual
6. Use o botão "Novo Pedido" para fazer um novo pedido
7. Use o botão "Sair" para fazer logout

### Para Fazer Pedidos:

1. Escolha o tipo de pedido (Delivery ou Local)
2. Adicione itens ao carrinho
3. No checkout, preencha:
   - **Telefone** (obrigatório) - formato (DDD) 9XXXX-XXXX
   - **Nome** (opcional) - usado apenas para identificação
   - **Endereço** (obrigatório para delivery)
4. Confirme o pedido

### Para o Administrador:

1. Acesse a área administrativa (`frontend/restaurant`)
2. Os pedidos são automaticamente associados aos clientes pelo telefone
3. O histórico de clientes mostra todos os pedidos de cada usuário
4. Cada pedido mostra o nome específico usado naquele momento

## Estrutura dos Frontends

### Frontend Cliente (`frontend/client`)

- Interface para clientes fazerem pedidos
- Sistema de autenticação por telefone (nome opcional)
- Visualização de histórico de pedidos com nomes variáveis
- Acompanhamento de pedido atual
- Máscara automática de telefone

### Frontend Admin (`frontend/restaurant`)

- Interface administrativa para gerenciar pedidos
- Gestão de cardápio
- Histórico de clientes
- Estatísticas do restaurante

## Rotas da API

### Autenticação

- `POST /api/auth/phone` - Autenticar por telefone
  - Body: `{"phone": "Telefone", "name": "Nome (opcional)"}`
  - Retorna: usuário, histórico de pedidos e pedido atual

### Busca por Telefone

- `GET /api/users/phone/<phone>` - Buscar usuário por telefone
  - Retorna: usuário, histórico de pedidos e pedido atual

### Criação de Pedido

- `POST /api/orders` - Criar novo pedido
  - Body: `{"customer_phone": "Telefone", "customer_name": "Nome (opcional)", ...}`
  - Telefone obrigatório, nome opcional

## Migração do Banco de Dados

Para aplicar as mudanças no banco de dados:

```bash
cd backend
python migrate_phone_unique.py
```

Este script irá:

1. Verificar e remover telefones duplicados
2. Adicionar restrição única para o campo `customer_phone`
3. Permitir nomes opcionais (não obrigatórios)
4. Criar índice para melhor performance
5. Verificar pedidos e usuários sem nome

## Estrutura de Dados

### Modelo User Atualizado:

- `customer_phone`: Campo único e obrigatório (identificador principal)
- `customer_name`: Nome opcional (pode variar entre pedidos)
- `customer_email`: Email (opcional)
- `delivery_address`: Endereço (opcional)
- Métodos auxiliares para busca por telefone

### Modelo Order Atualizado:

- `customer_phone`: Telefone do cliente
- `customer_name`: Nome opcional (pode ser NULL)
- `user_id`: Relacionamento com usuário
- Outros campos mantidos

### Funcionalidades Adicionadas:

- `find_by_phone()`: Busca usuário por telefone
- `find_or_create_by_phone()`: Busca ou cria usuário por telefone (nome opcional)

## Máscara de Telefone

### Formato: (DDD) 9XXXX-XXXX

- **DDD**: Código da área (2 dígitos)
- **9**: Dígito obrigatório para celulares
- **XXXX-XXXX**: Número do telefone (8 dígitos)

### Exemplos:

- `(11) 91234-5678`
- `(21) 98765-4321`
- `(31) 99999-9999`

### Implementação:

- Máscara aplicada automaticamente durante digitação
- Apenas números são aceitos
- Formatação visual para melhor usabilidade
- Remoção automática da máscara antes do envio

## Benefícios

1. **Identificação Única**: Telefone como ID natural do cliente
2. **Flexibilidade**: Nome pode variar sem perder histórico
3. **Facilidade de Uso**: Login simples apenas com telefone
4. **Histórico Completo**: Acompanhamento de todos os pedidos
5. **Status em Tempo Real**: Acompanhamento do pedido atual
6. **Persistência**: Dados salvos localmente
7. **Responsivo**: Interface adaptada para mobile e desktop
8. **Integração**: Sistema unificado entre pedidos e histórico
9. **Rastreabilidade**: Mostra qual nome foi usado em cada pedido
10. **Usabilidade**: Máscara de telefone para melhor experiência

## Segurança

- Validação de dados no backend
- Sanitização de inputs
- Tratamento de erros adequado
- Logs de operações importantes

## Próximos Passos Sugeridos

1. **Notificações**: Sistema de notificações para mudanças de status
2. **Favoritos**: Lista de itens favoritos do cliente
3. **Avaliações**: Sistema de avaliação dos pedidos
4. **Promoções**: Cupons e descontos personalizados
5. **Agendamento**: Reservas e pedidos agendados
6. **Atualização Automática**: Refresh automático do status do pedido
7. **Aliases**: Sistema de apelidos para o mesmo telefone
8. **Validação de DDD**: Verificação de códigos de área válidos
