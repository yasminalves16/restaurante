import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Check, Minus, Plus, ShoppingCart, Store, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

// Configuração da API - URL de produção
const API_BASE_URL = 'https://restaurante-production-1f07.up.railway.app/api';

// Componente para seleção do tipo de pedido
function OrderTypeSelection({ onSelectType }) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4'>
      <div className='max-w-md w-full space-y-6'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Bem-vindo!</h1>
          <p className='text-gray-600'>Como você gostaria de fazer seu pedido?</p>
        </div>

        <div className='space-y-4'>
          <Card className='cursor-pointer hover:shadow-lg transition-shadow' onClick={() => onSelectType('delivery')}>
            <CardContent className='p-6 text-center'>
              <Truck className='w-12 h-12 mx-auto mb-4 text-orange-500' />
              <h3 className='text-xl font-semibold mb-2'>Delivery</h3>
              <p className='text-gray-600'>Receba em casa com comodidade</p>
            </CardContent>
          </Card>

          <Card className='cursor-pointer hover:shadow-lg transition-shadow' onClick={() => onSelectType('local')}>
            <CardContent className='p-6 text-center'>
              <Store className='w-12 h-12 mx-auto mb-4 text-green-500' />
              <h3 className='text-xl font-semibold mb-2'>Retirar no Local</h3>
              <p className='text-gray-600'>Retire no balcão do restaurante</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Componente do formulário de checkout
