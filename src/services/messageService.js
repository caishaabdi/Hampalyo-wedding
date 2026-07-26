import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'hamplyo_wedding_messages_v1';
const LOCAL_CHANNEL_NAME = 'hamplyo_realtime_wall_channel';

// Relationship Enums
export const RELATIONSHIPS = [
  { key: 'Waalid', label: 'Waalid', englishLabel: 'Parent', icon: '👑', color: '#D4AF37' },
  { key: 'Walal', label: 'Walal', englishLabel: 'Sibling', icon: '❤️', color: '#800020' },
  { key: 'Saaxib', label: 'Saaxib', englishLabel: 'Friend', icon: '✨', color: '#C5A059' },
  { key: 'Xiriir', label: 'Xiriir', englishLabel: 'Relative', icon: '🌹', color: '#9B111E' },
  { key: 'Macallin', label: 'Macallin', englishLabel: 'Mentor', icon: '📚', color: '#B8860B' },
  { key: 'Jaar', label: 'Jaar', englishLabel: 'Neighbor', icon: '🏡', color: '#708090' },
];

// Default initial seed data
const INITIAL_SEED_MESSAGES = [
  {
    id: 'seed-msg-1',
    name: 'Hooyo & Aabo',
    relationship: 'Waalid',
    content: 'Ayaan & Farhaan, Hambalyo dhamaan reerka! Ilahay gurigiina ha ka dhigo mid nabad, kalgacal iyo barako buuxda ah. Waxaan idiin rajaynaynaa reer barwaaqo oo ubad qeyr qaba kala hela.',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    likes: 12,
  },
  {
    id: 'seed-msg-2',
    name: 'Mustafa Cabdi',
    relationship: 'Walal',
    content: 'Hambalyo Farhaan brother! So happy for you and Ayaan. You two are perfect for each other. Welcome to the family Ayaan! 🎉✨',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    likes: 8,
  },
  {
    id: 'seed-msg-3',
    name: 'Sumaya & Hamza',
    relationship: 'Saaxib',
    content: 'Wishing you both a lifetime of laughter, endless love, and joy! Haro & Naalo dhammaantiin. Munaasabad aad u qiimo badan!',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    likes: 15,
  },
  {
    id: 'seed-msg-4',
    name: 'Adeer Axmed',
    relationship: 'Xiriir',
    content: 'Barakallahu lakuma wa baraka alaykuma wa jama\'a baynakuma fii khayr. Guurkiina guur khayr leh ha noqdo!',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    likes: 19,
  },
  {
    id: 'seed-msg-5',
    name: 'Macallin Yuusuf',
    relationship: 'Macallin',
    content: 'Congratulations Ayaan & Farhaan! May your union be blessed with wisdom, patience, and boundless affection. Very proud of you!',
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    likes: 6,
  },
  {
    id: 'seed-msg-6',
    name: 'Reer Jaar Nuur',
    relationship: 'Jaar',
    content: 'Hambalyo iyadoo farxad leh! Waxaan idiin rajaynaynaa aqal galkiina inuu noqdo mid nabad iyo barako badan leh.',
    createdAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    likes: 7,
  }
];

class MessageService {
  constructor() {
    this.listeners = new Set();
    this.localChannel = null;
    this.supabaseChannel = null;
    this.cachedMessages = [];

    // Initialize local tab-to-tab BroadcastChannel fallback
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.localChannel = new BroadcastChannel(LOCAL_CHANNEL_NAME);
        this.localChannel.onmessage = (event) => {
          if (!isSupabaseConfigured) {
            this._handleLocalBroadcast(event.data);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel error:', err);
      }
    }
  }

  isDatabaseConnected() {
    return isSupabaseConfigured;
  }

  // Fetch messages from Supabase Postgres DB (or local storage fallback)
  async fetchMessages() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Map DB snake_case columns to app camelCase model
        this.cachedMessages = (data || []).map(row => ({
          id: row.id,
          name: row.name,
          relationship: row.relationship,
          content: row.content,
          createdAt: row.created_at || row.createdAt,
          likes: row.likes || 0
        }));

