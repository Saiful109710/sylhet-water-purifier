import React, { useState } from 'react';
import { X, ShieldCheck, Wrench, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, setupIncluded: boolean) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [includeSetup, setIncludeSetup] = useState(true);

  if (!product) return null;

  const total = includeSetup ? product.price + product.setupFee : product.price;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-sky-100 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-sky-950 via-sky-900 to-slate-900 text-white p-6 border-b border-sky-800/60">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-sky-200 hover:text-white bg-sky-900/60 hover:bg-sky-800 p-2 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="text-xs font-black uppercase tracking-wider text-sky-300 bg-sky-900/80 px-3 py-1 rounded-full border border-sky-700/80">
            {product.category.replace('_', ' ')} • {product.budgetTier} Tier
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-white mt-3 leading-snug">
            {product.name}
          </h2>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Main info & image */}
          <div className="grid sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-5 rounded-2xl overflow-hidden bg-sky-50 aspect-square border border-sky-100">
              <img
                src={product.imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="sm:col-span-7 space-y-3">
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {product.description}
              </p>

              <div className="bg-sky-50 border border-sky-200/80 rounded-2xl p-3.5 text-xs space-y-1.5 text-sky-950">
                <div className="flex items-center gap-1.5 font-black text-sky-950">
                  <ShieldCheck className="w-4 h-4 text-sky-600" /> বিশুদ্ধ পানি ও অরজিনাল ফিল্টার নিশ্চয়তা
                </div>
                <p className="text-slate-600">
                  ফিটিং করার পর আমাদের টেকনিশিয়ান ওয়াটার টিডিএস মিটার দিয়ে টেস্ট করে পানি কতটুকু বিশুদ্ধ হয়েছে তা বুঝিয়ে দিবেন।
                </p>
              </div>
            </div>
          </div>

          {/* Full Specifications Grid */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
              টেকনিক্যাল স্পেসিফিকেশন
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {product.specifications.stages && (
                <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">ধাপ (Stages)</span>
                  <span className="font-extrabold text-slate-900">{product.specifications.stages}</span>
                </div>
              )}

              {product.specifications.capacity && (
                <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">উৎপাদন ক্ষমতা</span>
                  <span className="font-extrabold text-slate-900">{product.specifications.capacity}</span>
                </div>
              )}

              {product.specifications.replacementSchedule && (
                <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">কার্টিজ পরিবর্তন মেয়ার</span>
                  <span className="font-extrabold text-slate-900">{product.specifications.replacementSchedule}</span>
                </div>
              )}

              {product.specifications.waterSource && (
                <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">উপযুক্ত পানি</span>
                  <span className="font-extrabold text-slate-900">{product.specifications.waterSource}</span>
                </div>
              )}

              {product.specifications.warranty && (
                <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">ওয়ারেন্টি</span>
                  <span className="font-extrabold text-emerald-700">{product.specifications.warranty}</span>
                </div>
              )}
            </div>
          </div>

          {/* Installation & Setup Option Toggle */}
          <div className="border-t border-slate-100 pt-4">
            <label className="flex items-center justify-between p-4 bg-sky-50/80 hover:bg-sky-100/60 rounded-2xl border border-sky-200/80 cursor-pointer transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    অন-সাইট এক্সপার্ট টেকনিশিয়ান ফিটিং ও ইনস্টলেশন
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    পাইপ, এডাপ্টার, প্রেসার ফিটিং এবং ফ্রি টিডিএস টেষ্টিং সহ
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-sky-950">+ ৳{product.setupFee}</span>
                <input
                  type="checkbox"
                  checked={includeSetup}
                  onChange={(e) => setIncludeSetup(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500 cursor-pointer"
                />
              </div>
            </label>
          </div>

        </div>

        {/* Modal Footer with Price & Add to Cart */}
        <div className="p-6 bg-sky-50/60 border-t border-sky-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block font-bold uppercase">মোট মূল্য</span>
            <span className="text-2xl font-black text-sky-950">
              ৳ {total.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
            >
              বাতিল
            </button>

            <button
              onClick={() => {
                onAddToCart(product, includeSetup);
                onClose();
              }}
              disabled={product.stock === 0}
              className={`px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 text-white transition shadow-lg shadow-sky-500/20 cursor-pointer ${
                product.stock === 0
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{product.stock === 0 ? 'স্টক নেই' : 'অর্ডার সম্পন্ন করুন'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