function CheckoutForm({ cart, orderType, onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_address: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        order_type: orderType,
        items: cart.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          notes: '',
        })),
      };

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        onSubmit(data.order);
      } else {
        alert('Erro ao criar pedido: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      alert('Erro ao enviar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='mb-6'>
          <Button variant='ghost' onClick={onBack} className='mb-4'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Voltar ao Cardápio
          </Button>
          <h1 className='text-2xl font-bold text-gray-900'>Finalizar Pedido</h1>
          <p className='text-gray-600'>{orderType === 'delivery' ? 'Delivery' : 'Retirar no Local'}</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Resumo do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {cart.map((item) => (
                  <div key={item.id} className='flex justify-between items-center'>
                    <div>
                      <h4 className='font-medium'>{item.name}</h4>
                      <p className='text-sm text-gray-600'>
                        {item.quantity}x R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className='font-medium'>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className='border-t pt-4'>
                  <div className='flex justify-between items-center text-lg font-bold'>
                    <span>Total:</span>
                    <span className='text-green-600'>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulário */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <Label htmlFor='customer_name'>Nome Completo *</Label>
                  <Input
                    id='customer_name'
                    value={formData.customer_name}
                    onChange={(e) => handleChange('customer_name', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor='customer_phone'>Telefone *</Label>
                  <Input
                    id='customer_phone'
                    type='tel'
                    value={formData.customer_phone}
                    onChange={(e) => handleChange('customer_phone', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor='customer_email'>E-mail</Label>
                  <Input
                    id='customer_email'
                    type='email'
                    value={formData.customer_email}
                    onChange={(e) => handleChange('customer_email', e.target.value)}
                  />
                </div>

                {orderType === 'delivery' && (
                  <div>
                    <Label htmlFor='delivery_address'>Endereço de Entrega *</Label>
                    <Textarea
                      id='delivery_address'
                      value={formData.delivery_address}
                      onChange={(e) => handleChange('delivery_address', e.target.value)}
                      required
                      placeholder='Rua, número, bairro, cidade...'
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor='notes'>Observações</Label>
                  <Textarea
                    id='notes'
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder='Alguma observação especial sobre o pedido...'
                  />
                </div>

                <Button type='submit' className='w-full' disabled={loading}>
                  {loading ? 'Enviando...' : 'Confirmar Pedido'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Componente de confirmação do pedido
function OrderConfirmation({ order, onNewOrder }) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4'>
      <div className='max-w-md w-full text-center'>
        <div className='bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6'>
          <Check className='w-8 h-8 text-green-600' />
        </div>

        <h1 className='text-2xl font-bold text-gray-900 mb-2'>Pedido Confirmado!</h1>
        <p className='text-gray-600 mb-6'>Seu pedido #{order.id} foi recebido com sucesso.</p>

        <Card className='mb-6'>
          <CardContent className='p-4'>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span>Cliente:</span>
                <span className='font-medium'>{order.customer_name}</span>
              </div>
              <div className='flex justify-between'>
                <span>Tipo:</span>
                <span className='font-medium'>{order.order_type === 'delivery' ? 'Delivery' : 'Retirar no Local'}</span>
              </div>
              <div className='flex justify-between'>
                <span>Total:</span>
                <span className='font-medium text-green-600'>R$ {order.total_amount.toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <span>Status:</span>
                <span className='font-medium capitalize'>{order.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={onNewOrder} className='w-full'>
          Fazer Novo Pedido
        </Button>
      </div>
    </div>
  );
}

// Componente do item do cardápio
function MenuItem({ item, onAddToCart }) {
  return (
    <Card className='h-full'>
      <CardContent className='p-4'>
        {item.image_url && <img src={item.image_url} alt={item.name} className='w-full h-32 object-cover rounded-md mb-3' />}
        <h3 className='font-semibold text-lg mb-2'>{item.name}</h3>
        <p className='text-gray-600 text-sm mb-3'>{item.description}</p>
        <div className='flex items-center justify-between'>
          <span className='text-xl font-bold text-green-600'>R$ {item.price.toFixed(2)}</span>
          <Button onClick={() => onAddToCart(item)} size='sm'>
            <Plus className='w-4 h-4 mr-1' />
            Adicionar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente do carrinho
function CartSidebar({ cart, isOpen, onClose, onUpdateQuantity, onRemoveItem, onCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50'>
      <div className='fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg'>
        <div className='p-4 border-b'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Seu Pedido</h2>
            <Button variant='ghost' onClick={onClose}>
              ×
            </Button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto p-4'>
          {cart.length === 0 ? (
            <p className='text-gray-500 text-center'>Carrinho vazio</p>
          ) : (
            <div className='space-y-4'>
              {cart.map((item) => (
                <div key={item.id} className='flex items-center space-x-3 p-3 border rounded-lg'>
                  <div className='flex-1'>
                    <h4 className='font-medium'>{item.name}</h4>
                    <p className='text-sm text-gray-600'>R$ {item.price.toFixed(2)}</p>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Button size='sm' variant='outline' onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                      <Minus className='w-3 h-3' />
                    </Button>
                    <span className='w-8 text-center'>{item.quantity}</span>
                    <Button size='sm' variant='outline' onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                      <Plus className='w-3 h-3' />
                    </Button>
                    <Button size='sm' variant='destructive' onClick={() => onRemoveItem(item.id)}>
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className='p-4 border-t'>
            <div className='flex justify-between items-center mb-4'>
              <span className='text-lg font-semibold'>Total:</span>
              <span className='text-xl font-bold text-green-600'>R$ {total.toFixed(2)}</span>
            </div>
            <Button onClick={onCheckout} className='w-full'>
              Finalizar Pedido
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principal do cardápio
function MenuPage({ orderType, onCheckout }) {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, [orderType, selectedCategory]);

  const fetchMenu = async () => {
    try {
      const params = new URLSearchParams({ type: orderType });
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await fetch(`${API_BASE_URL}/menu?${params}`);
      const data = await response.json();

      if (data.success) {
        setMenu(data.items);
      }
    } catch (error) {
      console.error('Erro ao carregar cardápio:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/categories`);
      const data = await response.json();

      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return prevCart.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem));
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)));
    }
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const handleCheckout = () => {
    setCartOpen(false);
    onCheckout(cart);
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4'></div>
          <p>Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm sticky top-0 z-40'>
        <div className='max-w-7xl mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Cardápio</h1>
              <p className='text-sm text-gray-600'>{orderType === 'delivery' ? 'Delivery' : 'Retirar no Local'}</p>
            </div>
            <Button onClick={() => setCartOpen(true)} className='relative'>
              <ShoppingCart className='w-5 h-5 mr-2' />
              Carrinho
              {cart.length > 0 && (
                <Badge className='absolute -top-2 -right-2 bg-red-500'>{cart.reduce((sum, item) => sum + item.quantity, 0)}</Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Filtros de categoria */}
      <div className='max-w-7xl mx-auto px-4 py-4'>
        <div className='flex space-x-2 overflow-x-auto'>
          <Button variant={selectedCategory === '' ? 'default' : 'outline'} onClick={() => setSelectedCategory('')} size='sm'>
            Todos
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              size='sm'
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid do cardápio */}
      <div className='max-w-7xl mx-auto px-4 pb-8'>
        {menu.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-gray-500'>Nenhum item encontrado</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {menu.map((item) => (
              <MenuItem key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </div>

      {/* Carrinho */}
      <CartSidebar
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}

function App() {
  const [orderType, setOrderType] = useState(null);
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'checkout', 'confirmation'
  const [cart, setCart] = useState([]);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const handleCheckout = (cartItems) => {
    setCart(cartItems);
    setCurrentView('checkout');
  };

  const handleOrderSubmit = (order) => {
    setConfirmedOrder(order);
    setCurrentView('confirmation');
  };

  const handleNewOrder = () => {
    setOrderType(null);
    setCurrentView('menu');
    setCart([]);
    setConfirmedOrder(null);
  };

  const handleBackToMenu = () => {
    setCurrentView('menu');
  };

  if (!orderType) {
    return <OrderTypeSelection onSelectType={setOrderType} />;
  }

  if (currentView === 'checkout') {
    return <CheckoutForm cart={cart} orderType={orderType} onBack={handleBackToMenu} onSubmit={handleOrderSubmit} />;
  }

  if (currentView === 'confirmation') {
    return <OrderConfirmation order={confirmedOrder} onNewOrder={handleNewOrder} />;
  }

  return (
    <Router>
      <div className='App'>
        <MenuPage orderType={orderType} onCheckout={handleCheckout} />
      </div>
    </Router>
  );
}

export default App;
