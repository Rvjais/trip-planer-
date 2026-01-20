import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Heart } from 'lucide-react';

const TripForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        destination: '',
        startDate: '',
        endDate: '',
        minBudget: '',
        maxBudget: '',
        interests: [],
        prompt: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleInterestChange = (interest) => {
        setFormData((prev) => {
            const interests = prev.interests.includes(interest)
                ? prev.interests.filter((i) => i !== interest)
                : [...prev.interests, interest];
            return { ...prev, interests };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const interestOptions = ['Culture', 'Adventure', 'Food', 'Relaxation', 'Nature', 'Shopping'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl"
        >
            <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Plan Your Dream Trip</h2>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Destination */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <MapPin size={18} /> Destination
                    </label>
                    <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        placeholder="e.g., Paris, Tokyo, New York"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                    />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar size={18} /> Start Date
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Calendar size={18} /> End Date
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                            required
                        />
                    </div>
                </div>

                {/* Budget */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <DollarSign size={18} /> Budget Range
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            name="minBudget"
                            value={formData.minBudget}
                            onChange={handleChange}
                            placeholder="Min Price"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                            min="0"
                        />
                        <input
                            type="number"
                            name="maxBudget"
                            value={formData.maxBudget}
                            onChange={handleChange}
                            placeholder="Max Price"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                            min="0"
                        />
                    </div>
                </div>

                {/* Interests */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Heart size={18} /> Interests
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {interestOptions.map((interest) => (
                            <button
                                key={interest}
                                type="button"
                                onClick={() => handleInterestChange(interest)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.interests.includes(interest)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Prompt */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Instructions / Prompt
                    </label>
                    <textarea
                        name="prompt"
                        value={formData.prompt}
                        onChange={handleChange}
                        placeholder="e.g., I want to focus on vegan food and hidden gems..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition h-24 resize-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition transform hover:scale-[1.02] active:scale-95"
                >
                    Generate Itinerary
                </button>
            </form>
        </motion.div>
    );
};

export default TripForm;
