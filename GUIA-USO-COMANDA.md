# 🍽️ Guia de Uso - Sistema de Comandas

Este guia explica como usar o sistema de comandas implementado.

## 📱 Para o Cliente

### Acesso via QR Code

1. **Cada mesa tem um QR Code único**

   - Mesa 1: `https://seu-dominio.com/comanda/1`
   - Mesa 2: `https://seu-dominio.com/comanda/2`
   - Mesa 3: `https://seu-dominio.com/comanda/3`
   - E assim por diante...

2. **Fluxo do Cliente**
   - Cliente senta na mesa
   - Escaneia o QR Code da mesa
   - Sistema carrega automaticamente a comanda da mesa
   - Cliente vê duas opções: "Ver Cardápio" ou "Ver Comanda"

### Navegação

#### Ver Cardápio

- Mostra todos os itens disponíveis
- Filtros por categoria
- Adicionar itens ao carrinho
- Botão "Adicionar" para incluir na comanda

#### Ver Comanda

- Lista todos os itens já pedidos
- Mostra quantidades e valores
- Permite ajustar quantidades
- Mostra total da comanda
- Botão "Adicionar" para incluir novos itens

### Funcionalidades do Cliente

1. **Adicionar Itens**

   - Navegar pelo cardápio
   - Clicar no "+" para adicionar
   - Ajustar quantidades
   - Clicar em "Adicionar à Comanda"

2. **Gerenciar Comanda**

   - Ver itens já pedidos
   - Aumentar/diminuir quantidades
   - Remover itens
   - Ver total em tempo real

3. **Persistência**
   - Comanda permanece ativa
   - Pode adicionar mais itens
   - Dados salvos automaticamente

## 🏪 Para o Restaurante

### Acesso ao Painel

1. **Login no painel administrativo**
2. **Ir para seção "Comandas"**
3. **Visualizar todas as mesas (1-30)**

### Gerenciamento de Comandas

#### Mesas Disponíveis

- Mostradas com borda tracejada
- Clique para iniciar nova comanda
- Selecionar mesa e adicionar itens iniciais

#### Mesas Ativas

- Mostradas com borda sólida
- Informações: número de pedidos e valor total
- Botões: "Adicionar Itens" e "Encerrar"

### Funcionalidades do Restaurante

#### 1. Iniciar Comanda

- Selecionar mesa disponível
- Escolher itens do cardápio
- Definir quantidades
- Clicar "Iniciar Comanda"

#### 2. Adicionar Itens

- Selecionar mesa ativa
- Escolher itens adicionais
- Definir quantidades
- Clicar "Adicionar à Comanda"

#### 3. Visualizar Comanda

- Clicar na mesa para ver detalhes
- Lista de todos os pedidos
- Status de cada pedido
- Total da comanda

#### 4. Encerrar Comanda

- Clicar "Encerrar Comanda"
- Confirmação de segurança
- Comanda vai para histórico
- Mesa fica disponível novamente

### Controle de Status

- **Pendente**: Pedido recebido
- **Preparando**: Em preparação
- **Pronto**: Pronto para entrega
- **Entregue**: Entregue ao cliente
- **Cancelado**: Pedido cancelado

## 🔄 Fluxo Completo

### 1. Início da Comanda

```
Cliente senta → Escaneia QR → Sistema carrega comanda
```

### 2. Durante o Serviço

```
Cliente faz pedidos → Adiciona à comanda → Restaurante vê pedidos
```

### 3. Preparação

```
Restaurante atualiza status → Cozinha prepara → Cliente acompanha
```

### 4. Encerramento

```
Restaurante encerra comanda → Vai para histórico → Mesa liberada
```

## 📊 Benefícios

### Para o Cliente

- ✅ Pedidos sem fila
- ✅ Cardápio sempre atualizado
- ✅ Controle total da comanda
- ✅ Sem erro de comunicação
- ✅ Histórico de pedidos

### Para o Restaurante

- ✅ Pedidos organizados por mesa
- ✅ Controle total das comandas
- ✅ Fácil gerenciamento
- ✅ Histórico completo
- ✅ Redução de erros

## 🛠️ Configuração dos QR Codes

### Gerar QR Codes

Use qualquer gerador de QR Code online:

**Formato da URL:**

```
https://seu-dominio.com/comanda/MESA
```

**Exemplos:**

- Mesa 1: `https://cliente-casadonorte.vercel.app/comanda/1`
- Mesa 2: `https://cliente-casadonorte.vercel.app/comanda/2`
- Mesa 3: `https://cliente-casadonorte.vercel.app/comanda/3`

### Imprimir QR Codes

1. Gerar QR Code para cada mesa
2. Imprimir em adesivos
3. Colar nas mesas
4. Testar funcionamento

## 🧪 Testando o Sistema

### Teste 1: Cliente

1. Acesse `https://seu-dominio.com/comanda/1`
2. Adicione itens ao carrinho
3. Verifique se aparece no painel admin

### Teste 2: Restaurante

1. Acesse painel administrativo
2. Vá para seção "Comandas"
3. Inicie uma comanda na mesa 2
4. Adicione itens
5. Verifique se cliente vê os itens

### Teste 3: Fluxo Completo

1. Cliente faz pedido via QR
2. Restaurante vê pedido
3. Atualiza status
4. Cliente acompanha
5. Restaurante encerra comanda

## 🐛 Solução de Problemas

### Cliente não consegue acessar

- Verificar se URL está correta
- Verificar se backend está funcionando
- Verificar se mesa existe

### Pedidos não aparecem

- Verificar conexão com API
- Verificar se comanda está ativa
- Verificar logs do sistema

### Mesa não libera

- Verificar se comanda foi encerrada
- Verificar status dos pedidos
- Recarregar página do admin

## 📞 Suporte

Para problemas ou dúvidas:

1. Verificar logs do sistema
2. Testar funcionalidades básicas
3. Consultar este guia
4. Entrar em contato com suporte

---

**✅ Sistema de Comandas Funcionando Perfeitamente!**
