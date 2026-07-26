import React from 'react';
import { Search, Sparkles, Filter, RefreshCw } from 'lucide-react';
import { RELATIONSHIPS } from '../services/messageService';

export default function Hero({
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onOpenForm,
  onReset
}) {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
      
      {/* Subtle Background Ornament */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-30">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#D4AF37]/20 via-[#800020]/10 to-transparent blur-3xl" />
      </div>

      {/* Decorative Top Stamp */}
      <div className="inline-flex items-center space-x-2 bg-[#FFFFFF] border border-[#D4AF37]/40 px-4 py-1.5 rounded-full shadow-xs mb-4">
        <span className="text-xs tracking-widest uppercase font-semibold text-[#800020]">Digital Guestbook & Wall</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
        <span className="text-xs font-serif-heading italic text-[#5A0016]">July 26, 2026</span>
      </div>

      {/* Main Calligraphy Title */}
      <h1 className="text-5xl sm:text-7xl lg:text-8xl font-script text-[#800020] mb-2 leading-none drop-shadow-xs">
        Aisha & Ahmed
      </h1>

      {/* Subtitle & Romantic Tagline */}
      <p className="font-serif-heading text-xl sm:text-2xl italic text-[#5A0016] max-w-2xl mx-auto font-medium mb-4">
        "Nabad, Kalgacal & Barako" — Welcome to our Digital Wedding Wall
      </p>

      <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed mb-8">
        Share your heartfelt prayers, warm congratulations, and unforgettable memories for the newlyweds. Your words will appear instantly on the screen!
      </p>

      {/* CTA Button */}
      <div className="flex justify-center mb-10">
        <button
          onClick={onOpenForm}
          className="burgundy-gradient-bg text-white hover:opacity-95 px-8 py-3.5 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center space-x-3 text-base border border-[#D4AF37]/50 active:scale-95 group"
        >
          <Sparkles className="w-5 h-5 text-[#FCF6BA] group-hover:rotate-12 transition-transform" />
          <span>Add Your Message Now</span>
        </button>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-[#FFFFFF]/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-[#D4AF37]/30 shadow-sm max-w-3xl mx-auto space-y-4">
        
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, message content, or relationship..."
            className="w-full pl-12 pr-4 py-3 bg-[#FAF9F6] border border-[#D4AF37]/30 rounded-xl text-sm focus:outline-none focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/20 transition-all placeholder:text-slate-400 text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-200/60 px-2 py-1 rounded-md"
            >
              Clear
            </button>
          )}
        </div>

        {/* Relationship Wax Seal Filter Badges */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-[#800020]" />
            <span>Filter by Relationship:</span>
          </div>
          
          <button
            onClick={onReset}
            title="Reset wall data to initial state"
            className="text-xs text-slate-400 hover:text-[#800020] flex items-center space-x-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Badge Selector Grid */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {/* ALL Filter Badge */}
          <button
            onClick={() => onFilterChange('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
              activeFilter === 'ALL'
                ? 'wax-seal-badge-active'
                : 'wax-seal-badge'
            }`}
          >
            🌟 All Wishes
          </button>

          {/* Relationship Badges */}
          {RELATIONSHIPS.map((rel) => (
            <button
              key={rel.key}
              onClick={() => onFilterChange(rel.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center space-x-1.5 ${
                activeFilter === rel.key
                  ? 'wax-seal-badge-active'
                  : 'wax-seal-badge'
              }`}
            >
              <span>{rel.icon}</span>
              <span>{rel.label}</span>
              <span className="opacity-70 text-[10px]">({rel.englishLabel})</span>
            </button>
          ))}
        </div>

      </div>

    </section>
  );
}
