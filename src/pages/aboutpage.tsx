import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Award, Heart, ShieldCheck, Truck, Users, Star, MapPin, Mail, Phone } from "lucide-react";

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
  const hero    = useInView(0.1);
  const values  = useInView(0.1);
  const stats   = useInView(0.2);
  const contact = useInView(0.15);

  const coreValues = [
    { icon: <Heart className="w-6 h-6" />,       title: "Customer First",   desc: "Every decision starts and ends with what's best for our customers." },
    { icon: <ShieldCheck className="w-6 h-6" />,  title: "Quality Assured",  desc: "Every garment passes our 12-point quality check before it reaches you." },
    { icon: <Truck className="w-6 h-6" />,        title: "Fast & Reliable",  desc: "Same-day dispatch with real-time tracking on every order." },
    { icon: <Award className="w-6 h-6" />,        title: "Best Value",       desc: "Premium fashion at prices that respect your budget — always." },
    { icon: <Users className="w-6 h-6" />,        title: "Inclusive Fashion", desc: "Styles for men, women, boys and girls across every age group." },
    { icon: <Star className="w-6 h-6" />,         title: "Community Driven", desc: "Built on 12,000+ happy customers and counting." },
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
      `}</style>

      <div className="about-page">

        {/* ══ HERO ══ */}
        <section className="relative min-h-[92svh] flex items-center overflow-hidden bg-[#fff7f3]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-orange-100 opacity-60 blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-orange-50 opacity-80 blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />
          <div className="dot-bg absolute inset-0 pointer-events-none" />

          <div ref={hero.ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            <div className="space-y-8">
              <div className={`fade-up d1 ${hero.inView ? "in" : ""}`}>
                <span className="inline-flex items-center gap-2 bg-white border border-orange-200 text-orange-500 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  Our Story
                </span>
              </div>

              <div className={`fade-up d2 ${hero.inView ? "in" : ""}`}>
                <h1 className="font-display font-extrabold leading-[1.04] tracking-tight text-[#111]" style={{ fontSize: "clamp(2.6rem,6vw,5rem)" }}>
                  Fashion for<br />
                  <span className="shimmer-text">Every Family.</span><br />
                  Every Budget.
                </h1>
              </div>

              <div className={`fade-up d3 ${hero.inView ? "in" : ""}`}>
                <p className="text-gray-500 leading-relaxed max-w-md" style={{ fontSize: "clamp(14px,1.5vw,16px)" }}>
                  Mall Ka Baap was born from a simple belief — that stylish, high-quality clothing
                  shouldn't be a luxury. We bring India's families the best fashion at prices that make sense.
                </p>
              </div>

              <div className={`fade-up d4 ${hero.inView ? "in" : ""} flex items-center gap-4 flex-wrap`}>
                <button className="group relative overflow-hidden bg-[#111] text-white font-medium tracking-wide text-sm px-8 py-4 rounded-full flex items-center gap-2 transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-200">
                  <span className="relative z-10">Shop Now</span>
                  <ArrowUpRight size={15} className="relative z-10 group-hover:rotate-45 transition-transform" />
                  <span className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-full" />
                </button>
                <a href="#contact" className="text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors flex items-center gap-1">
                  Get in touch <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            {/* Founder card */}
            <div className={`fade-left d3 ${hero.inView ? "in" : ""} flex justify-center lg:justify-end`}>
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-orange-200 scale-105 rotate-2" />
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-orange-100 border border-orange-50 max-w-sm w-full">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-6 shadow-lg shadow-orange-200">
                    <span className="font-display font-bold text-white text-3xl">AA</span>
                  </div>
                  <div className="mb-1">
                    <span className="text-xs font-semibold tracking-widest text-orange-400 uppercase">Founder & CEO</span>
                  </div>
                  <h2 className="font-display font-extrabold text-[#111] text-2xl mb-3 leading-tight">Ankit Agarwal</h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Entrepreneur, fashion enthusiast and the driving force behind Mall Ka Baap's mission to democratize style across India.
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-5 border-t border-gray-100">
                    {[
                      { label: "Years in Business", value: "5+" },
                      { label: "Cities Served",     value: "18+" },
                    ].map(s => (
                      <div key={s.label}>
                        <div className="font-display font-bold text-[#111] text-xl">{s.value}</div>
                        <div className="text-gray-400 text-xs mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 bg-orange-50 rounded-xl px-4 py-3 border-l-2 border-orange-400">
                    <p className="text-xs text-gray-500 italic leading-relaxed">
                      "Style is not a privilege. It's a right for every Indian family."
                    </p>
                    <p className="text-xs font-semibold text-orange-500 mt-1">— Ankit Agarwal</p>
                  </div>
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
                { icon: <MapPin className="w-5 h-5" />,  label: "Visit Us",  value: "Jaipur, Rajasthan, India" },
                { icon: <Mail className="w-5 h-5" />,    label: "Email Us",  value: "hello@mallkabaap.com" },
                { icon: <Phone className="w-5 h-5" />,   label: "Call Us",   value: "+91 98765 43210" },
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
              <button className="group relative overflow-hidden bg-[#111] text-white font-medium tracking-wide text-sm px-10 py-4 rounded-full flex items-center gap-2 mx-auto transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-200">
                <span className="relative z-10">Shop the Collection</span>
                <ArrowUpRight size={15} className="relative z-10 group-hover:rotate-45 transition-transform" />
                <span className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-full" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}