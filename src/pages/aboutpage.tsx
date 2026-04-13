import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Award, Heart, ShieldCheck, Truck, Users, Star, MapPin, Mail, Phone, ShoppingBag, RotateCcw, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, inView } = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(t); }
      else setVal(start);
    }, 20);
    return () => clearInterval(t);
  }, [inView, to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

export default function AboutPage() {
  const navigate = useNavigate();
  const handleShop = () => navigate("/shop");

  const welcome = useInView(0.1);
  const story   = useInView(0.1);
  const values  = useInView(0.1);
  const stats   = useInView(0.2);
  const contact = useInView(0.15);

  const coreValues = [
    { icon: <Heart className="w-6 h-6" />,       title: "Customer First",    desc: "Every decision starts and ends with what's best for our customers." },
    { icon: <ShieldCheck className="w-6 h-6" />,  title: "Quality Assured",   desc: "Every garment passes our 12-point quality check before it reaches you." },
    { icon: <Truck className="w-6 h-6" />,        title: "Fast & Reliable",   desc: "Same-day dispatch with real-time tracking on every order." },
    { icon: <Award className="w-6 h-6" />,        title: "Best Value",        desc: "Premium fashion at prices that respect your budget — always." },
    { icon: <Users className="w-6 h-6" />,        title: "Inclusive Fashion", desc: "Styles for men, women, boys and girls across every age group." },
    { icon: <Star className="w-6 h-6" />,         title: "Community Driven",  desc: "Built on 12,000+ happy customers and counting." },
  ];

  const missionPoints = [
    { icon: <ShoppingBag className="w-5 h-5" />, title: "Diverse Selection",   desc: "High-quality products across every category, curated for every family." },
    { icon: <Zap className="w-5 h-5" />,         title: "Fast Shipping",       desc: "Same-day dispatch with real-time tracking on every single order." },
    { icon: <RotateCcw className="w-5 h-5" />,   title: "Hassle-Free Returns", desc: "Easy, no-questions-asked returns because your satisfaction comes first." },
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        .about-page { font-family:'Plus Jakarta Sans', sans-serif; }
        .font-display { font-family:'Plus Jakarta Sans', sans-serif; }

        .fade-up    { opacity:0; transform:translateY(32px); transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1); }
        .fade-right { opacity:0; transform:translateX(-28px);transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1); }
        .fade-left  { opacity:0; transform:translateX(28px); transition:opacity .9s cubic-bezier(.16,1,.3,1),transform .9s cubic-bezier(.16,1,.3,1); }
        .fade-in    { opacity:0;                             transition:opacity .8s cubic-bezier(.16,1,.3,1); }
        .in         { opacity:1 !important; transform:none !important; }

        .d1{transition-delay:.05s} .d2{transition-delay:.15s} .d3{transition-delay:.25s}
        .d4{transition-delay:.35s} .d5{transition-delay:.45s} .d6{transition-delay:.55s}

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #ea641e 0%, #f59e0b 40%, #ea641e 60%, #ea641e 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        .val-card { transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s; }
        .val-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(234,100,30,0.12); }

        .dot-bg {
          background-image: radial-gradient(circle, rgba(234,100,30,0.07) 1px, transparent 1px);
          background-size: 26px 26px;
        }

        .shop-btn {
          position: relative; overflow: hidden;
          background: #111; color: #fff;
          font-weight: 500; letter-spacing: .03em; font-size: 14px;
          padding: 14px 32px; border-radius: 999px;
          display: inline-flex; align-items: center; gap: 8px;
          border: none; cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }
        .shop-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(234,100,30,0.22); }
        .shop-btn .btn-fill {
          position: absolute; inset: 0;
          background: #ea641e;
          transform: translateY(100%);
          transition: transform .5s cubic-bezier(.16,1,.3,1);
          border-radius: 999px;
        }
        .shop-btn:hover .btn-fill { transform: translateY(0); }
        .shop-btn span, .shop-btn svg { position: relative; z-index: 1; }
        .shop-btn svg { transition: transform .25s; }
        .shop-btn:hover svg { transform: rotate(45deg); }
      `}</style>

      <div className="about-page">

        {/* ══ WELCOME / MISSION ══ */}
        <section ref={welcome.ref} className="py-20 px-4 sm:px-8 bg-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: image */}
            <div className={`fade-right d1 ${welcome.inView ? "in" : ""} relative`}>
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-2xl bg-orange-100 opacity-60 z-0" />
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-orange-100 border border-orange-50 aspect-[4/3]">
                <img src="https://res.cloudinary.com/dquki4xol/image/upload/v1775912499/mall-ka-baap-deshbandhunagar-kolkata-shopping-mall-display-system-dealers-71yxyjc8fl-250_rv9gi5.avif" alt="Fashion store" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-orange-50 opacity-80 z-0" />
            </div>

            {/* Right: text */}
            <div className="space-y-8">
              <div className={`fade-up d1 ${welcome.inView ? "in" : ""}`}>
                <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-500 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full">
                  Welcome
                </span>
              </div>

              <div className={`fade-up d2 ${welcome.inView ? "in" : ""}`}>
                <h2 className="font-display font-extrabold text-[#111] leading-tight" style={{ fontSize: "clamp(1.9rem,4vw,3rem)" }}>
                  Welcome to<br /><span className="shimmer-text">Mall Ka Baap</span>
                </h2>
              </div>

              <div className={`fade-up d3 ${welcome.inView ? "in" : ""}`}>
                <p className="text-gray-500 leading-relaxed" style={{ fontSize: "clamp(14px,1.4vw,16px)" }}>
                  We're passionate about providing you with a seamless online shopping experience.
                  From our story to our mission and our unwavering commitment to customer satisfaction —
                  everything we do is built around <em>you</em>.
                </p>
              </div>

              <div className={`fade-up d3 ${welcome.inView ? "in" : ""}`}>
                <h3 className="font-display font-bold text-[#111] text-xl mb-4">Our Mission</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Our mission is to offer a diverse selection of high-quality products at competitive prices.
                  We strive to exceed customer expectations by delivering an outstanding shopping experience every time.
                </p>
              </div>

              <div className={`fade-up d4 ${welcome.inView ? "in" : ""} space-y-4`}>
                {missionPoints.map((mp, i) => (
                  <div key={mp.title} className="flex items-start gap-4" style={{ transitionDelay: `${i * 0.1}s` }}>
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-orange-200">
                      {mp.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-[#111] text-sm mb-0.5">{mp.title}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{mp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ OUR STORY ══ */}
        <section ref={story.ref} className="py-20 px-4 sm:px-8 bg-[#fff7f3]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: text */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className={`fade-right d1 ${story.inView ? "in" : ""}`}>
                <span className="inline-flex items-center gap-2 bg-white border border-orange-200 text-orange-500 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full shadow-sm">
                  Our Story
                </span>
              </div>

              <div className={`fade-right d2 ${story.inView ? "in" : ""}`}>
                <h2 className="font-display font-extrabold text-[#111] leading-tight" style={{ fontSize: "clamp(1.9rem,4vw,3rem)" }}>
                  How It All<br /><span className="shimmer-text">Began</span>
                </h2>
              </div>

              <div className={`fade-right d3 ${story.inView ? "in" : ""}`}>
                <p className="text-gray-500 leading-relaxed" style={{ fontSize: "clamp(14px,1.4vw,16px)" }}>
                  Mall Ka Baap started with a simple vision: to make shopping convenient, enjoyable,
                  and accessible to everyone. What began as a small venture has now grown into a thriving
                  online marketplace, serving customers across 18+ states in India.
                </p>
              </div>

              <div className={`fade-right d4 ${story.inView ? "in" : ""} bg-white rounded-2xl p-6 border border-orange-100 shadow-sm`}>
                <p className="text-gray-500 text-sm leading-relaxed italic">
                  "We started small, with a big dream. Today, every package we ship carries that same
                  original promise — fashion that's for everyone, not just a few."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md shadow-orange-200">
                    <span className="text-white font-bold text-sm">AA</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#111] text-sm">Ankit Agarwal</p>
                    <p className="text-orange-400 text-xs">Founder & CEO</p>
                  </div>
                </div>
              </div>

              <div className={`fade-right d5 ${story.inView ? "in" : ""}`}>
                <button className="shop-btn" onClick={handleShop}>
                  <div className="btn-fill" />
                  <span>Shop Now</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>

            {/* Right: image collage */}
            <div className={`fade-left d2 ${story.inView ? "in" : ""} order-1 lg:order-2`}>
              <div className="relative h-[420px]">
                <div className="absolute top-0 right-0 w-[55%] h-[85%] rounded-3xl overflow-hidden border border-orange-100 shadow-xl">
                  <img src="https://res.cloudinary.com/dquki4xol/image/upload/v1775912499/mall-ka-baap-deshbandhunagar-kolkata-shopping-mall-display-system-dealers-71yxyjc8fl-250_rv9gi5.avif" alt="Fashion store" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 left-0 w-[60%] h-[80%] rounded-3xl overflow-hidden border border-orange-50 shadow-2xl shadow-orange-100 z-10">
                  <img src="https://res.cloudinary.com/dquki4xol/image/upload/v1775910600/girl-friends-shopping-clothes-store-picture-143749390_cyu9tc.webp" alt="Happy customers" className="w-full h-full object-cover" />
                </div>
                {/* Floating stat badge */}
                <div className="absolute bottom-8 right-4 z-20 bg-white rounded-2xl px-5 py-3 shadow-xl shadow-orange-100 border border-orange-50">
                  <div className="font-display font-extrabold text-[#111] text-2xl leading-none">
                    <Counter to={12000} suffix="+" />
                  </div>
                  <div className="text-gray-400 text-xs mt-1 tracking-wide">Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ STATS ══ */}
        <section ref={stats.ref} className="bg-[#111] py-16 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { to: 12000, suffix: "+", label: "Happy Customers" },
              { to: 50,    suffix: "+", label: "Brands" },
              { to: 380,   suffix: "+", label: "Styles" },
              { to: 18,    suffix: "+", label: "States Served" },
            ].map((s, i) => (
              <div key={s.label} className={`fade-up d${i + 1} ${stats.inView ? "in" : ""}`}>
                <div className="font-display font-extrabold text-white mb-1" style={{ fontSize: "clamp(2rem,5vw,3rem)" }}>
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-gray-400 text-xs tracking-widest uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ VALUES ══ */}
        <section ref={values.ref} className="py-20 px-4 sm:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className={`fade-up d1 ${values.inView ? "in" : ""} text-center mb-14`}>
              <p className="text-orange-500 text-xs font-semibold tracking-widest uppercase mb-3">What We Stand For</p>
              <h2 className="font-display font-extrabold text-[#111]" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>
                Our Core Values
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((v, i) => (
                <div
                  key={v.title}
                  className={`fade-up d${(i % 6) + 1} ${values.inView ? "in" : ""} val-card bg-[#fff7f3] rounded-2xl p-7 border border-orange-100`}
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center text-white mb-5 shadow-md shadow-orange-200">
                    {v.icon}
                  </div>
                  <h3 className="font-display font-bold text-[#111] text-base mb-2">{v.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CONTACT ══ */}
        <section id="contact" ref={contact.ref} className="py-20 px-4 sm:px-8 bg-[#fff7f3]">
          <div className="max-w-4xl mx-auto">
            <div className={`fade-up d1 ${contact.inView ? "in" : ""} text-center mb-14`}>
              <p className="text-orange-500 text-xs font-semibold tracking-widest uppercase mb-3">Get In Touch</p>
              <h2 className="font-display font-extrabold text-[#111]" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>
                We'd Love to Hear From You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <MapPin className="w-5 h-5" />,  label: "Visit Us",  value: "EB 20, Shop No 2 & 3, Near Baguiati AC Market, Vip Road, Deshbandhunagar, Kolkata-700059, West Bengal" },
                { icon: <Mail className="w-5 h-5" />,    label: "Email Us",  value: "agarwal.ankit0193@gmail.com" },
                { icon: <Phone className="w-5 h-5" />,   label: "Call Us",   value: "07942700870" },
              ].map((c, i) => (
                <div
                  key={c.label}
                  className={`fade-up d${i + 1} ${contact.inView ? "in" : ""} val-card bg-white rounded-2xl p-7 border border-orange-100 text-center`}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-orange-200">
                    {c.icon}
                  </div>
                  <div className="text-xs text-gray-400 tracking-widest uppercase mb-2">{c.label}</div>
                  <div className="font-semibold text-[#111] text-sm">{c.value}</div>
                </div>
              ))}
            </div>

            <div className={`fade-up d4 ${contact.inView ? "in" : ""} mt-12 text-center`}>
              <button className="shop-btn" onClick={handleShop}>
                <div className="btn-fill" />
                <span>Shop the Collection</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}