        return this.cachedMessages;
      } catch (err) {
        console.error('Supabase fetch error, falling back to local storage:', err);
      }
    }

    // Local storage fallback
    return this._getLocalMessages();
  }

  // Add new message to Supabase Postgres (or local storage)
  async addMessage({ name, relationship, content }) {
    const cleanName = name.trim().slice(0, 50);
    const cleanContent = content.trim().slice(0, 500);

    if (!cleanName || !cleanContent) {
      throw new Error('Name and content are required.');
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert([
            {
              name: cleanName,
              relationship: relationship || 'Saaxib',
              content: cleanContent,
              likes: 0
            }
          ])
          .select()
          .single();

        if (error) throw error;

        const newMsg = {
          id: data.id,
          name: data.name,
          relationship: data.relationship,
          content: data.content,
          createdAt: data.created_at,
          likes: data.likes || 0
        };

        this.cachedMessages = [newMsg, ...this.cachedMessages];
        this._notifyListeners(this.cachedMessages, newMsg, 'ADD');
        return newMsg;
      } catch (err) {
        console.error('Supabase insert error, saving locally:', err);
      }
    }

    // Local storage fallback
    const newMsg = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      name: cleanName,
      relationship: relationship || 'Saaxib',
      content: cleanContent,
      createdAt: new Date().toISOString(),
      likes: 0
    };

    const current = this._getLocalMessages();
    const updated = [newMsg, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    if (this.localChannel) {
      this.localChannel.postMessage({ type: 'NEW_MESSAGE', message: newMsg });
    }

    this.cachedMessages = updated;
    this._notifyListeners(updated, newMsg, 'ADD');
    return newMsg;
  }

  // Toggle like
  async toggleLike(messageId) {
    if (isSupabaseConfigured && supabase) {
      try {
        const target = this.cachedMessages.find(m => m.id === messageId);
        const newLikes = (target ? target.likes || 0 : 0) + 1;

        const { error } = await supabase
          .from('messages')
          .update({ likes: newLikes })
          .eq('id', messageId);

        if (error) throw error;

        this.cachedMessages = this.cachedMessages.map(m =>
          m.id === messageId ? { ...m, likes: newLikes } : m
        );
        this._notifyListeners(this.cachedMessages, { messageId }, 'LIKE');
        return;
      } catch (err) {
        console.error('Supabase update like error:', err);
      }
    }

    // Local storage fallback
    const current = this._getLocalMessages();
    const updated = current.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, likes: (msg.likes || 0) + 1 };
      }
      return msg;
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    if (this.localChannel) {
      this.localChannel.postMessage({ type: 'LIKE_MESSAGE', messageId });
    }
    this.cachedMessages = updated;
    this._notifyListeners(updated, { messageId }, 'LIKE');
  }

  // Subscribe to Realtime Updates (Supabase Realtime WebSocket or BroadcastChannel)
  subscribe(callback) {
    this.listeners.add(callback);

    // Attach Supabase WebSocket listener if configured
    if (isSupabaseConfigured && supabase && !this.supabaseChannel) {
      this.supabaseChannel = supabase
        .channel('public:messages')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'messages' },
          async () => {
            const fresh = await this.fetchMessages();
            this._notifyListeners(fresh, null, 'SYNC');
          }
        )
        .subscribe();
    }

    return () => {
      this.listeners.delete(callback);
    };
  }

  // Reset local demo data
  resetMessages() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_MESSAGES));
    this.cachedMessages = INITIAL_SEED_MESSAGES;
    if (this.localChannel) {
      this.localChannel.postMessage({ type: 'RESET' });
    }
    this._notifyListeners(INITIAL_SEED_MESSAGES, null, 'RESET');
  }

  _getLocalMessages() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_MESSAGES));
        return INITIAL_SEED_MESSAGES;
      }
      const parsed = JSON.parse(data);
      return parsed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (e) {
      return INITIAL_SEED_MESSAGES;
    }
  }

  _handleLocalBroadcast(data) {
    const fresh = this._getLocalMessages();
    this.cachedMessages = fresh;
    if (data && data.type === 'NEW_MESSAGE') {
      this._notifyListeners(fresh, data.message, 'ADD');
    } else {
      this._notifyListeners(fresh, null, 'SYNC');
    }
  }

  _notifyListeners(messages, payload, actionType) {
    this.listeners.forEach(cb => cb(messages, payload, actionType));
  }
}

export const messageService = new MessageService();
