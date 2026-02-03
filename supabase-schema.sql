-- =============================================
-- SUPABASE DATABASE SCHEMA FOR BRM EXPEDITIONS
-- =============================================
-- Run this SQL in your Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TOURS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS tours (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500),
  description TEXT,
  hero_image VARCHAR(1000),
  duration_days INTEGER DEFAULT 1,
  duration_nights INTEGER DEFAULT 0,
  difficulty VARCHAR(50) DEFAULT 'moderate',
  
  -- Pricing
  price DECIMAL(10,2) DEFAULT 0,
  original_price DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'USD',
  rider_price DECIMAL(10,2) DEFAULT 0,
  pillion_price DECIMAL(10,2) DEFAULT 0,
  single_supplement DECIMAL(10,2) DEFAULT 0,
  deposit_amount DECIMAL(10,2) DEFAULT 0,
  deposit_type VARCHAR(20) DEFAULT 'percentage',
  
  -- Discounts
  early_bird_enabled BOOLEAN DEFAULT FALSE,
  early_bird_percentage INTEGER DEFAULT 0,
  early_bird_deadline_days INTEGER DEFAULT 60,
  group_discount_enabled BOOLEAN DEFAULT FALSE,
  group_discount_min_riders INTEGER DEFAULT 4,
  group_discount_percentage INTEGER DEFAULT 0,
  
  -- Location
  start_location VARCHAR(255),
  end_location VARCHAR(255),
  countries JSONB DEFAULT '[]',
  regions JSONB DEFAULT '[]',
  
  -- Tour Details
  max_group_size INTEGER DEFAULT 12,
  min_group_size INTEGER DEFAULT 4,
  total_distance VARCHAR(100),
  terrain JSONB DEFAULT '[]',
  best_season VARCHAR(255),
  
  -- Content
  highlights JSONB DEFAULT '[]',
  inclusions JSONB DEFAULT '[]',
  exclusions JSONB DEFAULT '[]',
  itinerary JSONB DEFAULT '[]',
  gallery JSONB DEFAULT '[]',
  upgrades JSONB DEFAULT '[]',
  available_bikes JSONB DEFAULT '[]',
  departure_dates JSONB DEFAULT '[]',
  
  -- SEO
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords JSONB DEFAULT '[]',
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  
  -- Map
  map_url VARCHAR(1000),
  map_embed_url VARCHAR(1000),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_tours_status ON tours(status);
CREATE INDEX idx_tours_featured ON tours(featured);
CREATE INDEX idx_tours_slug ON tours(slug);

-- =============================================
-- DESTINATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS destinations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100),
  tagline VARCHAR(500),
  description TEXT,
  hero_image VARCHAR(1000),
  
  -- Details
  difficulty VARCHAR(50) DEFAULT 'moderate',
  altitude VARCHAR(100),
  best_time_to_visit VARCHAR(255),
  climate TEXT,
  terrain JSONB DEFAULT '[]',
  
  -- Content
  highlights JSONB DEFAULT '[]',
  popular_routes JSONB DEFAULT '[]',
  things_to_know JSONB DEFAULT '[]',
  gallery JSONB DEFAULT '[]',
  
  -- SEO
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords JSONB DEFAULT '[]',
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft',
  featured BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_destinations_status ON destinations(status);
CREATE INDEX idx_destinations_featured ON destinations(featured);
CREATE INDEX idx_destinations_slug ON destinations(slug);

-- =============================================
-- BIKES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS bikes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100),
  model VARCHAR(255),
  year INTEGER,
  image VARCHAR(1000),
  gallery JSONB DEFAULT '[]',
  
  -- Specifications
  engine_capacity VARCHAR(50),
  power VARCHAR(50),
  torque VARCHAR(50),
  weight VARCHAR(50),
  seat_height VARCHAR(50),
  fuel_capacity VARCHAR(50),
  transmission VARCHAR(100),
  top_speed VARCHAR(50),
  
  -- Details
  description TEXT,
  features JSONB DEFAULT '[]',
  ideal_for JSONB DEFAULT '[]',
  category VARCHAR(50) DEFAULT 'adventure',
  
  -- Pricing
  rental_price DECIMAL(10,2) DEFAULT 0,
  upgrade_price DECIMAL(10,2) DEFAULT 0,
  
  -- Status
  available BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bikes_available ON bikes(available);
