import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { BarChart3, CheckCircle, Clock, Edit, Menu as MenuIcon, Package, Plus, ShoppingBag, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import './App.css';

// Configuração da API - URL de produção
const API_BASE_URL = 'https://restaurante-casadonorte-c4o3ymzy7.vercel.app/api';

// Componente de navegação
function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/menu', label: 'Cardápio', icon: MenuIcon },
    { path: '/orders', label: 'Pedidos', icon: ShoppingBag },
  ];

  return (
    <nav className='bg-white shadow-sm border-b'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-8'>
            <h1 className='text-xl font-bold text-gray-900'>Restaurante Admin</h1>
            <div className='flex space-x-4'>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className='w-4 h-4' />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Componente do Dashboard
function Dashboard() {
  const [stats, setStats] = useState({
    total_orders: 0,
    pending_orders: 0,
    preparing_orders: 0,
    ready_orders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`);
      const data = await response.json();
      if (data.success) {
        setRecentOrders(data.orders.slice(0, 5));
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos recentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pendente: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
      preparando: { color: 'bg-blue-100 text-blue-800', label: 'Preparando' },
      pronto: { color: 'bg-green-100 text-green-800', label: 'Pronto' },
      entregue: { color: 'bg-gray-100 text-gray-800', label: 'Entregue' },
      cancelado: { color: 'bg-red-100 text-red-800', label: 'Cancelado' },
    };

    const config = statusConfig[status] || statusConfig['pendente'];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900'>Dashboard</h2>
        <p className='text-gray-600'>Visão geral do restaurante</p>
      </div>

      {/* Cards de estatísticas */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Total de Pedidos</p>
                <p className='text-2xl font-bold text-gray-900'>{stats.total_orders}</p>
              </div>
              <Package className='w-8 h-8 text-blue-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Pendentes</p>
                <p className='text-2xl font-bold text-yellow-600'>{stats.pending_orders}</p>
              </div>
              <Clock className='w-8 h-8 text-yellow-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Preparando</p>
                <p className='text-2xl font-bold text-blue-600'>{stats.preparing_orders}</p>
              </div>
              <Clock className='w-8 h-8 text-blue-500' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Prontos</p>
                <p className='text-2xl font-bold text-green-600'>{stats.ready_orders}</p>
              </div>
              <CheckCircle className='w-8 h-8 text-green-500' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pedidos recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
          <CardDescription>Últimos 5 pedidos realizados</CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className='text-gray-500 text-center py-4'>Nenhum pedido encontrado</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>
                      <Badge variant='outline'>{order.order_type === 'delivery' ? 'Delivery' : 'Local'}</Badge>
                    </TableCell>
                    <TableCell>R$ {order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de gerenciamento do cardápio
function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchMenuItems();
    fetchCategories();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu/admin`);
      const data = await response.json();
      if (data.success) {
        setMenuItems(data.items);
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

  const handleSaveItem = async (itemData) => {
    try {
      const url = editingItem ? `${API_BASE_URL}/menu/${editingItem.id}` : `${API_BASE_URL}/menu`;

      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      const data = await response.json();

      if (data.success) {
        fetchMenuItems();
        fetchCategories();
        setIsDialogOpen(false);
        setEditingItem(null);
      } else {
        alert('Erro ao salvar item: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      alert('Erro ao salvar item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Tem certeza que deseja remover este item?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/menu/${itemId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchMenuItems();
      } else {
        alert('Erro ao remover item: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
      alert('Erro ao remover item');
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>Gerenciar Cardápio</h2>
          <p className='text-gray-600'>Adicione, edite ou remova itens do cardápio</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className='w-4 h-4 mr-2' />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Item' : 'Novo Item'}</DialogTitle>
              <DialogDescription>{editingItem ? 'Edite as informações do item' : 'Adicione um novo item ao cardápio'}</DialogDescription>
            </DialogHeader>
            <MenuItemForm
              item={editingItem}
              categories={categories}
              onSave={handleSaveItem}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingItem(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className='font-medium'>{item.name}</p>
                      <p className='text-sm text-gray-500'>{item.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline'>{item.category}</Badge>
                  </TableCell>
                  <TableCell>R$ {item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    {item.available_for_delivery ? (
                      <CheckCircle className='w-4 h-4 text-green-500' />
                    ) : (
                      <XCircle className='w-4 h-4 text-red-500' />
                    )}
                  </TableCell>
                  <TableCell>
                    {item.available_for_local ? (
                      <CheckCircle className='w-4 h-4 text-green-500' />
                    ) : (
                      <XCircle className='w-4 h-4 text-red-500' />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {item.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className='flex space-x-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => {
                          setEditingItem(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className='w-3 h-3' />
                      </Button>
                      <Button size='sm' variant='outline' onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 className='w-3 h-3' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente do formulário de item do cardápio
function MenuItemForm({ item, categories, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    category: item?.category || '',
    available_for_delivery: item?.available_for_delivery ?? true,
    available_for_local: item?.available_for_local ?? true,
    is_active: item?.is_active ?? true,
    image_url: item?.image_url || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <Label htmlFor='name'>Nome *</Label>
        <Input id='name' value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
      </div>

      <div>
        <Label htmlFor='description'>Descrição</Label>
        <Textarea id='description' value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
      </div>

      <div>
        <Label htmlFor='price'>Preço *</Label>
        <Input
          id='price'
          type='number'
          step='0.01'
          value={formData.price}
          onChange={(e) => handleChange('price', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor='category'>Categoria *</Label>
        <Input
          id='category'
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          required
          placeholder='Ex: Lanches, Bebidas, Sobremesas...'
        />
      </div>

      <div>
        <Label htmlFor='image_url'>URL da Imagem</Label>
        <Input
          id='image_url'
          value={formData.image_url}
          onChange={(e) => handleChange('image_url', e.target.value)}
          placeholder='https://...'
        />
      </div>

      <div className='space-y-2'>
        <Label>Disponibilidade</Label>
        <div className='flex items-center space-x-4'>
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={formData.available_for_delivery}
              onChange={(e) => handleChange('available_for_delivery', e.target.checked)}
            />
            <span>Delivery</span>
          </label>
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={formData.available_for_local}
              onChange={(e) => handleChange('available_for_local', e.target.checked)}
            />
            <span>Local</span>
          </label>
          <label className='flex items-center space-x-2'>
            <input type='checkbox' checked={formData.is_active} onChange={(e) => handleChange('is_active', e.target.checked)} />
            <span>Ativo</span>
          </label>
        </div>
      </div>

      <div className='flex space-x-2 pt-4'>
        <Button type='submit' className='flex-1'>
          {item ? 'Atualizar' : 'Criar'}
        </Button>
        <Button type='button' variant='outline' onClick={onCancel} className='flex-1'>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

// Componente de gerenciamento de pedidos
function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`${API_BASE_URL}/orders?${params}`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
      } else {
        alert('Erro ao atualizar status: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pendente: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
      preparando: { color: 'bg-blue-100 text-blue-800', label: 'Preparando' },
      pronto: { color: 'bg-green-100 text-green-800', label: 'Pronto' },
      entregue: { color: 'bg-gray-100 text-gray-800', label: 'Entregue' },
      cancelado: { color: 'bg-red-100 text-red-800', label: 'Cancelado' },
    };

    const config = statusConfig[status] || statusConfig['pendente'];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>Gerenciar Pedidos</h2>
          <p className='text-gray-600'>Visualize e gerencie todos os pedidos</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='Filtrar por status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos</SelectItem>
            <SelectItem value='pendente'>Pendente</SelectItem>
            <SelectItem value='preparando'>Preparando</SelectItem>
            <SelectItem value='pronto'>Pronto</SelectItem>
            <SelectItem value='entregue'>Entregue</SelectItem>
            <SelectItem value='cancelado'>Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Lista de pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos</CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='max-h-96 overflow-y-auto'>
              {orders.length === 0 ? (
                <p className='text-gray-500 text-center py-8'>Nenhum pedido encontrado</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedOrder?.id === order.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <p className='font-medium'>
                          #{order.id} - {order.customer_name}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {order.order_type === 'delivery' ? 'Delivery' : 'Local'} • R$ {order.total_amount.toFixed(2)}
                        </p>
                      </div>
                      <div className='text-right'>
                        {getStatusBadge(order.status)}
                        <p className='text-xs text-gray-500 mt-1'>{new Date(order.created_at).toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detalhes do pedido */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedOrder ? (
              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium'>Informações do Cliente</h4>
                  <p className='text-sm text-gray-600'>Nome: {selectedOrder.customer_name}</p>
                  <p className='text-sm text-gray-600'>Telefone: {selectedOrder.customer_phone}</p>
                  {selectedOrder.customer_email && <p className='text-sm text-gray-600'>E-mail: {selectedOrder.customer_email}</p>}
                  {selectedOrder.delivery_address && <p className='text-sm text-gray-600'>Endereço: {selectedOrder.delivery_address}</p>}
                </div>

                <div>
                  <h4 className='font-medium'>Itens do Pedido</h4>
                  <div className='space-y-2'>
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className='flex justify-between text-sm'>
                        <span>
                          {item.quantity}x {item.menu_item.name}
                        </span>
                        <span>R$ {item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className='border-t pt-2 font-medium'>
                      <div className='flex justify-between'>
                        <span>Total:</span>
                        <span>R$ {selectedOrder.total_amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <h4 className='font-medium mb-2'>Observações</h4>
                    <p className='text-sm text-gray-600'>{selectedOrder.notes}</p>
                  </div>
                )}

                <div>
                  <h4 className='font-medium mb-2'>Atualizar Status</h4>
                  <div className='grid grid-cols-2 gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => updateOrderStatus(selectedOrder.id, 'preparando')}
                      disabled={selectedOrder.status === 'preparando'}
                    >
                      Preparando
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => updateOrderStatus(selectedOrder.id, 'pronto')}
                      disabled={selectedOrder.status === 'pronto'}
                    >
                      Pronto
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => updateOrderStatus(selectedOrder.id, 'entregue')}
                      disabled={selectedOrder.status === 'entregue'}
                    >
                      Entregue
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelado')}
                      disabled={selectedOrder.status === 'cancelado'}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <p className='text-gray-500 text-center py-8'>Selecione um pedido para ver os detalhes</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className='min-h-screen bg-gray-50'>
        <Navigation />
        <main className='max-w-7xl mx-auto px-4 py-8'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/menu' element={<MenuManagement />} />
            <Route path='/orders' element={<OrderManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
