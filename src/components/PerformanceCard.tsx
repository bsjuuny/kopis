"use client";

import { KOPISPerformance } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

interface PerformanceCardProps {
  performance: KOPISPerformance;
}

export default function PerformanceCard({ performance }: PerformanceCardProps) {
  const posterUrl = performance.poster.startsWith("http") 
    ? performance.poster 
    : `http://www.kopis.or.kr${performance.poster}`;

  return (
    <Link 
      href={`/performance/detail?id=${performance.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] transition-all hover:shadow-xl dark:hover:shadow-purple-500/10"
      aria-label={`${performance.title} 상세 정보 보기`}
    >
      <article className="h-full flex flex-col">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={posterUrl}
            alt={`${performance.title} 포스터`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-[10px] font-bold rounded-lg backdrop-blur-md border ${
              performance.state === "공연중"
                ? "bg-emerald-500/80 text-white border-emerald-400/50"
                : performance.state === "공연예정"
                ? "bg-amber-500/80 text-white border-amber-400/50"
                : "bg-slate-700/80 text-slate-300 border-slate-600/50"
            }`}>
              {performance.state}
            </span>
          </div>

          <FavoriteButton 
            performance={performance}
            className="absolute top-2 left-2 p-2 rounded-full bg-black/20 backdrop-blur-sm sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          />
        </div>
        
        <div className="flex flex-col p-4 flex-grow">
          <span className="text-[11px] font-bold text-[var(--accent-primary)] uppercase tracking-wider mb-1">
            {performance.genre}
          </span>
          <h3 className="text-[15px] font-bold leading-snug mb-2 line-clamp-2 min-h-[2.75rem] text-[var(--text-primary)]">
            {performance.title}
          </h3>

          <div className="mt-auto space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              <Calendar size={12} className="shrink-0" />
              <span>{performance.startDate} - {performance.endDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
              <MapPin size={12} className="shrink-0" />
              <span className="line-clamp-1">{performance.place}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
