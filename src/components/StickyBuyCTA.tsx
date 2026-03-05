"use client";

import { useEffect, useState } from "react";

interface Props {
  productName: string;
  price: string;
  amazonUrl: string;
}

export default function StickyBuyCTA({ productName, price, amazonUrl }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 600px (past the winner card)
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-sticky-bar">
      <div className="bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-gray-900 truncate">{productName}</div>
            <div className="text-xs text-gray-500">Mejor opcion &middot; {price}</div>
          </div>
          <a
            href={amazonUrl}
            target="_blank"
            rel="nofollow noopener sponsored"
            className="shrink-0 bg-amber-400 hover:bg-amber-500 text-black font-bold px-6 py-2.5 rounded-lg transition text-sm shadow-sm"
          >
            Ver en Amazon
          </a>
        </div>
      </div>
    </div>
  );
}
