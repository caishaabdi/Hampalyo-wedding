import React, { useState } from 'react';
import { X, Send, Sparkles, AlertCircle, Heart, CheckCircle2 } from 'lucide-react';
import { RELATIONSHIPS } from '../services/messageService';

export default function MessageFormModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Saaxib');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [lastSubmittedTime, setLastSubmittedTime] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanName = name.trim();
    const cleanContent = content.trim();

    if (!cleanName) {
      setError('Please enter your name.');
      return;
    }
    if (!cleanContent) {
      setError('Please write a message or blessing for the couple.');
      return;
    }

    // Rate Limiting Debounce Guard (prevent spam clicking within 5 seconds)
    const now = Date.now();
    if (now - lastSubmittedTime < 5000) {
      setError('Please wait a few seconds before submitting another wish.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: cleanName,
        relationship,
        content: cleanContent,
      });

      setLastSubmittedTime(now);
      setName('');
      setContent('');
      setRelationship('Saaxib');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#FAF9F6] rounded-3xl shadow-2xl border border-[#D4AF37]/50 overflow-hidden transform transition-all my-8">
        
        {/* Top Gold & Burgundy Header Strip */}
        <div className="burgundy-gradient-bg px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 mb-1">
            <Heart className="w-5 h-5 text-[#FCF6BA] fill-[#FCF6BA]" />
            <span className="text-xs uppercase tracking-widest text-[#FCF6BA] font-semibold">Wedding Guestbook</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-heading font-bold text-white">
            Send Your Hamplyo & Duco
          </h2>
          <p className="text-xs text-white/80 mt-1">
            Your wish will be displayed live on the venue wall in real-time.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Guest Name Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Your Name <span className="text-[#800020]">*</span>
            </label>
            <input
              type="text"
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Caasha & Yaasiin"
              className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-xl text-sm focus:outline-none focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/20 transition-all text-slate-800 placeholder:text-slate-400"
              required
            />
            <div className="flex justify-end mt-1">
              <span className="text-[11px] text-slate-400">{name.length}/50</span>
            </div>
          </div>

          {/* Relationship Selector Wax Seals */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Your Relationship to the Couple <span className="text-[#800020]">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {RELATIONSHIPS.map((rel) => {
                const isSelected = relationship === rel.key;
                return (
                  <button
                    type="button"
                    key={rel.key}
                    onClick={() => setRelationship(rel.key)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all border ${
                      isSelected
                        ? 'wax-seal-badge-active scale-105 shadow-md'
                        : 'wax-seal-badge hover:scale-102'
                    }`}
                  >
                    <span>{rel.icon}</span>
                    <span>{rel.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Your Blessing & Wish <span className="text-[#800020]">*</span>
            </label>
            <textarea
              rows={4}
              maxLength={500}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your heartfelt congratulations, prayers, or advice for Ayaan & Farhaan..."
              className="w-full px-4 py-3 bg-[#FFFFFF] border border-[#D4AF37]/40 rounded-xl text-sm focus:outline-none focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/20 transition-all text-slate-800 placeholder:text-slate-400 font-serif-heading text-base leading-relaxed"
              required
            />
            <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
              <span>Somali or English welcome ❤️</span>
              <span>{content.length}/500</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full burgundy-gradient-bg text-white hover:opacity-95 py-3.5 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 text-sm border border-[#D4AF37]/50 active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Wish...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#FCF6BA]" />
                  <span>Post to Live Wall & Trigger Confetti</span>
                  <Sparkles className="w-4 h-4 text-[#FCF6BA]" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
