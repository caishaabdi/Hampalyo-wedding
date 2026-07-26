import React from 'react';
import { Heart, Volume2, VolumeX, Tv, PenTool, Sparkles, Database } from 'lucide-react';
import { messageService } from '../services/messageService';

export default function Navbar({ messageCount, onOpenForm, onTogglePresentation, isMuted, onToggleMute }) {
  const isDbConnected = messageService.isDatabaseConnected();

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-[#800020] flex items-center justify-center text-[#D4AF37] shadow-md border border-[#D4AF37]/50 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-script text-2xl font-bold text-[#800020] leading-none">Hamplyo & Duco</span>
              
              {/* Database Connection Status Badge */}
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                isDbConnected
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-[#D4AF37]/15 text-[#5A0016] border-[#D4AF37]/40'
              }`}>
                {isDbConnected ? (
                  <>
                    <Database className="w-3 h-3 text-emerald-600 animate-pulse" /> Supabase Realtime
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Local Realtime
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium tracking-wide">Ayaan & Farhaan's Wedding Wall</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          
          {/* Live Message Counter Badge */}
          <div className="hidden md:flex items-center space-x-1.5 bg-[#FFFFFF] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30 shadow-xs text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>{messageCount} {messageCount === 1 ? 'Wish' : 'Wishes'} Shared</span>
          </div>

          {/* Mute/Sound Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? "Enable chime sound on new message" : "Mute sound"}
            className="p-2.5 text-slate-600 hover:text-[#800020] hover:bg-[#D4AF37]/10 rounded-full transition-colors border border-transparent hover:border-[#D4AF37]/30"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-[#800020]" />}
          </button>

          {/* Fullscreen TV Presentation Mode */}
          <button
            onClick={onTogglePresentation}
            className="hidden sm:flex items-center space-x-2 bg-[#FFFFFF] text-[#800020] hover:bg-[#FAF9F6] border border-[#800020]/30 hover:border-[#800020] px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95"
            title="Open TV / Venue Projector Presentation Mode"
          >
            <Tv className="w-4 h-4 text-[#800020]" />
            <span>Venue View</span>
          </button>

          {/* Write Message CTA */}
          <button
            onClick={onOpenForm}
            className="burgundy-gradient-bg text-white hover:opacity-95 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center space-x-2 border border-[#AA771C]/40 active:scale-95"
          >
            <PenTool className="w-4 h-4 text-[#FCF6BA]" />
            <span>Leave a Wish</span>
          </button>

        </div>

      </div>
    </header>
  );
}
