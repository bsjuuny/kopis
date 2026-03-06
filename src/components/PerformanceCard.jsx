import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';

const PerformanceCard = ({ performance }) => {
    const { id, title, startDate, endDate, place, poster, genre, state } = performance;

    // Create a default placeholder if poster is missing or url is "http:"
    const posterUrl = poster ? (poster.startsWith('http') ? poster : `http://www.kopis.or.kr${poster}`) : 'https://placehold.co/400x600?text=No+Preview';

    const getStatusColor = (status) => {
        switch (status) {
            case '공연중': return 'bg-emerald-500 text-white border border-emerald-400 shadow-lg';
            case '공연예정': return 'bg-amber-500 text-white border border-amber-400 shadow-lg';
            case '공연완료': return 'bg-slate-600 text-white border border-slate-500 shadow-lg';
            default: return 'bg-purple-500 text-white border border-purple-400 shadow-lg';
        }
    };

    return (
        <Link to={`/performance/${id}`} className="block group h-full min-w-0">
            <div className="bg-slate-800 rounded-lg sm:rounded-xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl shadow-lg relative h-full flex flex-row sm:flex-col">

                {/* Image Container with Aspect Ratio */}
                <div className="relative w-20 xs:w-24 sm:w-full h-32 xs:h-36 sm:h-auto sm:pt-[140%] shrink-0 bg-slate-900 overflow-hidden">
                    <img
                        src={posterUrl}
                        alt={title}
                        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x600?text=Error'; }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Status Badge */}
                    <div className={`absolute top-1.5 left-1.5 sm:top-3 sm:right-3 sm:left-auto px-1 py-0.5 xs:px-1.5 sm:px-2 sm:py-1 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-tight xs:tracking-wider backdrop-blur-sm ${getStatusColor(state)} shadow-sm`}>
                        {state}
                    </div>
                </div>

                {/* Content */}
                <div className="p-2 xs:p-2.5 sm:p-4 flex-1 flex flex-col gap-1.5 xs:gap-2 sm:gap-3 relative z-10 w-full min-w-0">
                    <div className="flex-1 min-w-0">
                        <div className="text-[10px] xs:text-xs font-medium text-purple-400 mb-0.5 xs:mb-1 flex items-center gap-1 min-w-0">
                            <Tag className="w-2.5 h-2.5 xs:w-3 xs:h-3 shrink-0" /> <span className="truncate flex-1">{genre}</span>
                        </div>
                        <h3 className="text-xs xs:text-sm sm:text-lg font-bold text-white leading-tight mb-1 xs:mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                            {title}
                        </h3>
                    </div>

                    <div className="space-y-0.5 xs:space-y-1 sm:space-y-2 mt-auto text-[10px] xs:text-xs sm:text-sm text-slate-400 w-full">
                        <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 min-w-0">
                            <Calendar className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
                            <span className="truncate flex-1">{startDate} ~ {endDate}</span>
                        </div>
                        <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 min-w-0">
                            <MapPin className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
                            <span className="truncate flex-1">{place}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PerformanceCard;
