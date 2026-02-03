import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tour, Destination, Bike, Booking, Page, SiteSettings } from '../types';
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
const storage = {
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage (instant, no async)
  const [tours, setTours] = useState<Tour[]>(() => storage.get('brm_tours', defaultTours));
  const [destinations, setDestinations] = useState<Destination[]>(() => storage.get('brm_destinations', defaultDestinations));
  const [bikes, setBikes] = useState<Bike[]>(() => storage.get('brm_bikes', defaultBikes));
  const [bookings, setBookings] = useState<Booking[]>(() => storage.get('brm_bookings', []));
  const [pages, setPages] = useState<Page[]>(() => storage.get('brm_pages', []));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => storage.get('brm_settings', defaultSiteSettings));
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => storage.get('brm_media', []));
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUsingDatabase, setIsUsingDatabase] = useState(false);
  
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

  // Function to refresh data from database
  const refreshFromDatabase = async () => {
    setLoading(true);
    try {
      const { loadFromDatabase, isSupabaseAvailable } = await import('../lib/supabase');
      
      if (!isSupabaseAvailable()) {
        console.log('Database not available');
        setLoading(false);
        return;
      }
      
      setIsUsingDatabase(true);
      console.log('🔄 Loading from database...');
      
      const dbData = await loadFromDatabase();
      
      if (dbData) {
        if (dbData.tours && Array.isArray(dbData.tours) && dbData.tours.length > 0) {
          setTours(dbData.tours as Tour[]);
          storage.set('brm_tours', dbData.tours);
          console.log(`✅ Loaded ${dbData.tours.length} tours`);
        }
        
        if (dbData.destinations && Array.isArray(dbData.destinations) && dbData.destinations.length > 0) {
          setDestinations(dbData.destinations as Destination[]);
          storage.set('brm_destinations', dbData.destinations);
        }
        
        if (dbData.bikes && Array.isArray(dbData.bikes) && dbData.bikes.length > 0) {
          setBikes(dbData.bikes as Bike[]);
          storage.set('brm_bikes', dbData.bikes);
        }
        
        if (dbData.bookings && Array.isArray(dbData.bookings) && dbData.bookings.length > 0) {
          setBookings(dbData.bookings as Booking[]);
          storage.set('brm_bookings', dbData.bookings);
        }
        
        if (dbData.pages && Array.isArray(dbData.pages) && dbData.pages.length > 0) {
          setPages(dbData.pages as Page[]);
          storage.set('brm_pages', dbData.pages);
        }
        
        if (dbData.siteSettings) {
          setSiteSettings(dbData.siteSettings as SiteSettings);
          storage.set('brm_settings', dbData.siteSettings);
        }
        
        if (dbData.media && Array.isArray(dbData.media) && dbData.media.length > 0) {
          setMediaItems(dbData.media as MediaItem[]);
          storage.set('brm_media', dbData.media);
        }
      }
    } catch (error) {
      console.log('Database refresh failed:', error);
    }
    setLoading(false);
  };

  // Save to localStorage when data changes
  useEffect(() => { storage.set('brm_tours', tours); }, [tours]);
  useEffect(() => { storage.set('brm_destinations', destinations); }, [destinations]);
  useEffect(() => { storage.set('brm_bikes', bikes); }, [bikes]);
  useEffect(() => { storage.set('brm_bookings', bookings); }, [bookings]);
  useEffect(() => { storage.set('brm_pages', pages); }, [pages]);
  useEffect(() => { storage.set('brm_settings', siteSettings); }, [siteSettings]);
  useEffect(() => { storage.set('brm_media', mediaItems); }, [mediaItems]);

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
