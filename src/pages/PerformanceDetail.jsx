import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPerformanceDetail } from '../services/api';
import { ArrowLeft, Ticket, MapPin, Clock, Users, DollarSign, Calendar } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';

const PerformanceDetail = () => {
    const { id } = useParams();
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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
        <div className="flex justify-center items-center h-[50vh]">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (error || !performance) return (
        <div className="container py-12 text-center text-red-400">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p>{error || "Performance not found"}</p>
            <Link to="/" className="inline-block mt-4 text-purple-400 hover:text-purple-300 underline">
                Back to Home
            </Link>
        </div>
    );

    const { poster, title, startDate, endDate, place, cast, crew, runtime, age, price, genre, state, openrun, story, images } = performance;

    const posterUrl = poster ? (poster.startsWith('http') ? poster : `http://www.kopis.or.kr${poster}`) : 'https://placehold.co/400x600?text=No+Preview';

    return (
        <div className="container pb-20">
            {/* Back Button */}
            <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Left Column: Poster & Quick Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-xl overflow-hidden shadow-2xl ring-1 ring-slate-700">
                        <img
                            src={posterUrl}
                            alt={title}
                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x600?text=Error'; }}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Ticket className="w-5 h-5 text-purple-400" />
                            <span className="text-sm font-bold uppercase text-slate-400 tracking-wider">Booking Channels</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {performance.relates && performance.relates.length > 0 ? (
                                performance.relates.map((relate, idx) => (
                                    <a
                                        key={idx}
                                        href={relate.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="relative group overflow-hidden rounded-md border border-slate-700 hover:border-purple-500 transition-colors bg-slate-800 px-4 py-2 flex items-center justify-center min-w-[100px]"
                                        title={`Book on ${relate.name}`}
                                    >
                                        <span className="text-sm font-medium text-slate-300 group-hover:text-white truncate">
                                            {relate.name || 'Booking'}
                                        </span>
                                    </a>
                                ))
                            ) : (
                                <span className="text-sm text-slate-500 italic px-2">Online booking not available</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold uppercase tracking-wider border border-purple-500/30">
                                {genre}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-md ${state === '공연중' ? 'bg-emerald-500 text-white border-emerald-400' : state === '공연예정' ? 'bg-amber-500 text-white border-amber-400' : state === '공연완료' ? 'bg-slate-600 text-white border-slate-500' : 'bg-purple-500 text-white border-purple-400'}`}>
                                {state}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-4 leading-tight">
                            {title}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-slate-300 text-lg">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-purple-400" />
                                <span>{startDate} ~ {endDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-pink-400" />
                                <span>{place}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl space-y-4">
                        <h3 className="text-xl font-bold border-b border-slate-700 pb-2 mb-4 text-white">Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-slate-500 mt-0.5" />
                                <div>
                                    <span className="block text-slate-400 text-xs uppercase mb-0.5">Runtime</span>
                                    <span className="text-slate-200 font-medium">{runtime}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-slate-500 mt-0.5" />
                                <div>
                                    <span className="block text-slate-400 text-xs uppercase mb-0.5">Cast</span>
                                    <span className="text-slate-200 font-medium line-clamp-2">{cast || 'TBA'}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-slate-500 mt-0.5" />
                                <div>
                                    <span className="block text-slate-400 text-xs uppercase mb-0.5">Crew</span>
                                    <span className="text-slate-200 font-medium line-clamp-2">{crew || 'TBA'}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-slate-500 mt-0.5" />
                                <div>
                                    <span className="block text-slate-400 text-xs uppercase mb-0.5">Age Rating</span>
                                    <span className="text-slate-200 font-medium">{age}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 md:col-span-2">
                                <DollarSign className="w-5 h-5 text-slate-500 mt-0.5" />
                                <div>
                                    <span className="block text-slate-400 text-xs uppercase mb-0.5">Price</span>
                                    <span className="text-slate-200 font-medium">{price}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Story / Synopsis (if available) */}
                    {story && (
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">Synopsis</h3>
                            <div className="prose prose-invert prose-p:text-slate-300 max-w-none">
                                {/* Sometimes story contains HTML or simple text. Safely render if possible or just text */}
                                <p className="whitespace-pre-line leading-relaxed">{story.replace(/<[^>]*>/g, '')}</p>
                            </div>
                        </div>
                    )}

                    {/* Gallery */}
                    {images && images.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">Gallery</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {images.slice(0, 6).map((img, idx) => (
                                    <div key={idx} className="rounded-lg overflow-hidden h-48 bg-slate-800 border border-slate-700 hover:border-purple-500 transition-colors group cursor-pointer">
                                        <a href={img} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={img}
                                                alt={`Scene ${idx + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                            />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Blog Reviews Section */}
                    <ReviewSection performanceTitle={title} />
                </div>
            </div>
        </div>
    );
};

export default PerformanceDetail;
