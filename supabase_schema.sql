-- Blog Posts Table
-- Run this in your Supabase SQL Editor to create the posts table

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  author TEXT DEFAULT 'Admin',
  date TEXT,
  read_time TEXT DEFAULT '5 min read',
  category TEXT DEFAULT 'Adventure',
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  seo JSONB DEFAULT '{"metaTitle": "", "metaDescription": "", "keywords": []}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to published posts
CREATE POLICY "Public posts are viewable by everyone"
  ON posts FOR SELECT
  USING (status = 'published');

-- Policy: Allow authenticated users to do everything
CREATE POLICY "Authenticated users can manage posts"
  ON posts FOR ALL
  USING (auth.role() = 'authenticated');
