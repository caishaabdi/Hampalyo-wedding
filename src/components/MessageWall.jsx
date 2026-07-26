import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageCard from './MessageCard';
import { Sparkles, MessageCircleHeart } from 'lucide-react';

export default function MessageWall({ messages, onLike, newlyAddedId, onOpenForm }) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-[#FFFFFF]/60 rounded-3xl border border-dashed border-[#D4AF37]/40 max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-[#800020]/10 text-[#800020] flex items-center justify-center mx-auto mb-4 border border-[#800020]/20">
          <MessageCircleHeart className="w-8 h-8" />
        </div>
        <h3 className="font-serif-heading text-2xl font-bold text-slate-800 mb-2">
          No Wishes Found
        </h3>
        <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
          Be the first loved one to leave a heartfelt blessing on Ayaan & Farhaan's wedding wall!
        </p>
        <button
          onClick={onOpenForm}
          className="burgundy-gradient-bg text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all inline-flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-[#FCF6BA]" />
          <span>Write First Message</span>
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Wall Header Indicator */}
      <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#D4AF37]/20">
        <h2 className="font-serif-heading text-2xl font-bold text-[#800020] flex items-center gap-2">
          <span>Live Guestbook Messages</span>
          <span className="text-xs font-sans font-semibold bg-[#D4AF37]/20 text-[#5A0016] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40">
            {messages.length}
          </span>
        </h2>
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Realtime Live Stream • Newest First
        </span>
      </div>

      {/* Masonry / Grid Container */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 1, 0.5, 1],
              }}
            >
              <MessageCard
                message={msg}
                onLike={onLike}
                isNew={msg.id === newlyAddedId}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

    </section>
  );
}
