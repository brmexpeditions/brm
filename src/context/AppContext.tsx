import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Tour, Destination, Bike, Booking, Page, Post, SiteSettings } from '../types';
import { defaultTours } from '../data/tours';
import { defaultDestinations } from '../data/destinations';
import { defaultBikes } from '../data/bikes';
import { defaultSiteSettings } from '../data/siteSettings';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  category: string;
}

interface AppContextType {
  tours: Tour[];
  destinations: Destination[];
  bikes: Bike[];
  bookings: Booking[];
  pages: Page[];
  posts: Post[];
  siteSettings: SiteSettings;
  mediaItems: MediaItem[];
  loading: boolean;
  isUsingDatabase: boolean;

  addTour: (tour: Tour) => void;
  updateTour: (id: string, tour: Tour) => void;
  deleteTour: (id: string) => void;

  addDestination: (destination: Destination) => void;
  updateDestination: (id: string, destination: Destination) => void;
  deleteDestination: (id: string) => void;

  addBike: (bike: Bike) => void;
  updateBike: (id: string, bike: Bike) => void;
  deleteBike: (id: string) => void;

  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;

  addPage: (page: Page) => void;
  updatePage: (id: string, page: Page) => void;
  deletePage: (id: string) => void;

  addPost: (post: Post) => void;
  updatePost: (id: string, post: Post) => void;
  deletePost: (id: string) => void;

  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  addMediaItem: (item: MediaItem) => void;
  deleteMediaItem: (id: string) => void;

  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  refreshFromDatabase: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Safe localStorage operations
const safeLocalStorage = {
  get: <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key: string, value: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors
    }
  }
};

