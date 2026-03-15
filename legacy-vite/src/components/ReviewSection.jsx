import React, { useState, useEffect } from 'react';
import { fetchReviews } from '../services/reviewApi';
import { motion } from 'framer-motion';
import { MessageSquareText } from 'lucide-react';

const ReviewSection = ({ performanceTitle }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReviews = async () => {
      setLoading(true);
      if (performanceTitle) {
        const query = `"${performanceTitle}" 연극 뮤지컬 공연 후기 -영화 -드라마 -넷플릭스 -웹툰`;
        const data = await fetchReviews(query, 6, performanceTitle);
        setReviews(data);
      }
      setLoading(false);
    };

    getReviews();
  }, [performanceTitle]);

  if (!performanceTitle) return null;

  return (
    <div className="mt-16 pt-12 border-t border-white/5">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1.5 h-8 bg-gradient-to-b from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full shadow-[0_0_15px_rgba(175,82,222,0.3)]" />
        <h3 className="text-3xl font-black tracking-tight text-[var(--text-primary)] flex items-center gap-3">
          블로그 관람 후기
        </h3>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-[var(--text-secondary)]">
          <div className="w-10 h-10 border-3 border-[var(--accent-glow)] border-t-[var(--accent-primary)] rounded-full animate-spin mb-5" />
          <p className="text-sm font-bold tracking-tight">후기를 불러오는 중입니다...</p>
        </div>
      ) : reviews.length > 0 ? (
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {reviews.map((review, index) => (
            <motion.a
              key={index}
              href={review.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="group p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)] transition-all backdrop-blur-xl flex flex-col gap-4 shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-[var(--accent-primary)]">{review.blogger}</span>
                <span className="text-[var(--text-muted)]">{review.date}</span>
              </div>
              <h4
                className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2 leading-snug"
                dangerouslySetInnerHTML={{ __html: review.title }}
              />
              <p
                className="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: review.description }}
              />
            </motion.a>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-[var(--bg-card)] rounded-[var(--radius-xl)] border border-dashed border-[var(--border-color)]">
          <MessageSquareText className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-5 opacity-50" />
          <p className="text-[var(--text-secondary)] font-bold">최근 등록된 블로그 후기가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
