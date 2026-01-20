import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import ItineraryView from './components/ItineraryView';
import { generateItinerary } from './utils/tripPlanner';
import { Plane, Loader2, AlertCircle } from 'lucide-react';

function App() {
  const [itinerary, setItinerary] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (data) => {
    setFormData(data);
    setLoading(true);
    setError(null);
    try {
      const plan = await generateItinerary(data);
      setItinerary(plan);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setItinerary(null);
    setFormData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 p-4 font-medium text-slate-700 flex flex-col">
      <header className="max-w-5xl mx-auto mb-4 flex flex-col items-center justify-center pt-4 shrink-0">
        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-sm mb-3">
          <Plane size={24} className="text-teal-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-1">move.ai</h1>
        <p className="text-slate-500 text-sm md:text-base">Your mindful travel companion</p>
      </header>

      <main className="container mx-auto max-w-5xl flex-1 flex flex-col">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 flex-1">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <Loader2 size={48} className="text-teal-600 animate-spin relative z-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 mt-6">Dreaming up your journey...</h2>
            <p className="text-slate-500 mt-2 text-sm">Breathing life into your itinerary.</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto bg-red-50/80 backdrop-blur-sm border border-red-100 p-6 rounded-3xl text-center shadow-sm my-auto">
            <AlertCircle size={40} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-700 mb-2">A small hiccup</h3>
            <p className="text-red-600 mb-6 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition shadow-lg shadow-red-200 text-sm"
            >
              Try Again
            </button>
          </div>
        ) : !itinerary ? (
          <ChatInterface onTripReady={handleFormSubmit} />
        ) : (
          <ItineraryView
            itinerary={itinerary}
            destination={formData.destination}
            onBack={handleBack}
          />
        )}
      </main>

      <footer className="text-center mt-6 pb-4 text-slate-400 text-xs shrink-0">
        <p>© {new Date().getFullYear()} TripPlanner.ai • Crafted with mindfulness</p>
      </footer>
    </div>
  );
}

export default App;
