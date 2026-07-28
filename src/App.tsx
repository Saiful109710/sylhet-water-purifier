import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { PortfolioSection } from './components/PortfolioSection';
import { WaterAIAdvisor } from './components/WaterAIAdvisor';
import { AboutSection } from './components/AboutSection';
import { ContactAndFooter } from './components/ContactAndFooter';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { Product, Order, PortfolioItem } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_PORTFOLIO } from './data/initialData';
import { 
  seedInitialDataIfEmpty, 
  subscribeProducts, 
  subscribeOrders, 
  subscribePortfolio 
} from './lib/firebase';
import { Sparkles, Filter, Droplet, Search } from 'lucide-react';

export default function App() {
  // Application Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);

  // Filter & Search States
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeBudgetTier, setActiveBudgetTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // UI Drawer & Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Setup Firebase Realtime Listeners & Auto-Seeding
  useEffect(() => {
    // 1. Seed initial default data into Firestore if database is empty
    seedInitialDataIfEmpty();

    // 2. Subscribe to real-time Firestore collections
    const unsubProducts = subscribeProducts((updatedProds) => {
      if (updatedProds.length > 0) {
        setProducts(updatedProds);
      }
    });

    const unsubOrders = subscribeOrders((updatedOrders) => {
      if (updatedOrders.length > 0) {
        setOrders(updatedOrders);
      }
    });

    const unsubPortfolio = subscribePortfolio((updatedPortfolio) => {
      if (updatedPortfolio.length > 0) {
        setPortfolio(updatedPortfolio);
      }
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubPortfolio();
    };
  }, []);

  const loadData = async () => {
    // Real-time Firestore subscriptions handle updates automatically
  };

  // Cart operations
  const handleAddToCart = (product: Product, includeSetup: boolean = true) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        updated[existingIndex].includeSetup = includeSetup;
        return updated;
      } else {
        return [...prev, { product, quantity: 1, includeSetup }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    loadData();
  };

  // Filtered Products Logic
  const filteredProducts = products.filter(p => {
    const matchCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchBudget = activeBudgetTier === 'all' || p.budgetTier === activeBudgetTier;
    
    const query = searchQuery.trim().toLowerCase();
    const matchSearch = !query || (
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );

    return matchCategory && matchBudget && matchSearch;
  });

  const lowStockCount = products.filter(p => p.stock <= p.minStockAlert).length;
  const pendingOrderCount = orders.filter(o => o.status === 'Pending').length;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      
      {/* Top Navigation */}
      <Navbar
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        onOpenAIAdvisor={() => scrollToSection('ai-advisor-section')}
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        lowStockCount={lowStockCount}
        pendingOrderCount={pendingOrderCount}
      />

      {isAdmin ? (
        /* ADMIN DASHBOARD VIEW */
        <AdminDashboard
          products={products}
          orders={orders}
          portfolio={portfolio}
          onRefreshData={loadData}
          onCloseAdmin={() => setIsAdmin(false)}
        />
      ) : (
        /* CUSTOMER STOREFRONT VIEW */
        <main className="flex-1">
          
          {/* Hero Banner Section */}
          <Hero
            onSelectCategory={setActiveCategory}
            onOpenAIAdvisor={() => scrollToSection('ai-advisor-section')}
            onScrollToPortfolio={() => scrollToSection('portfolio-section')}
          />

          {/* Product Showcase Section */}
          <section id="products-showcase" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
            
            {/* Filter & Budget Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Droplet className="w-6 h-6 text-cyan-600" />
                  <span>Water Filter & Treatment Collection</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Showing {filteredProducts.length} items for homes, offices, and industrial plants.
                </p>
              </div>

              {/* Budget Tier Selector */}
              <div className="flex items-center gap-2 self-start md:self-auto bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-400 pl-2">Budget:</span>
                {['all', 'Budget', 'Standard', 'Premium'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setActiveBudgetTier(tier)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activeBudgetTier === tier
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tier === 'all' ? 'All Budgets' : tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
                <Search className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No matching products found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search query or selecting 'All Products' category.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setActiveBudgetTier('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-cyan-600 text-white font-bold text-xs rounded-xl hover:bg-cyan-700 transition cursor-pointer"
                >
                  Reset Search & Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setSelectedProduct(p)}
                    onAddToCart={(p, setup) => handleAddToCart(p, setup)}
                  />
                ))}
              </div>
            )}

          </section>

          {/* AI Water Recommendation Tool Section */}
          <WaterAIAdvisor
            onAddToCart={(p, setup) => handleAddToCart(p, setup)}
          />

          {/* Portfolio Section (RO & IRP Plant setups) */}
          <PortfolioSection portfolio={portfolio} />

          {/* About Us Section */}
          <AboutSection />

          {/* Contact, Custom Quotes, Newsletter & Footer */}
          <ContactAndFooter />

        </main>
      )}

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, setup) => handleAddToCart(p, setup)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrderTrackerModal
        isOpen={isOrderTrackerOpen}
        onClose={() => setIsOrderTrackerOpen(false)}
      />

    </div>
  );
}