// Supabase configuration
const SUPABASE_URL = 'https://khidecfioxjgwspwcwer.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoaWRlY2Zpb3hqZ3dzcHdjd2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMDU3NzUsImV4cCI6MjA4NTY4MTc3NX0.2qnrst53yk4g2AKeYBUpi4vVbXqi77F835PnT67SUYo';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage (instant, no async)
  const [tours, setTours] = useState<Tour[]>(() => safeLocalStorage.get('brm_tours', defaultTours));
  const [destinations, setDestinations] = useState<Destination[]>(() => safeLocalStorage.get('brm_destinations', defaultDestinations));
  const [bikes, setBikes] = useState<Bike[]>(() => safeLocalStorage.get('brm_bikes', defaultBikes));
  const [bookings, setBookings] = useState<Booking[]>(() => safeLocalStorage.get('brm_bookings', []));
  const [pages, setPages] = useState<Page[]>(() => safeLocalStorage.get('brm_pages', []));
  const [posts, setPosts] = useState<Post[]>(() => safeLocalStorage.get('brm_posts', []));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => safeLocalStorage.get('brm_settings', defaultSiteSettings));
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => safeLocalStorage.get('brm_media', []));
  const [loading, setLoading] = useState(false);
  const [isUsingDatabase] = useState(true);
  const [hasLoadedFromDb, setHasLoadedFromDb] = useState(false);

  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const session = localStorage.getItem('brm_session');
      if (session) {
        const data = JSON.parse(session);
        return data?.expiry > Date.now();
      }
    } catch { /* ignore */ }
    return false;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const session = localStorage.getItem('brm_session');
      if (session) {
        const data = JSON.parse(session);
        return data?.expiry > Date.now();
      }
    } catch { /* ignore */ }
    return false;
  });

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'nepal2024') {
      const session = { authenticated: true, expiry: Date.now() + 86400000 };
      try { localStorage.setItem('brm_session', JSON.stringify(session)); } catch { /* ignore */ }
      setIsAuthenticated(true);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    try { localStorage.removeItem('brm_session'); } catch { /* ignore */ }
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // Load data from Supabase - safe function
  const loadFromSupabase = useCallback(async () => {
    if (hasLoadedFromDb) return;

    console.log('🔄 Loading data from Supabase...');
    setLoading(true);

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

      // Test connection
      const { error: testError } = await supabase.from('tours').select('id').limit(1);
      if (testError) {
        console.log('⚠️ Database not accessible:', testError.message);
        setLoading(false);
        return;
      }

      console.log('✅ Connected to Supabase');

      // Load tours
      try {
        const { data: toursData } = await supabase.from('tours').select('*').order('created_at', { ascending: false });
        if (toursData && toursData.length > 0) {
          console.log(`📦 Found ${toursData.length} tours`);
          const mapped: Tour[] = toursData.map((t) => ({
            id: String(t.id || ''),
            slug: String(t.slug || ''),
            title: String(t.title || ''),
            subtitle: String(t.subtitle || ''),
            description: String(t.description || ''),
            shortDescription: String(t.short_description || ''),
            heroImage: String(t.hero_image || ''),
            gallery: Array.isArray(t.gallery) ? t.gallery : [],
            duration: String(t.duration || ''),
            durationDays: Number(t.duration_days) || 0,
            distance: String(t.distance || ''),
            difficulty: (t.difficulty || 'Moderate') as Tour['difficulty'],
            groupSize: String(t.group_size || ''),
            startLocation: String(t.start_location || ''),
            endLocation: String(t.end_location || ''),
            countries: Array.isArray(t.countries) ? t.countries : [],
            terrain: Array.isArray(t.terrain) ? t.terrain : [],
            bestSeason: String(t.best_season || ''),
            price: Number(t.price) || 0,
            originalPrice: t.original_price ? Number(t.original_price) : undefined,
            currency: String(t.currency || 'USD'),
            nextDeparture: String(t.next_departure || ''),
            departureDates: Array.isArray(t.departure_dates) ? t.departure_dates : [],
            highlights: Array.isArray(t.highlights) ? t.highlights : [],
            itinerary: Array.isArray(t.itinerary) ? t.itinerary : [],
            inclusions: (t.inclusions && typeof t.inclusions === 'object') ? t.inclusions : { included: [], notIncluded: [] },
            upgrades: Array.isArray(t.upgrades) ? t.upgrades : [],
            seo: t.seo || undefined,
            mapUrl: String(t.map_url || ''),
            availableBikes: Array.isArray(t.available_bikes) ? t.available_bikes : [],
            pricing: t.pricing_config || undefined,
            featured: Boolean(t.featured),
            status: (t.status === 'published' ? 'published' : 'draft') as Tour['status'],
            createdAt: String(t.created_at || new Date().toISOString()),
            updatedAt: String(t.updated_at || new Date().toISOString())
          }));
          setTours(mapped);
          safeLocalStorage.set('brm_tours', mapped);
        }
      } catch (e) { console.log('⚠️ Tours load error:', e); }

      // Load destinations
      try {
        const { data: destData } = await supabase.from('destinations').select('*').order('created_at', { ascending: false });
        if (destData && destData.length > 0) {
          console.log(`📦 Found ${destData.length} destinations`);
          const mapped: Destination[] = destData.map((d) => ({
            id: String(d.id || ''),
            slug: String(d.slug || ''),
            name: String(d.name || ''),
            country: String(d.country || ''),
            tagline: String(d.tagline || ''),
            description: String(d.description || ''),
            heroImage: String(d.hero_image || ''),
            gallery: Array.isArray(d.gallery) ? d.gallery : [],
            highlights: Array.isArray(d.highlights) ? d.highlights : [],
            bestTimeToVisit: String(d.best_time_to_visit || ''),
            climate: String(d.climate || ''),
            terrain: Array.isArray(d.terrain) ? d.terrain : [],
            difficulty: (d.difficulty || 'Moderate') as Destination['difficulty'],
            averageAltitude: String(d.average_altitude || ''),
            popularRoutes: Array.isArray(d.popular_routes) ? d.popular_routes : [],
            thingsToKnow: Array.isArray(d.things_to_know) ? d.things_to_know : [],
            featured: Boolean(d.featured),
            status: (d.status === 'published' ? 'published' : 'draft') as Destination['status'],
            seo: d.seo || { metaTitle: '', metaDescription: '', keywords: [] },
            createdAt: String(d.created_at || new Date().toISOString()),
            updatedAt: String(d.updated_at || new Date().toISOString())
          }));
          setDestinations(mapped);
          safeLocalStorage.set('brm_destinations', mapped);
        }
      } catch (e) { console.log('⚠️ Destinations load error:', e); }

      // Load bikes
      try {
        const { data: bikesData } = await supabase.from('bikes').select('*').order('created_at', { ascending: false });
        if (bikesData && bikesData.length > 0) {
          console.log(`📦 Found ${bikesData.length} bikes`);
          const mapped: Bike[] = bikesData.map((b) => ({
            id: String(b.id || ''),
            name: String(b.name || ''),
            brand: String(b.brand || ''),
            model: String(b.model || ''),
            year: Number(b.year) || new Date().getFullYear(),
            image: String(b.image || ''),
            gallery: Array.isArray(b.gallery) ? b.gallery : [],
            engineCapacity: String(b.engine_capacity || ''),
            power: String(b.power || ''),
            torque: String(b.torque || ''),
            weight: String(b.weight || ''),
            seatHeight: String(b.seat_height || ''),
            fuelCapacity: String(b.fuel_capacity || ''),
            transmission: String(b.transmission || ''),
            topSpeed: String(b.top_speed || ''),
            description: String(b.description || ''),
            features: Array.isArray(b.features) ? b.features : [],
            idealFor: Array.isArray(b.ideal_for) ? b.ideal_for : [],
            rentalPrice: Number(b.rental_price) || 0,
            upgradePrice: Number(b.upgrade_price) || 0,
            available: b.available !== false,
            featured: Boolean(b.featured),
            category: (['adventure', 'cruiser', 'sport', 'touring', 'standard'].includes(b.category) ? b.category : 'adventure') as Bike['category']
          }));
          setBikes(mapped);
          safeLocalStorage.set('brm_bikes', mapped);
        }
      } catch (e) { console.log('⚠️ Bikes load error:', e); }

      // Load bookings
      try {
        const { data: bookingsData } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
        if (bookingsData && bookingsData.length > 0) {
          console.log(`📦 Found ${bookingsData.length} bookings`);
          const mapped: Booking[] = bookingsData.map((b) => ({
            id: String(b.id || ''),
            tourId: String(b.tour_id || ''),
            customerName: String(b.customer_name || ''),
            email: String(b.customer_email || ''),
            phone: String(b.customer_phone || ''),
            departureDate: String(b.selected_date || ''),
            riders: Number(b.riders) || 1,
            passengers: Number(b.pillions) || 0,
            selectedUpgrades: Array.isArray(b.selected_upgrades) ? b.selected_upgrades : [],
            totalPrice: Number(b.total_price) || 0,
            status: (b.status || 'pending') as Booking['status'],
            createdAt: String(b.created_at || new Date().toISOString()),
            notes: String(b.notes || '')
          }));
          setBookings(mapped);
          safeLocalStorage.set('brm_bookings', mapped);
        }
      } catch (e) { console.log('⚠️ Bookings load error:', e); }

      // Load pages
      try {
        const { data: pagesData } = await supabase.from('pages').select('*').order('created_at', { ascending: false });
        if (pagesData && pagesData.length > 0) {
          console.log(`📦 Found ${pagesData.length} pages`);
          const mapped: Page[] = pagesData.map((p) => ({
            id: String(p.id || ''),
            title: String(p.title || ''),
            slug: String(p.slug || ''),
            content: String(p.content || ''),
            template: (p.template || 'default') as Page['template'],
            featuredImage: String(p.featured_image || ''),
            excerpt: String(p.excerpt || ''),
            showInMenu: Boolean(p.show_in_menu),
            menuOrder: Number(p.menu_order) || 0,
            status: (p.status === 'published' ? 'published' : 'draft') as Page['status'],
            seo: p.seo || { metaTitle: '', metaDescription: '', keywords: [] },
            createdAt: String(p.created_at || new Date().toISOString()),
            updatedAt: String(p.updated_at || new Date().toISOString())
          }));
          setPages(mapped);
          safeLocalStorage.set('brm_pages', mapped);
        }
      } catch (e) { console.log('⚠️ Pages load error:', e); }

      // Load posts
      try {
        const { data: postsData } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (postsData && postsData.length > 0) {
          console.log(`📦 Found ${postsData.length} posts`);
          const mapped: Post[] = postsData.map((p) => ({
            id: String(p.id || ''),
            slug: String(p.slug || ''),
            title: String(p.title || ''),
            excerpt: String(p.excerpt || ''),
            content: String(p.content || ''),
            image: String(p.image || ''),
            author: String(p.author || 'Admin'),
            date: String(p.date || new Date().toISOString()),
            readTime: String(p.read_time || '5 min read'),
            category: String(p.category || 'Adventure'),
            tags: Array.isArray(p.tags) ? p.tags : [],
            featured: Boolean(p.featured),
            status: (p.status === 'published' ? 'published' : 'draft') as Post['status'],
            seo: p.seo || { metaTitle: '', metaDescription: '', keywords: [] },
            createdAt: String(p.created_at || new Date().toISOString()),
            updatedAt: String(p.updated_at || new Date().toISOString())
          }));
          setPosts(mapped);
          safeLocalStorage.set('brm_posts', mapped);
        }
      } catch (e) { console.log('⚠️ Posts load error:', e); }

      // Load site settings
      try {
        const { data: settingsData } = await supabase.from('site_settings').select('*').eq('id', 'main').single();
        if (settingsData?.settings) {
          console.log('📦 Found site settings');
          const dbSettings = settingsData.settings as any;

          // Deep merge for safety (at least one level deep for each major category)
          const mergedSettings: SiteSettings = {
            ...defaultSiteSettings,
            ...dbSettings,
            general: { ...defaultSiteSettings.general, ...(dbSettings.general || {}) },
            typography: { ...defaultSiteSettings.typography, ...(dbSettings.typography || {}) },
            colors: { ...defaultSiteSettings.colors, ...(dbSettings.colors || {}) },
            header: { ...defaultSiteSettings.header, ...(dbSettings.header || {}) },
            footer: { ...defaultSiteSettings.footer, ...(dbSettings.footer || {}) },
            contact: { ...defaultSiteSettings.contact, ...(dbSettings.contact || {}) },
            homepage: { ...defaultSiteSettings.homepage, ...(dbSettings.homepage || {}) },
          };

          setSiteSettings(mergedSettings);
          safeLocalStorage.set('brm_settings', mergedSettings);
        }
      } catch (e) { console.log('⚠️ Settings load error:', e); }

      // Load media
      try {
        const { data: mediaData } = await supabase.from('media').select('*').order('created_at', { ascending: false });
        if (mediaData && mediaData.length > 0) {
          console.log(`📦 Found ${mediaData.length} media items`);
          setMediaItems(mediaData as MediaItem[]);
          safeLocalStorage.set('brm_media', mediaData);
        }
      } catch (e) { console.log('⚠️ Media load error:', e); }

      console.log('✅ Data sync complete!');
      setHasLoadedFromDb(true);

    } catch (error) {
      console.log('⚠️ Supabase error:', error);
    } finally {
      setLoading(false);
    }
  }, [hasLoadedFromDb]);

  // Auto-load from Supabase after page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      loadFromSupabase();
    }, 1000);
    return () => clearTimeout(timer);
  }, [loadFromSupabase]);

  // Manual refresh function
  const refreshFromDatabase = async (): Promise<void> => {
    setHasLoadedFromDb(false);
    await loadFromSupabase();
  };

  // Save to localStorage when data changes
  useEffect(() => { safeLocalStorage.set('brm_tours', tours); }, [tours]);
  useEffect(() => { safeLocalStorage.set('brm_destinations', destinations); }, [destinations]);
  useEffect(() => { safeLocalStorage.set('brm_bikes', bikes); }, [bikes]);
  useEffect(() => { safeLocalStorage.set('brm_bookings', bookings); }, [bookings]);
  useEffect(() => { safeLocalStorage.set('brm_pages', pages); }, [pages]);
  useEffect(() => { safeLocalStorage.set('brm_posts', posts); }, [posts]);
  useEffect(() => { safeLocalStorage.set('brm_settings', siteSettings); }, [siteSettings]);
  useEffect(() => { safeLocalStorage.set('brm_media', mediaItems); }, [mediaItems]);

  // Force update menu if Blog is missing (Migration)
  useEffect(() => {
    const mainMenu = siteSettings.menus.find(m => m.location === 'header');
    if (mainMenu && !mainMenu.items.some(i => i.label === 'Blog')) {
      const newSettings = { ...siteSettings };
      const menuIndex = newSettings.menus.findIndex(m => m.location === 'header');
      if (menuIndex >= 0) {
        // Add Blog before Contact (which is usually last)
        const contactIndex = newSettings.menus[menuIndex].items.findIndex(i => i.label === 'Contact');
        const blogItem = { id: 'menu-blog', label: 'Blog', url: '/blog', target: '_self' as const, type: 'custom' as const, order: 5 };

        if (contactIndex >= 0) {
          newSettings.menus[menuIndex].items.splice(contactIndex, 0, blogItem);
          // Re-index orders if needed, but flexbox should handle it. Just ensure contact is last.
          newSettings.menus[menuIndex].items[contactIndex + 1].order = 7;
        } else {
          newSettings.menus[menuIndex].items.push(blogItem);
        }
        setSiteSettings(newSettings);
      }
    }
  }, [siteSettings]);

  // Background sync to database
  const syncTour = async (tour: Tour) => {
    try {
      const { syncToDatabase } = await import('../lib/supabase');
      syncToDatabase.tour(tour as unknown as Record<string, unknown>);
    } catch { /* ignore */ }
  };

  const syncDestination = async (destination: Destination) => {
    try {
      const { syncToDatabase } = await import('../lib/supabase');
      syncToDatabase.destination(destination as unknown as Record<string, unknown>);
    } catch { /* ignore */ }
  };

  const syncBike = async (bike: Bike) => {
    try {
      const { syncToDatabase } = await import('../lib/supabase');
      syncToDatabase.bike(bike as unknown as Record<string, unknown>);
    } catch { /* ignore */ }
  };

  const syncBooking = async (booking: Booking) => {
    try {
      const { syncToDatabase } = await import('../lib/supabase');
      syncToDatabase.booking(booking as unknown as Record<string, unknown>);
    } catch { /* ignore */ }
  };

  const syncPage = async (page: Page) => {
    try {
      const { syncToDatabase } = await import('../lib/supabase');
      syncToDatabase.page(page as unknown as Record<string, unknown>);
    } catch { /* ignore */ }
  };

  const syncPost = async (post: Post) => {
    try {
      const { syncToDatabase } = await import('../lib/supabase');
      syncToDatabase.post(post as unknown as Record<string, unknown>);
    } catch { /* ignore */ }
  };

  const syncSettings = async (settings: SiteSettings) => {
    try {
      const { syncToDatabase } = await import('../lib/supabase');
      syncToDatabase.settings(settings as unknown as Record<string, unknown>);
    } catch { /* ignore */ }
  };

  // Tour functions
  const addTour = (tour: Tour) => {
    setTours(prev => [tour, ...prev]);
    syncTour(tour);
  };

  const updateTour = (id: string, tour: Tour) => {
    setTours(prev => prev.map(t => t.id === id ? tour : t));
    syncTour(tour);
  };

  const deleteTour = async (id: string) => {
    setTours(prev => prev.filter(t => t.id !== id));
    try {
      const { syncToDatabase } = await import('../lib/supabase');
      syncToDatabase.deleteTour(id);
    } catch { /* ignore */ }
  };

  // Destination functions
  const addDestination = (destination: Destination) => {
    setDestinations(prev => [destination, ...prev]);
    syncDestination(destination);
  };

  const updateDestination = (id: string, destination: Destination) => {
    setDestinations(prev => prev.map(d => d.id === id ? destination : d));
    syncDestination(destination);
  };

  const deleteDestination = async (id: string) => {
    setDestinations(prev => prev.filter(d => d.id !== id));
    try {
      const { syncToDatabase } = await import('../lib/supabase');
      syncToDatabase.deleteDestination(id);
    } catch { /* ignore */ }
  };

  // Bike functions
  const addBike = (bike: Bike) => {
    setBikes(prev => [bike, ...prev]);
    syncBike(bike);
  };

  const updateBike = (id: string, bike: Bike) => {
    setBikes(prev => prev.map(b => b.id === id ? bike : b));
    syncBike(bike);
  };

  const deleteBike = async (id: string) => {
    setBikes(prev => prev.filter(b => b.id !== id));
    try {
      const { syncToDatabase } = await import('../lib/supabase');
      syncToDatabase.deleteBike(id);
    } catch { /* ignore */ }
  };

  // Booking functions
  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
    syncBooking(booking);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, ...updates } : b);
      const booking = updated.find(b => b.id === id);
      if (booking) syncBooking(booking);
      return updated;
    });
  };

  // Page functions
  const addPage = (page: Page) => {
    setPages(prev => [page, ...prev]);
    syncPage(page);
  };

  const updatePage = (id: string, page: Page) => {
    setPages(prev => prev.map(p => p.id === id ? page : p));
    syncPage(page);
  };

  const deletePage = async (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
    try {
      const { syncToDatabase } = await import('../lib/supabase');
      syncToDatabase.deletePage(id);
    } catch { /* ignore */ }
  };

  // Post functions
  const addPost = (post: Post) => {
    setPosts(prev => [post, ...prev]);
    syncPost(post);
  };

  const updatePost = (id: string, post: Post) => {
    setPosts(prev => prev.map(p => p.id === id ? post : p));
    syncPost(post);
  };

  const deletePost = async (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    try {
      const { syncToDatabase } = await import('../lib/supabase');
      syncToDatabase.deletePost(id);
    } catch { /* ignore */ }
  };

  // Settings
  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings(prev => {
      const newSettings = { ...prev, ...updates };
      syncSettings(newSettings);
      return newSettings;
    });
  };

  // Media functions
  const addMediaItem = (item: MediaItem) => setMediaItems(prev => [item, ...prev]);
  const deleteMediaItem = (id: string) => setMediaItems(prev => prev.filter(m => m.id !== id));

  return (
    <AppContext.Provider value={{
      tours,
      destinations,
      bikes,
      bookings,
      pages,
      posts,
      siteSettings,
      mediaItems,
      loading,
      isUsingDatabase,
      addTour,
      updateTour,
      deleteTour,
      addDestination,
      updateDestination,
      deleteDestination,
      addBike,
      updateBike,
      deleteBike,
      addBooking,
      updateBooking,
      addPage,
      updatePage,
      deletePage,
      addPost,
      updatePost,
      deletePost,
      updateSiteSettings,
      addMediaItem,
      deleteMediaItem,
      isAdmin,
      setIsAdmin,
      isAuthenticated,
      login,
      logout,
      refreshFromDatabase
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
