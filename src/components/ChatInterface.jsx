import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../utils/chatService';

const ChatInterface = ({ onTripReady }) => {
    const [messages, setMessages] = useState([
        { role: 'model', text: "Hello! I'm here to help you plan a peaceful journey. Where is your heart guiding you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        // Prepare history for API
        // Gemini requires history to start with 'user'. If our first msg is 'model' (greeting), skip it.
        let historyMessages = messages;
        if (historyMessages.length > 0 && historyMessages[0].role === 'model') {
            historyMessages = historyMessages.slice(1);
        }

        const history = historyMessages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        const response = await sendChatMessage(history, userMessage);

        setIsLoading(false);

        if (response.data) {
            setMessages(prev => [...prev, { role: 'model', text: response.text }]);
            setTimeout(() => {
                onTripReady(response.data);
            }, 1500);
        } else {
            setMessages(prev => [...prev, { role: 'model', text: response.text }]);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white/60 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-teal-100/50 border border-white/50 overflow-hidden flex flex-col h-[75vh] md:h-[700px] relative">
            {/* Header */}
            <div className="bg-white/50 backdrop-blur-md p-4 md:p-6 border-b border-white/20 flex items-center justify-center gap-2 z-10">
                <Sparkles size={20} className="text-teal-500" />
                <h2 className="font-semibold text-slate-700 tracking-wide">Travel Assistant</h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent scroll-smooth">
                <AnimatePresence mode="popLayout">
                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] p-5 rounded-3xl shadow-sm ${msg.role === 'user'
                                    ? 'bg-teal-600 text-white rounded-br-none shadow-teal-200'
                                    : 'bg-white text-slate-700 rounded-bl-none shadow-slate-100 border border-white'
                                    }`}
                            >
                                <p className="text-[15px] leading-relaxed">{msg.text}</p>
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-white p-4 rounded-3xl rounded-bl-none shadow-sm border border-white flex items-center gap-3">
                                <div className="flex gap-1">
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-teal-400 rounded-full" />
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-teal-400 rounded-full" />
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-teal-400 rounded-full" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 md:p-6 bg-white/50 backdrop-blur-md border-t border-white/20">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your thoughts..."
                        className="w-full p-3 md:p-4 pr-12 md:pr-14 bg-white border-none rounded-full shadow-lg shadow-slate-100 focus:ring-2 focus:ring-teal-200 focus:shadow-teal-50 transition-all outline-none text-slate-700 placeholder:text-slate-400 text-sm md:text-base"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-md shadow-teal-200"
                    >
                        <Send size={20} className="ml-0.5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatInterface;
