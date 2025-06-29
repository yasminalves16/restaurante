import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  BarChart3,
  CheckCircle,
  Clock,
  Edit,
  Menu as MenuIcon,
  Minus,
  Package,
  Plus,
  Printer,
  ShoppingBag,
  Trash2,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import './App.css';
import { useIsMobile } from './hooks/use-mobile';

// Configuração da API - URL de produção
const API_BASE_URL = 'https://restaurante-production-1f07.up.railway.app/api';

// Componente de navegação
function Navigation() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BarChart3 },
    { path: '/menu', label: 'Cardápio', icon: MenuIcon },
    { path: '/orders', label: 'Pedidos', icon: ShoppingBag },
    { path: '/history', label: 'Histórico', icon: Users },
    { path: '/comandas', label: 'Comandas', icon: Package },
  ];

  const handleNavClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className='bg-white shadow-sm border-b'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-8'>
            <h1 className='text-xl font-bold text-gray-900'>Restaurante Admin</h1>

            {/* Menu desktop */}
            {!isMobile && (
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
            )}
          </div>

          {/* Botão do menu hambúrguer para mobile */}
          {isMobile && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            >
              {isMenuOpen ? <X className='w-6 h-6' /> : <MenuIcon className='w-6 h-6' />}
            </button>
          )}
        </div>

        {/* Menu mobile */}
        {isMobile && isMenuOpen && (
          <div className='border-t border-gray-200 py-4'>
            <div className='flex flex-col space-y-2'>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className='w-5 h-5' />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
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
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [resultsPerPage, setResultsPerPage] = useState(5);

  // Filtros adicionais
  const [dateFilter, setDateFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [activeFilter, allOrders, dateFilter, addressFilter, customerFilter, resultsPerPage]);

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
        setAllOrders(data.orders);
        setRecentOrders(data.orders.slice(0, 5));
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos recentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...allOrders];

    // Filtro por status
    if (activeFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === activeFilter);
    }

    // Filtro por data
    if (dateFilter) {
      filtered = filtered.filter((order) => {
        // Extrai a data no formato YYYY-MM-DD do created_at
        const orderDate = new Date(order.created_at);
        const orderDateStr = orderDate.toISOString().slice(0, 10); // YYYY-MM-DD
        return orderDateStr === dateFilter;
      });
    }

    // Filtro por endereço
    if (addressFilter) {
      filtered = filtered.filter(
        (order) => order.delivery_address && order.delivery_address.toLowerCase().includes(addressFilter.toLowerCase())
      );
    }

    // Filtro por nome do cliente
    if (customerFilter) {
      filtered = filtered.filter((order) => order.customer_name.toLowerCase().includes(customerFilter.toLowerCase()));
    }

    if (resultsPerPage === 'all') {
      setRecentOrders(filtered);
    } else {
      setRecentOrders(filtered.slice(0, resultsPerPage));
    }
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const clearFilters = () => {
    setActiveFilter('all');
    setDateFilter('');
    setAddressFilter('');
    setCustomerFilter('');
  };

  const printOrder = (order) => {
    const printWindow = window.open('', '_blank');

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pedido #${order.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 14px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .restaurant-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .customer-info {
            margin-bottom: 20px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .items-table th,
          .items-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .items-table th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .total {
            text-align: right;
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
            border-top: 2px solid #000;
            padding-top: 10px;
          }
          .notes {
            margin-top: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-left: 4px solid #007bff;
          }
          .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
          }
          .status-pendente { background-color: #fff3cd; color: #856404; }
          .status-preparando { background-color: #cce5ff; color: #004085; }
          .status-pronto { background-color: #d4edda; color: #155724; }
          .status-entregue { background-color: #e2e3e5; color: #383d41; }
          .status-cancelado { background-color: #f8d7da; color: #721c24; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="restaurant-name">Restaurante Nordestino</div>
          <div>Pedido #${order.id}</div>
          <div>Data: ${new Date(order.created_at).toLocaleString('pt-BR')}</div>
          <div>Tipo: ${order.order_type === 'delivery' ? 'Delivery' : 'Local'}</div>
          <div>Status: <span class="status status-${order.status}">${order.status.toUpperCase()}</span></div>
        </div>

        <div class="customer-info">
          <h3>Informações do Cliente</h3>
          <p><strong>Nome:</strong> ${order.customer_name}</p>
          <p><strong>Telefone:</strong> ${order.customer_phone}</p>
          ${order.customer_email ? `<p><strong>E-mail:</strong> ${order.customer_email}</p>` : ''}
          ${order.delivery_address ? `<p><strong>Endereço:</strong> ${order.delivery_address}</p>` : ''}
        </div>

        <div class="order-items">
          <h3>Itens do Pedido</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Qtd</th>
                <th>Item</th>
                <th>Preço Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.quantity}</td>
                  <td>${item.menu_item.name}</td>
                  <td>R$ ${item.menu_item.price.toFixed(2)}</td>
                  <td>R$ ${item.subtotal.toFixed(2)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <div class="total">
          <strong>TOTAL: R$ ${order.total_amount.toFixed(2)}</strong>
        </div>

        ${
          order.notes
            ? `
          <div class="notes">
            <h4>Observações:</h4>
            <p>${order.notes}</p>
          </div>
        `
            : ''
        }

        <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
          <p>Obrigado pela preferência!</p>
          <p>Pedido impresso em: ${new Date().toLocaleString('pt-BR')}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
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
        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => handleFilterClick('all')}
        >
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

        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'pendente' ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''
          }`}
          onClick={() => handleFilterClick('pendente')}
        >
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

        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'preparando' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}
          onClick={() => handleFilterClick('preparando')}
        >
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

        <Card
          className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeFilter === 'pronto' ? 'ring-2 ring-green-500 bg-green-50' : ''
          }`}
          onClick={() => handleFilterClick('pronto')}
        >
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
          <CardTitle>
            Pedidos Recentes
            {activeFilter !== 'all' && (
              <Badge className='ml-2' variant='outline'>
                {activeFilter === 'pendente' && 'Pendentes'}
                {activeFilter === 'preparando' && 'Preparando'}
                {activeFilter === 'pronto' && 'Prontos'}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {activeFilter === 'all'
              ? `Exibindo ${resultsPerPage === 'all' ? 'todos' : resultsPerPage} pedidos mais recentes`
              : `Exibindo ${resultsPerPage === 'all' ? 'todos' : resultsPerPage} pedidos ${
                  activeFilter === 'pendente' ? 'pendentes' : activeFilter === 'preparando' ? 'em preparação' : 'prontos'
                }`}
          </CardDescription>
        </CardHeader>
        {/* Seletor de quantidade de resultados */}
        <div className='px-6 pb-2 flex justify-end'>
          <div className='flex items-center gap-2'>
            <Label htmlFor='results-per-page' className='text-sm font-medium text-gray-700'>
              Resultados por página:
            </Label>
            <select
              id='results-per-page'
              value={resultsPerPage}
              onChange={(e) => setResultsPerPage(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className='border rounded px-2 py-1 text-sm outline-none'
            >
              <option value='all'>Todos</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        {/* Filtros adicionais */}
        <div className='px-6 pb-4'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div>
              <Label htmlFor='date-filter' className='text-sm font-medium text-gray-700'>
                Data
              </Label>
              <Input
                id='date-filter'
                type='date'
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className='mt-1'
                placeholder='Filtrar por data'
              />
            </div>

            <div>
              <Label htmlFor='customer-filter' className='text-sm font-medium text-gray-700'>
                Cliente
              </Label>
              <Input
                id='customer-filter'
                type='text'
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                className='mt-1'
                placeholder='Nome do cliente'
              />
            </div>

            <div>
              <Label htmlFor='address-filter' className='text-sm font-medium text-gray-700'>
                Endereço
              </Label>
              <Input
                id='address-filter'
                type='text'
                value={addressFilter}
                onChange={(e) => setAddressFilter(e.target.value)}
                className='mt-1'
                placeholder='Endereço de entrega'
              />
            </div>

            <div className='flex items-end'>
              <Button variant='outline' onClick={clearFilters} className='w-full'>
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>

        <CardContent>
          {recentOrders.length === 0 ? (
            <p className='text-gray-500 text-center py-4'>
              {activeFilter === 'all' && !dateFilter && !addressFilter && !customerFilter
                ? 'Nenhum pedido encontrado'
                : 'Nenhum pedido encontrado com os filtros aplicados'}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>
                      <Badge variant='outline'>
                        {order.order_type === 'delivery' ? 'Delivery' : order.order_type === 'local' ? 'Local' : 'Comanda'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {order.delivery_address ? (
                        <span className='text-sm text-gray-600 max-w-xs truncate block' title={order.delivery_address}>
                          {order.delivery_address}
                        </span>
                      ) : (
                        <span className='text-sm text-gray-400'>-</span>
                      )}
                    </TableCell>
                    <TableCell>R$ {order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      {order.payment_status === 'pago' ? (
                        <Badge className='bg-green-100 text-green-800'>Pago</Badge>
                      ) : (
                        <Badge className='bg-yellow-100 text-yellow-800'>Não Pago</Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Button size='sm' variant='outline' onClick={() => printOrder(order)} className='flex items-center gap-1'>
                        <Printer className='w-3 h-3' />
                        Imprimir
                      </Button>
                    </TableCell>
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
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchMenuItems();
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
        setIsDialogOpen(false);
        setEditingItem(null);
      } else {
        toast.error('Erro ao salvar item: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      toast.error('Erro ao salvar item');
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
        toast.success('Item removido com sucesso!');
      } else {
        toast.error('Erro ao remover item: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao remover item:', error);
      toast.error('Erro ao remover item');
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
              {menuItems.map((item) => {
                console.log(item);
                return (
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
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente do formulário de item do cardápio
function MenuItemForm({ item, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    category: item?.category || '',
    available_for_delivery: !!item?.available_for_delivery,
    available_for_local: !!item?.available_for_local,
    is_active: !!item?.is_active,
    image_url: item?.image_url || '',
  });

  // Atualiza o formData quando o item muda (edição)
  useEffect(() => {
    setFormData({
      name: item?.name || '',
      description: item?.description || '',
      price: item?.price || '',
      category: item?.category || '',
      available_for_delivery: !!item?.available_for_delivery,
      available_for_local: !!item?.available_for_local,
      is_active: !!item?.is_active,
      image_url: item?.image_url || '',
    });
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      available_for_delivery: Boolean(formData.available_for_delivery),
      available_for_local: Boolean(formData.available_for_local),
      is_active: Boolean(formData.is_active),
    };
    console.log('Enviando para o backend:', payload);
    onSave(payload);
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
      if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);

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
        toast.success('Status atualizado com sucesso!');
      } else {
        toast.error('Erro ao atualizar status: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  const updatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payment_status: newPaymentStatus }),
      });

      const data = await response.json();

      if (data.success) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
        toast.success('Status de pagamento atualizado com sucesso!');
      } else {
        toast.error('Erro ao atualizar status de pagamento: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao atualizar status de pagamento:', error);
      toast.error('Erro ao atualizar status de pagamento');
    }
  };

  const printOrder = (order) => {
    const printWindow = window.open('', '_blank');

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Pedido #${order.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 14px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .restaurant-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .customer-info {
            margin-bottom: 20px;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          .items-table th,
          .items-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          .items-table th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .total {
            text-align: right;
            font-size: 18px;
            font-weight: bold;
            margin-top: 20px;
            border-top: 2px solid #000;
            padding-top: 10px;
          }
          .notes {
            margin-top: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border-left: 4px solid #007bff;
          }
          .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
          }
          .status-pendente { background-color: #fff3cd; color: #856404; }
          .status-preparando { background-color: #cce5ff; color: #004085; }
          .status-pronto { background-color: #d4edda; color: #155724; }
          .status-entregue { background-color: #e2e3e5; color: #383d41; }
          .status-cancelado { background-color: #f8d7da; color: #721c24; }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="restaurant-name">Restaurante Nordestino</div>
          <div>Pedido #${order.id}</div>
          <div>Data: ${new Date(order.created_at).toLocaleString('pt-BR')}</div>
          <div>Tipo: ${order.order_type === 'delivery' ? 'Delivery' : 'Local'}</div>
          <div>Status: <span class="status status-${order.status}">${order.status.toUpperCase()}</span></div>
        </div>

        <div class="customer-info">
          <h3>Informações do Cliente</h3>
          <p><strong>Nome:</strong> ${order.customer_name}</p>
          <p><strong>Telefone:</strong> ${order.customer_phone}</p>
          ${order.customer_email ? `<p><strong>E-mail:</strong> ${order.customer_email}</p>` : ''}
          ${order.delivery_address ? `<p><strong>Endereço:</strong> ${order.delivery_address}</p>` : ''}
        </div>

        <div class="order-items">
          <h3>Itens do Pedido</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Qtd</th>
                <th>Item</th>
                <th>Preço Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.quantity}</td>
                  <td>${item.menu_item.name}</td>
                  <td>R$ ${item.menu_item.price.toFixed(2)}</td>
                  <td>R$ ${item.subtotal.toFixed(2)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <div class="total">
          <strong>TOTAL: R$ ${order.total_amount.toFixed(2)}</strong>
        </div>

        ${
          order.notes
            ? `
          <div class="notes">
            <h4>Observações:</h4>
            <p>${order.notes}</p>
          </div>
        `
            : ''
        }

        <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
          <p>Obrigado pela preferência!</p>
          <p>Pedido impresso em: ${new Date().toLocaleString('pt-BR')}</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
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
            <div className='flex items-center justify-between'>
              <CardTitle>Pedidos</CardTitle>
              {selectedOrder && (
                <Button size='sm' variant='outline' onClick={() => printOrder(selectedOrder)} className='flex items-center gap-2'>
                  <Printer className='w-4 h-4' />
                  Imprimir Selecionado
                </Button>
              )}
            </div>
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
            <div className='flex items-center justify-between'>
              <CardTitle>Detalhes do Pedido</CardTitle>
              {selectedOrder && (
                <Button size='sm' variant='outline' onClick={() => printOrder(selectedOrder)} className='flex items-center gap-2'>
                  <Printer className='w-4 h-4' />
                  Imprimir
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedOrder ? (
              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium mb-2'>Informações do Cliente</h4>
                  <p className='text-sm text-gray-600'>Nome: {selectedOrder.customer_name}</p>
                  <p className='text-sm text-gray-600'>Telefone: {selectedOrder.customer_phone}</p>
                  {selectedOrder.customer_email && <p className='text-sm text-gray-600'>E-mail: {selectedOrder.customer_email}</p>}
                  {selectedOrder.delivery_address && <p className='text-sm text-gray-600'>Endereço: {selectedOrder.delivery_address}</p>}
                </div>

                <div>
                  <h4 className='font-medium mb-2'>Itens do Pedido</h4>
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

                <div>
                  <h4 className='font-medium mb-2'>Status de Pagamento</h4>
                  <div className='grid grid-cols-2 gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => updatePaymentStatus(selectedOrder.id, 'pago')}
                      disabled={selectedOrder.payment_status === 'pago'}
                      className='bg-green-50 hover:bg-green-100'
                    >
                      Marcar como Pago
                    </Button>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => updatePaymentStatus(selectedOrder.id, 'nao_pago')}
                      disabled={selectedOrder.payment_status === 'nao_pago'}
                      className='bg-yellow-50 hover:bg-yellow-100'
                    >
                      Marcar como Não Pago
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

// Componente de gerenciamento de histórico de clientes
function CustomerHistory() {
  const [users, setUsers] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      const response = await fetch(`${API_BASE_URL}/users?${params}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/orders`);
      const data = await response.json();

      if (data.success) {
        setUserOrders(data.orders);
        setShowOrdersModal(true);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos do usuário:', error);
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
          <h2 className='text-2xl font-bold text-gray-900'>Histórico de Clientes</h2>
          <p className='text-gray-600'>Visualize informações e histórico de pedidos dos clientes</p>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div className='flex-1'>
          <Input
            placeholder='Buscar por nome, telefone, email ou endereço...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full'
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='Ordenar por' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='created_at'>Data de cadastro</SelectItem>
            <SelectItem value='name'>Nome</SelectItem>
            <SelectItem value='total_orders'>Quantidade de pedidos</SelectItem>
            <SelectItem value='total_spent'>Total gasto</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className='w-32'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='desc'>Decrescente</SelectItem>
            <SelectItem value='asc'>Crescente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabela de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes ({users.length})</CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead className='text-center'>Pedidos</TableHead>
                  <TableHead className='text-right'>Total Gasto</TableHead>
                  <TableHead className='text-center'>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center text-gray-500 py-8'>
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className='font-medium'>{user.customer_name}</p>
                          <p className='text-sm text-gray-500'>Cadastrado em {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='space-y-1'>
                          {user.customer_phone && <p className='text-sm'>{user.customer_phone}</p>}
                          {user.customer_email && <p className='text-sm text-gray-600'>{user.customer_email}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.delivery_address ? (
                          <p className='text-sm text-gray-600 max-w-xs truncate' title={user.delivery_address}>
                            {user.delivery_address}
                          </p>
                        ) : (
                          <p className='text-sm text-gray-400'>Não informado</p>
                        )}
                      </TableCell>
                      <TableCell className='text-center'>
                        <Badge variant='secondary'>{user.total_orders}</Badge>
                      </TableCell>
                      <TableCell className='text-right'>
                        <span className='font-medium text-green-600'>R$ {user.total_spent.toFixed(2)}</span>
                      </TableCell>
                      <TableCell className='text-center'>
                        <Button size='sm' variant='outline' onClick={() => fetchUserOrders(user.id)} disabled={user.total_orders === 0}>
                          <Package className='w-4 h-4 mr-1' />
                          Ver Pedidos
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal com histórico de pedidos */}
      <Dialog open={showOrdersModal} onOpenChange={setShowOrdersModal}>
        <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Histórico de Pedidos</DialogTitle>
            <DialogDescription>Todos os pedidos realizados por este cliente</DialogDescription>
          </DialogHeader>

          {userOrders.length === 0 ? (
            <p className='text-gray-500 text-center py-8'>Nenhum pedido encontrado</p>
          ) : (
            <div className='space-y-4'>
              {userOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className='pb-3'>
                    <div className='flex items-center justify-between'>
                      <div>
                        <CardTitle className='text-lg'>Pedido #{order.id}</CardTitle>
                        <CardDescription>
                          {new Date(order.created_at).toLocaleString('pt-BR')} • {order.order_type === 'delivery' ? 'Delivery' : 'Local'}
                        </CardDescription>
                      </div>
                      <div className='text-right'>
                        {getStatusBadge(order.status)}
                        <p className='text-lg font-bold text-green-600 mt-1'>R$ {order.total_amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      <div>
                        <h4 className='font-medium mb-2'>Itens do Pedido</h4>
                        <div className='space-y-1'>
                          {order.items.map((item) => (
                            <div key={item.id} className='flex justify-between text-sm'>
                              <span>
                                {item.quantity}x {item.menu_item.name}
                              </span>
                              <span>R$ {item.subtotal.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {order.notes && (
                        <div>
                          <h4 className='font-medium mb-1'>Observações</h4>
                          <p className='text-sm text-gray-600'>{order.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ComandaManagement() {
  const [comandas, setComandas] = useState({});
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showIniciarComanda, setShowIniciarComanda] = useState(false);
  const [mesaParaIniciar, setMesaParaIniciar] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchComandas();
    fetchMenuItems();
  }, []);

  const fetchComandas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orders?is_comanda=true&status_comanda=aberta`);
      const data = await response.json();
      if (data.success) {
        // Agrupa por mesa, ignorando mesas undefined, null ou vazias
        const mesas = {};
        data.orders.forEach((order) => {
          if (order.mesa !== undefined && order.mesa !== null && order.mesa !== '' && !isNaN(order.mesa)) {
            if (!mesas[order.mesa]) mesas[order.mesa] = [];
            mesas[order.mesa].push(order);
          }
        });
        setComandas(mesas);
      }
    } catch (error) {
      console.error('Erro ao carregar comandas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/menu?type=comanda`);
      const data = await response.json();
      if (data.success) {
        // Filtra apenas itens disponíveis para comanda
        setMenuItems(data.items.filter((item) => item.available_for_local === true));
      }
    } catch (error) {
      console.error('Erro ao carregar cardápio:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPedidosMesa = async (mesa) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/comanda/${mesa}`);
      const data = await response.json();
      if (data.success) {
        setPedidos(data.orders);
        setSelectedMesa(mesa);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos da mesa:', error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarComanda = async (mesa) => {
    if (!mesa || cart.length === 0) {
      toast.error('Digite o número da mesa e adicione itens antes de iniciar a comanda');
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
        toast.success('Comanda iniciada com sucesso!');
        setCart([]);
        setMesaParaIniciar('');
        setShowIniciarComanda(false);
        fetchComandas();
      } else {
        toast.error('Erro ao iniciar comanda: ' + data.message);
      }
    } catch (error) {
      console.error('Erro ao iniciar comanda:', error);
      toast.error('Erro ao iniciar comanda. Tente novamente.');
    }
  };

  const encerrarComanda = async (mesa) => {
    if (!confirm(`Tem certeza que deseja encerrar a comanda da Mesa ${mesa}?`)) return;

    try {
      // Buscar todos os pedidos da mesa
      const response = await fetch(`${API_BASE_URL}/comanda/${mesa}`);
      const data = await response.json();

      if (data.success) {
        // Atualizar status de todos os pedidos da mesa
        for (const order of data.orders) {
          await fetch(`${API_BASE_URL}/orders/${order.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status_comanda: 'encerrada',
              status: 'entregue', // Marca como entregue quando encerra
            }),
          });
        }

        toast.success('Comanda encerrada com sucesso!');
        setSelectedMesa(null);
        fetchComandas();
      }
    } catch (error) {
      console.error('Erro ao encerrar comanda:', error);
      toast.error('Erro ao encerrar comanda. Tente novamente.');
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

  const calcularTotalComanda = (mesa) => {
    if (!comandas[mesa]) return 0;
    return comandas[mesa].reduce((acc, pedido) => acc + pedido.total_amount, 0);
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

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>Gerenciar Comandas</h2>
          <p className='text-gray-600'>Gerencie comandas por mesa</p>
        </div>
        <Button onClick={() => setShowIniciarComanda(true)}>
          <Plus className='w-4 h-4 mr-2' />
          Iniciar Comanda
        </Button>
      </div>

      {loading && <p>Carregando...</p>}

      {/* Modal para iniciar comanda */}
      {showIniciarComanda && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
          <div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden'>
            <div className='p-6 border-b'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>Iniciar Nova Comanda</h3>
                <Button variant='ghost' onClick={() => setShowIniciarComanda(false)}>
                  ×
                </Button>
              </div>
            </div>

            <div className='p-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Seleção de mesa e cardápio */}
                <div>
                  <div className='mb-4'>
                    <Label htmlFor='mesa' className='text-sm font-medium text-gray-700'>
                      Número da Mesa
                    </Label>
                    <Input
                      id='mesa'
                      type='number'
                      min='1'
                      value={mesaParaIniciar}
                      onChange={(e) => setMesaParaIniciar(e.target.value)}
                      placeholder='Ex: 1, 2, 3...'
                      className='mt-1'
                    />
                  </div>

                  <div className='mb-4'>
                    <h4 className='font-medium mb-2'>Cardápio</h4>
                    <div className='max-h-96 overflow-y-auto space-y-2'>
                      {menuItems.map((item) => {
                        const cartItem = cart.find((cartItem) => cartItem.id === item.id);
                        return (
                          <div key={item.id} className='flex items-center justify-between p-2 border rounded'>
                            <div className='flex-1'>
                              <p className='font-medium'>{item.name}</p>
                              <p className='text-sm text-gray-600'>R$ {item.price.toFixed(2)}</p>
                            </div>
                            <div className='flex items-center space-x-2'>
                              {cartItem && (
                                <>
                                  <Button size='sm' variant='outline' onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}>
                                    <Minus className='w-3 h-3' />
                                  </Button>
                                  <span className='w-8 text-center'>{cartItem.quantity}</span>
                                </>
                              )}
                              <Button size='sm' variant='outline' onClick={() => addToCart(item)}>
                                <Plus className='w-3 h-3' />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className='flex space-x-2'>
                    <Button onClick={() => iniciarComanda(mesaParaIniciar)} disabled={!mesaParaIniciar || cart.length === 0}>
                      Iniciar Comanda
                    </Button>
                    <Button variant='outline' onClick={() => setShowIniciarComanda(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>

                {/* Carrinho */}
                <div>
                  <h4 className='font-medium mb-2'>Itens Selecionados</h4>
                  <div className='border rounded-lg p-4 max-h-96 overflow-y-auto'>
                    {cart.length === 0 ? (
                      <p className='text-gray-500 text-center py-4'>Nenhum item selecionado</p>
                    ) : (
                      <div className='space-y-2'>
                        {cart.map((item) => (
                          <div key={item.id} className='flex items-center justify-between p-2 border rounded'>
                            <div className='flex-1'>
                              <p className='font-medium'>{item.name}</p>
                              <p className='text-sm text-gray-600'>
                                R$ {item.price.toFixed(2)} x {item.quantity}
                              </p>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <span className='font-medium'>R$ {(item.price * item.quantity).toFixed(2)}</span>
                              <Button size='sm' variant='destructive' onClick={() => removeFromCart(item.id)}>
                                Remover
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className='border-t pt-2'>
                          <div className='flex justify-between items-center font-bold'>
                            <span>Total:</span>
                            <span>R$ {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedMesa ? (
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {/* Mesas com comandas abertas */}
          {Object.keys(comandas).map((mesa) => (
            <Card key={mesa} className='cursor-pointer hover:shadow-md transition-shadow' onClick={() => fetchPedidosMesa(mesa)}>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>Mesa {mesa}</CardTitle>
                <CardDescription>Comanda Ativa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <p className='text-sm text-gray-600'>Pedidos: {comandas[mesa].length}</p>
                  <p className='text-lg font-bold text-green-600'>R$ {calcularTotalComanda(mesa).toFixed(2)}</p>
                  <div className='flex space-x-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMesa(mesa);
                        setShowIniciarComanda(true);
                      }}
                    >
                      Adicionar Itens
                    </Button>
                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={(e) => {
                        e.stopPropagation();
                        encerrarComanda(mesa);
                      }}
                    >
                      Encerrar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Mesas disponíveis (1-30) */}
          {Array.from({ length: 30 }, (_, i) => i + 1).map((mesa) => {
            if (comandas[mesa]) return null; // Mesa já tem comanda
            return (
              <Card
                key={mesa}
                className='cursor-pointer hover:shadow-md transition-shadow border-dashed'
                onClick={() => {
                  setMesaParaIniciar(mesa.toString());
                  setShowIniciarComanda(true);
                }}
              >
                <CardHeader className='pb-3'>
                  <CardTitle className='text-lg text-gray-500'>Mesa {mesa}</CardTitle>
                  <CardDescription>Disponível</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size='sm' variant='outline' className='w-full'>
                    Iniciar Comanda
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div>
          <div className='flex items-center justify-between mb-4'>
            <Button onClick={() => setSelectedMesa(null)}>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Voltar
            </Button>
            <div className='flex space-x-2'>
              <Button
                variant='outline'
                onClick={() => {
                  setMesaParaIniciar(selectedMesa.toString());
                  setShowIniciarComanda(true);
                }}
              >
                Adicionar Itens
              </Button>
              <Button variant='destructive' onClick={() => encerrarComanda(selectedMesa)}>
                Encerrar Comanda
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pedidos da Mesa {selectedMesa}</CardTitle>
              <CardDescription>Total: R$ {calcularTotalComanda(selectedMesa).toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              {pedidos.length === 0 ? (
                <p className='text-gray-500 text-center py-8'>Nenhum pedido encontrado</p>
              ) : (
                <div className='space-y-4'>
                  {pedidos.map((pedido) => (
                    <div key={pedido.id} className='border rounded-lg p-4'>
                      <div className='flex items-center justify-between mb-2'>
                        <h4 className='font-medium'>Pedido #{pedido.id}</h4>
                        <div className='flex items-center space-x-2'>
                          {getStatusBadge(pedido.status)}
                          <span className='text-lg font-bold text-green-600'>R$ {pedido.total_amount.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className='space-y-2'>
                        {pedido.items.map((item) => (
                          <div key={item.id} className='flex justify-between text-sm'>
                            <span>
                              {item.quantity}x {item.menu_item.name}
                            </span>
                            <span>R$ {item.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <p className='text-xs text-gray-500 mt-2'>{new Date(pedido.created_at).toLocaleString('pt-BR')}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
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
            <Route path='/history' element={<CustomerHistory />} />
            <Route path='/comandas' element={<ComandaManagement />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
