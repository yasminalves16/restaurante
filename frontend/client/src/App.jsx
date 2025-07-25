import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Check, History, LogOut, Minus, Phone, Plus, ShoppingCart, Store, Truck, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { toast } from 'sonner';
import nordestinoLogo from './assets/nordestino.png';

// Configuração da API - URL de produção
const API_BASE_URL = 'https://restaurante-production-1f07.up.railway.app/api';

// Componente para seleção do tipo de pedido
function OrderTypeSelection({ onSelectType }) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4'>
      <div className='max-w-md w-full space-y-6'>
        <div className='text-center'>
          {/* Logo/Nome do Restaurante */}
          <div className='flex items-center justify-center mb-4'>
            <img src={nordestinoLogo} alt='Logo Casa do Norte' className='w-16 h-16 mr-3' />
            <h1 className='text-3xl font-bold text-gray-900'>Restaurante Casa do Norte</h1>
          </div>
          <p className='text-gray-600 mb-6'>Como você gostaria de fazer seu pedido?</p>
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

        {/* Informações de Contato */}
        <Card className='bg-white/80 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='text-center mb-3'>
              <h3 className='font-semibold text-gray-800 mb-2'>Informações de Contato</h3>
            </div>
            <div className='space-y-2 text-sm'>
              <div className='flex items-center justify-center gap-2'>
                <Phone className='w-4 h-4 text-orange-500' />
                <span className='text-gray-700'>(12) 98136-9231</span>
              </div>
              <div className='flex items-center justify-center gap-2'>
                <Store className='w-4 h-4 text-green-500' />
                <span className='text-gray-700'>Avenida José Fortes Rangel, 351</span>
              </div>
              <div className='flex items-center justify-center gap-2'>
                <img src={nordestinoLogo} alt='Nordestino' className='w-4 h-4' />
                <span className='text-gray-700'>Cidade Salvador, Jacareí - SP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Componente do formulário de checkout
