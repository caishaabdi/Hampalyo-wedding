import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, QrCode, Tv, Quote } from 'lucide-react';
import { RELATIONSHIPS } from '../services/messageService';

export default function LivePresentation({ messages, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate spotlight message every 8 seconds
  useEffect(() => {
    if (messages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const activeMessage = messages[currentIndex] || messages[0];
  const relInfo = activeMessage
    ? RELATIONSHIPS.find((r) => r.key === activeMessage.relationship) || { label: activeMessage.relationship, icon: '✨' }
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-[#120206] text-white flex flex-col justify-between p-6 sm:p-12 overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      
      {/* Background Animated Gradient Blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-radial from-[#800020] via-[#5A0016] to-transparent blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-radial from-[#D4AF37]/30 via-[#BF953F]/10 to-transparent blur-3xl animate-pulse" />
      </div>

      {/* Top Bar Header */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#D4AF37]/30 pb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-[#800020] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shadow-lg">
            <Heart className="w-6 h-6 fill-[#D4AF37]" />
          </div>
          <div>
            <h1 className="font-script text-4xl sm:text-5xl text-[#FCF6BA] font-bold leading-none">
              Ayaan & Farhaan
            </h1>
            <p className="text-xs text-[#D4AF37] tracking-widest uppercase font-semibold mt-1">
              Digital Wedding Message Wall • Live Venue Display
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Live Indicator */}
          <div className="flex items-center space-x-2 bg-[#800020]/80 border border-[#D4AF37]/50 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#FCF6BA]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Stream ({messages.length})</span>
          </div>

          <button
            onClick={onClose}
            className="p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            title="Exit Fullscreen Presentation"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Center Spotlight Showcase Card */}
      <div className="relative z-10 max-w-4xl mx-auto my-auto w-full px-4">
        {activeMessage && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMessage.id + '-' + currentIndex}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.9 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#FAF9F6] text-slate-900 rounded-3xl p-8 sm:p-14 shadow-2xl border-2 border-[#D4AF37] relative"
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#800020] via-[#D4AF37] to-[#800020] rounded-t-3xl" />

              {/* Quote Mark */}
              <Quote className="w-16 h-16 text-[#D4AF37]/20 absolute top-8 left-8 -rotate-12 pointer-events-none" />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-[#800020] text-white flex items-center justify-center font-serif-heading text-2xl font-bold border-2 border-[#D4AF37]">
                    {activeMessage.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-serif-heading text-3xl font-bold text-slate-900">
                      {activeMessage.name}
                    </h2>
                    <span className="text-xs text-slate-500 font-medium">Guest Wish #{currentIndex + 1} of {messages.length}</span>
                  </div>
                </div>

                <div className="wax-seal-badge-active px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                  <span>{relInfo?.icon}</span>
                  <span>{relInfo?.label}</span>
                </div>
              </div>

              {/* Message Content */}
              <p className="font-serif-heading text-2xl sm:text-4xl italic text-slate-800 leading-relaxed my-6 font-medium">
                "{activeMessage.content}"
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200 text-xs text-slate-500 font-semibold">
                <div className="flex items-center space-x-1 text-[#800020]">
                  <Heart className="w-4 h-4 fill-[#800020]" />
                  <span>{activeMessage.likes || 0} Loves</span>
                </div>
                <span>Hamplyo & Duco • Ayaan & Farhaan</span>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Bottom Footer & Guest Instructions */}
      <div className="relative z-10 border-t border-[#D4AF37]/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 bg-white/10 px-5 py-3 rounded-2xl border border-white/20">
          <QrCode className="w-6 h-6 text-[#FCF6BA]" />
          <div>
            <p className="text-xs text-[#FCF6BA] font-bold uppercase tracking-wider">Leave a Wish on Your Phone</p>
            <p className="text-xs text-white/80">Scan QR Code or visit this link to post your message live!</p>
          </div>
        </div>

        <div className="text-center sm:text-right">
          <p className="font-script text-2xl text-[#FCF6BA]">May your love grow stronger every day</p>
          <p className="text-xs text-white/60">Press Esc or tap close to exit Venue Presentation Mode</p>
        </div>
      </div>

    </div>
  );
}
