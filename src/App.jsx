import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MessageWall from './components/MessageWall';
import MessageFormModal from './components/MessageFormModal';
import LivePresentation from './components/LivePresentation';
import { messageService } from './services/messageService';
import { triggerWeddingConfetti } from './utils/confetti';
import { Heart, Sparkles, Database, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [newlyAddedId, setNewlyAddedId] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  // Play subtle bell chime audio on new message
  const playSubmissionChime = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const playTone = (freq, time, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + duration);
      };

      // Play soft wedding harp arpeggio (C5 - E5 - G5 - C6)
      playTone(523.25, 0, 0.4);
      playTone(659.25, 0.1, 0.5);
      playTone(783.99, 0.2, 0.6);
      playTone(1046.50, 0.35, 0.9);
    } catch (e) {
      console.warn('Audio chime unsupported:', e);
    }
  };

  // Load initial messages from database & subscribe to realtime updates
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      const initial = await messageService.fetchMessages();
      if (isMounted) setMessages(initial);
    };

    loadInitialData();

    const unsubscribe = messageService.subscribe((updatedMessages, payload, actionType) => {
      if (!isMounted) return;
      setMessages(updatedMessages);

      if (actionType === 'ADD' && payload) {
        setNewlyAddedId(payload.id);
        playSubmissionChime();
        setTimeout(() => setNewlyAddedId(null), 4000);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isMuted]);

  // Handle new message submission
  const handleAddMessage = async (formData) => {
    const newMsg = await messageService.addMessage(formData);
    setNewlyAddedId(newMsg.id);
    
    // Trigger festive wedding confetti
    triggerWeddingConfetti();
    playSubmissionChime();

    setTimeout(() => setNewlyAddedId(null), 4000);
  };

  // Handle like toggle
  const handleLike = async (messageId) => {
    await messageService.toggleLike(messageId);
  };

  // Reset demo seed data
  const handleResetData = () => {
    if (window.confirm('Reset message wall to initial sample wishes?')) {
      messageService.resetMessages();
    }
  };

  // Filter & Search computation
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      if (activeFilter !== 'ALL' && msg.relationship !== activeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = msg.name.toLowerCase().includes(q);
        const matchesContent = msg.content.toLowerCase().includes(q);
        const matchesRel = msg.relationship.toLowerCase().includes(q);
        return matchesName || matchesContent || matchesRel;
      }
      return true;
    });
  }, [messages, activeFilter, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#800020] selection:text-white">
      
      <div>
        {/* Top Navbar */}
        <Navbar
          messageCount={messages.length}
          onOpenForm={() => setIsFormOpen(true)}
          onTogglePresentation={() => setIsPresentationOpen(true)}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
        />

        {/* Hero Banner with Filters */}
        <Hero
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenForm={() => setIsFormOpen(true)}
          onReset={handleResetData}
        />

        {/* Live Message Grid Wall */}
        <main>
          <MessageWall
            messages={filteredMessages}
            onLike={handleLike}
            newlyAddedId={newlyAddedId}
            onOpenForm={() => setIsFormOpen(true)}
          />
        </main>
      </div>

      {/* Floating Bottom Sticky Action Pill for Mobile */}
      <div className="fixed bottom-6 right-6 z-30 sm:hidden">
        <button
          onClick={() => setIsFormOpen(true)}
          className="burgundy-gradient-bg text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center space-x-2 text-xs font-bold border border-[#D4AF37] active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-[#FCF6BA]" />
          <span>Leave Wish</span>
        </button>
      </div>

      {/* Submission Modal */}
      <MessageFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddMessage}
      />

      {/* Fullscreen Venue Presentation Overlay */}
      {isPresentationOpen && (
        <LivePresentation
          messages={messages}
          onClose={() => setIsPresentationOpen(false)}
        />
      )}

      {/* Luxury Stationery Footer */}
      <footer className="mt-20 border-t border-[#D4AF37]/30 bg-[#FFFFFF]/60 backdrop-blur-xs py-10 px-4 text-center text-slate-500 text-xs">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex justify-center items-center space-x-2 text-[#800020] font-script text-3xl font-bold">
            <Heart className="w-5 h-5 fill-[#800020]" />
            <span>Ayaan & Farhaan</span>
            <Heart className="w-5 h-5 fill-[#800020]" />
          </div>
          <p className="font-serif-heading italic text-sm text-slate-700">
            "Waxaan idiin rajaynaynaa reer barwaaqo oo ubad qeyr qaba kala hela."
          </p>
          <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-400 font-semibold pt-2">
            <span className="flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-emerald-600" /> Supabase Realtime Connected
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> Anonymous Security Rules
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-[#800020]" /> July 26, 2026
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
