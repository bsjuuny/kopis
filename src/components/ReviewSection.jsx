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
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
        <h3 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          블로그 관람 후기
        </h3>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
          <p className="text-sm">후기를 불러오는 중입니다...</p>
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
              className="group p-5 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-purple-500/30 transition-all backdrop-blur-md flex flex-col gap-3"
            >
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-purple-400">{review.blogger}</span>
                <span className="text-slate-500">{review.date}</span>
              </div>
              <h4
                className="text-base font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-2 leading-snug"
                dangerouslySetInnerHTML={{ __html: review.title }}
              />
              <p
                className="text-sm text-slate-400 line-clamp-3 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: review.description }}
              />
            </motion.a>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-white/2 rounded-3xl border border-dashed border-white/5">
          <MessageSquareText className="w-10 h-10 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">최근 등록된 블로그 후기가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
