"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPerformances } from "@/services/api";
import { KOPISParams, KOPISPerformance } from "@/types";
import PerformanceCard from "@/components/PerformanceCard";
import ScrollToTop from "@/components/ScrollToTop";
import { Search, Filter, Loader2, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useFavorites } from "@/hooks/useFavorites";
import { getPersonalizedRecommendations } from "@/lib/recommendation";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function HomePage() {
  const [params, setParams] = useState<KOPISParams>(() => {
    const defaults: KOPISParams = {
      startDate: new Date().toISOString().slice(0, 10).replace(/-/g, ""),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, ""),
      page: 1,
      rows: 40,
      genre: "",
      status: "02",
    };
    if (typeof window === "undefined") return defaults;
    try {
      const saved = sessionStorage.getItem("kopis-filters");
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch {
      return defaults;
    }
  });

  const [searchInput, setSearchInput] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      const saved = sessionStorage.getItem("kopis-filters");
      return saved ? (JSON.parse(saved).keyword ?? "") : "";
    } catch { return ""; }
  });
  const [isSticky, setIsSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const filterBarHeightRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSticky(true);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Capture filter bar height while it's still in-flow
    if (filterBarRef.current) {
      filterBarHeightRef.current = filterBarRef.current.offsetHeight;
    }

    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        setIsSticky(window.scrollY > 300);
      } else {
        setIsSticky(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const { data: performances, isLoading, error } = useQuery({
    queryKey: ["performances", params],
    queryFn: () => fetchPerformances(params),
  });
  
  const { favorites } = useFavorites();
  
  const recommendations = performances 
    ? getPersonalizedRecommendations(performances, favorites, 5) 
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ keyword: searchInput });
  };

  const scrollToResults = () => {
    if (resultsRef.current) {
      // Header(64) + Sticky Filter Bar (Mobile: ~150, Desktop: ~100) + Padding
      const offset = isMobile ? 220 : 180; 
      const elementPosition = resultsRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const saveFilters = (updated: KOPISParams) => {
    try { sessionStorage.setItem("kopis-filters", JSON.stringify(updated)); } catch {}
  };

  const handlePageChange = (newPage: number) => {
    setParams(prev => {
      const updated = { ...prev, page: newPage };
      saveFilters(updated);
      return updated;
    });
    scrollToResults();
  };

  const updateParams = (newParams: Partial<KOPISParams>) => {
    setParams(prev => {
      const updated = { ...prev, ...newParams, page: 1 };
      saveFilters(updated);
      return updated;
    });
  };

  return (
    <main className={cn(
      "container mx-auto px-4 max-w-7xl overflow-x-hidden transition-all duration-300",
      isSticky ? (isMobile ? "pt-40" : "pt-8") : "pt-8"
    )}>
      <header className={cn("mb-12 w-full overflow-hidden", isMobile && "hidden")}>
        <h1 
          className="text-4xl md:text-5xl font-black mb-4 tracking-tight bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent flex items-baseline gap-3"
        >
          공연마루 <span className="text-2xl md:text-3xl font-bold opacity-60 tracking-tighter" style={{ WebkitTextFillColor: 'var(--text-secondary)' }}>| Stage Maru</span>
        </h1>
        <p className="text-[var(--text-secondary)] font-medium">대한민국 공연예술의 모든 것</p>
      </header>

      {isSticky && !isMobile && (
        <div style={{ height: filterBarHeightRef.current || 220 }} aria-hidden="true" />
      )}

      <div ref={filterBarRef} className={cn(
        "space-y-6 mb-12 transition-all duration-300",
        isSticky && "fixed top-16 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border-b border-[var(--border-color)] py-2 mb-0 shadow-lg px-4"
      )}>
        <div className={cn("container mx-auto max-w-7xl", isSticky ? "space-y-2" : "space-y-4")}>
          {(isMobile || !isSticky) && (
            <form onSubmit={handleSearch} className={cn("relative group max-w-2xl w-full", isSticky && isMobile && "mb-2")}>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-10 blur-xl group-focus-within:opacity-20 transition-opacity rounded-3xl" />
              <div className={cn(
                "relative glass rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center p-1.5 border-[var(--border-color)] group-focus-within:border-[var(--accent-primary)] transition-all gap-1.5 sm:gap-0",
                isSticky && "p-1 rounded-xl"
              )}>
                <div className="flex items-center flex-grow px-2 sm:px-0">
                  <Search className={cn("ml-2 sm:ml-4 text-[var(--accent-primary)] shrink-0", isSticky && "w-4 h-4")} size={20} />
                  <input 
                    type="text"
                    placeholder="공연명, 장소 등을 검색해보세요"
                    value={isMounted ? searchInput : ""}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className={cn(
                      "w-full bg-transparent border-none outline-none px-3 py-3 font-bold text-base sm:text-lg placeholder:font-medium min-w-0 font-sans text-[var(--text-primary)]",
                      isSticky && "py-1.5 text-sm"
                    )}
                  />
                </div>
                {!isSticky && (
                  <button 
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-black shadow-lg hover:scale-105 active:scale-95 transition-all text-sm shrink-0"
                  >
                    검색
                  </button>
                )}
              </div>
            </form>
          )}

          <div className={cn("flex flex-col gap-3", isSticky && "sm:flex-row sm:items-center sm:justify-between")}>
            {/* Status & Genre Toggle Row */}
            <div className={cn("flex items-center gap-2", isSticky && "overflow-x-auto no-scrollbar py-1")}>
              <div className={cn("flex p-1 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] w-fit shrink-0", isSticky && "rounded-xl")}>
                {[
                  { label: "공연중", value: "02" },
                  { label: "공연예정", value: "01" },
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => updateParams({ status: s.value })}
                    className={cn(
                      "transition-all font-black whitespace-nowrap",
                      isSticky ? "px-3 py-1 rounded-lg text-xs" : "px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-xl",
                      (isMounted && params.status === s.value)
                        ? "bg-[var(--accent-primary)] text-white shadow-md" 
                        : "text-[var(--text-secondary)] dark:text-zinc-400 hover:text-[var(--text-primary)]"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => updateParams({ kid: !params.kid })}
                className={cn(
                  "transition-all font-black border shrink-0 flex items-center gap-2 relative overflow-hidden whitespace-nowrap",
                  isSticky ? "px-3 py-1 rounded-lg text-xs" : "px-4 sm:px-6 py-2.5 text-xs sm:text-sm rounded-xl",
                  (isMounted && params.kid)
                    ? "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 text-white border-transparent shadow-xl shadow-amber-500/40" 
                    : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-amber-400"
                )}
              >
                <span className="relative z-10 text-shadow-sm">아동용</span>
              </button>

              {isSticky && (
                <div className="flex-grow min-w-0">
                  <Swiper
                    slidesPerView="auto"
                    spaceBetween={6}
                    className="genre-swiper-sticky !flex items-center"
                  >
                    {[
                      { label: "전체", value: "" },
                      { label: "연극", value: "AAAA" },
                      { label: "뮤지컬", value: "CCCA" },
                      { label: "클래식", value: "CCCC" },
                      { label: "대중음악", value: "EEEB" },
                    ].map((g) => (
                      <SwiperSlide key={g.value} className="!w-auto">
                        <button
                          onClick={() => updateParams({ genre: g.value })}
                          className={cn(
                            "px-3 py-1 rounded-lg font-bold text-xs transition-all whitespace-nowrap",
                            (isMounted && params.genre === g.value)
                              ? "bg-[var(--accent-primary)] text-white"
                              : "text-[var(--text-secondary)] dark:text-zinc-400 hover:bg-[var(--accent-primary)]/10"
                          )}
                        >
                          {g.label}
                        </button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>

            {/* Region & Sort Row */}
            <div className={cn("flex items-center gap-4", isSticky ? "justify-between sm:justify-end border-t border-[var(--border-color)] sm:border-none pt-2 sm:pt-0" : "justify-start sm:justify-end sm:ml-auto")}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)] dark:text-zinc-400 leading-none">지역</span>
                <select 
                  value={isMounted ? (params.area || "") : ""}
                  onChange={(e) => updateParams({ area: e.target.value })}
                  className="bg-transparent font-black text-xs sm:text-sm outline-none text-[var(--accent-primary)] cursor-pointer leading-none"
                >
                  <option value="">전국</option>
                  <option value="11">서울</option>
                  <option value="41">경기</option>
                  <option value="28">인천</option>
                  <option value="26">부산</option>
                  <option value="27">대구</option>
                  <option value="51">강원</option>
                  <option value="50">제주</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)] dark:text-zinc-400 leading-none">정렬</span>
                <select 
                  value={isMounted ? (params.newsql || "N") : "N"}
                  onChange={(e) => updateParams({ newsql: e.target.value })}
                  className="bg-transparent font-black text-xs sm:text-sm outline-none text-[var(--accent-primary)] cursor-pointer leading-none"
                >
                  <option value="N">기본순</option>
                  <option value="Y">최신순</option>
                </select>
              </div>
            </div>
          </div>

          {!isSticky && (
            <div className="w-full">
              <Swiper
                slidesPerView="auto"
                spaceBetween={8}
                className="genre-swiper"
              >
                {[
                  { label: "전체", value: "" },
                  { label: "연극", value: "AAAA" },
                  { label: "뮤지컬", value: "CCCA" },
                  { label: "서양음악(클래식)", value: "CCCC" },
                  { label: "한국음악(국악)", value: "CCCD" },
                  { label: "대중음악", value: "EEEB" },
                  { label: "무용", value: "BBBC" },
                  { label: "복합", value: "GGGA" },
                ].map((g) => (
                  <SwiperSlide key={g.value} className="!w-auto">
                    <button
                      onClick={() => updateParams({ genre: g.label === "전체" ? "" : g.value })}
                      className={cn(
                        "px-4 py-2 rounded-full font-bold text-xs border transition-all whitespace-nowrap",
                        (isMounted && params.genre === g.value)
                          ? "bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-primary)]/20"
                          : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--accent-primary)]"
                      )}
                    >
                      {g.label}
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="animate-spin text-[var(--accent-primary)] mb-4" size={48} />
          <p className="font-bold text-[var(--text-muted)]">데이터를 불러오는 중입니다...</p>
        </div>
      ) : error ? (
        <div className="text-center py-40">
          <p className="text-red-500 font-bold mb-4">데이터 로드 실패: API 키를 확인해주세요.</p>
        </div>
      ) : performances?.length === 0 ? (
        <div className="text-center py-40">
          <p className="text-[var(--text-muted)] font-bold">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <>
          {/* Personalized Recommendations Section */}
          <AnimatePresence>
            {favorites.length > 0 && recommendations.length > 0 && !params.keyword && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-16 relative p-1"
              >
                {/* Visual Distinction Ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent-primary)]/20 via-[var(--accent-secondary)]/20 to-[var(--accent-primary)]/20 blur opacity-30 rounded-[3rem]" />
                
                <div className="relative glass-card rounded-[2.8rem] p-8 border border-[var(--accent-primary)]/20 overflow-hidden">
                  {/* Background decoration */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent-primary)]/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[var(--accent-secondary)]/10 rounded-full blur-3xl" />

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                    <div className="relative group">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-[10px] font-black uppercase tracking-widest mb-3 border border-[var(--accent-primary)]/20 shadow-sm">
                        <TrendingUp size={10} /> Personalized For You
                      </span>
                      <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">
                        취향 저격 <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">추천 공연</span>
                      </h2>
                      <p className="text-[var(--text-secondary)] text-sm font-medium whitespace-nowrap">
                        사용자가 찜한 <span className="text-[var(--accent-primary)] font-bold">{favorites.length}개</span>의 공연 정보를 분석했어요
                      </p>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-8 relative z-10">
                    {recommendations.map((perf: KOPISPerformance) => (
                      <PerformanceCard key={`rec-${perf.id}`} performance={perf} />
                    ))}
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <div 
            ref={resultsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-8 scroll-mt-48"
          >
            {performances?.map((perf: KOPISPerformance) => (
              <PerformanceCard key={perf.id} performance={perf} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-20">
            <button
              disabled={params.page === 1}
              onClick={() => handlePageChange(Number(params.page) - 1)}
              className="p-3 rounded-2xl border border-[var(--border-color)] disabled:opacity-30 hover:bg-[var(--bg-primary)] transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-black text-lg">{params.page}</span>
            <button
              disabled={performances && performances.length < (params.rows as number)}
              onClick={() => handlePageChange(Number(params.page) + 1)}
              className="p-3 rounded-2xl border border-[var(--border-color)] disabled:opacity-30 hover:bg-[var(--bg-primary)] transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
      <ScrollToTop onClick={scrollToResults} />
    </main>
  );
}
