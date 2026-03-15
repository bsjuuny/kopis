"use client";

import { useFavorites } from "@/hooks/useFavorites";
import PerformanceCard from "@/components/PerformanceCard";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] font-bold hover:text-[var(--accent-primary)] transition-colors"
          aria-label="목록으로 돌아가기"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">목록으로</span>
        </Link>

        <div className="flex items-center gap-2 flex-1">
          <Heart size={20} className="text-rose-500 fill-rose-500" aria-hidden="true" />
          <h1 className="text-2xl font-black tracking-tight text-[var(--text-primary)]">내 찜 목록</h1>
        </div>

        <span className="text-sm font-bold px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
          {favorites.length}개
        </span>
      </div>

      {/* 빈 상태 */}
      {favorites.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-40 gap-6 text-center"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed border-[var(--border-color)]"
          >
            <Heart size={36} className="opacity-20" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xl font-black mb-2 text-[var(--text-primary)]">아직 찜한 공연이 없어요</p>
            <p className="text-sm text-[var(--text-secondary)]">
              공연 카드의 하트 버튼을 눌러 찜해보세요
            </p>
          </div>
          <Link
            href="/"
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold text-sm hover:opacity-90 transition-opacity"
          >
            공연 둘러보기
          </Link>
        </motion.div>
      )}

      {/* 찜 목록 그리드 */}
      {favorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-8">
          <AnimatePresence>
            {favorites.map((perf, idx) => (
              <motion.div
                key={perf.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
              >
                <PerformanceCard performance={perf} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
