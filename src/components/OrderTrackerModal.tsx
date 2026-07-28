import React, { useState } from 'react';
import { X, Search, Truck, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/orders/track?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Installation Scheduled': return 3;
      case 'Completed': return 4;
      default: return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-sky-100 relative animate-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-sky-50 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">অর্ডার ট্রাক করুণ (Order Tracking)</h2>
            <p className="text-xs text-slate-500">আপনার অর্ডার আইডি (যেমন: SWP-2026-001) অথবা মোবাইল নাম্বার দিন</p>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="যেমন: SWP-2026-001 অথবা 01711223344"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-xl text-xs transition cursor-pointer shadow-md"
          >
            {loading ? 'খোঁজা হচ্ছে...' : 'ট্র্যাক করুন'}
          </button>
        </form>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto space-y-4">
          {hasSearched && orders.length === 0 && !loading && (
            <div className="p-8 text-center bg-sky-50/60 rounded-2xl border border-sky-100 text-slate-500 space-y-1.5">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-xs font-black text-slate-800">কোনো অর্ডার পাওয়া যায়নি</p>
              <p className="text-[11px] text-slate-500">অনুগ্রহ করে আপনার অর্ডার নাম্বার অথবা ফোন নাম্বারটি সঠিকভাবে পরীক্ষা করুন।</p>
            </div>
          )}

          {orders.map((ord) => {
            const currentStep = getStatusStep(ord.status);
            return (
              <div key={ord.id} className="p-4 bg-sky-50/50 rounded-2xl border border-sky-200 space-y-3">
                <div className="flex justify-between items-start border-b border-sky-200/80 pb-2.5">
                  <div>
                    <span className="text-xs font-black text-sky-950 block">{ord.orderNumber}</span>
                    <span className="text-[11px] font-bold text-slate-600 block">গ্রাহক: {ord.customerName}</span>
                  </div>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-sky-200/80 text-sky-950 border border-sky-300">
                    {ord.status}
                  </span>
                </div>

                {/* Status Timeline */}
                <div className="grid grid-cols-4 gap-1.5 py-2 text-center text-[10px]">
                  <div className={`p-1.5 rounded-lg ${currentStep >= 1 ? 'bg-sky-600 text-white font-bold' : 'bg-slate-200 text-slate-500'}`}>
                    অর্ডার গৃহীত
                  </div>
                  <div className={`p-1.5 rounded-lg ${currentStep >= 2 ? 'bg-sky-600 text-white font-bold' : 'bg-slate-200 text-slate-500'}`}>
                    কনফার্মড
                  </div>
                  <div className={`p-1.5 rounded-lg ${currentStep >= 3 ? 'bg-sky-600 text-white font-bold' : 'bg-slate-200 text-slate-500'}`}>
                    ফিটিং শিডিউল
                  </div>
                  <div className={`p-1.5 rounded-lg ${currentStep >= 4 ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200 text-slate-500'}`}>
                    সম্পন্ন
                  </div>
                </div>

                {ord.notes && (
                  <div className="bg-white p-3 rounded-xl border border-sky-200 text-[11px] text-slate-700">
                    <span className="font-bold text-sky-950">টেকনিশিয়ান নোট: </span>
                    {ord.notes}
                  </div>
                )}

                <div className="flex justify-between text-xs text-slate-600 pt-1">
                  <span>মোট বিল: <strong className="text-sky-950 font-black">৳{ord.totalAmount.toLocaleString()}</strong></span>
                  <span className="font-semibold text-slate-700">পেমেন্ট: {ord.paymentMethod}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
