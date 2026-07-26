-- ========================================================
-- Realtime Digital Wedding Message Wall: Supabase Database Schema
-- Run this script in your Supabase SQL Editor (https://supabase.com)
-- ========================================================

-- 1. Create the `messages` table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    relationship VARCHAR(20) NOT NULL,
    content VARCHAR(500) NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Realtime on the `messages` table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 4. RLS Security Policies:
-- Allow anyone (anonymous guests) to read all messages
CREATE POLICY "Allow public select on messages"
    ON public.messages
    FOR SELECT
    USING (true);

-- Allow anyone (anonymous guests) to insert new messages (no edits/deletes allowed)
CREATE POLICY "Allow public insert on messages"
    ON public.messages
    FOR INSERT
    WITH CHECK (
        char_length(name) > 0 AND char_length(name) <= 50 AND
        char_length(content) > 0 AND char_length(content) <= 500
    );

-- Allow anyone (anonymous guests) to increment likes
CREATE POLICY "Allow public update on likes"
    ON public.messages
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- ========================================================
-- Seed Initial Sample Somali Wedding Messages
-- ========================================================
INSERT INTO public.messages (name, relationship, content, likes) VALUES
('Hooyo & Aabo', 'Waalid', 'Ayaan & Farhaan, Hambalyo dhamaan reerka! Ilahay gurigiina ha ka dhigo mid nabad, kalgacal iyo barako buuxda ah.', 12),
('Mustafa Cabdi', 'Walal', 'Hambalyo Farhaan brother! So happy for you and Ayaan. You two are perfect for each other. Welcome to the family Ayaan! 🎉✨', 8),
('Sumaya & Hamza', 'Saaxib', 'Wishing you both a lifetime of laughter, endless love, and joy! Haro & Naalo dhammaantiin.', 15),
('Adeer Axmed', 'Xiriir', 'Barakallahu lakuma wa baraka alaykuma wa jama''a baynakuma fii khayr. Guurkiina guur khayr leh ha noqdo!', 19),
('Macallin Yuusuf', 'Macallin', 'Congratulations Ayaan & Farhaan! May your union be blessed with wisdom, patience, and boundless affection.', 6),
('Reer Jaar Nuur', 'Jaar', 'Hambalyo iyadoo farxad leh! Waxaan idiin rajaynaynaa aqal galkiina inuu noqdo mid nabad iyo barako badan leh.', 7);
