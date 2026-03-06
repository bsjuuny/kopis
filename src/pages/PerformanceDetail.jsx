import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPerformanceDetail } from '../services/api';
import { ArrowLeft, Ticket, MapPin, Clock, Users, DollarSign, Calendar, Info } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';
import { motion } from 'framer-motion';

const PerformanceDetail = () => {
    const { id } = useParams();
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const loadDetail = async () => {
            try {
                setLoading(true);
                const data = await fetchPerformanceDetail(id);
                setPerformance(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load performance details.");
            } finally {
                setLoading(false);
            }
        };
        loadDetail();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
    );

    if (error || !performance) return (
        <div className="container py-20 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
            <p className="text-slate-400">{error || "Performance not found"}</p>
            <Link to="/" className="inline-block mt-8 btn-primary">
                Back to Home
            </Link>
        </div>
    );

    const { poster, title, startDate, endDate, place, cast, crew, runtime, age, price, genre, state, story, images } = performance;
    const posterUrl = poster ? (poster.startsWith('http') ? poster : `http://www.kopis.or.kr${poster}`) : 'https://placehold.co/400x600?text=No+Preview';

    const InfoPill = ({ icon: Icon, label, value, colorClass = "text-purple-400" }) => (
        <div className="bg-slate-900/40 border border-white/5 backdrop-blur-md rounded-2xl p-4 flex items-start gap-4 transition-all hover:bg-slate-800/60 hover:border-white/10 group">
            <div className={`p-2.5 rounded-xl bg-slate-950/60 ${colorClass} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <div>
                <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{label}</span>
                <span className="text-sm font-semibold text-slate-200 leading-tight">{value || 'TBA'}</span>
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-20 relative"
        >
            {/* Hero Background - Cinematic Blur */}
            <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden -z-10">
                <img src={posterUrl} alt="" className="w-full h-full object-cover blur-[80px] opacity-30 scale-110" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-[#020617]" />
            </div>

            <div className="container pt-4">
                <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Discover</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Left Side: Poster & Booking */}
                    <div className="lg:col-span-4 space-y-8">
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="sticky top-24"
                        >
                            <div className="rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10 aspect-[3/4.2]">
                                <img
                                    src={posterUrl}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="mt-8 space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 px-1">Booking Channels</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {performance.relates && performance.relates.length > 0 ? (
                                        performance.relates.map((relate, idx) => (
                                            <a
                                                key={idx}
                                                href={relate.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/50 transition-all group"
                                            >
                                                <span className="font-semibold text-slate-300 group-hover:text-white">{relate.name || 'Official Booking'}</span>
                                                <Ticket className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                            </a>
                                        ))
                                    ) : (
                                        <div className="p-4 rounded-2xl bg-slate-900/40 border border-white/5 text-center italic text-slate-500 text-sm">
                                            Online booking not available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Details */}
                    <div className="lg:col-span-8 space-y-12">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-1.5 bg-purple-500/20 text-purple-300 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border border-purple-500/30 backdrop-blur-md">
                                    {genre}
                                </span>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border backdrop-blur-md ${state === '공연중' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800/40 text-slate-400 border-white/10'}`}>
                                    {state}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight text-white">
                                {title}
                            </h1>

                            <div className="flex flex-wrap gap-y-4 gap-x-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                        <Calendar className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Schedule</p>
                                        <p className="text-slate-200 font-semibold">{startDate} &ndash; {endDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                                        <MapPin className="w-5 h-5 text-pink-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Venue</p>
                                        <p className="text-slate-200 font-semibold">{place}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Info Grid */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            <InfoPill icon={Clock} label="Runtime" value={runtime} colorClass="text-blue-400" />
                            <InfoPill icon={Users} label="Age Rating" value={age} colorClass="text-amber-400" />
                            <InfoPill icon={Info} label="Cast" value={cast} colorClass="text-emerald-400" />
                            <InfoPill icon={Users} label="Crew" value={crew} colorClass="text-indigo-400" />
                            <div className="md:col-span-2">
                                <InfoPill icon={DollarSign} label="Ticket Prices" value={price} colorClass="text-rose-400" />
                            </div>
                        </motion.div>

                        {/* Synopsis */}
                        {story && (
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-6"
                            >
                                <h3 className="text-2xl font-bold tracking-tight border-l-4 border-purple-500 pl-4">Synopsis</h3>
                                <p className="text-slate-400 text-lg leading-relaxed whitespace-pre-line selection:bg-purple-500/30">
                                    {story.replace(/<[^>]*>/g, '')}
                                </p>
                            </motion.div>
                        )}

                        {/* Gallery */}
                        {images && images.length > 0 && (
                            <motion.div
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-6"
                            >
                                <h3 className="text-2xl font-bold tracking-tight border-l-4 border-pink-500 pl-4">Gallery</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {images.slice(0, 6).map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? 1 : -1 }}
                                            className="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-white/5 cursor-zoom-in"
                                        >
                                            <a href={img} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={img}
                                                    alt={`Scene ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </a>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Blog Reviews Section */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <ReviewSection performanceTitle={title} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PerformanceDetail;
