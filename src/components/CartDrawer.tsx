import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, CheckCircle, ShieldCheck, ShoppingBag, Truck, MapPin } from 'lucide-react';
import { Product, Order } from '../types';
import { saveOrderToFirebase, updateStockInFirebase } from '../lib/firebase';

export interface CartItem {
  product: Product;
  quantity: number;
  includeSetup: boolean;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderPlaced: (newOrder: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderPlaced
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cityZone, setCityZone] = useState('Sylhet');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash / Nagad' | 'Bank Transfer'>('Cash on Delivery');
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const setupTotal = items.reduce(
    (acc, item) => acc + (item.includeSetup ? item.product.setupFee * item.quantity : 0),
    0
  );
  const totalAmount = subtotal + setupTotal;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !address) {
      setErrorMessage('অনুগ্রহ করে নাম, ফোন নাম্বার এবং ঠিকানা লিখুন।');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const orderItems = items.map(i => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        unitPrice: i.product.price,
        setupIncluded: i.includeSetup
      }));

      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const newOrderData: Omit<Order, 'id'> = {
        orderNumber: `SWP-2026-${randomSuffix}`,
        customerName,
        customerPhone,
        customerEmail,
        address,
        cityZone,
        items: orderItems,
        subtotal,
        setupTotal,
        totalAmount,
        paymentMethod,
        status: 'Pending',
        notes,
        createdAt: new Date().toISOString()
      };

      // 1. Save directly to Firestore database
      const createdOrder = await saveOrderToFirebase(newOrderData);

      // 2. Deduct stock levels in Firestore
      for (const item of items) {
        if (item.product.id) {
          const newStock = Math.max(0, item.product.stock - item.quantity);
          await updateStockInFirebase(item.product.id, newStock).catch(err => console.log('Stock update err:', err));
        }
      }

      // 3. Fallback backend API call
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderData)
      }).catch(err => console.log('Backend sync notice:', err));

      setOrderReceipt(createdOrder);
      onOrderPlaced(createdOrder);
      onClearCart();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage('অর্ডার জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে হটলাইনে কল দিন 01886-587395');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-sky-800/60 flex items-center justify-between bg-sky-950 text-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-sky-400" />
            <h2 className="font-black text-base text-white">আপনার কেনাকাটার কার্ট</h2>
            <span className="bg-sky-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full">
              {items.length} টি
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-sky-300 hover:text-white hover:bg-sky-900 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* SUCCESS ORDER RECEIPT */}
          {orderReceipt ? (
            <div className="space-y-5 py-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-300">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">অর্ডার সফলভাবে কনফার্ম হয়েছে!</h3>
                <p className="text-xs text-slate-500">
                  অর্ডার নাম্বার: <span className="font-extrabold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">{orderReceipt.orderNumber}</span>
                </p>
              </div>

              <div className="bg-sky-50/70 p-4 rounded-2xl text-left border border-sky-100 text-xs space-y-2">
                <div className="flex justify-between border-b border-sky-100 pb-2">
                  <span className="text-slate-500 font-medium">গ্রাহকের নাম:</span>
                  <span className="font-bold text-slate-900">{orderReceipt.customerName} ({orderReceipt.customerPhone})</span>
                </div>
                <div className="flex justify-between border-b border-sky-100 pb-2">
                  <span className="text-slate-500 font-medium">ডেলিভারি ঠিকানা:</span>
                  <span className="font-bold text-slate-900 text-right">{orderReceipt.address}, {orderReceipt.cityZone}</span>
                </div>
                <div className="flex justify-between border-b border-sky-100 pb-2">
                  <span className="text-slate-500 font-medium">পেমেন্ট মেথড:</span>
                  <span className="font-extrabold text-emerald-700">{orderReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between font-black text-base text-sky-950 pt-1">
                  <span>সর্বমোট মূল্য:</span>
                  <span>৳ {orderReceipt.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3.5 bg-sky-100/60 border border-sky-200 rounded-2xl text-xs text-sky-950 flex items-center gap-2.5 text-left font-medium">
                <Truck className="w-5 h-5 text-sky-600 shrink-0" />
                <span>আমাদের টেকনিশিয়ান আগামী ১-২ ঘণ্টার মধ্যে ফোন করে ডেলিভারি ও ফিটিং শিডিউল বুক করবেন।</span>
              </div>

              <button
                onClick={() => {
                  setOrderReceipt(null);
                  onClose();
                }}
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-2xl text-sm transition cursor-pointer shadow-md"
              >
                কেনাকাটায় ফিরে যান
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-sky-50 text-sky-400 rounded-full flex items-center justify-center mx-auto border border-sky-100">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">আপনার কার্ট খালি রয়েছে</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                আমাদের ফিল্টার কার্টিজ, RO মেশিন অথবা আইআরপি ওয়াটার প্ল্যান্ট থেকে পছন্দমতো পন্য যোগ করুন।
              </p>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3.5 bg-sky-50/50 border border-sky-100 rounded-2xl flex items-center gap-3"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover rounded-xl border border-sky-200"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs truncate">
                        {item.product.name}
                      </h4>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-sky-900">৳ {item.product.price.toLocaleString()}</span>
                        {item.includeSetup && (
                          <span className="text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md font-bold text-[10px]">
                            +৳{item.product.setupFee} ফিটিং
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white border border-sky-200 rounded-xl p-1">
                      <button
                        onClick={() => onUpdateQty(item.product.id, -1)}
                        className="p-1 text-slate-600 hover:bg-sky-50 rounded-lg"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQty(item.product.id, 1)}
                        className="p-1 text-slate-600 hover:bg-sky-50 rounded-lg"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Order Form */}
              <form onSubmit={handleCheckout} className="border-t border-slate-100 pt-4 space-y-3.5">
                <h3 className="font-black text-xs uppercase tracking-wider text-slate-400">
                  ডেলিভারি ও কাস্টমার তথ্য
                </h3>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-bold">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: তানভীর আহমেদ"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">মোবাইল নাম্বার *</label>
                    <input
                      type="tel"
                      required
                      placeholder="01711XXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">সম্পূর্ণ ঠিকানা *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="বাসা/ফ্ল্যাট #, রোড #, জিন্দাবাজার/আম্বরখানা/সিলেট এলাকা"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">বিভাগ/জেলা</label>
                    <select
                      value={cityZone}
                      onChange={(e) => setCityZone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value="Sylhet">Sylhet (সিলেট)</option>
                      <option value="Dhaka">Dhaka (ঢাকা)</option>
                      <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                      <option value="Moulvibazar">Moulvibazar (মৌলভীবাজার)</option>
                      <option value="Habiganj">Habiganj (হবিগঞ্জ)</option>
                      <option value="Sunamganj">Sunamganj (সুনামগঞ্জ)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">পেমেন্ট পদ্ধতি</label>
                    <select
                      value={paymentMethod}
                      onChange={(e: any) => setPaymentMethod(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value="Cash on Delivery">Cash on Delivery (ক্যাশ অন ডেলিভারি)</option>
                      <option value="bKash / Nagad">bKash / Nagad (বিকাশ / নগদ)</option>
                      <option value="Bank Transfer">Bank Transfer (ব্যাংক ট্রান্সফার)</option>
                    </select>
                  </div>
                </div>

                {/* Bill Summary */}
                <div className="p-4 bg-sky-50/80 rounded-2xl border border-sky-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>প্রোডাক্ট সাবটোটাল:</span>
                    <span>৳ {subtotal.toLocaleString()}</span>
                  </div>
                  {setupTotal > 0 && (
                    <div className="flex justify-between text-sky-900 font-bold">
                      <span>ইনস্টলেশন ও ফিটিং চার্জ:</span>
                      <span>৳ {setupTotal.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-sm text-sky-950 border-t border-sky-200 pt-2">
                    <span>সর্বমোট দেয় টাকা:</span>
                    <span>৳ {totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 hover:from-sky-600 hover:to-sky-800 text-white font-black rounded-2xl text-sm shadow-xl shadow-sky-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-sky-200" />
                  <span>{isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : 'অর্ডার কনফার্ম করুন'}</span>
                </button>
              </form>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
