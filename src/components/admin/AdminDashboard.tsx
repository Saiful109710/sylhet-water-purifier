import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  AlertTriangle, 
  Download, 
  Plus, 
  Trash2, 
  X, 
  RefreshCw, 
  BarChart3, 
  Search,
  MessageSquare,
  PhoneCall,
  Mail,
  CheckCircle2,
  Clock,
  User,
  Send,
  Check
} from 'lucide-react';

import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

import { Product, Order, PortfolioItem, ProductCategory, BudgetTier, OrderStatus } from '../../types';
import { 
  updateStockInFirebase, 
  updateOrderStatusInFirebase, 
  saveProductToFirebase, 
  deleteProductFromFirebase,
  subscribeMessages,
  updateMessageStatusInFirebase,
  ContactMessage
} from '../../lib/firebase';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  portfolio: PortfolioItem[];
  onRefreshData: () => void;
  onCloseAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  portfolio,
  onRefreshData,
  onCloseAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'orders' | 'messages'>('analytics');
  
  // Realtime Customer Messages State
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messageSearch, setMessageSearch] = useState('');
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read' | 'resolved'>('all');

  useEffect(() => {
    const unsub = subscribeMessages((msgs) => {
      setMessages(msgs);
    });
    return () => unsub();
  }, []);

  const handleMessageStatusChange = async (msgId: string | undefined, status: 'unread' | 'read' | 'resolved') => {
    if (!msgId) return;
    try {
      await updateMessageStatusInFirebase(msgId, status);
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  };
  
  // Inventory state
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState<string>('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('housing_cartridge');
  const [newProdBudget, setNewProdBudget] = useState<BudgetTier>('Standard');
  const [newProdPrice, setNewProdPrice] = useState<number>(500);
  const [newProdStock, setNewProdStock] = useState<number>(20);
  const [newProdMinStock, setNewProdMinStock] = useState<number>(5);
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80');
  const [newProdSetupFee, setNewProdSetupFee] = useState<number>(200);

  // Orders Filter State
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Analytics Metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert);

  // Chart Data preparation
  const categoryColors = ['#0284c7', '#38bdf8', '#0284c7', '#0369a1', '#075985', '#38bdf8'];
  
  const categoryChartData = [
    { name: 'Housing Cartridges', value: products.filter(p => p.category === 'housing_cartridge').length },
    { name: 'RO Machines', value: products.filter(p => p.category === 'ro_machine').length },
    { name: 'IRP Plants', value: products.filter(p => p.category === 'irp_plant').length },
    { name: 'Electric Purifiers', value: products.filter(p => p.category === 'electric_purifier').length },
    { name: 'Non-Electric', value: products.filter(p => p.category === 'non_electric').length },
    { name: 'Spare Parts', value: products.filter(p => p.category === 'spare_parts').length },
  ];

  const monthlySalesChartData = [
    { month: 'মে ২০২৬', revenue: 45000, orders: 4 },
    { month: 'জুন ২০২৬', revenue: 68000, orders: 7 },
    { month: 'জুলাই ২০২৬', revenue: totalRevenue > 0 ? totalRevenue : 74500, orders: orders.length }
  ];

  // Stock update Firestore call
  const handleStockAdjust = async (productId: string, stockDelta: number) => {
    try {
      const prod = products.find(p => p.id === productId);
      if (prod) {
        const newStock = Math.max(0, prod.stock + stockDelta);
        await updateStockInFirebase(productId, newStock);
      }
      await fetch(`/api/products/${productId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockDelta })
      }).catch(e => console.log('API stock fallback notice:', e));
      onRefreshData();
    } catch (err) {
      console.error('Error adjusting stock:', err);
    }
  };

  // Status update Firestore call
  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatusInFirebase(orderId, status);
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }).catch(e => console.log('API order status fallback notice:', e));
      onRefreshData();
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // Add Product Firestore call
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: newProdName,
        category: newProdCategory,
        budgetTier: newProdBudget,
        price: Number(newProdPrice),
        stock: Number(newProdStock),
        minStockAlert: Number(newProdMinStock),
        description: newProdDescription,
        imageUrl: newProdImage,
        setupFee: Number(newProdSetupFee),
        specifications: {
          stages: 'Standard Filtration',
          replacementSchedule: '6 Months'
        }
      };

      await saveProductToFirebase(payload);
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(e => console.log('API product fallback notice:', e));

      setIsAddProductOpen(false);
      onRefreshData();
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  // Delete Product Firestore call
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই প্রোডাক্টটি ডিলেট করতে চান?')) return;
    try {
      await deleteProductFromFirebase(id);
      fetch(`/api/products/${id}`, { method: 'DELETE' }).catch(e => console.log('API delete fallback notice:', e));
      onRefreshData();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchCategory = inventoryCategory === 'all' || p.category === inventoryCategory;
    const matchSearch = p.name.toLowerCase().includes(inventorySearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  const filteredMessages = messages.filter(m => {
    const matchFilter = messageFilter === 'all' || (m.status || 'unread') === messageFilter;
    const searchLower = messageSearch.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(searchLower) || 
                        m.phone.toLowerCase().includes(searchLower) || 
                        m.message.toLowerCase().includes(searchLower) ||
                        m.setupType.toLowerCase().includes(searchLower);
    return matchFilter && matchSearch;
  });

  const unreadMessagesCount = messages.filter(m => (m.status || 'unread') === 'unread').length;

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Admin Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-sky-950 p-5 sm:p-6 rounded-3xl border border-sky-800/80 shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full">
              SYLHET WATER PURIFIER ADMIN
            </span>
            <span className="text-sky-300/80 text-xs font-medium">ইনভেন্টরি • কাস্টমার মেসেজ • সেলস রিপোর্ট</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1.5">
            Sylhet Water Purifier - অ্যাডমিন ম্যানেজমেন্ট প্যানেল
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefreshData}
            className="p-2.5 bg-sky-900/80 hover:bg-sky-800 rounded-2xl text-sky-200 transition cursor-pointer flex items-center gap-2 text-xs font-black border border-sky-700/60"
          >
            <RefreshCw className="w-4 h-4 text-sky-400" /> ডেটা রিফ্রেশ
          </button>

          <button
            onClick={onCloseAdmin}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-2xl text-xs transition cursor-pointer shadow-lg shadow-sky-500/20"
          >
            ওয়েবসাইট ভিউতে যান
          </button>
        </div>
      </div>

      {/* Metric Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div className="bg-sky-950/80 p-5 rounded-2xl border border-sky-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-sky-300/70 block font-bold">মোট বিক্রি (Shop Revenue)</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              ৳ {totalRevenue.toLocaleString()}
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-950 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-800 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-sky-950/80 p-5 rounded-2xl border border-sky-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-sky-300/70 block font-bold">মোট কাস্টমার অর্ডার</span>
            <span className="text-2xl font-black text-white mt-1 block">
              {orders.length}
            </span>
          </div>
          <div className="w-12 h-12 bg-sky-900 text-sky-300 rounded-2xl flex items-center justify-center border border-sky-700 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-sky-950/80 p-5 rounded-2xl border border-sky-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-sky-300/70 block font-bold">ইনকোয়ারি মেসেজ</span>
            <span className="text-2xl font-black text-cyan-300 mt-1 block">
              {messages.length} টি
            </span>
            {unreadMessagesCount > 0 && (
              <span className="text-[10px] text-emerald-400 font-black block">
                ● {unreadMessagesCount} টি অপঠিত
              </span>
            )}
          </div>
          <div className="w-12 h-12 bg-cyan-950 text-cyan-400 rounded-2xl flex items-center justify-center border border-cyan-800 shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-sky-950/80 p-5 rounded-2xl border border-sky-800/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-sky-300/70 block font-bold">পেন্ডিং ফিটিং অর্ডার</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">
              {pendingOrdersCount}
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-950 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-800 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-sky-950/80 p-5 rounded-2xl border border-sky-800/80 flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <span className="text-xs text-sky-300/70 block font-bold">কম স্টক প্রোডাক্ট</span>
            <span className={`text-2xl font-black mt-1 block ${lowStockProducts.length > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {lowStockProducts.length} টি
            </span>
          </div>
          <div className="w-12 h-12 bg-rose-950 text-rose-400 rounded-2xl flex items-center justify-center border border-rose-800 shrink-0">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-sky-900 space-x-2 pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-3 rounded-t-2xl font-black text-xs flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-sky-900 text-sky-300 border-t-2 border-sky-400'
              : 'text-sky-300/60 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>সেলস এনালিটিক্স ও রিপোর্ট</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-3 rounded-t-2xl font-black text-xs flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-sky-900 text-sky-300 border-t-2 border-sky-400'
              : 'text-sky-300/60 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>ইনভেন্টরি ও স্টক ({products.length})</span>
          {lowStockProducts.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0 rounded-full font-bold">
              {lowStockProducts.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-3 rounded-t-2xl font-black text-xs flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-sky-900 text-sky-300 border-t-2 border-sky-400'
              : 'text-sky-300/60 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>কাস্টমার অর্ডার ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-5 py-3 rounded-t-2xl font-black text-xs flex items-center gap-2 transition cursor-pointer whitespace-nowrap relative ${
            activeTab === 'messages'
              ? 'bg-sky-900 text-sky-300 border-t-2 border-sky-400'
              : 'text-sky-300/60 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>কাস্টমার ইনকোয়ারি মেসেজ ({messages.length})</span>
          {unreadMessagesCount > 0 && (
            <span className="bg-emerald-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse ml-1">
              {unreadMessagesCount} নতুন
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: SALES ANALYTICS & MONTHLY REPORTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center bg-sky-950 p-5 rounded-2xl border border-sky-800/80 gap-3">
            <div>
              <h3 className="font-black text-white text-base">মাসিক সেলস ও রেভিনিউ রিপোর্ট</h3>
              <p className="text-xs text-sky-300/70">প্রতি মাসের প্রোডাক্ট বিক্রি ও আয় পর্যবেক্ষণ এবং রিপোর্ট ডাউনলোড করুন।</p>
            </div>

            <a
              href="/api/analytics/export-csv"
              download
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <Download className="w-4 h-4" />
              <span>মাসিক CSV রিপোর্ট ডাউনলোড করুন</span>
            </a>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            
            {/* Monthly Sales Revenue Chart */}
            <div className="lg:col-span-7 bg-sky-950 p-6 rounded-3xl border border-sky-800/80 space-y-4">
              <h4 className="font-black text-sm text-sky-200">মাসিক রেভিনিউ চার্ট (BDT ৳)</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySalesChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#075985" />
                    <XAxis dataKey="month" stroke="#7dd3fc" fontSize={12} />
                    <YAxis stroke="#7dd3fc" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#082f49', borderColor: '#0369a1', borderRadius: '16px' }}
                      formatter={(val: any) => [`৳ ${val.toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Product Category Share Pie Chart */}
            <div className="lg:col-span-5 bg-sky-950 p-6 rounded-3xl border border-sky-800/80 space-y-4">
              <h4 className="font-black text-sm text-sky-200">ক্যাটাগরি অনুযায়ী প্রোডাক্টের সংখ্যা</h4>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#082f49', borderColor: '#0369a1', borderRadius: '16px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & STOCK MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-950 p-4 rounded-2xl border border-sky-800/80">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-sky-400" />
              <input
                type="text"
                placeholder="প্রোডাক্ট খুঁজুন..."
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-full bg-slate-900 border border-sky-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
              />
            </div>

            <select
              value={inventoryCategory}
              onChange={(e) => setInventoryCategory(e.target.value)}
              className="bg-slate-900 border border-sky-800 text-sky-200 text-xs font-bold rounded-xl px-3.5 py-2 focus:outline-none"
            >
              <option value="all">সকল ক্যাটাগরি</option>
              <option value="housing_cartridge">Housing Cartridge</option>
              <option value="ro_machine">RO Machine</option>
              <option value="irp_plant">IRP Plant</option>
              <option value="electric_purifier">Electric Purifier</option>
              <option value="non_electric">Non-Electric</option>
            </select>

            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" /> নতুন প্রোডাক্ট যোগ করুন
            </button>
          </div>

          {/* Product Table */}
          <div className="bg-sky-950 rounded-2xl border border-sky-800/80 overflow-x-auto">
            <table className="w-full text-left text-xs text-sky-100">
              <thead className="bg-sky-900/80 text-sky-300 uppercase text-[10px] font-black tracking-wider border-b border-sky-800">
                <tr>
                  <th className="p-3.5">প্রোডাক্ট</th>
                  <th className="p-3.5">ক্যাটাগরি</th>
                  <th className="p-3.5">মূল্য (BDT)</th>
                  <th className="p-3.5">বর্তমান স্টক</th>
                  <th className="p-3.5 text-center">স্টক আপডেট</th>
                  <th className="p-3.5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-800/60">
                {filteredProducts.map((p) => {
                  const isLow = p.stock <= p.minStockAlert;
                  return (
                    <tr key={p.id} className="hover:bg-sky-900/40 transition">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover rounded-xl border border-sky-700"
                        />
                        <div>
                          <span className="font-black text-white block line-clamp-1">{p.name}</span>
                          <span className="text-[10px] text-sky-300/70">{p.budgetTier} Tier • ফিটিং: ৳{p.setupFee}</span>
                        </div>
                      </td>

                      <td className="p-3.5 capitalize font-bold text-sky-300">
                        {p.category.replace('_', ' ')}
                      </td>

                      <td className="p-3.5 font-black text-white">
                        ৳ {p.price.toLocaleString()}
                      </td>

                      <td className="p-3.5">
                        <span className={`font-black px-2.5 py-1 rounded-full text-[11px] ${
                          isLow ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300'
                        }`}>
                          {p.stock} টি
                        </span>
                        {isLow && (
                          <span className="block text-[10px] text-rose-400 font-bold mt-1">
                            কম স্টক সতর্কবার্তা!
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-sky-800">
                          <button
                            onClick={() => handleStockAdjust(p.id, -1)}
                            className="px-2.5 py-1 bg-sky-950 hover:bg-sky-800 text-sky-200 rounded-lg text-xs font-black"
                          >
                            -১
                          </button>
                          <button
                            onClick={() => handleStockAdjust(p.id, 10)}
                            className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-black"
                          >
                            +১০ স্টক
                          </button>
                        </div>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 rounded-xl transition cursor-pointer"
                          title="প্রোডাক্ট ডিলেট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: CUSTOMER ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-sky-950 p-4 rounded-2xl border border-sky-800/80">
            <h3 className="font-black text-white text-base">সকল অনলাইন কাস্টমার অর্ডার</h3>

            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="bg-slate-900 border border-sky-800 text-sky-200 text-xs font-bold rounded-xl px-3.5 py-2 focus:outline-none"
            >
              <option value="all">সকল স্ট্যাটাস</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Installation Scheduled">Installation Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="bg-sky-950 p-5 rounded-2xl border border-sky-800/80 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sky-400 text-sm">{ord.orderNumber}</span>
                    <span className="text-xs text-sky-300/60">({new Date(ord.createdAt).toLocaleDateString()})</span>
                  </div>

                  <p className="font-black text-white text-xs">
                    {ord.customerName} • <span className="text-sky-300">{ord.customerPhone}</span>
                  </p>

                  <p className="text-xs text-sky-200/80">
                    ঠিকানা: {ord.address}, {ord.cityZone}
                  </p>

                  <div className="text-[11px] text-sky-200 bg-slate-900 p-2.5 rounded-xl border border-sky-800/60 max-w-lg font-medium">
                    {ord.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-lg font-black text-white">
                    ৳ {ord.totalAmount.toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-sky-300/80 font-bold">স্ট্যাটাস:</span>
                    <select
                      value={ord.status}
                      onChange={(e: any) => handleStatusChange(ord.id, e.target.value)}
                      className="bg-slate-900 border border-sky-800 text-sky-300 font-black text-xs rounded-xl px-3 py-1.5 focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Installation Scheduled">Installation Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMER MESSAGES MANAGEMENT */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-950 p-4 rounded-2xl border border-sky-800/80">
            <div>
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <span>কাস্টমার ইনকোয়ারি ও কন্টাক্ট মেসেজ সমূহ</span>
              </h3>
              <p className="text-xs text-sky-300/70">ওয়েবসাইটের কন্টাক্ট ফরম থেকে প্রেরিত সকল কাস্টমার বার্তা রিয়েল-টাইমে এখানে দেখা যাবে।</p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="নাম, ফোন বা মেসেজ খুঁজুন..."
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  className="bg-slate-900 border border-sky-800 text-sky-200 text-xs font-bold rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-400 w-48 sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <select
                value={messageFilter}
                onChange={(e: any) => setMessageFilter(e.target.value)}
                className="bg-slate-900 border border-sky-800 text-sky-200 text-xs font-bold rounded-xl px-3.5 py-2 focus:outline-none"
              >
                <option value="all">সকল মেসেজ ({messages.length})</option>
                <option value="unread">অপঠিত / নতুন ({unreadMessagesCount})</option>
                <option value="read">পড়া হয়েছে ({messages.filter(m => m.status === 'read').length})</option>
                <option value="resolved">সমাধান হয়েছে ({messages.filter(m => m.status === 'resolved').length})</option>
              </select>
            </div>
          </div>

          {/* Messages List */}
          {filteredMessages.length === 0 ? (
            <div className="bg-sky-950 p-12 rounded-2xl border border-sky-800/80 text-center space-y-3">
              <MessageSquare className="w-12 h-12 text-sky-600 mx-auto" />
              <p className="text-sky-300 font-bold text-sm">কোন কাস্টমার ইনকোয়ারি মেসেজ পাওয়া যায়নি</p>
              <p className="text-xs text-sky-400/60">কাস্টমাররা ওয়েবসাইট থেকে ফরম ফিলআপ করলে সাথে সাথে এই প্যানেলে জমা হবে।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {filteredMessages.map((msg) => {
                const status = msg.status || 'unread';
                return (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-2xl border transition duration-300 ${
                      status === 'unread'
                        ? 'bg-sky-950/90 border-cyan-500/80 shadow-lg shadow-cyan-950/40'
                        : status === 'read'
                        ? 'bg-sky-950/60 border-sky-800/70'
                        : 'bg-slate-900/80 border-slate-800 opacity-80'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      
                      {/* Left Side: Customer Info & Setup Type */}
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2.5">
                          
                          {/* Status Badge */}
                          {status === 'unread' && (
                            <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                              নতুন মেসেজ
                            </span>
                          )}
                          {status === 'read' && (
                            <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                              পড়া হয়েছে
                            </span>
                          )}
                          {status === 'resolved' && (
                            <span className="bg-slate-800 text-slate-400 border border-slate-700 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                              সমাধান সম্পন্ন
                            </span>
                          )}

                          {/* Inquiry Type Badge */}
                          <span className="bg-cyan-950 text-cyan-300 border border-cyan-800/80 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                            {msg.setupType}
                          </span>

                          {/* Date Time */}
                          <span className="text-sky-400/60 text-xs font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(msg.createdAt).toLocaleString('bn-BD', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </span>
                        </div>

                        {/* Customer Name & Phone */}
                        <div>
                          <h4 className="text-base font-black text-white flex items-center gap-2">
                            <User className="w-4 h-4 text-cyan-400" />
                            <span>{msg.name}</span>
                          </h4>
                          <p className="text-xs font-black text-cyan-300 mt-0.5 flex items-center gap-1.5">
                            <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{msg.phone}</span>
                          </p>
                        </div>

                        {/* Message Text */}
                        <div className="bg-slate-900/90 p-3.5 rounded-xl border border-sky-800/50 text-slate-200 text-xs leading-relaxed font-medium">
                          <p className="whitespace-pre-wrap">{msg.message || 'কোন অতিরিক্ত বার্তা লেখা হয়নি।'}</p>
                        </div>
                      </div>

                      {/* Right Side: Quick Call & Status Toggle Buttons */}
                      <div className="flex flex-col items-end gap-2.5 shrink-0 sm:self-center">
                        
                        {/* Direct Communication Buttons */}
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${msg.phone}`}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-md shadow-emerald-950/50"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>কল দিন</span>
                          </a>

                          <a
                            href={`https://wa.me/880${msg.phone.replace(/^0/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 font-black px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition"
                          >
                            <span>WhatsApp</span>
                          </a>
                        </div>

                        {/* Status Change Selector */}
                        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-sky-800/80">
                          <button
                            onClick={() => handleMessageStatusChange(msg.id, 'unread')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer ${
                              status === 'unread' ? 'bg-emerald-500 text-slate-950' : 'text-sky-300/60 hover:text-white'
                            }`}
                          >
                            নতুন
                          </button>
                          <button
                            onClick={() => handleMessageStatusChange(msg.id, 'read')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer ${
                              status === 'read' ? 'bg-sky-500 text-slate-950' : 'text-sky-300/60 hover:text-white'
                            }`}
                          >
                            পড়া হয়েছে
                          </button>
                          <button
                            onClick={() => handleMessageStatusChange(msg.id, 'resolved')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer ${
                              status === 'resolved' ? 'bg-slate-700 text-white' : 'text-sky-300/60 hover:text-white'
                            }`}
                          >
                            সমাধান
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-sky-950 border border-sky-700 rounded-3xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-sky-800 pb-3">
              <h3 className="font-black text-base text-white">নতুন ওয়াটার ফিল্টার প্রোডাক্ট যোগ করুন</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-sky-300 hover:text-white p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block mb-1 font-bold text-sky-200">প্রোডাক্টের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="যেমন: 7-Stage RO Alkaline Water Filter"
                  className="w-full bg-slate-900 border border-sky-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-sky-200">ক্যাটাগরি</label>
                  <select
                    value={newProdCategory}
                    onChange={(e: any) => setNewProdCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-sky-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none"
                  >
                    <option value="housing_cartridge">Housing Cartridge</option>
                    <option value="ro_machine">RO Machine</option>
                    <option value="irp_plant">IRP Plant</option>
                    <option value="electric_purifier">Electric Purifier</option>
                    <option value="non_electric">Non-Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-sky-200">বাজেট টায়ার</label>
                  <select
                    value={newProdBudget}
                    onChange={(e: any) => setNewProdBudget(e.target.value)}
                    className="w-full bg-slate-900 border border-sky-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none"
                  >
                    <option value="Budget">Budget</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-sky-200">মূল্য (BDT) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-sky-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-sky-200">স্টক পরিমাণ *</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-sky-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-sky-200">ইনস্টলেশন ফি</label>
                  <input
                    type="number"
                    value={newProdSetupFee}
                    onChange={(e) => setNewProdSetupFee(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-sky-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-bold text-sky-200">ছবি লিংক (Image URL)</label>
                <input
                  type="text"
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full bg-slate-900 border border-sky-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-bold text-sky-200">বিবরণ</label>
                <textarea
                  rows={2}
                  value={newProdDescription}
                  onChange={(e) => setNewProdDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-sky-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 font-black text-slate-950 rounded-xl text-xs transition shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                প্রোডাক্ট সেভ করুন
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
