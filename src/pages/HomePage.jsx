import React, { useState, useEffect } from 'react';
import { fetchPerformances } from '../services/api';
import PerformanceCard from '../components/PerformanceCard';
import { Loader, RefreshCw, ChevronLeft, ChevronRight, Search } from 'lucide-react';

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
            <div className="bg-slate-900/50 rounded-2xl p-4 sm:p-5 border border-slate-700/50 backdrop-blur-md mb-8 sm:mb-10 shadow-lg">
                <div className="flex flex-col xl:flex-row gap-4 xl:items-center">

                    {/* Search Bar */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setFilters({ ...filters, keyword: searchInput, page: 1 });
                        }}
                        className="relative w-full xl:w-[350px] shrink-0"
                    >
                        <input
                            type="text"
                            placeholder="Search performances..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none w-full shadow-inner transition-shadow placeholder:text-slate-500"
                        />
                        <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </form>

                    <div className="hidden xl:block w-px h-8 bg-slate-700"></div>

                    {/* Dropdowns & Toggles */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-row flex-wrap gap-3 w-full">
                        <select
                            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl px-3 py-2.5 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors cursor-pointer w-full sm:w-auto"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        >
                            <option value="">All Status</option>
                            <option value="02">Running</option>
                            <option value="01">Upcoming</option>
                        </select>

                        <select
                            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl px-3 py-2.5 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors cursor-pointer w-full sm:w-auto"
                            value={filters.genre}
                            onChange={(e) => setFilters({ ...filters, genre: e.target.value, page: 1 })}
                        >
                            <option value="">All Genres</option>
                            <option value="AAAA">Theater</option>
                            <option value="BBBC">Dance</option>
                            <option value="CCCA">Musical</option>
                            <option value="CCCC">Classic</option>
                            <option value="CCCD">Opera</option>
                            <option value="EEEB">Mixed</option>
                        </select>

                        <select
                            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl px-3 py-2.5 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors cursor-pointer w-full sm:w-auto sm:flex-1 md:flex-none"
                            value={filters.area}
                            onChange={(e) => setFilters({ ...filters, area: e.target.value, page: 1 })}
                        >
                            <option value="">All Areas</option>
                            <option value="11">Seoul</option>
                            <option value="26">Busan</option>
                            <option value="27">Daegu</option>
                            <option value="28">Incheon</option>
                            <option value="29">Gwangju</option>
                            <option value="30">Daejeon</option>
                            <option value="31">Ulsan</option>
                            <option value="36">Sejong</option>
                            <option value="41">Gyeonggi</option>
                            <option value="43">Chungbuk</option>
                            <option value="44">Chungnam</option>
                            <option value="45">Jeonbuk</option>
                            <option value="46">Jeonnam</option>
                            <option value="47">Gyeongbuk</option>
                            <option value="48">Gyeongnam</option>
                            <option value="50">Jeju</option>
                        </select>

                        <label className="col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start gap-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 text-sm sm:text-base cursor-pointer hover:bg-slate-700 transition-colors select-none w-full sm:w-auto mt-1 sm:mt-0">
                            <input
                                type="checkbox"
                                className="accent-purple-500 w-4 h-4 sm:w-5 sm:h-5 rounded focus:ring-purple-500 focus:ring-2 cursor-pointer"
                                checked={filters.kid}
                                onChange={(e) => setFilters({ ...filters, kid: e.target.checked, page: 1 })}
                            />
                            <span>For Kids</span>
                        </label>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-12 w-full">
                        {performances.map((perf) => (
                            <PerformanceCard key={perf.id} performance={perf} />
                        ))}
                    </div>

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
