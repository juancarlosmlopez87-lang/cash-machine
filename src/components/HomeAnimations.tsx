"use client";

import { useEffect, useRef, useState } from "react";

// ─── Animated Counter (counts up when visible) ───
export function AnimatedCounter({ end, suffix = "" }: { end: number | string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const numericEnd = typeof end === "number" ? end : parseInt(end.toString(), 10);
          if (isNaN(numericEnd)) {
            setDisplay(String(end));
            return;
          }
          const duration = 1800;
          const startTime = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * numericEnd).toLocaleString("es-ES"));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

// ─── Scroll Reveal Observer (activates .scroll-reveal elements) ───
export function ScrollRevealInit() {
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}

// ─── Pulsing "Actualizado hoy" badge ───
export function UpdatedBadge() {
  return (
    <div className="inline-flex items-center gap-2 animate-pulse-badge bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold px-3 py-1 rounded-full mt-4">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      Actualizado hoy
    </div>
  );
}
