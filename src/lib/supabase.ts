/**
 * Supabase Database Connection
 * Nepal Bike Tours CMS
 * 
 * Set ENABLE_SUPABASE to true when ready to use the database.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Tour, Destination, Bike, Booking, Page, SiteSettings } from '../types';

// ============================================
// CONFIGURATION
// ============================================

// Set to TRUE to use Supabase, FALSE for localStorage only
const ENABLE_SUPABASE = true;

// Your Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
// ============================================
// SUPABASE CLIENT
// ============================================

let supabase: SupabaseClient | null = null;

function initSupabase(): SupabaseClient | null {
  if (!ENABLE_SUPABASE) {
    console.log('📁 Supabase disabled - using localStorage');
    return null;
  }
  
  try {
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    console.log('✅ Supabase client initialized');
    return client;
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error);
    return null;
  }
}

function getSupabase(): SupabaseClient | null {
  if (!supabase && ENABLE_SUPABASE) {
    supabase = initSupabase();
  }
  return supabase;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function isSupabaseConfigured(): boolean {
  return ENABLE_SUPABASE && getSupabase() !== null;
}

export async function testConnection(): Promise<{
  connected: boolean;
  error?: string;
  tables?: { name: string; count: number; error?: string }[];
}> {
  const client = getSupabase();
  if (!client) {
    return { connected: false, error: 'Supabase not configured or disabled' };
  }
  
  try {
    const tables = ['tours', 'destinations', 'bikes', 'bookings', 'pages', 'site_settings', 'media'];
    const tableResults = await Promise.all(
      tables.map(async (table) => {
        try {
          const { count, error } = await client
            .from(table)
            .select('*', { count: 'exact', head: true });
          
          return error 
            ? { name: table, count: 0, error: error.message }
            : { name: table, count: count || 0 };
        } catch (err) {
          return { name: table, count: 0, error: String(err) };
        }
      })
    );
    
    const hasErrors = tableResults.some(t => t.error);
    return {
      connected: !hasErrors,
      tables: tableResults,
      error: hasErrors ? 'Some tables have issues' : undefined
    };
  } catch (error) {
    return { connected: false, error: String(error) };
  }
}

// ============================================
// MEDIA ITEM TYPE
// ============================================

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  category: string;
  created_at?: string;
}

// ============================================
// DATABASE OPERATIONS
// ============================================

export const db = {
  // ==================
  // TOURS
  // ==================
  
  async getTours(): Promise<Tour[]> {
    const client = getSupabase();
    if (!client) return [];
    
    try {
      const { data, error } = await client
        .from('tours')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tours:', error);
        return [];
      }
      
      return (data || []).map(mapTourFromDb);
    } catch (error) {
      console.error('Error fetching tours:', error);
      return [];
    }
  },
  
  async createTour(tour: Tour): Promise<Tour | null> {
    const client = getSupabase();
    if (!client) return null;
    
    try {
      const dbTour = mapTourToDb(tour);
      const { data, error } = await client
        .from('tours')
        .insert([dbTour])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating tour:', error);
        return null;
      }
      
      return mapTourFromDb(data);
    } catch (error) {
      console.error('Error creating tour:', error);
      return null;
    }
  },
  
  async updateTour(id: string, tour: Tour): Promise<Tour | null> {
    const client = getSupabase();
    if (!client) return null;
    
    try {
      const dbTour = mapTourToDb(tour);
      const { data, error } = await client
        .from('tours')
        .update(dbTour)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating tour:', error);
        return null;
      }
      
      return mapTourFromDb(data);
    } catch (error) {
      console.error('Error updating tour:', error);
      return null;
    }
  },
  
  async deleteTour(id: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    
    try {
      const { error } = await client
        .from('tours')
        .delete()
        .eq('id', id);
      
      return !error;
    } catch (error) {
      console.error('Error deleting tour:', error);
      return false;
    }
  },
  
  // ==================
  // DESTINATIONS
  // ==================
  
  async getDestinations(): Promise<Destination[]> {
    const client = getSupabase();
    if (!client) return [];
    
    try {
      const { data, error } = await client
        .from('destinations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) return [];
      return (data || []).map(mapDestinationFromDb);
    } catch {
      return [];
    }
  },
  
  async createDestination(destination: Destination): Promise<Destination | null> {
    const client = getSupabase();
    if (!client) return null;
    
    try {
      const { data, error } = await client
        .from('destinations')
        .insert([mapDestinationToDb(destination)])
        .select()
        .single();
      
      if (error) return null;
      return mapDestinationFromDb(data);
    } catch {
      return null;
    }
  },
  
  async updateDestination(id: string, destination: Destination): Promise<Destination | null> {
    const client = getSupabase();
    if (!client) return null;
    
    try {
      const { data, error } = await client
        .from('destinations')
        .update(mapDestinationToDb(destination))
        .eq('id', id)
        .select()
        .single();
      
      if (error) return null;
      return mapDestinationFromDb(data);
    } catch {
      return null;
    }
  },
  
  async deleteDestination(id: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    
    try {
      const { error } = await client.from('destinations').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },
  
  // ==================
  // BIKES
  // ==================
  
  async getBikes(): Promise<Bike[]> {
    const client = getSupabase();
    if (!client) return [];
    
    try {
      const { data, error } = await client
        .from('bikes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) return [];
      return (data || []).map(mapBikeFromDb);
    } catch {
      return [];
    }
  },
  
  async createBike(bike: Bike): Promise<Bike | null> {
    const client = getSupabase();
    if (!client) return null;
    
    try {
      const { data, error } = await client
        .from('bikes')
        .insert([mapBikeToDb(bike)])
        .select()
        .single();
      
      if (error) return null;
      return mapBikeFromDb(data);
    } catch {
      return null;
    }
  },
  
  async updateBike(id: string, bike: Bike): Promise<Bike | null> {
    const client = getSupabase();
    if (!client) return null;
    
    try {
      const { data, error } = await client
        .from('bikes')
        .update(mapBikeToDb(bike))
        .eq('id', id)
        .select()
        .single();
      
      if (error) return null;
      return mapBikeFromDb(data);
    } catch {
      return null;
    }
  },
  
  async deleteBike(id: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    
    try {
      const { error } = await client.from('bikes').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },
  
  // ==================
  // BOOKINGS
  // ==================
  
  async getBookings(): Promise<Booking[]> {
    const client = getSupabase();
    if (!client) return [];
    
    try {
      const { data, error } = await client
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) return [];
      return (data || []).map(mapBookingFromDb);
    } catch {
      return [];
    }
  },
  
  async createBooking(booking: Booking): Promise<Booking | null> {
    const client = getSupabase();
    if (!client) return null;
    
    try {
      const { data, error } = await client
        .from('bookings')
        .insert([mapBookingToDb(booking)])
        .select()
        .single();
      
      if (error) return null;
      return mapBookingFromDb(data);
    } catch {
      return null;
    }
  },
  
  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    const client = getSupabase();
    if (!client) return null;
    
    try {
      const { data, error } = await client
        .from('bookings')
        .update(mapBookingToDb(updates as Booking))
        .eq('id', id)
        .select()
        .single();
      
      if (error) return null;
      return mapBookingFromDb(data);
    } catch {
      return null;
    }
  },
  
  async deleteBooking(id: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    
    try {
      const { error } = await client.from('bookings').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },
  
  // ==================
  // PAGES
  // ==================
  
  async getPages(): Promise<Page[]> {
    const client = getSupabase();
    if (!client) return [];
    
    try {
      const { data, error } = await client
        .from('pages')
        .select('*')
        .order('menu_order', { ascending: true });
      
      if (error) return [];
      return (data || []).map(mapPageFromDb);
    } catch {
      return [];
    }
  },
  
  async createPage(page: Page): Promise<Page | null> {
    const client = getSupabase();
    if (!client) return null;
    
    try {
      const { data, error } = await client
        .from('pages')
        .insert([mapPageToDb(page)])
        .select()
        .single();
      
      if (error) return null;
      return mapPageFromDb(data);
    } catch {
      return null;
    }
  },
  
  async updatePage(id: string, page: Page): Promise<Page | null> {
    const client = getSupabase();
    if (!client) return null;
    
    try {
      const { data, error } = await client
        .from('pages')
        .update(mapPageToDb(page))
        .eq('id', id)
        .select()
        .single();
      
      if (error) return null;
      return mapPageFromDb(data);
    } catch {
      return null;
    }
  },
  
  async deletePage(id: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    
    try {
      const { error } = await client.from('pages').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  },
  
  // ==================
  // SITE SETTINGS
  // ==================
  
  async getSiteSettings(): Promise<SiteSettings | null> {
    const client = getSupabase();
    if (!client) return null;
    
    try {
      const { data, error } = await client
        .from('site_settings')
        .select('*')
        .eq('id', 'main')
        .single();
      
      if (error) return null;
      return data?.settings || null;
    } catch {
      return null;
    }
  },
  
  async updateSiteSettings(settings: SiteSettings): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    
    try {
      const { error } = await client
        .from('site_settings')
        .upsert({
          id: 'main',
          settings: settings,
          updated_at: new Date().toISOString()
        });
      
      return !error;
    } catch {
      return false;
    }
  },
  
  // ==================
  // MEDIA
  // ==================
  
  async getMediaItems(): Promise<MediaItem[]> {
    const client = getSupabase();
    if (!client) return [];
    
    try {
      const { data, error } = await client
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) return [];
      return data || [];
    } catch {
      return [];
    }
  },
  
  async createMediaItem(item: MediaItem): Promise<MediaItem | null> {
    const client = getSupabase();
    if (!client) return null;
    
    try {
      const { data, error } = await client
        .from('media')
        .insert([item])
        .select()
        .single();
      
      if (error) return null;
      return data;
    } catch {
      return null;
    }
  },
  
  async deleteMediaItem(id: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return false;
    
    try {
      const { error } = await client.from('media').delete().eq('id', id);
      return !error;
    } catch {
      return false;
    }
  }
};

// ============================================
// DATA MAPPING FUNCTIONS
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTourFromDb(data: any): Tour {
  return {
    id: data.id || '',
    slug: data.slug || '',
    title: data.title || '',
    subtitle: data.subtitle || '',
    description: data.description || '',
    shortDescription: data.short_description || '',
    heroImage: data.hero_image || '',
    gallery: data.gallery || [],
    duration: data.duration || '',
    durationDays: data.duration_days || 0,
    distance: data.distance || '',
    difficulty: data.difficulty || 'Moderate',
    groupSize: data.group_size || '',
    startLocation: data.start_location || '',
    endLocation: data.end_location || '',
    countries: data.countries || [],
    terrain: data.terrain || [],
    bestSeason: data.best_season || '',
    price: data.price || 0,
    originalPrice: data.original_price,
    pricing: data.pricing_config,
    currency: data.currency || 'USD',
    nextDeparture: data.next_departure || '',
    departureDates: data.departure_dates || [],
    highlights: data.highlights || [],
    itinerary: data.itinerary || [],
    inclusions: data.inclusions || { included: [], notIncluded: [] },
    upgrades: data.upgrades || [],
    seo: data.seo,
    mapUrl: data.map_url || '',
    availableBikes: data.available_bikes || [],
    featured: data.featured || false,
    status: data.status || 'draft',
    createdAt: data.created_at || '',
    updatedAt: data.updated_at || '',
  };
}

function mapTourToDb(tour: Tour): Record<string, unknown> {
  return {
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    subtitle: tour.subtitle,
    description: tour.description,
    short_description: tour.shortDescription,
    hero_image: tour.heroImage,
    gallery: tour.gallery || [],
    duration: tour.duration,
    duration_days: tour.durationDays,
    distance: tour.distance,
    difficulty: tour.difficulty,
    group_size: tour.groupSize,
    start_location: tour.startLocation,
    end_location: tour.endLocation,
    countries: tour.countries || [],
    terrain: tour.terrain || [],
    best_season: tour.bestSeason,
    price: tour.price,
    original_price: tour.originalPrice,
    pricing_config: tour.pricing,
    currency: tour.currency || 'USD',
    next_departure: tour.nextDeparture,
    departure_dates: tour.departureDates || [],
    highlights: tour.highlights || [],
    itinerary: tour.itinerary || [],
    inclusions: tour.inclusions || { included: [], notIncluded: [] },
    upgrades: tour.upgrades || [],
    seo: tour.seo || {},
    map_url: tour.mapUrl,
    available_bikes: tour.availableBikes || [],
    featured: tour.featured || false,
    status: tour.status || 'draft',
    updated_at: new Date().toISOString()
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDestinationFromDb(data: any): Destination {
  return {
    id: data.id || '',
    slug: data.slug || '',
    name: data.name || '',
    country: data.country || '',
    tagline: data.tagline || '',
    description: data.description || '',
    heroImage: data.hero_image || '',
    gallery: data.gallery || [],
    highlights: data.highlights || [],
    bestTimeToVisit: data.best_time_to_visit || '',
    climate: data.climate || '',
    terrain: data.terrain || [],
    difficulty: data.difficulty || 'Moderate',
    averageAltitude: data.average_altitude || '',
    popularRoutes: data.popular_routes || [],
    thingsToKnow: data.things_to_know || [],
    featured: data.featured || false,
    status: data.status || 'draft',
    seo: data.seo || { metaTitle: '', metaDescription: '', keywords: [] },
    createdAt: data.created_at || '',
    updatedAt: data.updated_at || '',
  };
}

function mapDestinationToDb(dest: Destination): Record<string, unknown> {
  return {
    id: dest.id,
    slug: dest.slug,
    name: dest.name,
    country: dest.country,
    tagline: dest.tagline,
    description: dest.description,
    hero_image: dest.heroImage,
    gallery: dest.gallery || [],
    highlights: dest.highlights || [],
    best_time_to_visit: dest.bestTimeToVisit,
    climate: dest.climate,
    terrain: dest.terrain || [],
    difficulty: dest.difficulty,
    average_altitude: dest.averageAltitude,
    popular_routes: dest.popularRoutes || [],
    things_to_know: dest.thingsToKnow || [],
    featured: dest.featured || false,
    status: dest.status || 'draft',
    seo: dest.seo || {},
    updated_at: new Date().toISOString()
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBikeFromDb(data: any): Bike {
  return {
    id: data.id || '',
    name: data.name || '',
    brand: data.brand || '',
    model: data.model || '',
    year: data.year || 0,
    image: data.image || '',
    gallery: data.gallery || [],
    engineCapacity: data.engine_capacity || '',
    power: data.power || '',
    torque: data.torque || '',
    weight: data.weight || '',
    seatHeight: data.seat_height || '',
    fuelCapacity: data.fuel_capacity || '',
    transmission: data.transmission || '',
    topSpeed: data.top_speed || '',
    description: data.description || '',
    features: data.features || [],
    idealFor: data.ideal_for || [],
    rentalPrice: data.rental_price || 0,
    upgradePrice: data.upgrade_price || 0,
    available: data.available !== false,
    featured: data.featured || false,
    category: data.category || 'adventure',
  };
}

function mapBikeToDb(bike: Bike): Record<string, unknown> {
  return {
    id: bike.id,
    name: bike.name,
    brand: bike.brand,
    model: bike.model,
    year: bike.year,
    image: bike.image,
    gallery: bike.gallery || [],
    engine_capacity: bike.engineCapacity,
    power: bike.power,
    torque: bike.torque,
    weight: bike.weight,
    seat_height: bike.seatHeight,
    fuel_capacity: bike.fuelCapacity,
    transmission: bike.transmission,
    top_speed: bike.topSpeed,
    description: bike.description,
    features: bike.features || [],
    ideal_for: bike.idealFor || [],
    rental_price: bike.rentalPrice,
    upgrade_price: bike.upgradePrice,
    available: bike.available !== false,
    featured: bike.featured || false,
    category: bike.category || 'adventure',
    updated_at: new Date().toISOString()
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBookingFromDb(data: any): Booking {
  return {
    id: data.id || '',
    tourId: data.tour_id || '',
    customerName: data.customer_name || '',
    email: data.customer_email || '',
    phone: data.customer_phone || '',
    departureDate: data.selected_date || '',
    riders: data.riders || 1,
    passengers: data.pillions || 0,
    selectedUpgrades: data.selected_upgrades || [],
    totalPrice: data.total_price || 0,
    status: data.status || 'pending',
    notes: data.notes || '',
    createdAt: data.created_at || '',
  };
}

function mapBookingToDb(booking: Booking): Record<string, unknown> {
  return {
    id: booking.id,
    tour_id: booking.tourId,
    customer_name: booking.customerName,
    customer_email: booking.email,
    customer_phone: booking.phone,
    selected_date: booking.departureDate,
    riders: booking.riders || 1,
    pillions: booking.passengers || 0,
    selected_upgrades: booking.selectedUpgrades || [],
    total_price: booking.totalPrice,
    status: booking.status || 'pending',
    notes: booking.notes,
    updated_at: new Date().toISOString()
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPageFromDb(data: any): Page {
  return {
    id: data.id || '',
    title: data.title || '',
    slug: data.slug || '',
    content: data.content || '',
    template: data.template || 'default',
    featuredImage: data.featured_image || '',
    excerpt: data.excerpt || '',
    showInMenu: data.show_in_menu || false,
    menuOrder: data.menu_order || 0,
    status: data.status || 'draft',
    seo: data.seo || { metaTitle: '', metaDescription: '', keywords: [] },
    createdAt: data.created_at || '',
    updatedAt: data.updated_at || '',
  };
}

function mapPageToDb(page: Page): Record<string, unknown> {
  return {
    id: page.id,
    title: page.title,
    slug: page.slug,
    content: page.content,
    template: page.template || 'default',
    featured_image: page.featuredImage,
    excerpt: page.excerpt,
    show_in_menu: page.showInMenu || false,
    menu_order: page.menuOrder || 0,
    status: page.status || 'draft',
    seo: page.seo || {},
    updated_at: new Date().toISOString()
  };
}

export default { db, isSupabaseConfigured, testConnection };