function CheckoutForm({ cart, orderType, onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    delivery_address: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Função para aplicar máscara no telefone
  const applyPhoneMask = (value) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');

    // Aplica a máscara (DDD) 9XXXX-XXXX
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // Função para remover máscara do telefone
  const removePhoneMask = (value) => {
    return value.replace(/\D/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        customer_phone: removePhoneMask(formData.customer_phone), // Remove máscara antes de enviar
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
        toast.error('Erro ao criar pedido: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      toast.error('Erro ao enviar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    if (field === 'customer_phone') {
      // Aplica máscara para telefone
      const maskedValue = applyPhoneMask(value);
      setFormData((prev) => ({ ...prev, [field]: maskedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-4 md:py-8'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='mb-4 md:mb-6'>
          <Button variant='ghost' onClick={onBack} className='mb-4'>
            <ArrowLeft className='w-4 h-4 mr-2' />
          </Button>
          <h1 className='text-xl md:text-2xl font-bold text-gray-900'>Finalizar Pedido</h1>
          <p className='text-sm md:text-base text-gray-600'>
            {orderType === 'delivery' ? 'Delivery' : orderType === 'local' ? 'Retirar no Local' : 'Comanda'}
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8'>
          {/* Resumo do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg md:text-xl'>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3 md:space-y-4'>
                {cart.map((item) => (
                  <div key={item.id} className='flex justify-between items-center'>
                    <div>
                      <h4 className='font-medium text-sm md:text-base'>{item.name}</h4>
                      <p className='text-xs md:text-sm text-gray-600'>
                        {item.quantity}x R$ {item.price.toFixed(2)}
                      </p>
                    </div>
                    <span className='font-medium text-sm md:text-base'>R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className='border-t pt-3 md:pt-4'>
                  <div className='flex justify-between items-center text-base md:text-lg font-bold'>
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
              <CardTitle className='text-lg md:text-xl'>Dados do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-3 md:space-y-4'>
                <div>
                  <Label htmlFor='customer_phone' className='text-sm md:text-base'>
                    Telefone *
                  </Label>
                  <Input
                    id='customer_phone'
                    type='tel'
                    value={formData.customer_phone}
                    onChange={(e) => handleChange('customer_phone', e.target.value)}
                    placeholder='(11) 91234-5678'
                    required
                    className='text-sm md:text-base'
                  />
                  <p className='text-xs text-gray-500 mt-1'>Formato: (DDD) 9XXXX-XXXX</p>
                </div>

                <div>
                  <Label htmlFor='customer_name' className='text-sm md:text-base'>
                    Nome (opcional)
                  </Label>
                  <Input
                    id='customer_name'
                    value={formData.customer_name}
                    onChange={(e) => handleChange('customer_name', e.target.value)}
                    placeholder='Seu nome (opcional)'
                    className='text-sm md:text-base'
                  />
                  <p className='text-xs text-gray-500 mt-1'>O nome é usado apenas para identificação. O histórico é baseado no telefone.</p>
                </div>

                {orderType === 'delivery' && (
                  <div>
                    <Label htmlFor='delivery_address' className='text-sm md:text-base'>
                      Endereço de Entrega *
                    </Label>
                    <Textarea
                      id='delivery_address'
                      value={formData.delivery_address}
                      onChange={(e) => handleChange('delivery_address', e.target.value)}
                      required
                      placeholder='Rua, número, bairro, cidade...'
                      className='text-sm md:text-base'
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor='notes' className='text-sm md:text-base'>
                    Observações
                  </Label>
                  <Textarea
                    id='notes'
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder='Alguma observação especial sobre o pedido...'
                    className='text-sm md:text-base'
                  />
                </div>

                <Button type='submit' className='w-full text-sm md:text-base' disabled={loading}>
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
function OrderConfirmation({ order, onNewOrder, onBack }) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4'>
      <div className='max-w-md w-full text-center'>
        {/* Botão Voltar */}
        <div className='flex justify-start mb-4'>
          <Button variant='ghost' onClick={onBack} className='text-gray-600 hover:text-gray-900'>
            <ArrowLeft className='w-4 h-4' />
          </Button>
        </div>

        <div className='bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6'>
          <Check className='w-8 h-8 text-green-600' />
        </div>

        <h1 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>Pedido Confirmado!</h1>
        <p className='text-sm md:text-base text-gray-600 mb-6'>Seu pedido #{order.id} foi recebido com sucesso.</p>

        <Card className='mb-6'>
          <CardContent className='p-4'>
            <div className='space-y-2 text-xs md:text-sm'>
              <div className='flex justify-between'>
                <span>Cliente:</span>
                <span className='font-medium'>{order.customer_name}</span>
              </div>
              <div className='flex justify-between'>
                <span>Tipo:</span>
                <span className='font-medium'>
                  {order.order_type === 'delivery' ? 'Delivery' : orderType === 'local' ? 'Retirar no Local' : 'Comanda'}
                </span>
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
function MenuItem({ item, onAddToCart, quantity }) {
  return (
    <Card className='min-h-[176px] md:min-h-[288px] flex'>
      <CardContent className='p-[14px] md:p-4 w-full h-full flex flex-row md:flex-col'>
        {item.image_url && (
          <div className='w-2/5 md:w-full h-full flex items-center justify-center'>
            <img
              src={item.image_url}
              alt={item.name}
              className='h-36 w-full md:h-40 md:w-full object-cover rounded-md md:mb-3 mb-0'
              style={{ aspectRatio: '4/5', maxHeight: '90%' }}
            />
          </div>
        )}
        <div className='flex flex-col justify-between w-3/5 md:w-full pl-3 md:pl-0 h-full'>
          <div>
            <h3 className='font-semibold text-base md:text-lg mb-1 md:mb-2'>{item.name}</h3>
            <div className='text-gray-600 text-xs md:text-sm mb-2 md:mb-3 min-h-[40px] md:min-h-[56px] flex items-start'>
              {item.description ? <span className='line-clamp-3'>{item.description}</span> : <span>&nbsp;</span>}
            </div>
          </div>
          <div className='flex items-center justify-between mt-auto'>
            <span className='text-lg md:text-xl font-bold text-green-600'>R$ {item.price.toFixed(2)}</span>
            <div className='flex items-center gap-2'>
              {quantity > 0 && <span className='text-xs font-bold text-red-600 bg-red-100 rounded px-2 py-0.5'>+{quantity}</span>}
              <Button onClick={() => onAddToCart(item)} size='sm' className='text-xs md:text-sm'>
                <Plus className='w-3 h-3 md:w-4 md:h-4 mr-1' />
                <span className='hidden sm:inline'>Adicionar</span>
                <span className='sm:hidden'>+</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente do carrinho
function CartSidebar({ cart, isOpen, onClose, onUpdateQuantity, onRemoveItem, onCheckout, isComanda, mesa }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50'>
      <div className='fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg'>
        <div className='p-4 border-b'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>{isComanda ? `Comanda - Mesa ${mesa}` : 'Seu Pedido'}</h2>
            <Button variant='ghost' onClick={onClose}>
              ×
            </Button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto p-4'>
          {cart.length === 0 ? (
            <p className='text-gray-500 text-center'>{isComanda ? 'Nenhum item na comanda' : 'Carrinho vazio'}</p>
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
              {isComanda ? 'Adicionar à Comanda' : 'Finalizar Pedido'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente principal do cardápio
function MenuPage({ orderType, onCheckout, onBack }) {
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
        setMenu(data.items.filter((item) => item.available_for_local === true));
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
            <div className='flex items-center space-x-3'>
              <Button variant='ghost' onClick={onBack} className='p-2'>
                <ArrowLeft className='w-4 h-4' />
              </Button>
              <div>
                <h1 className='text-xl md:text-2xl font-bold text-gray-900'>Cardápio</h1>
                <p className='text-xs md:text-sm text-gray-600'>
                  {orderType === 'delivery' ? 'Delivery' : orderType === 'local' ? 'Retirar no Local' : 'Comanda'}
                </p>
              </div>
            </div>
            <Button onClick={() => setCartOpen(true)} className='relative text-sm md:text-base'>
              <ShoppingCart className='w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2' />
              <span className='hidden sm:inline'>Carrinho</span>
              {cart.length > 0 && (
                <Badge className='absolute -top-2 -right-2 bg-red-500 text-xs'>{cart.reduce((sum, item) => sum + item.quantity, 0)}</Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Filtros de categoria */}
      <div className='max-w-7xl mx-auto px-4 py-4'>
        <div className='flex space-x-2 overflow-x-auto pb-2'>
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('')}
            size='sm'
            className='whitespace-nowrap'
          >
            Todos
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              size='sm'
              className='whitespace-nowrap'
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
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
            {menu.map((item) => {
              const cartItem = cart.find((cartItem) => cartItem.id === item.id);
              return <MenuItem key={item.id} item={item} onAddToCart={addToCart} quantity={cartItem ? cartItem.quantity : 0} />;
            })}
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
        isComanda={orderType === 'comanda'}
        mesa={''}
      />
    </div>
  );
}

// Componente de autenticação por telefone
function PhoneAuth({ onAuthenticated, onBack }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função para aplicar máscara no telefone
  const applyPhoneMask = (value) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');

    // Aplica a máscara (DDD) 9XXXX-XXXX
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // Função para remover máscara do telefone
  const removePhoneMask = (value) => {
    return value.replace(/\D/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: removePhoneMask(phone), // Remove máscara antes de enviar
          name: name.trim() || undefined, // Envia apenas se não estiver vazio
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Salvar no localStorage para persistir a sessão
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('orders', JSON.stringify(data.orders));
        localStorage.setItem('currentOrder', JSON.stringify(data.current_order));
        onAuthenticated(data.user, data.orders, data.current_order);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const maskedValue = applyPhoneMask(e.target.value);
    setPhone(maskedValue);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          {/* Botão Voltar */}
          <div className='flex justify-start mb-4'>
            <Button variant='ghost' onClick={onBack} className='text-gray-600 hover:text-gray-900'>
              <ArrowLeft className='w-4 h-4' />
              Voltar
            </Button>
          </div>
          <CardTitle className='flex items-center justify-center gap-2'>
            <Phone className='w-6 h-6' />
            Acessar Meus Pedidos
          </CardTitle>
          <p className='text-gray-600'>Digite seu telefone para ver seu histórico de pedidos</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label htmlFor='phone'>Telefone *</Label>
              <Input id='phone' type='tel' value={phone} onChange={handlePhoneChange} placeholder='(11) 91234-5678' required />
              <p className='text-xs text-gray-500 mt-1'>Formato: (DDD) 9XXXX-XXXX</p>
            </div>
            <div>
              <Label htmlFor='name'>Nome (opcional)</Label>
              <Input id='name' type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='Seu nome (opcional)' />
              <p className='text-xs text-gray-500 mt-1'>O nome é usado apenas para identificação. O histórico é baseado no telefone.</p>
            </div>
            {error && <div className='text-red-600 text-sm text-center'>{error}</div>}
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Carregando...' : 'Acessar Pedidos'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de histórico de pedidos
function OrderHistory({ user, orders, currentOrder, onLogout, onNewOrder, onBack }) {
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pendente':
        return 'secondary';
      case 'preparando':
        return 'default';
      case 'pronto':
        return 'default';
      case 'entregue':
        return 'default';
      case 'cancelado':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'preparando':
        return 'Preparando';
      case 'pronto':
        return 'Pronto';
      case 'entregue':
        return 'Entregue';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('orders');
    localStorage.removeItem('currentOrder');
    onLogout();
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto p-4 md:p-6'>
        {/* Botão Voltar */}
        <div className='flex justify-start mb-4'>
          <Button variant='ghost' onClick={onBack} className='text-gray-600 hover:text-gray-900'>
            <ArrowLeft className='w-4 h-4' />
            Voltar
          </Button>
        </div>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>Meus Pedidos</h1>
          <div className='flex gap-2'>
            <Button onClick={onNewOrder} variant='outline'>
              Novo Pedido
            </Button>
            <Button onClick={handleLogout} variant='outline'>
              <LogOut className='w-4 h-4 mr-2' />
              Sair
            </Button>
          </div>
        </div>

        <div className='grid gap-6'>
          {/* Informações do usuário */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <User className='w-5 h-5' />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>Nome</Label>
                  <p className='text-lg font-semibold'>{user.customer_name}</p>
                </div>
                <div>
                  <Label className='text-sm font-medium text-gray-600'>Telefone</Label>
                  <p className='text-lg font-semibold'>{user.customer_phone}</p>
                </div>
                {user.customer_email && (
                  <div>
                    <Label className='text-sm font-medium text-gray-600'>Email</Label>
                    <p className='text-lg font-semibold'>{user.customer_email}</p>
                  </div>
                )}
                {user.delivery_address && (
                  <div>
                    <Label className='text-sm font-medium text-gray-600'>Endereço</Label>
                    <p className='text-lg font-semibold'>{user.delivery_address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pedido atual */}
          {currentOrder && (
            <Card className='border-blue-200 bg-blue-50'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-blue-800'>
                  <History className='w-5 h-5' />
                  Pedido Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium'>Pedido #{currentOrder.id}</span>
                    <Badge variant={getStatusBadgeVariant(currentOrder.status)}>{getStatusText(currentOrder.status)}</Badge>
                  </div>
                  <div className='text-sm text-gray-600'>
                    <p>Data: {new Date(currentOrder.created_at).toLocaleString('pt-BR')}</p>
                    <p>Total: R$ {currentOrder.total_amount.toFixed(2)}</p>
                    <p>
                      Tipo: {currentOrder.order_type === 'delivery' ? 'Delivery' : orderType === 'local' ? 'Retirar no Local' : 'Comanda'}
                    </p>
                  </div>
                  {currentOrder.items && currentOrder.items.length > 0 && (
                    <div>
                      <Label className='text-sm font-medium'>Itens:</Label>
                      <ul className='mt-2 space-y-1'>
                        {currentOrder.items.map((item) => (
                          <li key={item.id} className='text-sm'>
                            {item.quantity}x {item.menu_item?.name} - R$ {item.subtotal.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Histórico de pedidos */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <History className='w-5 h-5' />
                Histórico de Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className='text-gray-500 text-center py-8'>Nenhum pedido encontrado</p>
              ) : (
                <div className='space-y-4'>
                  {orders.map((order) => (
                    <div key={order.id} className='border rounded-lg p-4'>
                      <div className='flex justify-between items-start mb-3'>
                        <div>
                          <h3 className='font-semibold'>Pedido #{order.id}</h3>
                          <p className='text-sm text-gray-600'>{new Date(order.created_at).toLocaleString('pt-BR')}</p>
                          {order.customer_name && (
                            <p className='text-sm text-blue-600 font-medium'>Nome no pedido: {order.customer_name}</p>
                          )}
                        </div>
                        <Badge variant={getStatusBadgeVariant(order.status)}>{getStatusText(order.status)}</Badge>
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                        <div>
                          <span className='font-medium'>Total:</span> R$ {order.total_amount.toFixed(2)}
                        </div>
                        <div>
                          <span className='font-medium'>Tipo:</span>{' '}
                          {order.order_type === 'delivery' ? 'Delivery' : orderType === 'local' ? 'Retirar no Local' : 'Comanda'}
                        </div>
                        {order.delivery_address && (
                          <div>
                            <span className='font-medium'>Endereço:</span> {order.delivery_address}
                          </div>
                        )}
                      </div>
                      {order.items && order.items.length > 0 && (
                        <div className='mt-3'>
                          <Label className='text-sm font-medium'>Itens:</Label>
                          <ul className='mt-1 space-y-1'>
                            {order.items.map((item) => (
                              <li key={item.id} className='text-sm text-gray-600'>
                                {item.quantity}x {item.menu_item?.name} - R$ {item.subtotal.toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Componente específico para comandas
function ComandaPage({ mesa, onBack }) {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comandaAtual, setComandaAtual] = useState(null);
  const [loadingComanda, setLoadingComanda] = useState(false);
  const [currentView, setCurrentView] = useState('menu'); // 'menu' ou 'comanda'

  // Validar se mesa é válida
  if (!mesa || isNaN(mesa) || mesa <= 0) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4'>
        <div className='max-w-md w-full space-y-6'>
          <div className='text-center'>
            <div className='flex items-center justify-center mb-4'>
              <img src={nordestinoLogo} alt='Logo Casa do Norte' className='w-16 h-16 mr-3' />
              <h1 className='text-3xl font-bold text-gray-900'>Mesa Inválida</h1>
            </div>
            <p className='text-gray-600 mb-6'>A mesa especificada não é válida.</p>
          </div>
          <Button variant='outline' onClick={onBack} className='w-full'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchMenu();
    fetchCategories();
    buscarComandaMesa();
  }, [selectedCategory, mesa]);

  const fetchMenu = async () => {
    try {
      const params = new URLSearchParams({ type: 'comanda' });
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await fetch(`${API_BASE_URL}/menu?${params}`);
      const data = await response.json();

      if (data.success) {
        setMenu(data.items.filter((item) => item.available_for_local === true));
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

  const buscarComandaMesa = async () => {
    setLoadingComanda(true);
    try {
      const response = await fetch(`${API_BASE_URL}/comanda/${mesa}`);
      const data = await response.json();

      if (data.success && data.orders.length > 0) {
        // Se há comanda aberta, carregar os itens no carrinho
        const itensComanda = [];
        data.orders.forEach((order) => {
          order.items.forEach((item) => {
            const existingItem = itensComanda.find((i) => i.id === item.menu_item.id);
            if (existingItem) {
              existingItem.quantity += item.quantity;
            } else {
              itensComanda.push({
                ...item.menu_item,
                quantity: item.quantity,
              });
            }
          });
        });
        setCart(itensComanda);
        setComandaAtual(data.orders[0]);
      } else {
        // Nova comanda
        setCart([]);
        setComandaAtual(null);
      }
    } catch (error) {
      console.error('Erro ao buscar comanda:', error);
    } finally {
      setLoadingComanda(false);
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

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Adicione itens ao carrinho antes de finalizar');
      return;
    }

    try {
      const orderData = {
        order_type: 'comanda',
        is_comanda: true,
        mesa: parseInt(mesa),
        status_comanda: 'aberta',
        customer_name: `Mesa ${mesa}`,
        customer_phone: `mesa ${mesa}`,
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
        toast.success('Pedido adicionado à comanda com sucesso!');
        setCart([]);
        buscarComandaMesa(); // Recarregar comanda
        setCartOpen(false);
      } else {
        toast.error('Erro ao adicionar pedido: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao enviar pedido:', error);
      toast.error('Erro ao enviar pedido. Tente novamente.');
    }
  };

  const calcularTotalComanda = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
            <div className='flex items-center space-x-3'>
              <Button variant='ghost' onClick={onBack} className='p-2'>
                <ArrowLeft className='w-4 h-4' />
              </Button>
              <div>
                <h1 className='text-xl md:text-2xl font-bold text-gray-900'>Mesa {mesa}</h1>
                <p className='text-xs md:text-sm text-gray-600'>{comandaAtual ? 'Comanda ativa' : 'Nova comanda'}</p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='text-right'>
                <p className='text-sm font-medium text-gray-900'>Total da Comanda</p>
                <p className='text-lg font-bold text-green-600'>R$ {calcularTotalComanda().toFixed(2)}</p>
              </div>
              <Button onClick={() => setCartOpen(true)} className='relative text-sm md:text-base'>
                <ShoppingCart className='w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2' />
                <span className='hidden sm:inline'>Adicionar</span>
                {cart.length > 0 && (
                  <Badge className='absolute -top-2 -right-2 bg-red-500 text-xs'>
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação entre Cardápio e Comanda */}
      <div className='max-w-7xl mx-auto px-4 py-4'>
        <div className='flex space-x-2 mb-4'>
          <Button variant={currentView === 'menu' ? 'default' : 'outline'} onClick={() => setCurrentView('menu')} className='flex-1'>
            Ver Cardápio
          </Button>
          <Button variant={currentView === 'comanda' ? 'default' : 'outline'} onClick={() => setCurrentView('comanda')} className='flex-1'>
            Ver Comanda
          </Button>
        </div>
      </div>

      {currentView === 'menu' ? (
        <>
          {/* Filtros de categoria */}
          <div className='max-w-7xl mx-auto px-4 py-4'>
            <div className='flex space-x-2 overflow-x-auto pb-2'>
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('')}
                size='sm'
                className='whitespace-nowrap'
              >
                Todos
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  size='sm'
                  className='whitespace-nowrap'
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
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
                {menu.map((item) => {
                  const cartItem = cart.find((cartItem) => cartItem.id === item.id);
                  return <MenuItem key={item.id} item={item} onAddToCart={addToCart} quantity={cartItem ? cartItem.quantity : 0} />;
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Visualização da Comanda */
        <div className='max-w-7xl mx-auto px-4 pb-8'>
          <Card>
            <CardHeader>
              <CardTitle>Itens da Comanda - Mesa {mesa}</CardTitle>
              <CardDescription>Total: R$ {calcularTotalComanda().toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className='text-gray-500 text-center py-8'>Nenhum item na comanda</p>
              ) : (
                <div className='space-y-4'>
                  {cart.map((item) => (
                    <div key={item.id} className='flex items-center justify-between p-3 border rounded-lg'>
                      <div className='flex-1'>
                        <h4 className='font-medium'>{item.name}</h4>
                        <p className='text-sm text-gray-600'>
                          R$ {item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <span className='font-medium'>R$ {(item.price * item.quantity).toFixed(2)}</span>
                        <Button size='sm' variant='outline' onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className='w-3 h-3' />
                        </Button>
                        <span className='w-8 text-center'>{item.quantity}</span>
                        <Button size='sm' variant='outline' onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus className='w-3 h-3' />
                        </Button>
                        <Button size='sm' variant='destructive' onClick={() => removeFromCart(item.id)}>
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className='border-t pt-4'>
                    <div className='flex justify-between items-center text-lg font-bold'>
                      <span>Total:</span>
                      <span className='text-green-600'>R$ {calcularTotalComanda().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Carrinho */}
      <CartSidebar
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        isComanda={true}
        mesa={mesa}
      />
    </div>
  );
}

function App() {
  const [currentView, setCurrentView] = useState('order-type'); // 'order-type', 'menu', 'comanda', 'checkout', 'confirmation', 'auth', 'history'
  const [orderType, setOrderType] = useState(null);
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const [mesaAtual, setMesaAtual] = useState(null);

  // Estados para autenticação
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Detectar se é uma comanda baseado na URL
  useEffect(() => {
    const path = window.location.pathname;
    const comandaMatch = path.match(/\/comanda\/(\d+)/);

    if (comandaMatch) {
      const mesa = parseInt(comandaMatch[1]);
      setMesaAtual(mesa);
      setCurrentView('comanda');
    } else {
      // Se não é uma comanda, limpar mesa atual
      setMesaAtual(null);
    }
  }, []);

  // Carregar dados salvos ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedOrders = localStorage.getItem('orders');
    const savedCurrentOrder = localStorage.getItem('currentOrder');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setOrders(JSON.parse(savedOrders || '[]'));
      setCurrentOrder(JSON.parse(savedCurrentOrder || 'null'));
      setCurrentView('history');
    }
  }, []);

  const handleCheckout = (cartItems) => {
    setCart(cartItems);
    setCurrentView('checkout');
  };

  const handleOrderSubmit = (order) => {
    setOrder(order);
    setCurrentView('confirmation');
  };

  const handleNewOrder = () => {
    setCurrentView('order-type');
    setCart([]);
    setOrder(null);
    setMesaAtual(null);
  };

  const handleBackToMenu = () => {
    if (orderType === 'comanda' || mesaAtual) {
      setCurrentView('comanda');
    } else {
      setCurrentView('menu');
    }
  };

  const handleBackFromMenu = () => {
    setCurrentView('order-type');
    setMesaAtual(null);
  };

  // Handlers para autenticação
  const handleAuthenticated = (userData, userOrders, userCurrentOrder) => {
    setUser(userData);
    setOrders(userOrders);
    setCurrentOrder(userCurrentOrder);
    setCurrentView('history');
  };

  const handleLogout = () => {
    setUser(null);
    setOrders([]);
    setCurrentOrder(null);
    setCurrentView('order-type');
  };

  const handleShowAuth = () => {
    setCurrentView('auth');
  };

  // Renderizar componente baseado na view atual
  const showPedidosButton = currentView !== 'history' && !mesaAtual;

  if (currentView === 'auth') {
    return <PhoneAuth onAuthenticated={handleAuthenticated} onBack={handleBackToMenu} />;
  }

  if (currentView === 'history') {
    return (
      <OrderHistory
        user={user}
        orders={orders}
        currentOrder={currentOrder}
        onLogout={handleLogout}
        onNewOrder={handleNewOrder}
        onBack={handleBackToMenu}
      />
    );
  }

  return (
    <Router>
      <div className='App'>
        {currentView === 'order-type' && (
          <div>
            <OrderTypeSelection
              onSelectType={(type) => {
                setOrderType(type);
                if (type === 'comanda') {
                  setCurrentView('comanda');
                } else {
                  setCurrentView('menu');
                }
              }}
            />
          </div>
        )}

        {currentView === 'menu' && <MenuPage orderType={orderType} onCheckout={handleCheckout} onBack={handleBackFromMenu} />}

        {currentView === 'comanda' && mesaAtual && <ComandaPage mesa={mesaAtual} onBack={handleBackFromMenu} />}

        {currentView === 'checkout' && (
          <CheckoutForm cart={cart} orderType={orderType} onBack={handleBackToMenu} onSubmit={handleOrderSubmit} />
        )}

        {currentView === 'confirmation' && <OrderConfirmation order={order} onNewOrder={handleNewOrder} onBack={handleBackToMenu} />}

        {/* Botão flutuante para consultar pedidos */}
        {showPedidosButton && (
          <div className='fixed bottom-4 right-4 z-[999] pointer-events-auto block'>
            <Button onClick={handleShowAuth} variant='outline' size='sm'>
              <History className='w-4 h-4 mr-2' />
              Meus Pedidos
            </Button>
          </div>
        )}

        {/* Toaster para notificações */}
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
