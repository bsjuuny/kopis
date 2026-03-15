import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const PerformanceCard = ({ performance }) => {
    const { id, title, startDate, endDate, place, poster, genre, state } = performance;

    const posterUrl = poster ? (poster.startsWith('http') ? poster : `http://www.kopis.or.kr${poster}`) : 'https://placehold.co/400x600?text=No+Preview';

    const getStatusColor = (status) => {
        switch (status) {
            case '공연중': return 'bg-emerald-500/90 text-white border-emerald-400/50';
            case '공연예정': return 'bg-amber-500/90 text-white border-amber-400/50';
            case '공연완료': return 'bg-slate-700/90 text-slate-300 border-slate-600/50';
            default: return 'bg-purple-500/90 text-white border-purple-400/50';
        }
    };

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="h-full"
        >
            <Link to={`/performance/${id}`} className="block group h-full">
                <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border-color)] hover:border-[var(--border-focus)] transition-all duration-500 backdrop-blur-xl shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] h-full flex flex-col relative">

                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                            src={posterUrl}
                            alt={title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                        {/* Glass Badge */}
                        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${getStatusColor(state)} shadow-xl`}>
                            {state}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 xs:p-5 flex-1 flex flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-[var(--accent-glow)] text-[var(--accent-primary)] text-[10px] xs:text-[11px] font-bold border border-[var(--border-focus)]">
                                {genre}
                            </span>
                        </div>

                        <h3 className="text-base xs:text-lg font-bold text-[var(--text-primary)] leading-tight line-clamp-2 group-hover:text-[var(--accent-primary)] transition-colors min-h-[2.5rem] xs:min-h-[3rem]">
                            {title}
                        </h3>

                        <div className="mt-auto space-y-2 text-[11px] xs:text-xs text-[var(--text-secondary)]">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-3.5 h-3.5 text-[var(--accent-primary)] opacity-70 shrink-0" />
                                <span className="truncate">{startDate} ~ {endDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-[var(--accent-secondary)] opacity-70 shrink-0" />
                                <span className="truncate">{place}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default PerformanceCard;
