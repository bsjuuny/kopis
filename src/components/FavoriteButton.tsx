"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { KOPISPerformance } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  performance: KOPISPerformance;
  className?: string;
  size?: number;
}

export default function FavoriteButton({ performance, className, size = 20 }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(performance.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(performance);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative flex items-center justify-center transition-all active:scale-90",
        className
      )}
      aria-label={active ? "찜 해제" : "찜하기"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active ? "active" : "inactive"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 20 }}
        >
          <Heart
            size={size}
            className={cn(
              "transition-colors duration-300",
              active 
                ? "fill-rose-500 text-rose-500" 
                : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
            )}
          />
        </motion.div>
      </AnimatePresence>
      
      {active && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 rounded-full bg-rose-500/30 pointer-events-none"
        />
      )}
    </button>
  );
}
