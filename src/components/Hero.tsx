import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Droplet, 
  Wrench, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Award, 
  Gauge,
  PhoneCall,
  Star,
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SWPLogo } from './SWPLogo';

interface HeroProps {
  onSelectCategory: (cat: string) => void;
  onOpenAIAdvisor: () => void;
  onScrollToPortfolio: () => void;
}

const heroSlides = [
  {
    url: "https://scontent.fdac80-1.fna.fbcdn.net/v/t39.30808-6/481900266_122253388772008433_24887613061947377_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1220&ctp=s2048x1220&_nc_cat=108&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeFCuj8Pb46wKIo5lXa5Amyksmfpxanc-CGyZ-nFqdz4IaqHIyOuSmLDWkJ0FbG7Ptrp6Pi1RLvUskEz635Wi4Mt&_nc_ohc=omUH2_rwqV4Q7kNvwE8ILMI&_nc_oc=Adpl42Q2BonK-KFU3y_7HR9Ku3G3iOWO846v7k6KMihYchv25eVbmmD7mpHyrqr_Odg&_nc_zt=23&_nc_ht=scontent.fdac80-1.fna&_nc_gid=Qy3Ms4ETEa7jdAAEHNR3xg&_nc_ss=7b2a8&oh=00_AQAqMT0FdnjMF6biEhk5sKO9GOgtkUcR-nnb-LfyJUkE-Q&oe=6A6E517B",
    title: "সিলেটে ১ নম্বর বিশ্বস্ত ওয়াটার পিউরিফায়ার শপ",
    badge: "TDS Level: 18 PPM (Pure)"
  },
  {
    url: "https://scontent.fdac80-1.fna.fbcdn.net/v/t39.30808-6/529018914_122285088818008433_6669093263896142990_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1536&ctp=s2048x1536&_nc_cat=109&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeEJjegRwOx0wibOFqCJUiozNkChweWXROE2QKHB5ZdE4Qxw0vwRpo_n5kR-n6yMb1z2OixBDNGbUUcEyzSSkwMz&_nc_ohc=pXfWZggyyF4Q7kNvwE6SRGN&_nc_oc=Adogo3wnOiJAISB33nC6N2eeA4NGIXWwwr0Hz8zFxcIv-CFjHZymYyoEwV-jnXiXYyU&_nc_zt=23&_nc_ht=scontent.fdac80-1.fna&_nc_gid=0BN6OIdeCK29qCv2-legnw&_nc_ss=7b2a8&oh=00_AQBzNgt5gHPGe_Bu0z9fAmrDKMkA-aFq73_oxUuEsYohCw&oe=6A6E7CBC",
    title: "আয়রন রিমুভাল ও RO ফিল্টার ইনস্টলেশন",
    badge: "১০০% আয়রনমুক্ত ওয়াটার"
  }
];

