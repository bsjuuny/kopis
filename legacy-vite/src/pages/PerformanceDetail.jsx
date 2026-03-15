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
        <div className="flex justify-center items-center h-[70vh]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[var(--accent-glow)] border-t-[var(--accent-primary)] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-ping"></div>
                </div>
            </div>
        </div>
    );

    if (error || !performance) return (
        <div className="container py-32 text-center">
            <div className="inline-flex p-4 rounded-full bg-red-500/10 mb-6">
                <Info size={48} className="text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4">Oops!</h2>
            <p className="text-[var(--text-secondary)] text-lg mb-10 max-w-md mx-auto">{error || "Performance details could not be found."}</p>
            <Link to="/" className="btn-primary inline-flex">
                Back to Home
            </Link>
        </div>
    );

    const { poster, title, startDate, endDate, place, cast, crew, runtime, age, price, genre, state, story, images } = performance;
    const posterUrl = poster ? (poster.startsWith('http') ? poster : `http://www.kopis.or.kr${poster}`) : 'https://placehold.co/400x600?text=No+Preview';

    const InfoPill = ({ icon: Icon, label, value, colorClass = "text-[var(--accent-primary)]" }) => (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] backdrop-blur-xl rounded-[var(--radius-lg)] p-4 flex items-start gap-4 transition-all hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-focus)] group shadow-sm">
            <div className={`p-2.5 rounded-xl bg-[var(--accent-glow)] ${colorClass} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <div>
                <span className="block text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-black mb-1">{label}</span>
                <span className="text-sm font-bold text-[var(--text-primary)] leading-tight">{value || 'TBA'}</span>
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
            <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden -z-10">
                <img src={posterUrl} alt="" className="w-full h-full object-cover blur-[100px] opacity-40 scale-110" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)] to-[var(--bg-primary)] opacity-90" />
            </div>

            <div className="container pt-4">
                <Link to="/" className="inline-flex items-center text-[var(--text-secondary)] hover:text-[var(--accent-primary)] mb-8 transition-colors group">
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1.5 transition-transform" />
                    <span className="text-base font-bold tracking-tight">Back to Home</span>
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
                            <div className="rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-lg)] ring-1 ring-[var(--border-color)] aspect-[3/4.2] bg-[var(--bg-tertiary)]">
                                <img
                                    src={posterUrl}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="mt-8 space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] px-1">Booking Channels</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {performance.relates && performance.relates.length > 0 ? (
                                        performance.relates.map((relate, idx) => (
                                            <a
                                                key={idx}
                                                href={relate.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between px-6 py-5 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-glow)] hover:shadow-[0_8px_25px_-5px_rgba(175,82,222,0.15)] transition-all group active:scale-[0.98] ring-1 ring-inset ring-transparent hover:ring-[var(--accent-primary)/20]"
                                            >
                                                <span className="font-black text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] text-sm tracking-tight">{relate.name || 'Official Booking'}</span>
                                                <div className="p-2 rounded-lg bg-[var(--bg-tertiary)] group-hover:bg-[var(--accent-primary)] transition-colors">
                                                    <Ticket className="w-4 h-4 text-[var(--accent-primary)] group-hover:text-white transition-colors" />
                                                </div>
                                            </a>
                                        ))
                                    ) : (
                                        <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg-card)] border border-[var(--border-color)] text-center italic text-[var(--text-muted)] text-sm font-medium">
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
                                <span 
                                    className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border backdrop-blur-md transition-colors"
                                    style={{ 
                                        backgroundColor: 'var(--accent-glow)', 
                                        color: 'var(--accent-primary)',
                                        borderColor: 'var(--border-focus)'
                                    }}
                                >
                                    {genre}
                                </span>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border backdrop-blur-md transition-colors ${
                                    state === '공연중' 
                                        ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50' 
                                        : state === '공연예정'
                                            ? 'bg-amber-500/20 text-amber-500 border-amber-500/50'
                                            : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-[var(--border-color)]'
                                }`}>
                                    {state}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-[var(--text-primary)]">
                                {title}
                            </h1>

                            <div className="flex flex-wrap gap-y-4 gap-x-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent-glow)] flex items-center justify-center border border-[var(--border-focus)]">
                                        <Calendar className="w-6 h-6 text-[var(--accent-primary)]" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-black text-[var(--accent-primary)] tracking-wider mb-0.5">Schedule</p>
                                        <p className="text-[var(--text-primary)] font-bold text-lg">{startDate} &ndash; {endDate}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[var(--accent-secondary)] opacity-10 flex items-center justify-center border border-[var(--accent-secondary)]">
                                        <MapPin className="w-6 h-6 text-[var(--accent-secondary)]" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] uppercase font-black text-[var(--accent-secondary)] tracking-wider mb-0.5">Venue</p>
                                        <p className="text-[var(--text-primary)] font-bold text-lg leading-tight">{place}</p>
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
                                <h3 className="text-2xl font-black tracking-tight border-l-4 border-[var(--accent-primary)] pl-4">Synopsis</h3>
                                <p className="text-[var(--text-primary)] text-lg leading-relaxed whitespace-pre-line selection:bg-[var(--accent-glow)] font-medium">
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
                                <h3 className="text-2xl font-black tracking-tight border-l-4 border-[var(--accent-secondary)] pl-4">Gallery</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {images.slice(0, 6).map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? 1 : -1, zIndex: 10 }}
                                            className="rounded-[var(--radius-lg)] overflow-hidden aspect-[4/3] bg-[var(--bg-tertiary)] border border-[var(--border-color)] cursor-zoom-in shadow-md"
                                        >
                                            <a href={img} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={img}
                                                    alt={`Scene ${idx + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                />
                                            </a>                          </motion.div>
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
