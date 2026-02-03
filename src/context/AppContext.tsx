import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tour, Destination, Bike, Booking, Page, SiteSettings } from '../types';
import { defaultTours } from '../data/tours';
import { defaultDestinations } from '../data/destinations';
import { defaultBikes } from '../data/bikes';
import { defaultSiteSettings } from '../data/siteSettings';
import { syncToDatabase, isSupabaseAvailable } from '../lib/supabase';

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
  // Initialize state from localStorage
  const [tours, setTours] = useState<Tour[]>(() => storage.get('brm_tours', defaultTours));
  const [destinations, setDestinations] = useState<Destination[]>(() => storage.get('brm_destinations', defaultDestinations));
  const [bikes, setBikes] = useState<Bike[]>(() => storage.get('brm_bikes', defaultBikes));
  const [bookings, setBookings] = useState<Booking[]>(() => storage.get('brm_bookings', []));
  const [pages, setPages] = useState<Page[]>(() => storage.get('brm_pages', []));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => storage.get('brm_settings', defaultSiteSettings));
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => storage.get('brm_media', []));
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading] = useState(false);
  const [isUsingDatabase] = useState(isSupabaseAvailable());
  
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const session = localStorage.getItem('brm_session');
      if (session) {
        const data = JSON.parse(session);
        return data?.expiry > Date.now();
      }
    } catch {}
    return false;
  });

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'nepal2024') {
      const session = { authenticated: true, expiry: Date.now() + 86400000 };
      try { localStorage.setItem('brm_session', JSON.stringify(session)); } catch {}
      setIsAuthenticated(true);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    try { localStorage.removeItem('brm_session'); } catch {}
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // Save to localStorage when data changes
  useEffect(() => { storage.set('brm_tours', tours); }, [tours]);
  useEffect(() => { storage.set('brm_destinations', destinations); }, [destinations]);
  useEffect(() => { storage.set('brm_bikes', bikes); }, [bikes]);
  useEffect(() => { storage.set('brm_bookings', bookings); }, [bookings]);
  useEffect(() => { storage.set('brm_pages', pages); }, [pages]);
  useEffect(() => { storage.set('brm_settings', siteSettings); }, [siteSettings]);
  useEffect(() => { storage.set('brm_media', mediaItems); }, [mediaItems]);

  // Tour functions - save to localStorage + sync to Supabase in background
  const addTour = (tour: Tour) => {
    setTours(prev => [tour, ...prev]);
    // Background sync to Supabase (won't block or crash)
    syncToDatabase.tour(tour as unknown as Record<string, unknown>);
  };
  
  const updateTour = (id: string, tour: Tour) => {
    setTours(prev => prev.map(t => t.id === id ? tour : t));
    syncToDatabase.tour(tour as unknown as Record<string, unknown>);
  };
  
  const deleteTour = (id: string) => {
    setTours(prev => prev.filter(t => t.id !== id));
    syncToDatabase.deleteTour(id);
  };

  // Destination functions
  const addDestination = (destination: Destination) => {
    setDestinations(prev => [destination, ...prev]);
    syncToDatabase.destination(destination as unknown as Record<string, unknown>);
  };
  
  const updateDestination = (id: string, destination: Destination) => {
    setDestinations(prev => prev.map(d => d.id === id ? destination : d));
    syncToDatabase.destination(destination as unknown as Record<string, unknown>);
  };
  
  const deleteDestination = (id: string) => {
    setDestinations(prev => prev.filter(d => d.id !== id));
    syncToDatabase.deleteDestination(id);
  };

  // Bike functions
  const addBike = (bike: Bike) => {
    setBikes(prev => [bike, ...prev]);
    syncToDatabase.bike(bike as unknown as Record<string, unknown>);
  };
  
  const updateBike = (id: string, bike: Bike) => {
    setBikes(prev => prev.map(b => b.id === id ? bike : b));
    syncToDatabase.bike(bike as unknown as Record<string, unknown>);
  };
  
  const deleteBike = (id: string) => {
    setBikes(prev => prev.filter(b => b.id !== id));
    syncToDatabase.deleteBike(id);
  };

  // Booking functions
  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
    syncToDatabase.booking(booking as unknown as Record<string, unknown>);
  };
  
  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, ...updates } : b);
      const booking = updated.find(b => b.id === id);
      if (booking) {
        syncToDatabase.booking(booking as unknown as Record<string, unknown>);
      }
      return updated;
    });
  };

  // Page functions
  const addPage = (page: Page) => {
    setPages(prev => [page, ...prev]);
    syncToDatabase.page(page as unknown as Record<string, unknown>);
  };
  
  const updatePage = (id: string, page: Page) => {
    setPages(prev => prev.map(p => p.id === id ? page : p));
    syncToDatabase.page(page as unknown as Record<string, unknown>);
  };
  
  const deletePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
    syncToDatabase.deletePage(id);
  };

  // Settings
  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings(prev => {
      const newSettings = { ...prev, ...updates };
      syncToDatabase.settings(newSettings as unknown as Record<string, unknown>);
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
      logout
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
