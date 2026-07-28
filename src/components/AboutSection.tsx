import React from 'react';
import { ShieldCheck, Award, Users, Wrench, Droplet, MapPin, PhoneCall } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-16 bg-white px-4 sm:px-6 lg:px-8 border-t border-sky-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          
          {/* Visual Showcase Box */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-sky-500/10 border border-sky-200 aspect-4/3 relative">
              <img
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
                alt="Sylhet Water Purifier Technicians"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-950/85 via-sky-950/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-sky-100 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
                    ৮+
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">সিলেটে ৮+ বছরের সুনাম ও অভিজ্ঞতা</h4>
                    <p className="text-xs text-slate-500">৩,৫০০+ বাসাবাড়ি ও প্রতিষ্ঠানে RO ফিল্টার ইনস্টলড</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-900 px-3.5 py-1.5 rounded-full text-xs font-black border border-sky-200">
              <Droplet className="w-4 h-4 text-sky-600 fill-sky-600/20" />
              <span>Sylhet Water Purifier সম্পর্কে</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              সিলেটের সুপেয়, আয়রনমুক্ত ও ১০০% জীবাণুমুক্ত নিরাপদ খাবার পানি সরবরাহে আমরা প্রতিশ্রুতিবদ্ধ
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              'সিলেট ওয়াটার পিউরিফায়ার' (SWP) দীর্ঘ ৮ বছর ধরে সিলেট বিভাগসহ সারাদেশে অরিজিনাল ওয়াটার ফিল্টার, কার্টিজ এবং আইআরপি প্ল্যান্ট সরবরাহ করে আসছে। সিলেটের বিশেষ কিছু এলাকায় পানিতে প্রচুর লাল আয়রন এবং দুর্গন্ধ থাকে, যা সমাধানের জন্য আমাদের অভিজ্ঞ টেকনিক্যাল টিম সার্বক্ষণিক সেবা দিয়ে থাকে।
            </p>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              রান্নাঘর বা বেসিনের জন্য ৫/৬ স্টেজ রিভার্স অস্মোসিস (RO) ওয়াটার পিউরিফায়ার থেকে শুরু করে মেস, হোটেল, রেস্টুরেন্ট এবং পুরো বিল্ডিং এর প্রধান লাইনের জন্য অটোমেটিক FRP ভেসেল আইআরপি আয়রন রিমুভাল প্ল্যান্ট—সব পাবেন আমাদের শোরুমে।
            </p>

            {/* Grid of Key Advantages */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-slate-900 text-xs">অরিজিনাল ফিল্টার কার্টিজ</h4>
                  <p className="text-[11px] text-slate-500">ফুড-গ্রেড মেমব্রেন ও ১০০% আসল ফিল্টার।</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Wrench className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-slate-900 text-xs">দক্ষ সিলেটের টেকনিশিয়ান</h4>
                  <p className="text-[11px] text-slate-500">দ্রুত হোম ফিটিং ও টিডিএস মিটার টেস্ট।</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-slate-900 text-xs">১ বছরের ফ্রি সার্ভিসিং</h4>
                  <p className="text-[11px] text-slate-500">মোটর ও পার্টসের সম্পূর্ণ ওয়ারেন্টি।</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-slate-900 text-xs">ঠিকানা: সুরমা গেইট আখালিয়া</h4>
                  <p className="text-[11px] text-slate-500">এলাহি ৭( ২য় তলা), সিলেট-৩১০০</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
