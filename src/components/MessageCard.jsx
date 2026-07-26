import React, { useState } from 'react';
import { Heart, Share2, Check, Quote, Clock } from 'lucide-react';
import { RELATIONSHIPS } from '../services/messageService';

export default function MessageCard({ message, onLike, isNew }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  // Find relationship details
  const relInfo = RELATIONSHIPS.find(r => r.key === message.relationship) || {
    label: message.relationship,
    englishLabel: 'Guest',
    icon: '✨'
  };

  // Format relative timestamp
  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Recently';
    }
  };

  const handleLike = () => {
    onLike(message.id);
    setLiked(true);
    setTimeout(() => setLiked(false), 800);
  };

  const handleCopy = () => {
    const text = `"${message.content}" — ${message.name} (${relInfo.label})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className={`stationery-card group flex flex-col justify-between ${isNew ? 'ring-2 ring-[#D4AF37] ring-offset-2 animate-pulse' : ''}`}>
      
      <div>
        {/* Card Header: Guest Name & Wax Seal Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3">
            {/* Avatar Initial Circle */}
            <div className="w-11 h-11 rounded-full bg-[#FAF9F6] border border-[#D4AF37]/40 flex items-center justify-center font-serif-heading font-bold text-lg text-[#800020] shadow-xs shrink-0 group-hover:bg-[#800020] group-hover:text-white transition-colors">
              {message.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 className="font-serif-heading text-lg font-bold text-slate-900 leading-snug">
                {message.name}
              </h3>
              <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-medium">
                <Clock className="w-3 h-3 text-[#D4AF37]" />
                <span>{formatTime(message.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Relationship Wax Seal / Foil Sticker Badge */}
          <div className="wax-seal-badge px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shrink-0">
            <span>{relInfo.icon}</span>
            <span>{relInfo.label}</span>
          </div>
        </div>

        {/* Decorative Quote Icon & Message Content */}
        <div className="relative my-3">
          <Quote className="w-6 h-6 text-[#D4AF37]/20 absolute -top-2 -left-1 rotate-180 pointer-events-none" />
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed pl-3 italic font-serif-heading font-medium">
            "{message.content}"
          </p>
        </div>
      </div>

      {/* Card Footer: Interactive Actions (Like & Share) */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            liked || message.likes > 0
              ? 'text-[#800020] bg-[#800020]/10 border border-[#800020]/20'
              : 'text-slate-500 hover:text-[#800020] hover:bg-slate-50 border border-transparent'
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform ${liked ? 'scale-125 fill-[#800020] text-[#800020]' : message.likes > 0 ? 'fill-[#800020] text-[#800020]' : ''}`} />
          <span>{message.likes || 0}</span>
        </button>

        {/* Copy Share Snippet */}
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-[#800020] px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          title="Copy message snippet"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Coppy</span>
            </>
          )}
        </button>

      </div>

    </article>
  );
}
