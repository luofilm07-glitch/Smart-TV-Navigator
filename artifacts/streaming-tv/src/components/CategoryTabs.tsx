import { useRef, useEffect } from "react";
import { categories } from "@/data/videos";

interface CategoryTabsProps {
  selected: string;
  onChange: (cat: string) => void;
  focusedIndex?: number;
  onFocus?: (index: number) => void;
}

export function CategoryTabs({ selected, onChange, focusedIndex, onFocus }: CategoryTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusedIndex !== undefined && containerRef.current) {
      const tab = containerRef.current.querySelector(`[data-tab-index="${focusedIndex}"]`) as HTMLElement;
      if (tab) {
        tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }
  }, [focusedIndex]);

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2"
    >
      {categories.map((cat, idx) => (
        <button
          key={cat}
          data-tv-id={`cat-${idx}`}
          data-tab-index={idx}
          tabIndex={0}
          onFocus={() => onFocus?.(idx)}
          onClick={() => onChange(cat)}
          className={`flex-shrink-0 px-3 py-1 rounded-lg text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-red-500 ${
            selected === cat
              ? "bg-white text-black"
              : "bg-[#272727] text-gray-200 hover:bg-[#3a3a3a]"
          } ${focusedIndex === idx ? "ring-2 ring-red-500" : ""}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
