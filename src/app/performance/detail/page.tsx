"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPerformanceDetail } from "@/services/api";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Ticket, Calendar, MapPin, Clock, Users, DollarSign, Info } from "lucide-react";
import Image from "next/image";
import { SanitizedContent } from "@/components/SanitizedContent";
import { ReviewSection } from "@/components/ReviewSection";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

function PerformanceDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();

  const { data: perf, isLoading, error } = useQuery({
    queryKey: ["performance", id],
    queryFn: () => fetchPerformanceDetail(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !perf) {
    return (
      <div className="container py-32 text-center">
        <h2 className="text-3xl font-black mb-4">공연 정보를 찾을 수 없습니다.</h2>
        <button 
          onClick={() => router.back()}
          className="px-6 py-3 rounded-2xl bg-[var(--accent-primary)] text-white font-bold"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  const InfoItem = ({ icon: Icon, label, value, color }: any) => (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
      <div className={cn("p-2 rounded-xl shrink-0", color || "bg-blue-500/10 text-blue-500")}>
        <Icon size={20} aria-hidden="true" />
      </div>
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] mb-0.5">{label}</h4>
        <p className="text-sm font-bold text-[var(--text-primary)]">{value || "정보 없음"}</p>
      </div>
    </div>
  );

  return (
    <main className="relative pb-20">
      {/* Cinematic Background */}
      <div className="absolute top-0 left-0 w-full h-[600px] -z-10 overflow-hidden">
        <Image 
          src={perf.poster} 
          alt="" 
          fill 
          className="object-cover blur-[100px] opacity-30 scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-primary)]" aria-hidden="true" />
      </div>

      <div className="container mx-auto px-4 pt-8 max-w-7xl">
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[var(--text-secondary)] font-bold mb-8 hover:text-[var(--accent-primary)] transition-colors"
          aria-label="공연 목록으로 돌아가기"
        >
          <ArrowLeft size={20} />
          <span>공연 목록으로</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Poster Column */}
          <div className="lg:col-span-4">
            <div 
              className="sticky top-24"
            >
              <div className="relative aspect-[3/4.2] rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-color)]">
                <Image src={perf.poster} alt={`${perf.title} 포스터`} fill className="object-cover" />
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] px-1">예매하기</h2>
                <div className="grid gap-3">
                  {perf.relates.length > 0 ? perf.relates.map((rel, idx) => (
                    <a 
                      key={idx} 
                      href={rel.url} 
                      target="_blank" 
                      className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-all group"
                      aria-label={`${rel.name}에서 예매하기 (새 창)`}
                    >
                      <span className="font-bold text-sm">{rel.name}</span>
                      <Ticket size={18} className="text-[var(--accent-primary)] transition-transform" />
                    </a>
                  )) : (
                    <p className="text-sm text-[var(--text-muted)] px-1 italic">온라인 예매 정보를 찾을 수 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-8 space-y-12">
            <header className="space-y-6">
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[var(--accent-glow)] text-[var(--accent-primary)] border border-[var(--accent-primary)]/20">
                  {perf.genre}
                </span>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                  perf.state === "공연중" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                )}>
                  {perf.state}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                {perf.title}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                    <Calendar size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-[10px] font-black text-indigo-500 tracking-wider uppercase">공연 기간</h2>
                    <p className="font-bold text-lg">{perf.startDate} ~ {perf.endDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    <MapPin size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-[10px] font-black text-rose-500 tracking-wider uppercase">공연 장소</h2>
                    <p className="font-bold text-lg">{perf.place}</p>
                  </div>
                </div>
              </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="공연 추가 정보">
              <InfoItem icon={Clock} label="런타임" value={perf.runtime} color="bg-blue-500/10 text-blue-500" />
              <InfoItem icon={Users} label="관람 연령" value={perf.age} color="bg-amber-500/10 text-amber-500" />
              <InfoItem icon={Info} label="출연진" value={perf.cast} color="bg-emerald-500/10 text-emerald-500" />
              <InfoItem icon={Users} label="제작진" value={perf.crew} color="bg-purple-500/10 text-purple-500" />
              <div className="md:col-span-2">
                <InfoItem icon={DollarSign} label="티켓 가격" value={perf.price} color="bg-rose-500/10 text-rose-500" />
              </div>
            </section>

            {perf.story && (
              <section className="space-y-6" aria-label="시놉시스">
                <h2 className="text-2xl font-black border-l-4 border-[var(--accent-primary)] pl-4">시놉시스</h2>
                <SanitizedContent content={perf.story} className="text-lg leading-relaxed text-[var(--text-secondary)] font-medium" />
              </section>
            )}

            {perf.images.length > 0 && (
              <section className="space-y-6" aria-label="갤러리">
                <h2 className="text-2xl font-black border-l-4 border-[var(--accent-secondary)] pl-4">갤러리</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {perf.images.map((img, idx) => (
                    <div 
                      key={idx} 
                      className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--border-color)]"
                    >
                      <Image src={img} alt={`${perf.title} 장면 ${idx+1}`} fill className="object-cover hover:scale-105 transition-transform" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            <ReviewSection performanceTitle={perf.title} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PerformanceDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-12 h-12 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PerformanceDetailContent />
    </Suspense>
  );
}
