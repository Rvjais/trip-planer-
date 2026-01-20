import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Sun, Moon, Coffee, Camera, ArrowLeft, Star, Navigation, Utensils, Bed } from 'lucide-react';

const ItineraryView = ({ itinerary, destination, onBack }) => {
    // Handle both old (array) and new (object) data structures for backward compatibility
    const days = Array.isArray(itinerary) ? itinerary : itinerary.itinerary;
    const hotels = Array.isArray(itinerary) ? [] : (itinerary.hotels || []);

    // Helper to get icon based on time/type
    const getIcon = (activity) => {
        const text = (activity.activity + activity.type).toLowerCase();
        if (text.includes('breakfast') || text.includes('dinner') || text.includes('lunch') || text.includes('food')) return <Coffee size={18} />;
        if (text.includes('morning')) return <Sun size={18} />;
        if (text.includes('night') || text.includes('evening')) return <Moon size={18} />;
        if (text.includes('museum') || text.includes('sight') || text.includes('photo')) return <Camera size={18} />;
        return <MapPin size={18} />;
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4 md:px-6">
            {/* Navigation */}
            <nav className="flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16 sticky top-4 z-50 gap-4">
                <button
                    onClick={onBack}
                    className="bg-white/90 backdrop-blur-md text-slate-600 hover:text-teal-600 px-6 py-3 rounded-full shadow-lg shadow-slate-200/50 transition-all hover:scale-105 flex items-center gap-2 font-medium border border-white/50 w-full md:w-auto justify-center"
                >
                    <ArrowLeft size={20} /> Plan New Trip
                </button>
                <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg shadow-slate-200/50 border border-white/50 text-slate-500 text-sm font-medium flex items-center gap-2 w-full md:w-auto justify-center">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    {days.length} Days in Paradise
                </div>
            </nav>

            {/* Hero Header */}
            <header className="text-center mb-16 md:mb-24 relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-5xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 mb-4 md:mb-6 tracking-tight leading-tight py-2">
                        {destination}
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed px-4">
                        Your curated journey of mindful exploration and unforgettable moments.
                    </p>
                </motion.div>
            </header>

            {/* Hotels Section */}
            {hotels.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20 md:mb-24"
                >
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <Bed size={24} className="text-teal-500" />
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Where to Stay</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {hotels.map((hotel, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg shadow-slate-100 border border-white flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${hotel.category.toLowerCase().includes('luxury') ? 'bg-purple-100 text-purple-600' :
                                            hotel.category.toLowerCase().includes('budget') ? 'bg-green-100 text-green-600' :
                                                'bg-blue-100 text-blue-600'
                                        }`}>
                                        {hotel.category}
                                    </span>
                                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                        <Star size={14} className="fill-yellow-500" />
                                        {hotel.rating}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">{hotel.name}</h3>
                                <p className="text-slate-500 text-sm mb-4 flex-1">{hotel.description}</p>
                                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-lg font-bold text-teal-600">{hotel.price}</span>
                                    <a
                                        href={hotel.booking_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-slate-400 hover:text-teal-600 flex items-center gap-1 transition-colors"
                                    >
                                        Book Now <ArrowLeft size={14} className="rotate-180" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Itinerary Grid */}
            <div className="relative">
                {/* Central Timeline Line (Desktop) */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal-200 via-blue-200 to-transparent hidden md:block" />
                {/* Mobile Timeline Line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-teal-200 via-blue-200 to-transparent md:hidden" />

                <div className="space-y-12 md:space-y-24">
                    {days.map((day, index) => (
                        <motion.div
                            key={day.day}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                }`}
                        >
                            {/* Day Marker (Center Desktop) */}
                            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-4 border-teal-400 rounded-full z-10 hidden md:block shadow-[0_0_0_8px_rgba(240,249,255,1)]" />
                            {/* Day Marker (Mobile) */}
                            <div className="absolute left-4 -translate-x-1/2 w-4 h-4 bg-white border-2 border-teal-400 rounded-full z-10 md:hidden" />

                            {/* Content Card */}
                            <div className="flex-1 md:w-1/2 pl-8 md:pl-0">
                                <div className={`bg-white/70 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-slate-100/60 border border-white hover:shadow-2xl hover:shadow-teal-100/40 transition-all duration-500 group ${index % 2 === 0 ? 'md:mr-16' : 'md:ml-16'
                                    }`}>
                                    <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-6 md:mb-8 border-b border-slate-100 pb-4 md:pb-6 gap-2">
                                        <h3 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">Day {day.day}</h3>
                                        <span className="text-teal-600 font-medium text-base md:text-lg bg-teal-50 px-4 py-1 rounded-full w-fit">{day.date}</span>
                                    </div>

                                    <div className="space-y-6 md:space-y-8">
                                        {day.activities.map((activity, i) => (
                                            <div key={i} className="flex gap-4 md:gap-5 group/item">
                                                <div className="mt-1 text-teal-500 bg-white shadow-sm border border-teal-50 p-2 md:p-3 rounded-2xl h-fit group-hover/item:bg-teal-500 group-hover/item:text-white transition-all duration-300 shrink-0">
                                                    {getIcon(activity)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{activity.time}</span>
                                                        <span className="h-px flex-1 bg-slate-100"></span>
                                                    </div>
                                                    <h4 className="text-lg md:text-xl font-semibold text-slate-700 mb-2 group-hover/item:text-teal-700 transition-colors break-words">{activity.activity}</h4>

                                                    {/* New Detailed Sections */}
                                                    <div className="space-y-3 mb-3">
                                                        {activity.description && (
                                                            <p className="text-slate-600 text-sm leading-relaxed">{activity.description}</p>
                                                        )}

                                                        <div className="flex flex-col gap-2">
                                                            {activity.transport && (
                                                                <div className="flex items-start gap-2 text-sm text-slate-500 bg-slate-50 p-2 rounded-lg">
                                                                    <Navigation size={14} className="mt-0.5 text-blue-500 shrink-0" />
                                                                    <span>{activity.transport}</span>
                                                                </div>
                                                            )}
                                                            {activity.food && (
                                                                <div className="flex items-start gap-2 text-sm text-slate-500 bg-orange-50 p-2 rounded-lg">
                                                                    <Utensils size={14} className="mt-0.5 text-orange-500 shrink-0" />
                                                                    <span>{activity.food}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <span className="inline-flex items-center px-3 py-1 bg-slate-50 text-slate-500 text-xs font-medium rounded-lg border border-slate-100">
                                                        {activity.type}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Empty space for the other side to balance flex */}
                            <div className="flex-1 hidden md:block" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Footer Message */}
            <div className="text-center mt-20 md:mt-32 mb-8 md:mb-12">
                <div className="inline-block p-1 rounded-full bg-gradient-to-r from-teal-100 to-blue-100 mb-6">
                    <div className="bg-white px-6 md:px-8 py-3 rounded-full">
                        <p className="text-slate-500 italic font-medium text-sm md:text-base">"The journey of a thousand miles begins with a single step."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryView;
