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
            endDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, ''), // +120 days
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
            <div className="mb-6 sm:mb-10">
                <h2 className="text-3xl xs:text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-secondary)] to-[var(--accent-primary)] tracking-tight animate-gradient-x">
                    Now Showing
                </h2>
                <p className="text-[var(--text-secondary)] text-sm xs:text-base sm:text-lg mt-2 font-medium">Discover the latest performances in Korea</p>
            </div>

            {/* Filter & Search Panel */}
            <div className="bg-[var(--bg-card)] rounded-[var(--radius-xl)] p-4 sm:p-6 border border-[var(--border-color)] backdrop-blur-2xl mb-12 shadow-[var(--shadow-lg)]">
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
                            className="bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-[var(--radius-lg)] pl-12 pr-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] outline-none w-full shadow-inner backdrop-blur-md transition-all placeholder:text-[var(--input-placeholder)]"
                        />
                        <Search className="w-5 h-5 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
                    </form>

                    <div className="hidden lg:block w-px h-8 bg-[var(--border-color)]"></div>

                    {/* Filter Elements Group */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <select
                            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--accent-primary)] outline-none transition-all cursor-pointer hover:bg-[var(--bg-tertiary)]"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        >
                            <option value="">전체 상태</option>
                            <option value="02">공연중</option>
                            <option value="01">공연예정</option>
                        </select>

                        <select
                            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--accent-primary)] outline-none transition-all cursor-pointer hover:bg-[var(--bg-tertiary)]"
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
                            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm focus:ring-2 focus:ring-[var(--accent-primary)] outline-none transition-all cursor-pointer hover:bg-[var(--bg-tertiary)]"
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
                        </select>

                        <div className="h-6 w-px bg-[var(--border-color)] hidden sm:block"></div>

                        <label className="flex items-center gap-2.5 px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-all cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="accent-[var(--accent-primary)] w-4 h-4 rounded"
                                checked={filters.kid}
                                onChange={(e) => setFilters({ ...filters, kid: e.target.checked, page: 1 })}
                            />
                            <span className="text-sm text-[var(--text-secondary)] font-medium">아동용</span>
                        </label>

                        <div className="h-6 w-px bg-[var(--border-color)] hidden sm:block"></div>

                        <select
                            className="bg-[var(--accent-glow)] border border-[var(--accent-glow)] text-[var(--accent-primary)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-[var(--accent-primary)] outline-none transition-all cursor-pointer hover:opacity-80"
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
                <div className="flex flex-col items-center justify-center py-24" >
                    <Loader className="w-12 h-12 text-[var(--accent-primary)] animate-spin mb-6" />
                    <p className="text-[var(--text-primary)] font-black text-lg tracking-tight">Curating the stage for you...</p>
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
                            className="flex items-center gap-1 xs:gap-2 px-4 xs:px-5 sm:px-8 py-2.5 xs:py-3 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm xs:text-base font-bold border border-[var(--border-color)] hover:border-[var(--accent-primary)] shadow-sm active:scale-95"
                        >
                            <ChevronLeft className="w-4 h-4" /> <span className="hidden xs:inline">Previous</span><span className="xs:hidden">Prev</span>
                        </button>
                        <span className="flex items-center px-4 text-base font-bold text-[var(--text-primary)] min-w-[3rem] justify-center">
                            {filters.page}
                        </span>
                        <button
                            disabled={performances.length < filters.rows}
                            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                            className="flex items-center gap-1 xs:gap-2 px-4 xs:px-5 sm:px-8 py-2.5 xs:py-3 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-tertiary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all text-sm xs:text-base font-bold border border-[var(--border-color)] hover:border-[var(--accent-primary)] shadow-sm active:scale-95"
                        >
                            <span className="hidden xs:inline">Next</span><span className="xs:hidden">Next</span> <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </>
            )
            }
        </div >
    );
};

export default HomePage;
