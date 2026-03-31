"use client";

import Link from "next/link";
import { Theater, Sun, Moon, Heart } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useFavorites } from "@/hooks/useFavorites";

export default function Header() {
  const { theme, toggleTheme, mounted } = useTheme();
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-50 w-full glass shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg">
            <Theater size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter text-[var(--text-primary)]">공연마루</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/favorites"
            aria-label={`찜 목록 (${favorites.length}개)`}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-rose-500/40 transition-colors"
          >
            <Heart size={18} className={favorites.length > 0 ? "fill-rose-500 text-rose-500" : "text-[var(--text-muted)]"} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                {favorites.length > 9 ? "9+" : favorites.length}
              </span>
            )}
          </Link>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-primary)] shadow-sm"
            aria-label={!mounted ? "테마 전환" : theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
          >
            {!mounted ? (
              <div className="w-4 h-4 rounded-full border-2 border-[var(--text-muted)] border-t-transparent animate-spin" />
            ) : theme === "dark" ? (
              <Sun size={18} className="text-amber-400" />
            ) : (
              <Moon size={18} className="text-violet-500" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
