import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  ShieldCheck, 
  Menu, 
  X, 
  LayoutDashboard, 
  PhoneCall, 
  Sparkles,
  MapPin,
  ChevronRight,
  SearchCode
} from 'lucide-react';
import { SWPLogo } from './SWPLogo';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrderTracker: () => void;
  onOpenAIAdvisor: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  lowStockCount: number;
  pendingOrderCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenOrderTracker,
  onOpenAIAdvisor,
  isAdmin,
  onToggleAdmin,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  lowStockCount,
  pendingOrderCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All Products' },
    { key: 'housing_cartridge', label: 'Housing Cartridges' },
    { key: 'ro_machine', label: 'RO Machines' },
    { key: 'irp_plant', label: 'IRP Iron Plants' },
    { key: 'electric_purifier', label: 'Electric Purifiers' },
    { key: 'non_electric', label: 'Non-Electric' },
    { key: 'spare_parts', label: 'Spare Parts' },
  ];

  const handleCategoryClick = (catKey: string) => {
    onSelectCategory(catKey);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-cyan-100 shadow-sm shadow-cyan-500/5 transition-all text-slate-800">
      {/* Top Banner - Hotline & Quick Services */}
      <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 text-white text-xs py-2 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-cyan-50 font-black">
              <PhoneCall className="w-3.5 h-3.5 text-cyan-200 animate-pulse" /> 
              <span>হটলাইন: 01886-587395</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-cyan-100">
              <MapPin className="w-3.5 h-3.5 text-cyan-200" /> সুরমা গেইট আখালিয়া, সিলেট-৩১০০
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-cyan-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> ফ্রি TDS ওয়াটার টেষ্টিং & ওয়ারেন্টি
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAIAdvisor}
              className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white border border-white/30 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-cyan-200 animate-spin" />
              <span>স্মার্ট ফিল্টার এডভাইজর</span>
            </button>

            <button
              onClick={onOpenOrderTracker}
              className="text-cyan-100 hover:text-white underline underline-offset-2 transition cursor-pointer text-xs font-medium px-2"
            >
              অর্ডার ট্র্যাকিং
            </button>

            <button
              onClick={onToggleAdmin}
              className={`px-3 py-1 rounded-full font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
                isAdmin 
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md' 
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/30'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'এডমিন থেকে বের হন' : 'এডমিন প্যানেল'}</span>
              {!isAdmin && (lowStockCount > 0 || pendingOrderCount > 0) && (
                <span className="bg-amber-400 text-slate-950 font-black rounded-full px-1.5 py-0 text-[10px]">
                  !
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2 group">
              <SWPLogo size="md" />
            </a>
          </div>

          {/* Integrated Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search className="w-4 h-4 text-cyan-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ফিল্টার কার্টিজ, RO মেশিন, আয়রন প্ল্যান্ট সার্চ করুন..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-cyan-50/70 border border-cyan-200/80 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenCart}
              className="relative px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-black text-xs transition flex items-center gap-2.5 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span>কার্ট</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-200 text-cyan-700"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyan-600 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-cyan-50 border border-cyan-200 text-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Integrated Search Bar (Mobile) */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-cyan-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="সার্চ ফিল্টার, RO, আইআরপি..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-cyan-50 border border-cyan-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Category Navigation Bar (Desktop & Mobile) */}
        <nav className="hidden md:flex space-x-1.5 overflow-x-auto py-2.5 border-t border-cyan-100 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat.key)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/30'
                    : 'text-slate-600 hover:bg-cyan-50 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-cyan-100 px-4 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="font-bold text-xs uppercase tracking-wider text-cyan-800">ক্যাটাগরি সমূহ</div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat.key)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition ${
                  activeCategory === cat.key
                    ? 'bg-cyan-600 text-white'
                    : 'bg-cyan-50/70 border border-cyan-100 text-slate-700 hover:bg-cyan-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-cyan-100 flex flex-col gap-2.5">
            <button
              onClick={() => {
                onOpenAIAdvisor();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-sky-600 rounded-xl text-xs font-black text-white"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-200" /> AI পানি ফিল্টার সিলেক্টর
              </span>
              <ChevronRight className="w-4 h-4 text-white" />
            </button>

            <button
              onClick={() => {
                onOpenOrderTracker();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full px-4 py-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs font-bold text-slate-800"
            >
              <span>অনলাইন অর্ডার ট্র্যাকিং</span>
              <SearchCode className="w-4 h-4 text-cyan-600" />
            </button>

            <button
              onClick={() => {
                onToggleAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full px-4 py-3 bg-amber-400 text-slate-950 rounded-xl text-xs font-black"
            >
              <span>{isAdmin ? 'এডমিন প্যানেল থেকে বের হন' : 'এডমিন প্যানেলে প্রবেশ করুন'}</span>
              <LayoutDashboard className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
