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
  error: string | null;
  isUsingDatabase: boolean;
  
  // Tour functions
  addTour: (tour: Tour) => void;
  updateTour: (id: string, tour: Tour) => void;
  deleteTour: (id: string) => void;
  getTourBySlug: (slug: string) => Tour | undefined;
  
  // Destination functions
  addDestination: (destination: Destination) => void;
  updateDestination: (id: string, destination: Destination) => void;
  deleteDestination: (id: string) => void;
  getDestinationBySlug: (slug: string) => Destination | undefined;
  
  // Bike functions
  addBike: (bike: Bike) => void;
  updateBike: (id: string, bike: Bike) => void;
  deleteBike: (id: string) => void;
  
  // Booking functions
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, booking: Partial<Booking>) => void;
  
  // Page functions
  addPage: (page: Page) => void;
  updatePage: (id: string, page: Page) => void;
  deletePage: (id: string) => void;
  
  // Settings functions
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  
  // Media functions
  addMediaItem: (item: MediaItem) => void;
  deleteMediaItem: (id: string) => void;
  
  // Admin
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Safe localStorage helper
const safeStorage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignore
    }
  }
};

// Safe JSON parse
const safeParse = <T,>(str: string | null, fallback: T): T => {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage data or defaults
  const [tours, setTours] = useState<Tour[]>(() => 
    safeParse(safeStorage.get('brm_tours'), defaultTours)
  );
  const [destinations, setDestinations] = useState<Destination[]>(() => 
    safeParse(safeStorage.get('brm_destinations'), defaultDestinations)
  );
  const [bikes, setBikes] = useState<Bike[]>(() => 
    safeParse(safeStorage.get('brm_bikes'), defaultBikes)
  );
  const [bookings, setBookings] = useState<Booking[]>(() => 
    safeParse(safeStorage.get('brm_bookings'), [])
  );
  const [pages, setPages] = useState<Page[]>(() => 
    safeParse(safeStorage.get('brm_pages'), [])
  );
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => 
    safeParse(safeStorage.get('brm_siteSettings'), defaultSiteSettings)
  );
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => 
    safeParse(safeStorage.get('brm_media'), [])
  );
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const isUsingDatabase = false; // Always use localStorage for stability
  
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const session = safeStorage.get('brm_admin_session');
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed?.expiry > Date.now()) {
          return true;
        }
      }
    } catch {
      // Ignore
    }
    return false;
  });

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'nepal2024') {
      const session = { authenticated: true, expiry: Date.now() + 86400000 };
      safeStorage.set('brm_admin_session', JSON.stringify(session));
      setIsAuthenticated(true);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    try {
      localStorage.removeItem('brm_admin_session');
    } catch {
      // Ignore
    }
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // Save to localStorage on changes
  useEffect(() => {
    safeStorage.set('brm_tours', JSON.stringify(tours));
  }, [tours]);

  useEffect(() => {
    safeStorage.set('brm_destinations', JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    safeStorage.set('brm_bikes', JSON.stringify(bikes));
  }, [bikes]);

  useEffect(() => {
    safeStorage.set('brm_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    safeStorage.set('brm_pages', JSON.stringify(pages));
  }, [pages]);

  useEffect(() => {
    safeStorage.set('brm_siteSettings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    safeStorage.set('brm_media', JSON.stringify(mediaItems));
  }, [mediaItems]);

  // CRUD Functions
  const addTour = (tour: Tour) => setTours(prev => [tour, ...prev]);
  const updateTour = (id: string, tour: Tour) => setTours(prev => prev.map(t => t.id === id ? tour : t));
  const deleteTour = (id: string) => setTours(prev => prev.filter(t => t.id !== id));
  const getTourBySlug = (slug: string) => tours.find(t => t.slug === slug);

  const addDestination = (dest: Destination) => setDestinations(prev => [dest, ...prev]);
  const updateDestination = (id: string, dest: Destination) => setDestinations(prev => prev.map(d => d.id === id ? dest : d));
  const deleteDestination = (id: string) => setDestinations(prev => prev.filter(d => d.id !== id));
  const getDestinationBySlug = (slug: string) => destinations.find(d => d.slug === slug);

  const addBike = (bike: Bike) => setBikes(prev => [bike, ...prev]);
  const updateBike = (id: string, bike: Bike) => setBikes(prev => prev.map(b => b.id === id ? bike : b));
  const deleteBike = (id: string) => setBikes(prev => prev.filter(b => b.id !== id));

  const addBooking = (booking: Booking) => setBookings(prev => [booking, ...prev]);
  const updateBooking = (id: string, updates: Partial<Booking>) => setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));

  const addPage = (page: Page) => setPages(prev => [page, ...prev]);
  const updatePage = (id: string, page: Page) => setPages(prev => prev.map(p => p.id === id ? page : p));
  const deletePage = (id: string) => setPages(prev => prev.filter(p => p.id !== id));

  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...updates }));
  };

  const addMediaItem = (item: MediaItem) => setMediaItems(prev => [item, ...prev]);
  const deleteMediaItem = (id: string) => setMediaItems(prev => prev.filter(m => m.id !== id));

  const refreshData = () => {
    // Reload from localStorage
    setTours(safeParse(safeStorage.get('brm_tours'), defaultTours));
    setDestinations(safeParse(safeStorage.get('brm_destinations'), defaultDestinations));
    setBikes(safeParse(safeStorage.get('brm_bikes'), defaultBikes));
    setBookings(safeParse(safeStorage.get('brm_bookings'), []));
    setPages(safeParse(safeStorage.get('brm_pages'), []));
    setSiteSettings(safeParse(safeStorage.get('brm_siteSettings'), defaultSiteSettings));
    setMediaItems(safeParse(safeStorage.get('brm_media'), []));
  };

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
      error,
      isUsingDatabase,
      addTour,
      updateTour,
      deleteTour,
      getTourBySlug,
      addDestination,
      updateDestination,
      deleteDestination,
      getDestinationBySlug,
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
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