CREATE INDEX idx_bikes_category ON bikes(category);

-- =============================================
-- BOOKINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_number VARCHAR(50) UNIQUE,
  
  -- Tour Info
  tour_id UUID REFERENCES tours(id),
  tour_title VARCHAR(255),
  departure_date DATE,
  
  -- Customer Info
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_country VARCHAR(100),
  
  -- Booking Details
  riders INTEGER DEFAULT 1,
  pillions INTEGER DEFAULT 0,
  selected_bike VARCHAR(255),
  selected_upgrades JSONB DEFAULT '[]',
  special_requests TEXT,
  
  -- Pricing
  base_price DECIMAL(10,2) DEFAULT 0,
  upgrades_total DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) DEFAULT 0,
  deposit_amount DECIMAL(10,2) DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending',
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX idx_bookings_customer_email ON bookings(customer_email);

-- =============================================
-- PAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image VARCHAR(1000),
  
  -- Settings
  template VARCHAR(50) DEFAULT 'default',
  show_in_menu BOOLEAN DEFAULT FALSE,
  menu_order INTEGER DEFAULT 0,
  
  -- SEO
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords JSONB DEFAULT '[]',
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_pages_status ON pages(status);
CREATE INDEX idx_pages_slug ON pages(slug);

-- =============================================
-- MEDIA TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255),
  url VARCHAR(1000) NOT NULL,
  type VARCHAR(50) DEFAULT 'image',
  category VARCHAR(50) DEFAULT 'general',
  alt_text VARCHAR(255),
  caption TEXT,
  file_size INTEGER,
  dimensions VARCHAR(50),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_media_category ON media(category);
CREATE INDEX idx_media_type ON media(type);

-- =============================================
-- SITE SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- The entire settings JSON
  settings JSONB NOT NULL DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================
-- Enable RLS on all tables
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public read access for published tours" ON tours
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read access for published destinations" ON destinations
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read access for available bikes" ON bikes
  FOR SELECT USING (available = TRUE);

CREATE POLICY "Public read access for published pages" ON pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public read access for media" ON media
  FOR SELECT USING (TRUE);

CREATE POLICY "Public read access for site settings" ON site_settings
  FOR SELECT USING (TRUE);

-- Allow anyone to create bookings
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT WITH CHECK (TRUE);

-- =============================================
-- ADMIN ACCESS (for authenticated users)
-- =============================================
-- You can create an admin user and add policies like:
-- CREATE POLICY "Admin full access to tours" ON tours
--   FOR ALL USING (auth.role() = 'authenticated');

-- For now, we'll allow all operations for development
-- REMOVE THESE IN PRODUCTION and use proper auth!
CREATE POLICY "Dev: Allow all tour operations" ON tours FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Dev: Allow all destination operations" ON destinations FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Dev: Allow all bike operations" ON bikes FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Dev: Allow all booking operations" ON bookings FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Dev: Allow all page operations" ON pages FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Dev: Allow all media operations" ON media FOR ALL USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Dev: Allow all settings operations" ON site_settings FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- =============================================
-- STORAGE BUCKET FOR IMAGES
-- =============================================
-- Run this in Storage section of Supabase or via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Storage policies (run in SQL editor)
-- CREATE POLICY "Public read access for images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'images');
-- 
-- CREATE POLICY "Anyone can upload images" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'images');
-- 
-- CREATE POLICY "Anyone can delete images" ON storage.objects
--   FOR DELETE USING (bucket_id = 'images');
