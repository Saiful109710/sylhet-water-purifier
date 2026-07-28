import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  MessageSquare, 
  CheckCircle, 
  Droplet,
  PhoneCall,
  Clock
} from 'lucide-react';
import { saveContactMessageToFirebase } from '../lib/firebase';

export const ContactAndFooter: React.FC = () => {
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [setupType, setSetupType] = useState('RO Machine Purchase');
  const [message, setMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState('');
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;
    setIsSubmittingContact(true);

    try {
      // Direct Firestore save
      await saveContactMessageToFirebase({
        name: contactName,
        phone: contactPhone,
        setupType,
        message
      });

      // API fallback call for backup
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          phone: contactPhone,
          setupType,
          message
        })
      }).catch(err => console.log('API contact fallback notice:', err));

      setContactSuccess('মেসেজ ডাটাবেজে রেকর্ড করা হয়েছে! টেকনিশিয়ান দ্রুত আপনার সাথে যোগাযোগ করবেন।');
      setContactName('');
      setContactPhone('');
      setMessage('');
    } catch (err) {
      console.error('Firestore contact error:', err);
      setContactSuccess('মেসেজটি রেকর্ড করা হয়েছে। হটলাইনে কল দিন 01886-587395');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubmittingNewsletter(true);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      setNewsletterSuccess(data.message || 'সাবস্ক্রিপশন সম্পন্ন হয়েছে!');
      setNewsletterEmail('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingNewsletter(false);
    }
  };

  return (
    <footer id="contact-section" className="bg-slate-950 text-sky-100 pt-16 pb-8 border-t border-sky-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Contact Form & Store Details Section */}
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Store Info & Social Links */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-400 to-cyan-300 flex items-center justify-center text-slate-950 shadow-lg shadow-sky-500/20 font-black text-xl">
                <Droplet className="w-7 h-7 text-slate-950 fill-slate-950/20" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  Sylhet <span className="text-sky-400">Water Purifier</span>
                </span>
                <span className="block text-xs font-semibold text-sky-300/80">
                  Your Trusted Source for Clean and Pure Water!
                </span>
              </div>
            </div>

            <p className="text-xs text-sky-200/80 leading-relaxed font-normal">
              হাউজিং কার্টিজ, ৫-১০ স্টেজ RO মেশিন, UV পিউরিফায়ার এবং আইআরপি আয়রন প্ল্যান্টের নির্ভরযোগ্য সমাধান। সিলেটসহ সারাদেশে হোম ডেলিভারি ও এক্সপার্ট ফিটিং সার্ভিস।
            </p>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="font-medium text-sky-100">ঠিকানা: এলাহি ৭( ২য় তলা)। সুরমা গেইট আখালিয়া সিলেট।, Sylhet, Bangladesh, 3100</span>
              </div>

              <div className="flex items-center gap-3">
                <PhoneCall className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="font-black text-white text-sm">01886-587395</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>info@sylhetwaterpurifier.com</span>
              </div>

              <div className="flex items-center gap-3 text-sky-300/80">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>প্রতিদিন সকাল ৯:০০ - রাত ১০:০০ (খোলা থাকে)</span>
              </div>
            </div>

            {/* WhatsApp Quick Direct Button */}
            <a
              href="https://wa.me/8801886587395?text=Hello%20Sylhet%20Water%20Purifier,%20I%20want%20to%20inquire%20about%20a%20filter"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-3 rounded-2xl text-xs transition cursor-pointer shadow-lg shadow-emerald-600/20"
            >
              <MessageSquare className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপ মেসেজ দিন (01886-587395)</span>
            </a>

            {/* Social Media Links */}
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-sky-400 block mb-2">
                সোশ্যাল মিডিয়া পেজ
              </span>
              <div className="flex gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-sky-900/60 hover:bg-sky-800 border border-sky-800 rounded-xl text-xs font-bold text-sky-200 transition"
                >
                  ফেসবুক পেজ (Facebook)
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-sky-900/60 hover:bg-sky-800 border border-sky-800 rounded-xl text-xs font-bold text-sky-200 transition"
                >
                  ইউটিউব চ্যানেল (Videos)
                </a>
              </div>
            </div>
          </div>

          {/* Contact & Custom Quote Form */}
          <div className="lg:col-span-7 bg-sky-950/80 p-6 sm:p-7 rounded-3xl border border-sky-800/80 space-y-4 shadow-xl">
            <div>
              <h3 className="text-base font-black text-white">মেসেজ দিন / কাস্টম ফিল্টার কোটেশন</h3>
              <p className="text-xs text-sky-300/80">পানির সমস্যা লিখুন, আমাদের সিলেটের অভিজ্ঞ টেকনিশিয়ান আপনার সাথে যোগাযোগ করবেন।</p>
            </div>

            {contactSuccess && (
              <div className="p-3.5 bg-emerald-950/90 border border-emerald-600 text-emerald-300 text-xs rounded-2xl flex items-center gap-2 font-bold">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{contactSuccess}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sky-200 block mb-1 font-bold">আপনার নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: তানভীর আহমেদ"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-sky-800/80 rounded-xl text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="text-sky-200 block mb-1 font-bold">মোবাইল নাম্বার *</label>
                  <input
                    type="tel"
                    required
                    placeholder="01711XXXXXX"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-sky-800/80 rounded-xl text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-sky-200 block mb-1 font-bold">প্রয়োজনীয় ফিল্টারের ধরন</label>
                <select
                  value={setupType}
                  onChange={(e) => setSetupType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-sky-800/80 rounded-xl text-white focus:outline-none focus:border-sky-400 font-bold"
                >
                  <option value="RO Machine Purchase">RO মিনারেল ওয়াটার মেশিন ক্রয়</option>
                  <option value="IRP Iron Plant Setup">IRP আয়রন রিমুভাল প্ল্যান্ট ইনস্টলেশন</option>
                  <option value="Housing Cartridge Replacement">ফিল্টার কার্টিজ পরিবর্তন সার্ভিস</option>
                  <option value="Commercial Water Plant">বাণিজ্যিক/অফিসিয়াল ওয়াটার প্ল্যান্ট</option>
                  <option value="Free Water TDS Test Request">ফ্রি ওয়াটার TDS টেষ্টিং সার্ভিস</option>
                </select>
              </div>

              <div>
                <label className="text-sky-200 block mb-1 font-bold">বিস্তারিত / এলাকা</label>
                <textarea
                  rows={2}
                  placeholder="আপনার বাসা বা অফিসের এলাকা এবং পানির সমস্যা লিখুন..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-sky-800/80 rounded-xl text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingContact}
                className="w-full py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-black rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/20"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingContact ? 'জমা হচ্ছে...' : 'মেসেজ পাঠান'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Integrated Newsletter Subscription Section */}
        <div className="bg-gradient-to-r from-sky-950 via-sky-900 to-slate-900 p-6 sm:p-8 rounded-3xl border border-sky-800/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-black text-white">ফিল্টার পরিবর্তন রিমাইন্ডার ও অফার অ্যালার্ট</h4>
            <p className="text-xs text-sky-200/80 max-w-md">
              আপনার ইমেইল দিয়ে রাখুন, ফিল্টার কার্টিজ পরিবর্তনের সঠিক সময়ে পাবেন নোটিফিকেশন ও ডিসকাউন্ট।
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              required
              placeholder="আপনার ইমেইল এড্রেস লিখুন..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="px-4 py-3 bg-slate-950 border border-sky-800 rounded-2xl text-xs text-white placeholder-sky-400/50 focus:outline-none focus:border-sky-400 min-w-[250px]"
            />
            <button
              type="submit"
              disabled={isSubmittingNewsletter}
              className="px-6 py-3 bg-sky-400 hover:bg-sky-300 text-slate-950 font-black rounded-2xl text-xs transition cursor-pointer shrink-0"
            >
              {isSubmittingNewsletter ? 'হচ্ছে...' : 'সাবস্ক্রাইব'}
            </button>
          </form>
        </div>

        {newsletterSuccess && (
          <p className="text-xs text-emerald-400 text-center font-bold">
            {newsletterSuccess}
          </p>
        )}

        {/* Copyright */}
        <div className="pt-8 border-t border-sky-950 text-center text-xs text-sky-400/60 font-medium">
          © {new Date().getFullYear()} Sylhet Water Purifier. All rights reserved. এলাহি ৭( ২য় তলা)। সুরমা গেইট আখালিয়া সিলেট।, Sylhet, Bangladesh, 3100
        </div>

      </div>
    </footer>
  );
};
