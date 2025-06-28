
-- Create storage buckets for files
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('playlist-covers', 'playlist-covers', true),
  ('songs', 'songs', true);

-- Create playlists table
CREATE TABLE public.playlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create songs table
CREATE TABLE public.songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  artist TEXT NOT NULL,
  file_url TEXT NOT NULL,
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (user side)
CREATE POLICY "Anyone can view playlists" ON public.playlists FOR SELECT USING (true);
CREATE POLICY "Anyone can view songs" ON public.songs FOR SELECT USING (true);

-- Create admin user account
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@gmail.com',
  crypt('admin', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Create admin policies for full CRUD access
CREATE POLICY "Admin can manage playlists" ON public.playlists 
  FOR ALL USING (auth.email() = 'admin@gmail.com');

CREATE POLICY "Admin can manage songs" ON public.songs 
  FOR ALL USING (auth.email() = 'admin@gmail.com');

-- Create storage policies
CREATE POLICY "Anyone can view playlist covers" ON storage.objects 
  FOR SELECT USING (bucket_id = 'playlist-covers');

CREATE POLICY "Anyone can view songs" ON storage.objects 
  FOR SELECT USING (bucket_id = 'songs');

CREATE POLICY "Admin can upload playlist covers" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'playlist-covers' AND auth.email() = 'admin@gmail.com');

CREATE POLICY "Admin can upload songs" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'songs' AND auth.email() = 'admin@gmail.com');

CREATE POLICY "Admin can delete playlist covers" ON storage.objects 
  FOR DELETE USING (bucket_id = 'playlist-covers' AND auth.email() = 'admin@gmail.com');

CREATE POLICY "Admin can delete songs" ON storage.objects 
  FOR DELETE USING (bucket_id = 'songs' AND auth.email() = 'admin@gmail.com');
