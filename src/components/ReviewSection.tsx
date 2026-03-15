"use client";

import React, { useState, useEffect, useRef } from "react";
import { fetchReviews, Review } from "@/services/reviewApi";
import { MessageSquareText, Clock, User, Calendar, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

interface ReviewSectionProps {
  performanceTitle: string;
}

export const ReviewSection = ({ performanceTitle }: ReviewSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    if (!performanceTitle) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const getReviews = async () => {
      const data = await fetchReviews(performanceTitle, 10);
      if (!cancelled) {
        setReviews(data);
        setLoading(false);
      }
    };

    getReviews();
    return () => { cancelled = true; };
  }, [performanceTitle]);

  if (!performanceTitle) return null;

  return (
    <section className="mt-16 pt-10 md:pt-12 border-t border-[var(--border-color)]" aria-label="공연 블로그 후기">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-1.5 h-8 bg-gradient-to-b from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full shadow-lg shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <h2 className="text-xl md:text-3xl font-black tracking-tight text-[var(--text-primary)]">
              블로그 관람 후기
            </h2>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-xs font-medium text-[var(--text-secondary)]">관람객 블로그 후기</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border border-[var(--accent-primary)]/20 bg-[var(--accent-glow)] text-[var(--accent-primary)]">
                <Clock size={9} aria-hidden="true" />
                최근 3개월
              </span>
            </div>
          </div>
        </div>

        {!loading && reviews.length > 1 && (
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-9 h-9 rounded-full border border-[var(--border-color)] flex items-center justify-center transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] text-[var(--text-secondary)]"
              aria-label="이전 후기"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-9 h-9 rounded-full border border-[var(--border-color)] flex items-center justify-center transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] text-[var(--text-secondary)]"
              aria-label="다음 후기"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-[var(--text-secondary)]">
          <div className="w-10 h-10 border-4 border-[var(--accent-glow)] border-t-[var(--accent-primary)] rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold tracking-tight animate-pulse">후기를 불러오는 중입니다...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="overflow-hidden">
          <Swiper
            modules={[Pagination, A11y]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1.2, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 24 },
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            className="review-swiper !pb-10"
          >
            {reviews.map((review, index) => (
              <SwiperSlide key={index} className="!h-auto">
                <a
                  href={review.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-5 md:p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-all flex flex-col gap-3 h-full shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-primary)] min-w-0">
                      <User size={11} className="text-[var(--accent-primary)] shrink-0" aria-hidden="true" />
                      <span className="text-xs font-bold truncate text-[var(--text-secondary)]">
                        {review.blogger}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 text-[var(--text-muted)]">
                      <Calendar size={11} aria-hidden="true" />
                      <span className="text-[10px] font-bold">{review.date}</span>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2 leading-snug">
                    {review.title}
                  </h4>

                  <p className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed font-medium flex-1">
                    {review.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[var(--accent-primary)] font-bold text-xs uppercase tracking-widest group-hover:gap-2.5 transition-all">
                    Read Full Review <ExternalLink size={12} aria-hidden="true" />
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-10 px-6 rounded-2xl border border-dashed border-[var(--border-color)]">
          <MessageSquareText className="w-8 h-8 text-[var(--text-muted)] opacity-40" aria-hidden="true" />
          <p className="text-sm font-bold text-center text-[var(--text-secondary)]">
            최근 3개월 이내 블로그 후기가 없습니다
          </p>
          <p className="text-xs text-center text-[var(--text-muted)]">
            네이버 블로그에서 직접 검색해보세요
          </p>
        </div>
      )}

      <style>{`
        .review-swiper .swiper-pagination-bullet {
          background: var(--text-muted);
          opacity: 0.4;
        }
        .review-swiper .swiper-pagination-bullet-active {
          background: var(--accent-primary);
          opacity: 1;
        }
      `}</style>
    </section>
  );
};
