import React, { useState } from 'react';
import { Sparkles, Droplets, CheckCircle2, ArrowRight } from 'lucide-react';
import { WaterProblemInput, AIRecommendationResult, Product } from '../types';

interface WaterAIAdvisorProps {
  onAddToCart: (product: Product, setupIncluded: boolean) => void;
}

export const WaterAIAdvisor: React.FC<WaterAIAdvisorProps> = ({ onAddToCart }) => {
  const [waterSource, setWaterSource] = useState<WaterProblemInput['waterSource']>('Deep Tube Well');
  const [visibleIssue, setVisibleIssue] = useState<WaterProblemInput['visibleIssue']>('High Iron (Red/Rusty Water)');
  const [tdsPpm, setTdsPpm] = useState<number>(450);
  const [familyMembers, setFamilyMembers] = useState<number>(5);
  const [budgetPreference, setBudgetPreference] = useState<WaterProblemInput['budgetPreference']>('Moderate');
  const [installationType, setInstallationType] = useState<WaterProblemInput['installationType']>('Home (Kitchen / Bathroom)');

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendationResult | null>(null);

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: WaterProblemInput = {
        waterSource,
        visibleIssue,
        tdsPpm,
        familyMembers,
        budgetPreference,
        installationType
      };

      const res = await fetch('/api/ai/water-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      setRecommendation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-advisor-section" className="py-14 bg-gradient-to-b from-sky-100/60 via-sky-50 to-white px-4 sm:px-6 lg:px-8 border-y border-sky-200/80">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-800 border border-sky-300 px-4 py-1.5 rounded-full text-xs font-black">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>স্মার্ট এআই ওয়াটার ফিল্টার এডভাইজর</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-sky-950 tracking-tight">
            আপনার খাবার ও ব্যবহারের পানির জন্য কোনটি প্রয়োজন?
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            আপনার পানির প্রধান সমস্যা (যেমন: লাল আয়রন, নোনতা পানি, ওয়াসার গন্ধ) এবং পরিবারের সদস্য সংখ্যা নির্বাচন করুন। আমাদের এআই সিস্টেম আপনার বাজেটের মধ্যে সেরা ফিল্টার ও আইআরপি প্ল্যান্ট পরামর্শ দেবে!
          </p>
        </div>

        {/* Input Form & Output Display */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Form */}
          <form onSubmit={handleConsult} className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-sky-200/90 shadow-xl shadow-sky-500/5 space-y-4">
            
            <div>
              <label className="text-xs font-black text-slate-900 block mb-1.5">পানির উৎস (Water Source)</label>
              <select
                value={waterSource}
                onChange={(e: any) => setWaterSource(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="Deep Tube Well">গভীর নলকূপ / ডিপ টিউবওয়েল (Deep Tube Well)</option>
                <option value="Tap / WASA">ওয়াসা সাপ্লাই পানি (Tap / WASA Supply Line)</option>
                <option value="Submersible Pump">সাবমার্সিবল পাম্প (Submersible Pump)</option>
                <option value="Pond / Surface Water">পুকুর / নদী / রিভার সাপ্লাই (Pond Water)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-black text-slate-900 block mb-1.5">পানির প্রধান দৃশ্যমান সমস্যা</label>
              <select
                value={visibleIssue}
                onChange={(e: any) => setVisibleIssue(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="High Iron (Red/Rusty Water)">অতিরিক্ত লাল আয়রন ও বালতিতে লাল দাগ (High Iron)</option>
                <option value="High TDS / Salty Water">নোনতা ও ভারী খনিজ পানি (High TDS / Salty Water)</option>
                <option value="Bad Odor / Chlorine">বাজে গন্ধ, ক্লোরিন ও স্বাদহীন পানি (Bad Odor)</option>
                <option value="Muddy / Turbid Water">ঘোলা ও কাদা পানি (Muddy Water)</option>
                <option value="Hard Water Scale">পায়খানার পাইপে সাদা খনিজ স্তুপ (Hard Water)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-900 block mb-1.5">আনুমানিক TDS (PPM)</label>
                <input
                  type="number"
                  min={10}
                  max={2500}
                  value={tdsPpm}
                  onChange={(e) => setTdsPpm(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1.5">পরিবারের সদস্য সংখ্যা</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={familyMembers}
                  onChange={(e) => setFamilyMembers(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-black text-slate-900 block mb-1.5">বাজেটের ধরন</label>
                <select
                  value={budgetPreference}
                  onChange={(e: any) => setBudgetPreference(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Economy">সাশ্রয়ী / ইকোনমি (Economy)</option>
                  <option value="Moderate">স্ট্যান্ডার্ড / মাঝারি (Standard)</option>
                  <option value="High Performance">প্রিমিয়াম / সেরা মান (Premium)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black text-slate-900 block mb-1.5">ইনস্টলেশন স্থান</label>
                <select
                  value={installationType}
                  onChange={(e: any) => setInstallationType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-sky-50/50 border border-sky-200 rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Home (Kitchen / Bathroom)">বাসা / কিচেন (Home Kitchen)</option>
                  <option value="Whole House / Building">পুরো বাসা / ছাদের ট্যাংকে (Whole House Tank)</option>
                  <option value="Office / Commercial Facility">অফিস / বাণিজ্যিক প্রতিষ্ঠান</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-sky-950 hover:bg-slate-900 text-white font-black rounded-2xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-950/20"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>{loading ? 'পানি বিশ্লেষণ করা হচ্ছে...' : 'তাত্ক্ষণিক সমাধান দেখুন'}</span>
            </button>
          </form>

          {/* AI Result Card */}
          <div className="lg:col-span-6">
            {recommendation ? (
              <div className="bg-gradient-to-br from-sky-950 via-sky-900 to-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-sky-400/40 shadow-2xl space-y-4 animate-in fade-in duration-300">
                <div className="inline-flex items-center gap-1.5 bg-sky-500/20 text-sky-200 px-3.5 py-1 rounded-full text-xs font-black border border-sky-400/30">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> আপনার পানির জন্য সুপারিশকৃত প্যাকেজ
                </div>

                <h3 className="text-xl font-black text-white leading-snug">
                  {recommendation.recommendedSystem}
                </h3>

                <div className="p-4 bg-sky-900/60 rounded-2xl backdrop-blur-md border border-sky-700/50 space-y-1.5 text-xs text-sky-100">
                  <p className="font-bold text-sky-300">প্রত্যাশিত ফলাফল (Water Quality Result):</p>
                  <p>{recommendation.expectedTdsReduction}</p>
                </div>

                <div className="text-xs space-y-2 text-sky-200/90">
                  <p className="font-bold text-white">কেন এই সিস্টেম আপনার জন্য সেরা:</p>
                  <p className="leading-relaxed bg-slate-950/50 p-4 rounded-2xl border border-sky-800/60 font-normal">
                    {recommendation.whyThisChoice}
                  </p>
                </div>

                {/* Estimated Budget & Products */}
                <div className="pt-4 border-t border-sky-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-sky-300/70 block">আনুমানিক প্রোডাক্ট ও ফিটিং খরচ</span>
                    <span className="text-2xl font-black text-white">
                      ৳ {(recommendation.estimatedPrice + recommendation.estimatedSetup).toLocaleString()}
                    </span>
                  </div>

                  {recommendation.recommendedProducts && recommendation.recommendedProducts.length > 0 && (
                    <button
                      onClick={() => onAddToCart(recommendation.recommendedProducts[0], true)}
                      className="px-5 py-3 bg-gradient-to-r from-sky-400 to-cyan-300 hover:from-sky-300 hover:to-cyan-200 text-slate-950 font-black rounded-2xl text-xs transition cursor-pointer shadow-lg shadow-sky-500/20 flex items-center gap-2"
                    >
                      <span>অর্ডার করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-sky-200/80 text-center space-y-3.5 shadow-sm">
                <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto border border-sky-100">
                  <Droplets className="w-7 h-7" />
                </div>
                <h3 className="font-black text-slate-900 text-base">আপনার পানির তথ্য সিলেক্ট করুন</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  বামপাশের ফর্মে তথ্যগুলো দিয়ে 'তাত্ক্ষণিক সমাধান দেখুন' বাটনে ক্লিক করলে আপনার পানির সুনির্দিষ্ট ফিল্টার ও কার্টিজ প্যাকেজ দেখতে পাবেন।
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
