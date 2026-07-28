import React from 'react';
import { ShoppingBag, Eye, AlertCircle, Wrench, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, setupIncluded: boolean) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart
}) => {
  const isLowStock = product.stock <= product.minStockAlert && product.stock > 0;
  const isOutOfStock = product.stock === 0;

  const categoryLabels: Record<string, string> = {
    housing_cartridge: 'হাউজিং ফিল্টার',
    ro_machine: 'RO ফিল্টার মেশিন',
    irp_plant: 'আইআরপি ওয়াটার প্ল্যান্ট',
    electric_purifier: 'ইউভি ওয়াটার ফিল্টার',
    non_electric: 'গ্রাভিটি ফিল্টার',
    spare_parts: 'স্পেয়ার পার্টস'
  };

  const budgetColor = {
    Budget: 'bg-emerald-500/10 text-emerald-700 border-emerald-300',
    Standard: 'bg-sky-500/10 text-sky-700 border-sky-300',
    Premium: 'bg-purple-500/10 text-purple-700 border-purple-300'
  }[product.budgetTier];

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 hover:border-sky-400 shadow-sm hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-sky-50/50">
        <img
          src={product.imageUrl}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Floating Tag */}
        <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-sky-300 text-[10px] font-black px-2.5 py-1 rounded-full border border-sky-400/30">
          {categoryLabels[product.category] || product.category}
        </span>

        {/* Budget Tier Badge */}
        <span className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-full border ${budgetColor}`}>
          {product.budgetTier}
        </span>

        {/* Stock Alert Badge */}
        {isOutOfStock ? (
          <span className="absolute bottom-3 left-3 bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
            স্টক শেষ
          </span>
        ) : isLowStock ? (
          <span className="absolute bottom-3 left-3 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md animate-pulse">
            <AlertCircle className="w-3 h-3 text-slate-950" /> মাত্র {product.stock} টি আছে
          </span>
        ) : null}

        {/* Quick View Overlay Button */}
        <button
          onClick={() => onQuickView(product)}
          className="absolute inset-x-4 bottom-3 bg-sky-950/90 hover:bg-sky-950 text-white text-xs font-bold py-2.5 rounded-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg border border-sky-500/30 cursor-pointer"
        >
          <Eye className="w-4 h-4 text-sky-400" /> স্পেসিফিকেশন ও বিস্তারিত
        </button>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base line-clamp-2 group-hover:text-sky-600 transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>

        {/* Specifications snippet */}
        <div className="bg-sky-50/70 p-3 rounded-2xl text-[11px] text-slate-700 space-y-1 border border-sky-100/80">
          {product.specifications.stages && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">ধাপ (Stages):</span>
              <span className="font-bold text-sky-900 truncate max-w-[140px]">{product.specifications.stages}</span>
            </div>
          )}
          {product.specifications.replacementSchedule && (
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">মেয়াদ/পরিবর্তন:</span>
              <span className="font-bold text-sky-900">{product.specifications.replacementSchedule}</span>
            </div>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">মূল্য</span>
            <span className="text-lg font-black text-slate-900 text-sky-950">
              ৳ {product.price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onQuickView(product)}
              className="p-2.5 text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition cursor-pointer border border-sky-100"
              title="বিস্তারিত দেখুন"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => onAddToCart(product, true)}
              disabled={isOutOfStock}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition cursor-pointer ${
                isOutOfStock 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-md shadow-sky-500/20'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>অর্ডার</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
