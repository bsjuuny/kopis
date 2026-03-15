"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPerformances } from "@/services/api";
import { useFavorites } from "@/hooks/useFavorites";
import { getPersonalizedRecommendations, getRecommendationReason } from "@/lib/recommendation";
import PerformanceCard from "@/components/PerformanceCard";
import { ChevronLeft, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function RecommendationsPage() {
  const { favorites } = useFavorites();
  
  // 추천을 위한 원본 데이터 확보를 위해 기본 파라미터로 요청
  const { data: performances, isLoading } = useQuery({
    queryKey: ["all-performances-for-rec"],
    queryFn: () => fetchPerformances({
        startDate: new Date().toISOString().slice(0, 10).replace(/-/g, ""),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, ""),
        rows: 100, // 더 넓은 풀에서 추천
        status: "02"
    }),
  });

  const recommendations = performances 
    ? getPersonalizedRecommendations(performances, favorites, 20) 
    : [];

  return (
    <main className="container mx-auto px-4 py-12 max-w-7xl">
      <header className="mb-16">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[var(--accent-primary)] font-bold mb-8 hover:translate-x-[-4px] transition-transform"
        >
          <ChevronLeft size={20} />
          <span>목록으로 돌아가기</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 shadow-sm">
                <Sparkles size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-[var(--accent-primary)]">Personalized AI Curator</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
              당신을 위한 <br />
              <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">맞춤형 공연 추천</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-lg font-medium max-w-2xl leading-relaxed">
              사용자의 찜 목록과 선호 장르를 분석하여 가장 흥미를 가질만한 공연들을 엄선했습니다.
            </p>
          </div>
          
          <div className="glass-card px-8 py-6 rounded-3xl border border-[var(--border-color)] flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">찜한 공연</p>
              <p className="text-2xl font-black text-[var(--accent-primary)]">{favorites.length}</p>
            </div>
            <div className="w-px h-8 bg-[var(--border-color)]" />
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">추천 항목</p>
              <p className="text-2xl font-black">{recommendations.length}</p>
            </div>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-[var(--border-color)] animate-pulse" />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-40 glass-card rounded-[3rem] border border-dashed border-[var(--border-color)]">
          <TrendingUp size={48} className="mx-auto text-[var(--text-muted)] mb-6 opacity-20" />
          <p className="text-xl font-bold text-[var(--text-secondary)] mb-2">아직 추천할 공연이 부족해요</p>
          <p className="text-[var(--text-muted)] mb-8">관심 있는 공연을 찜하면 맞춤 추천이 시작됩니다.</p>
          <Link href="/" className="px-8 py-4 rounded-2xl bg-[var(--accent-primary)] text-white font-black shadow-lg hover:scale-105 active:scale-95 transition-all">
            공연 보러가기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {recommendations.map((perf, index) => (
            <motion.div
              key={perf.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <div className="absolute -top-3 -right-3 z-10 px-3 py-1.5 rounded-xl bg-[var(--accent-primary)] text-white text-[10px] font-black shadow-xl">
                Match #{index + 1}
              </div>
              <PerformanceCard performance={perf} />
              <p className="mt-4 px-2 text-[11px] font-bold text-[var(--accent-primary)] flex items-center gap-1.5">
                <Sparkles size={10} />
                {getRecommendationReason(perf, favorites)}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
