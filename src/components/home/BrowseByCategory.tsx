import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, PersonStanding, Sparkles, Shirt, Baby } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: string;
  color: string;
}

const BrowseByCategory: React.FC = () => {

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scrollPos, setScrollPos] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);

  const categories: Category[] = [
    { id: "1", name: "Men", icon: <PersonStanding />, count: "240+ styles", color: "#3b82f6" },
    { id: "2", name: "Women", icon: <Sparkles />, count: "380+ styles", color: "#ec4899" },
    { id: "3", name: "Boys", icon: <Shirt />, count: "120+ styles", color: "#f59e0b" },
    { id: "4", name: "Girls", icon: <Baby />, count: "150+ styles", color: "#8b5cf6" }
  ];

  const scroll = (dir: "left" | "right") => {
    if (!trackRef.current) return;

    const amount = trackRef.current.offsetWidth * 0.7;

    trackRef.current.scrollBy({
      left: dir === "right" ? amount : -amount,
      behavior: "smooth"
    });
  };

  const handleScroll = () => {
    if (trackRef.current) {
      setScrollPos(trackRef.current.scrollLeft);
    }
  };

  const canScrollLeft = scrollPos > 0;

  const canScrollRight = trackRef.current
    ? scrollPos < trackRef.current.scrollWidth - trackRef.current.clientWidth - 4
    : false;

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">

          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-orange-500 uppercase tracking-widest">
              <div className="w-1 h-5 bg-orange-500 rounded-full"></div>
              Categories
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-2">
              Browse By Category
            </h2>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2 bg-gray-100 hover:bg-orange-500 hover:text-white rounded-full transition"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2 bg-gray-100 hover:bg-orange-500 hover:text-white rounded-full transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>

        </div>

        {/* Categories Grid */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {categories.map((cat) => {

            const active = activeId === cat.id || hoveredId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveId(activeId === cat.id ? null : cat.id)}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ borderColor: active ? cat.color : "#f0f0f0" }}
                className={`
                  relative rounded-xl border bg-gray-50 p-8
                  flex flex-col items-center justify-center
                  text-center transition-all duration-300
                  hover:shadow-lg
                  ${active ? "text-white shadow-xl" : "text-gray-800"}
                `}
              >

                {/* Background */}
                {active && (
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: cat.color }}
                  />
                )}

                {/* Icon */}
                <div
                  className="relative z-10 w-14 h-14 flex items-center justify-center rounded-full bg-white mb-4"
                  style={{ color: cat.color }}
                >
                  {cat.icon}
                </div>

                {/* Name */}
                <div className="relative z-10 font-semibold text-lg">
                  {cat.name}
                </div>

                {/* Count */}
                <div className="relative z-10 text-sm opacity-80 mt-1">
                  {cat.count}
                </div>

              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mt-16 border-b border-gray-200"></div>

      </div>
    </section>
  );
};

export default BrowseByCategory;