export const Hero: React.FC<HeroProps> = ({
  onSelectCategory,
  onOpenAIAdvisor,
  onScrollToPortfolio
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div 
      className="relative overflow-hidden bg-slate-900 text-slate-900 pt-8 pb-16 lg:pt-12 lg:pb-20 px-4 sm:px-6 lg:px-8 border-b border-cyan-100/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Slideshow Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-35 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={slide.url}
              alt={slide.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}

        {/* Soft Modern Light Gradient Mask for Maximum Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-50/80 via-transparent to-white" />
      </div>

      {/* Crystalline Water Ambient Background Lights */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-300/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 left-[-100px] w-[500px] h-[500px] bg-sky-300/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[350px] h-[350px] bg-blue-300/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* LEFT: Main Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-white/90 border border-cyan-200/90 text-cyan-900 px-4 py-1.5 rounded-full text-xs font-black shadow-xs backdrop-blur-md">
              <Award className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>Your Trusted Source for Clean and Pure Water!</span>
            </div>

            {/* Brand Logo & Headline */}
            <div>
              <div className="mb-4">
                <SWPLogo size="lg" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-slate-900">
                বাসাবাড়ি, অফিস ও আইআরপি আয়রন রিমুভাল প্ল্যান্টের সবচেয়ে বিশ্বস্ত ফিল্টার সলিউশন
              </h1>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              হাউজিং ফিল্টার কার্টিজ, ৫ ও ৬ স্টেজ RO মিনারেল ওয়াটার পিউরিফায়ার, ইলেকট্রিক UV এবং হাই-ক্যাপাসিটি FRP আয়রন রিমুভাল প্ল্যান্ট। ১০০% গ্যারান্টিসহ TDS ও লাল আয়রনমুক্ত সচ্ছ বিশুদ্ধ খাবার পানির নিশ্চয়তা।
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3.5 pt-2">
              <button
                onClick={onOpenAIAdvisor}
                className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-cyan-500/25 text-sm flex items-center gap-2.5 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-4.5 h-4.5 text-cyan-200 fill-cyan-200/20" />
                <span>আমার পানির জন্য ফিল্টার সিলেক্ট করুন (AI)</span>
              </button>

              <button
                onClick={onScrollToPortfolio}
                className="bg-white hover:bg-cyan-50/80 border border-cyan-200 text-slate-800 font-extrabold px-6 py-3.5 rounded-2xl text-sm flex items-center gap-2 transition cursor-pointer shadow-xs"
              >
                <span>সিলেটে সম্পন্ন প্রজেক্ট গ্যালারি</span>
                <ArrowRight className="w-4 h-4 text-cyan-600" />
              </button>
            </div>

            {/* Key Service Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-cyan-100/90">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-slate-900">১০০% আসল পার্টস</p>
                  <p className="text-[11px] text-slate-500">অরিজিনাল মেমব্রেন</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Gauge className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-slate-900">ফ্রি TDS ওয়াটার টেস্ট</p>
                  <p className="text-[11px] text-slate-500">ফিটিং এর পূর্বে ও পরে</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Wrench className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-slate-900">দক্ষ টেকনিশিয়ান</p>
                  <p className="text-[11px] text-slate-500">সিলেট বিভাগে হোম সার্ভিস</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-slate-900">১ বছরের সার্ভিস</p>
                  <p className="text-[11px] text-slate-500">ওয়ারেন্টি সাপোর্ট</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: Interactive Slideshow Showcase Card */}
          <div className="lg:col-span-5 relative">
            
            {/* Main Showcase Container */}
            <div className="relative bg-gradient-to-br from-white via-cyan-50/60 to-sky-100/40 p-4 sm:p-5 rounded-3xl border border-cyan-200/80 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl space-y-4">
              
              {/* Image Frame Slideshow */}
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 group border border-cyan-200/80 shadow-inner bg-slate-950">
                
                {/* Images Layer */}
                {heroSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                    }`}
                  >
                    <img
                      src={slide.url}
                      alt={slide.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Top Badge on Image */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-cyan-200 text-slate-900 font-black text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                  <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  <span>{heroSlides[currentSlide].badge}</span>
                </div>

                {/* Slide Nav Arrows */}
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/50 hover:bg-slate-950/80 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer backdrop-blur-xs"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/50 hover:bg-slate-950/80 border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer backdrop-blur-xs"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Bottom Overlay Info & Slide Indicator */}
                <div className="absolute bottom-3 left-3 right-3 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-cyan-300 tracking-wider block">
                        {heroSlides[currentSlide].title}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black text-white">সুরমা গেইট আখালিয়া, সিলেট</h4>
                    </div>

                    <a
                      href="tel:01886587395"
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-md transition shrink-0"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>01886-587395</span>
                    </a>
                  </div>

                  {/* Slide Dots */}
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    {heroSlides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === currentSlide ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

              </div>

              {/* Stats Floating Banner */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/90 p-3 rounded-2xl border border-cyan-200/80 flex items-center gap-3 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">৩,৫০০+ পরিবার</span>
                    <span className="text-[10px] text-slate-500">সিলেটে সফল সার্ভিস</span>
                  </div>
                </div>

                <div className="bg-white/90 p-3 rounded-2xl border border-cyan-200/80 flex items-center gap-3 shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Droplet className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">১০০% আয়রনমুক্ত</span>
                    <span className="text-[10px] text-slate-500">গ্যারান্টিযুক্ত ওয়াটার</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Quick Category Pills Showcase Grid */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-600" />
              <span>জনপ্রিয় ওয়াটার পিউরিফায়ার ক্যাটাগরি বেছে নিন:</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div 
              onClick={() => onSelectCategory('housing_cartridge')}
              className="group bg-white hover:bg-cyan-50/80 border border-cyan-200/80 hover:border-cyan-400 rounded-3xl p-4 transition-all shadow-xs hover:shadow-md cursor-pointer relative overflow-hidden"
            >
              <div className="w-9 h-9 rounded-2xl bg-cyan-100 text-cyan-700 border border-cyan-200 flex items-center justify-center mb-2.5 group-hover:scale-110 transition">
                <Droplet className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-black uppercase text-cyan-700 tracking-wider">Cartridges</span>
              <h4 className="text-sm font-black text-slate-900 group-hover:text-cyan-700 transition">ফিল্টার কার্টিজ</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">PP, CTO, RO মেমব্রেন ৳১৮০ থেকে</p>
            </div>

            <div 
              onClick={() => onSelectCategory('ro_machine')}
              className="group bg-white hover:bg-cyan-50/80 border border-cyan-200/80 hover:border-cyan-400 rounded-3xl p-4 transition-all shadow-xs hover:shadow-md cursor-pointer relative overflow-hidden"
            >
              <div className="w-9 h-9 rounded-2xl bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center mb-2.5 group-hover:scale-110 transition">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-black uppercase text-sky-700 tracking-wider">RO Purifiers</span>
              <h4 className="text-sm font-black text-slate-900 group-hover:text-cyan-700 transition">RO ফিল্টার মেশিন</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">৫ ও ৬ স্টেজ মিনারেল ৳৯,৮০০ থেকে</p>
            </div>

            <div 
              onClick={() => onSelectCategory('irp_plant')}
              className="group bg-white hover:bg-cyan-50/80 border border-cyan-200/80 hover:border-cyan-400 rounded-3xl p-4 transition-all shadow-xs hover:shadow-md cursor-pointer relative overflow-hidden"
            >
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-2.5 group-hover:scale-110 transition">
                <Wrench className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">Iron Removal</span>
              <h4 className="text-sm font-black text-slate-900 group-hover:text-cyan-700 transition">IRP আয়রন প্ল্যান্ট</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">FRP অটো ব্যাকওয়াশ ৳২৪,৫০০ থেকে</p>
            </div>

            <div 
              onClick={() => onSelectCategory('electric_purifier')}
              className="group bg-white hover:bg-cyan-50/80 border border-cyan-200/80 hover:border-cyan-400 rounded-3xl p-4 transition-all shadow-xs hover:shadow-md cursor-pointer relative overflow-hidden"
            >
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-2.5 group-hover:scale-110 transition">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">UV & Non-Electric</span>
              <h4 className="text-sm font-black text-slate-900 group-hover:text-cyan-700 transition">ইউভি ও গ্রাভিটি</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">সিরামিক ও UV ফিল্টার ৳৩,২০০ থেকে</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
