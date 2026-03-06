import React, { useState, useEffect } from 'react';
import { fetchPerformances } from '../services/api';
import PerformanceCard from '../components/PerformanceCard';
import { Loader, RefreshCw, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
    const [performances, setPerformances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(() => {
        const savedFilters = sessionStorage.getItem('kopis_filters');
        return savedFilters ? JSON.parse(savedFilters) : {
            startDate: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
            endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, ''), // +60 days
            page: 1,
            rows: 50,
            genre: '', // Optional
            area: '', // Area code optional
            kid: false, // Child friendly
            keyword: '', // Search keyword
            status: '', // '': all, 01: plan, 02: running
            sortOrder: 'latest', // Default sorting
        };
    });

    const [searchInput, setSearchInput] = useState(filters.keyword || '');

    useEffect(() => {
        setSearchInput(filters.keyword || '');
    }, [filters.keyword]);

    useEffect(() => {
        sessionStorage.setItem('kopis_filters', JSON.stringify(filters));
        loadPerformances();
    }, [filters]);

    const loadPerformances = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchPerformances(filters);
            setPerformances(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load performances. Please check your API key.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container pb-8 sm:pb-12 overflow-x-hidden">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 tracking-tight">
                    Now Showing
                </h2>
                <p className="text-slate-400 text-sm xs:text-base sm:text-lg mt-1.5">Discover the latest performances in Korea</p>
            </div>

            {/* Filter & Search Panel */}
            <div className="bg-slate-900/50 rounded-3xl p-4 sm:p-6 border border-white/5 backdrop-blur-xl mb-10 shadow-2xl">
                <div className="flex flex-col lg:flex-row gap-6 lg:items-center">

                    {/* Search Bar */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setFilters({ ...filters, keyword: searchInput, page: 1 });
                        }}
                        className="relative flex-1 lg:max-w-md"
                    >
                        <input
                            type="text"
                            placeholder="공연 명칭을 입력하세요..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="bg-slate-950/50 border border-white/10 text-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none w-full shadow-inner backdrop-blur-md transition-all placeholder:text-slate-600"
                        />
                        <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    </form>

                    <div className="hidden lg:block w-px h-8 bg-white/10"></div>

                    {/* Filter Elements Group */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <select
                            className="bg-slate-800/50 border border-white/10 text-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500/30 outline-none transition-all cursor-pointer hover:bg-slate-700/50"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        >
                            <option value="">전체 상태</option>
                            <option value="02">공연중</option>
                            <option value="01">공연예정</option>
                        </select>

                        <select
                            className="bg-slate-800/50 border border-white/10 text-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500/30 outline-none transition-all cursor-pointer hover:bg-slate-700/50"
                            value={filters.genre}
                            onChange={(e) => setFilters({ ...filters, genre: e.target.value, page: 1 })}
                        >
                            <option value="">전체 장르</option>
                            <option value="AAAA">연극</option>
                            <option value="BBBC">무용</option>
                            <option value="CCCA">뮤지컬</option>
                            <option value="CCCC">클래식</option>
                            <option value="CCCD">오페라</option>
                            <option value="EEEB">복합</option>
                        </select>

                        <select
                            className="bg-slate-800/50 border border-white/10 text-slate-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500/30 outline-none transition-all cursor-pointer hover:bg-slate-700/50"
                            value={filters.area}
                            onChange={(e) => setFilters({ ...filters, area: e.target.value, page: 1 })}
                        >
                            <option value="">전국</option>
                            <option value="11">서울</option>
                            <option value="26">부산</option>
                            <option value="27">대구</option>
                            <option value="28">인천</option>
                            <option value="41">경기</option>
                            <option value="50">제주</option>
                            {/* ... simplified for cleaner UI, can add more if needed */}
                        </select>

                        <div className="h-6 w-px bg-white/5 hidden sm:block"></div>

                        <label className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-800/30 border border-white/5 hover:bg-slate-800/50 transition-all cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="accent-purple-500 w-4 h-4 rounded"
                                checked={filters.kid}
                                onChange={(e) => setFilters({ ...filters, kid: e.target.checked, page: 1 })}
                            />
                            <span className="text-sm text-slate-400 font-medium">아동용</span>
                        </label>

                        <div className="h-6 w-px bg-white/5 hidden sm:block"></div>

                        <select
                            className="bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-purple-500/30 outline-none transition-all cursor-pointer hover:bg-purple-500/20"
                            value={filters.sortOrder}
                            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
                        >
                            <option value="latest">최신 시작순</option>
                            <option value="ending">마감 임박순</option>
                            <option value="alphabetical">가나다순</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20" >
                    <Loader className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                    <p className="text-slate-400">Loading performances...</p>
                </div>
            ) : error ? (
                <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-8 text-center max-w-lg mx-auto">
                    <h3 className="text-xl font-bold text-red-400 mb-2">Oops! Something went wrong.</h3>
                    <p className="text-red-200 mb-6">{error}</p>
                    <button
                        onClick={loadPerformances}
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" /> Try Again
                    </button>
                    <p className="mt-4 text-xs text-slate-500">
                        Note: KOPIS API key is required in .env
                    </p>
                </div>
            ) : performances.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                    <p className="text-lg">No performances found matching your criteria.</p>
                </div>
            ) : (
                <>
                    {/* Sort applied before mapping */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.05
                                }
                            }
                        }}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 xs:gap-4 sm:gap-6 mb-12 w-full"
                    >
                        {[...performances].sort((a, b) => {
                            if (filters.sortOrder === 'latest') {
                                return b.startDate.localeCompare(a.startDate);
                            } else if (filters.sortOrder === 'ending') {
                                return a.endDate.localeCompare(b.endDate);
                            } else if (filters.sortOrder === 'alphabetical') {
                                return a.title.localeCompare(b.title, 'ko');
                            }
                            return 0;
                        }).map((perf) => (
                            <motion.div
                                key={perf.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 400 } }
                                }}
                            >
                                <PerformanceCard performance={perf} />
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="flex justify-center gap-2 xs:gap-3 sm:gap-4 flex-wrap">
                        <button
                            disabled={filters.page === 1}
                            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                            className="flex items-center gap-1 xs:gap-2 px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-slate-800 rounded-lg xs:rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm xs:text-base font-medium border border-slate-700 hover:border-purple-500/50"
                        >
                            <ChevronLeft className="w-3 h-3 xs:w-4 xs:h-4" /> <span className="hidden xs:inline">Previous</span><span className="xs:hidden">Prev</span>
                        </button>
                        <span className="flex items-center px-2 xs:px-3 sm:px-4 text-sm xs:text-base font-mono text-slate-400">
                            {filters.page}
                        </span>
                        <button
                            disabled={performances.length < filters.rows}
                            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                            className="flex items-center gap-1 xs:gap-2 px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-slate-800 rounded-lg xs:rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm xs:text-base font-medium border border-slate-700 hover:border-purple-500/50"
                        >
                            <span className="hidden xs:inline">Next</span><span className="xs:hidden">Next</span> <ChevronRight className="w-3 h-3 xs:w-4 xs:h-4" />
                        </button>
                    </div>
                </>
            )
            }
        </div >
    );
};

export default HomePage;
