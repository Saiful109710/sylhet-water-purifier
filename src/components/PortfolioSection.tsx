import React, { useState } from 'react';
import { Play, Image as ImageIcon, MapPin, Sparkles, X } from 'lucide-react';
import { PortfolioItem } from '../types';

interface PortfolioSectionProps {
  portfolio: PortfolioItem[];
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ portfolio }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [activeMediaModal, setActiveMediaModal] = useState<PortfolioItem | null>(null);

  const categories = ['All', 'RO Setup', 'IRP Plant', 'Home Solution', 'Commercial / Office'];

  const filtered = filterCategory === 'All'
    ? portfolio
    : portfolio.filter(p => p.category === filterCategory || p.category.includes(filterCategory));

  return (
    <section id="portfolio-section" className="py-16 bg-sky-950 text-white relative overflow-hidden border-t border-sky-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-sky-900 border border-sky-700/80 text-sky-200 px-4 py-1.5 rounded-full text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>সিলেটে আমাদের বাস্তব প্রজেক্ট এর গ্যালারি</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            RO মেশিন ও IRP ওয়াটার প্ল্যান্ট <span className="text-sky-400">প্রজেক্ট পোর্টফোলিও</span>
          </h2>

          <p className="text-sky-200/80 text-xs sm:text-sm leading-relaxed font-normal">
            সিলেট বিভাগসহ সারাদেশের বাসাবাড়ি, রেস্টুরেন্ট, হোটেল, মেস ও ফ্যাক্টরিতে আমাদের ফিল্টার ইনস্টলেশন ও আইআরপি আয়রন প্ল্যান্টের ছবি ও ভিডিও ক্লিপ দেখুন।
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-sky-400 text-slate-950 font-black shadow-lg shadow-sky-400/20'
                    : 'bg-sky-900/80 text-sky-200 hover:bg-sky-800 border border-sky-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-sky-900/40 border border-sky-800/60 hover:border-sky-400/80 rounded-3xl overflow-hidden shadow-xl hover:shadow-sky-500/10 transition duration-300 flex flex-col justify-between group"
            >
              {/* Media Thumbnail */}
              <div 
                onClick={() => setActiveMediaModal(item)}
                className="relative aspect-16/9 bg-slate-950 overflow-hidden cursor-pointer group-hover:opacity-95 transition"
              >
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-950/30 to-transparent" />

                {/* Media Type Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-sky-950/90 text-sky-200 text-[11px] font-black px-3 py-1 rounded-full backdrop-blur-md border border-sky-700/60">
                  {item.mediaType === 'video' ? (
                    <>
                      <Play className="w-3.5 h-3.5 text-sky-400 fill-sky-400" /> ভিডিও ডেমো
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3.5 h-3.5 text-sky-400" /> ফটো গ্যালারি
                    </>
                  )}
                </div>

                {/* Center Play Button for Video */}
                {item.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                      <Play className="w-6 h-6 fill-slate-950 ml-1" />
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-sky-100 text-xs font-bold bg-sky-950/80 px-3 py-1 rounded-xl backdrop-blur-md border border-sky-800/80">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>{item.location}</span>
                </div>
              </div>

              {/* Text & Water Quality Specs */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-black text-sky-400 mb-1">
                    <span>{item.category}</span>
                    <span className="text-sky-300/70 font-normal">{item.completedDate}</span>
                  </div>

                  <h3 className="font-extrabold text-white text-base leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sky-200/80 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Before & After Water Test Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sky-800/80 text-xs">
                  {item.beforeTds !== undefined && item.afterTds !== undefined && (
                    <div className="bg-sky-950/80 p-2.5 rounded-2xl border border-sky-800/80">
                      <span className="text-sky-300/80 block text-[10px] uppercase font-bold">TDS কমানোর পরিমাণ</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-rose-400 font-bold">{item.beforeTds} PPM</span>
                        <span className="text-sky-500">➔</span>
                        <span className="text-emerald-400 font-black">{item.afterTds} PPM</span>
                      </div>
                    </div>
                  )}

                  {item.ironBeforePpm !== undefined && item.ironAfterPpm !== undefined && (
                    <div className="bg-sky-950/80 p-2.5 rounded-2xl border border-sky-800/80">
                      <span className="text-sky-300/80 block text-[10px] uppercase font-bold">আয়রন মাত্রা (লাল পানি)</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-rose-400 font-bold">{item.ironBeforePpm} PPM</span>
                        <span className="text-sky-500">➔</span>
                        <span className="text-emerald-400 font-black">{item.ironAfterPpm} PPM</span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setActiveMediaModal(item)}
                  className="w-full py-2.5 bg-sky-800/80 hover:bg-sky-400 hover:text-slate-950 text-white font-black text-xs rounded-2xl transition cursor-pointer flex items-center justify-center gap-2 border border-sky-700/60"
                >
                  <span>প্রজেক্টের ছবি ও বিস্তারিত দেখুন</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Media Detail Modal */}
      {activeMediaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-sky-950 border border-sky-700 rounded-3xl max-w-3xl w-full p-6 relative text-white space-y-4 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveMediaModal(null)}
              className="absolute top-4 right-4 text-sky-200 hover:text-white p-2 rounded-full bg-sky-900 hover:bg-sky-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-black text-sky-300 uppercase tracking-wider bg-sky-900 px-3.5 py-1 rounded-full border border-sky-700">
              {activeMediaModal.category} প্রজেক্ট
            </span>

            <h3 className="text-xl font-black text-white">{activeMediaModal.title}</h3>

            {/* Video Player or Main Photo */}
            <div className="aspect-16/9 rounded-2xl overflow-hidden bg-black border border-sky-800">
              {activeMediaModal.mediaType === 'video' ? (
                <video
                  src={activeMediaModal.mediaUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={activeMediaModal.mediaUrl}
                  alt={activeMediaModal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <p className="text-sky-200/90 text-xs sm:text-sm leading-relaxed">
              {activeMediaModal.description}
            </p>

            <div className="grid grid-cols-2 gap-3 bg-sky-900/60 p-3.5 rounded-2xl text-xs border border-sky-800">
              <div>
                <span className="text-sky-300/70 block font-medium">স্থান:</span>
                <span className="font-bold text-white">{activeMediaModal.location}</span>
              </div>
              <div>
                <span className="text-sky-300/70 block font-medium">গ্রাহকের ধরন:</span>
                <span className="font-bold text-white">{activeMediaModal.clientType}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
