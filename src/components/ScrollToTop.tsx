"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollToTopProps {
  onClick?: () => void;
}

export default function ScrollToTop({ onClick }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    if (onClick) {
      onClick();
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 p-3 sm:p-4 rounded-full transition-all duration-300 transform",
        "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-[var(--border-color)] shadow-2xl shadow-purple-500/20",
        "hover:bg-[var(--accent-primary)] hover:text-white hover:-translate-y-1 hover:scale-110 active:scale-95 group",
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-50 pointer-events-none"
      )}
      aria-label="최상단으로 이동"
    >
      <ArrowUp 
        size={20} 
        className="sm:w-6 sm:h-6 transition-transform duration-300 group-hover:animate-bounce" 
      />
    </button>
  );
}
