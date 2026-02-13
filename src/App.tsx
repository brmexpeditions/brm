import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ServiceHistory } from './components/ServiceHistory';
import Analytics from './components/Analytics';
import CompanySettings from './components/CompanySettings';
import AuthScreen from './components/AuthScreen';
import { HomePage } from './components/HomePage';
import { AdminPanel, SiteSettings } from './components/AdminPanel';
import { Motorcycle, ServiceRecord, CompanySettings as CompanySettingsType } from './types';
import { isSupabaseConfigured } from './lib/supabase';
import { loadPublicSiteSettings, savePublicSiteSettings } from './lib/supabaseSiteSettings';
import { loadFleetForCurrentUser, saveFleetForCurrentUser } from './lib/supabaseFleetStore';

const defaultSiteSettings: SiteSettings = {
  siteName: 'Fleet Guard',
  tagline: 'Protect Your Fleet',
  logo: '',
  favicon: '',
  fontFamily: 'System',

  heroBackgroundImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1920&h=1080&fit=crop&q=80',
  ctaBackgroundImage: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80',
  showcaseImage1: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=500&fit=crop',
  showcaseImage2: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
  showcaseImage3: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop',
  showcaseImage4: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=500&fit=crop',

  primaryColor: '#f59e0b',
  secondaryColor: '#1f2937',
  accentColor: '#10b981',
  backgroundColor: '#000000',
  textColor: '#ffffff',
  googleAnalyticsId: '',
  googleSearchConsoleId: '',
  metaTitle: 'Fleet Guard - Protect Your Fleet | Vehicle Management System',
  metaDescription: 'Manage your vehicle fleet with ease. Track services, documents, and maintenance for cars & bikes.',
  metaKeywords: 'fleet management, vehicle tracking, service reminder',
  ogImage: '',
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  email: 'support@fleetguard.in',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  address: 'Mumbai, Maharashtra, India',
  starterPrice: 0,
  starterVehicles: 5,
  proPrice: 2000,
  proVehicles: 30,
  enterprisePrice: 3500,
  showPricing: true,
  showReviews: true,
  showFaq: true,
  showContact: true,
  customCss: '',
  headerScripts: '',
  footerScripts: ''
};

interface User {
  id: string;
  username: string;
  email: string;
  companyName: string;
  phone: string;
}

interface AppData {
  motorcycles: Motorcycle[];
  serviceRecords: ServiceRecord[];
  savedMakes: string[];
  savedModels: { [make: string]: string[] };
  companySettings: CompanySettingsType;
  lastBackup?: string;
}

const defaultData: AppData = {
  motorcycles: [],
  serviceRecords: [],
  savedMakes: ['Honda', 'Yamaha', 'Suzuki', 'Royal Enfield', 'Bajaj', 'TVS', 'KTM', 'Hero'],
  savedModels: {
    'Honda': ['Activa 6G', 'Shine', 'Unicorn', 'CB350', 'Hornet'],
    'Yamaha': ['FZ', 'R15', 'MT15', 'Fascino', 'Ray ZR'],
    'Suzuki': ['Access', 'Gixxer', 'Burgman'],
    'Royal Enfield': ['Classic 350', 'Bullet 350', 'Meteor', 'Hunter 350'],
    'Bajaj': ['Pulsar', 'Avenger', 'Dominar', 'Platina'],
    'TVS': ['Apache', 'Jupiter', 'Ntorq', 'Raider'],
    'KTM': ['Duke 200', 'Duke 390', 'RC 200', 'Adventure 390'],
    'Hero': ['Splendor', 'HF Deluxe', 'Passion', 'Glamour']
  },
  companySettings: {
    companyName: 'Fleet Guard',
    tagline: 'Protect Your Fleet',
    logo: '',
    email: '',
    phone: '',
    alternatePhone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
    panNumber: '',
    businessRegNumber: '',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706'
  }
};

type AppView = 'home' | 'auth' | 'dashboard' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [data, setData] = useState<AppData>(defaultData);
  const [activeTab, setActiveTab] = useState<'fleet' | 'service' | 'analytics' | 'settings'>('fleet');
  const [isLoading, setIsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [pendingAdminOpen, setPendingAdminOpen] = useState(false);

  // Helper: hidden admin backend URL
  // Visit /admin in the browser to request backend access (admin-only).

  // Load site settings (local first, then Supabase if configured)
  useEffect(() => {
    const load = async () => {
      // Local cache first (fast)
      try {
        const savedSiteSettings = localStorage.getItem('fleet_site_settings');
        if (savedSiteSettings) {
          setSiteSettings({ ...defaultSiteSettings, ...JSON.parse(savedSiteSettings) });
        }
      } catch (e) {
        console.error('Error loading site settings (local):', e);
      }

      // Supabase public settings (shared for all users)
      if (isSupabaseConfigured) {
        try {
          const remote = await loadPublicSiteSettings();
          if (remote) {
            const merged = { ...defaultSiteSettings, ...remote };
            setSiteSettings(merged);
            localStorage.setItem('fleet_site_settings', JSON.stringify(merged));
          }
        } catch (e) {
          console.warn('Could not load site settings from Supabase. Using local settings.', e);
        }
      }
    };

    load();
  }, []);

  // Apply site settings to document (CSS + analytics)
  const applySiteSettings = (settings: SiteSettings) => {
    // Apply Google Analytics if provided
    if (settings.googleAnalyticsId && !document.querySelector(`script[src*="googletagmanager"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.googleAnalyticsId}');
      `;
      document.head.appendChild(inlineScript);
    }

    // Apply custom CSS
    let styleEl = document.getElementById('custom-site-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'custom-site-styles';
      document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = settings.customCss || '';

    // Title/meta
    if (settings.metaTitle) document.title = settings.metaTitle;
  };

  // Save site settings (local + Supabase if configured)
  const handleSaveSiteSettings = async (settings: SiteSettings) => {
    setSiteSettings(settings);
    localStorage.setItem('fleet_site_settings', JSON.stringify(settings));

    applySiteSettings(settings);

    if (isSupabaseConfigured) {
      try {
        await savePublicSiteSettings(settings);
      } catch (e) {
        console.warn('Failed saving site settings to Supabase. Saved locally only.', e);
        // Non-blocking message
        alert('Saved locally, but could not save to Supabase. Please ensure the "site_settings" table exists and RLS policies are correct.');
      }
    }
  };

  // Check if user is admin (simple check - case-insensitive)
  const isAdmin = (() => {
    if (!currentUser) return false;
    const email = (currentUser.email || '').toLowerCase().trim();
    const username = (currentUser.username || '').toLowerCase().trim();
    return (
      username === 'admin' ||
      email === 'admin@fleetguard.in' ||
      email === 'admin@fleetguard.com'
    );
  })();

  // Check for existing session + route (supports hidden /admin backend entry)
  useEffect(() => {
    const applyRoute = (user: User | null) => {
      const path = window.location.pathname;
      const wantsAdmin = path === '/admin' || path.startsWith('/admin/');

      if (!wantsAdmin) return;

      // If user is already admin, open backend directly
      if (isAdminUser(user)) {
        setCurrentView('dashboard');
        setShowAdminPanel(true);
        setPendingAdminOpen(false);
        return;
      }

      // Otherwise require login; if they login as admin, backend will open
      setPendingAdminOpen(true);
      setAuthMode('login');
      setCurrentView('auth');
    };

    try {
      const savedUser = localStorage.getItem('fleet_current_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        // Default route
        setCurrentView('dashboard');
        applyRoute(user);
      } else {
        applyRoute(null);
      }
    } catch (e) {
      console.error('Error loading user session:', e);
      applyRoute(null);
    }

    const onPopState = () => {
      applyRoute(currentUser);
    };
    window.addEventListener('popstate', onPopState);

    setIsLoading(false);
    return () => window.removeEventListener('popstate', onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load data (local first, then Supabase per-user if configured and logged in)
  useEffect(() => {
    const load = async () => {
      // Local cache first
      try {
        const saved = localStorage.getItem('motorcycle_fleet_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          setData({
            ...defaultData,
            ...parsed,
            motorcycles: Array.isArray(parsed.motorcycles) ? parsed.motorcycles : [],
            serviceRecords: Array.isArray(parsed.serviceRecords) ? parsed.serviceRecords : [],
            savedMakes: Array.isArray(parsed.savedMakes) ? parsed.savedMakes : defaultData.savedMakes,
            savedModels: parsed.savedModels || defaultData.savedModels,
            companySettings: { ...defaultData.companySettings, ...parsed.companySettings }
          });
        }
      } catch (e) {
        console.error('Error loading data (local):', e);
      }

      if (isSupabaseConfigured && currentUser) {
        try {
          const remote = await loadFleetForCurrentUser();
          if (remote) {
            const merged: AppData = {
              ...defaultData,
              ...remote,
              motorcycles: Array.isArray(remote.motorcycles) ? remote.motorcycles : [],
              serviceRecords: Array.isArray(remote.serviceRecords) ? remote.serviceRecords : [],
              savedMakes: Array.isArray(remote.savedMakes) ? remote.savedMakes : defaultData.savedMakes,
              savedModels: remote.savedModels || defaultData.savedModels,
              companySettings: { ...defaultData.companySettings, ...(remote.companySettings || {}) },
              lastBackup: remote.lastBackup,
            };
            setData(merged);
            localStorage.setItem('motorcycle_fleet_data', JSON.stringify(merged));
          }
        } catch (e) {
          console.warn('Could not load fleet data from Supabase. Using local data.', e);
        }
      }
    };

    load();
  }, [currentUser]);

  // Save data (local + Supabase per-user when configured)
  const saveData = (updater: AppData | ((prev: AppData) => AppData)) => {
    setData(prev => {
      const next = typeof updater === 'function' ? (updater as (p: AppData) => AppData)(prev) : updater;
      try {
        localStorage.setItem('motorcycle_fleet_data', JSON.stringify(next));
      } catch (e) {
        console.error('Error saving data:', e);
      }

      // Fire-and-forget cloud save
      if (isSupabaseConfigured && currentUser) {
        saveFleetForCurrentUser(next).catch((e) => {
          console.warn('Failed saving fleet data to Supabase. Saved locally only.', e);
        });
      }

      return next;
    });
  };

  const isAdminUser = (user: User | null) => {
    if (!user) return false;
    const email = (user.email || '').toLowerCase().trim();
    const username = (user.username || '').toLowerCase().trim();
    return username === 'admin' || email === 'admin@fleetguard.in' || email === 'admin@fleetguard.com';
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('dashboard');

    // If user requested admin access from the homepage, open backend right after login
    if (pendingAdminOpen && isAdminUser(user)) {
      setShowAdminPanel(true);
    }
    setPendingAdminOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('fleet_current_user');
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleGetStarted = () => {
    setAuthMode('signup');
    setCurrentView('auth');
  };

  const handleGoToLogin = () => {
    setPendingAdminOpen(false);
    setAuthMode('login');
    setCurrentView('auth');
  };

  // Admin route handling is implemented in the mount effect (supports hidden /admin entry)

  // Motorcycle handlers
  const handleAddBike = (bike: Motorcycle) => {
    saveData(prev => ({
      ...prev,
      motorcycles: [...(Array.isArray(prev.motorcycles) ? prev.motorcycles : []), bike],
    }));
  };

  const handleUpdateBike = (updatedBike: Motorcycle) => {
    saveData(prev => ({
      ...prev,
      motorcycles: (Array.isArray(prev.motorcycles) ? prev.motorcycles : []).map(b =>
        b.id === updatedBike.id ? updatedBike : b
      ),
    }));
  };

  const handleDeleteBike = (bikeId: string) => {
    saveData(prev => ({
      ...prev,
      motorcycles: (Array.isArray(prev.motorcycles) ? prev.motorcycles : []).filter(b => b.id !== bikeId),
      serviceRecords: (Array.isArray(prev.serviceRecords) ? prev.serviceRecords : []).filter(r => r.motorcycleId !== bikeId),
    }));
  };

  const handleAddMake = (make: string) => {
    const trimmed = make.trim();
    if (!trimmed) return;
    saveData(prev => {
      const existing = Array.isArray(prev.savedMakes) ? prev.savedMakes : [];
      if (existing.includes(trimmed)) return prev;
      return {
        ...prev,
        savedMakes: [...existing, trimmed],
      };
    });
  };

  const handleAddModel = (make: string, model: string) => {
    const mk = make.trim();
    const md = model.trim();
    if (!mk || !md) return;
    saveData(prev => {
      const current = prev.savedModels?.[mk] || [];
      if (current.includes(md)) return prev;
      return {
        ...prev,
        savedModels: {
          ...(prev.savedModels || {}),
          [mk]: [...current, md],
        },
      };
    });
  };

  // Service record handlers
  const handleAddServiceRecord = (record: ServiceRecord) => {
    saveData(prev => ({
      ...prev,
      serviceRecords: [...(Array.isArray(prev.serviceRecords) ? prev.serviceRecords : []), record],
    }));
  };

  const handleUpdateServiceRecord = (record: ServiceRecord) => {
    saveData(prev => ({
      ...prev,
      serviceRecords: (Array.isArray(prev.serviceRecords) ? prev.serviceRecords : []).map(r => (r.id === record.id ? record : r)),
    }));
  };

  const handleDeleteServiceRecord = (recordId: string) => {
    saveData(prev => ({
      ...prev,
      serviceRecords: (Array.isArray(prev.serviceRecords) ? prev.serviceRecords : []).filter(r => r.id !== recordId),
    }));
  };

  // Settings handlers
  const handleUpdateSettings = (settings: CompanySettingsType) => {
    saveData(prev => ({ ...prev, companySettings: settings }));
  };

  // Restore data handler
  const handleRestoreData = (restoredData: AppData) => {
    saveData({
      ...defaultData,
      ...restoredData,
      motorcycles: Array.isArray(restoredData.motorcycles) ? restoredData.motorcycles : [],
      serviceRecords: Array.isArray(restoredData.serviceRecords) ? restoredData.serviceRecords : []
    });
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-4xl">🛡️</span>
          </div>
          <p className="text-xl text-amber-400 font-semibold">Fleet Guard</p>
          <p className="text-gray-400 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // Show Admin Panel
  if (showAdminPanel && isAdmin) {
    return (
      <AdminPanel
        onClose={() => setShowAdminPanel(false)}
        onSave={handleSaveSiteSettings}
        currentSettings={siteSettings}
      />
    );
  }

  // Show Homepage
  if (currentView === 'home') {
    return (
      <HomePage 
        onGetStarted={handleGetStarted}
        onLogin={handleGoToLogin}
        siteSettings={siteSettings}
      />
    );
  }

  // Show Auth Screen
  if (currentView === 'auth') {
    return (
      <AuthScreen 
        onLogin={handleLogin}
        companySettings={data.companySettings}
        initialMode={authMode}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  // Show Dashboard (authenticated)
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Sticky Back to Home Button - Always Visible */}
      <button
        onClick={handleLogout}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 rounded-full text-white font-medium shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 group"
      >
        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>Back to Home</span>
      </button>

      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg sticky top-0 z-40 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {data.companySettings.logo ? (
                <img 
                  src={data.companySettings.logo} 
                  alt="Logo" 
                  className="w-10 h-10 rounded-xl bg-white p-1"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🛡️</span>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                  {data.companySettings.companyName || 'Fleet Guard'}
                </h1>
                <p className="text-xs text-gray-400 hidden sm:block">
                  {data.companySettings.tagline || 'Protect Your Fleet'}
                </p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {isAdmin && (
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="px-3 py-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 hover:from-purple-500/30 hover:to-purple-600/30 border border-purple-400/30 rounded-lg text-sm font-semibold text-purple-200 transition-colors flex items-center gap-2"
                  title="Admin Backend"
                >
                  <span className="hidden sm:inline">Admin</span>
                  <span>⚙️</span>
                </button>
              )}
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-white">{currentUser?.username}</p>
                <p className="text-xs text-gray-400">{currentUser?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-sm font-medium text-red-400 transition-colors flex items-center gap-1"
              >
                <span className="hidden sm:inline">Logout</span>
                <span>🚪</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-gray-900 shadow-md sticky top-[60px] z-30 overflow-x-auto border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex min-w-max">
            {[
              { id: 'fleet', label: 'Fleet & Vehicles', icon: '🚗' },
              { id: 'service', label: 'Service Records', icon: '🔧' },
              { id: 'analytics', label: 'Analytics', icon: '📊' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-3 font-medium transition-colors whitespace-nowrap flex items-center gap-2 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-500 bg-amber-500/10'
                    : 'border-transparent text-gray-400 hover:text-amber-400 hover:bg-gray-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'fleet' && (
          <Dashboard
            motorcycles={data.motorcycles}
            makes={data.savedMakes}
            models={data.savedModels}
            onAddBike={handleAddBike}
            onUpdateBike={handleUpdateBike}
            onDeleteBike={handleDeleteBike}
            onAddMake={handleAddMake}
            onAddModel={handleAddModel}
          />
        )}

        {activeTab === 'service' && (
          <ServiceHistory
            motorcycles={data.motorcycles}
            serviceRecords={data.serviceRecords}
            onAddServiceRecord={handleAddServiceRecord}
            onUpdateServiceRecord={handleUpdateServiceRecord}
            onDeleteServiceRecord={handleDeleteServiceRecord}
            onUpdateBike={handleUpdateBike}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics
            motorcycles={data.motorcycles}
            serviceRecords={data.serviceRecords}
            companySettings={data.companySettings}
          />
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <CompanySettings
              settings={data.companySettings}
              onUpdate={handleUpdateSettings}
            />

            {/* Data Backup Section */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                💾 Data Backup & Security
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <p className="text-sm text-amber-400 font-medium">Total Vehicles</p>
                  <p className="text-2xl font-bold text-white">{data.motorcycles.length}</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-sm text-green-400 font-medium">Service Records</p>
                  <p className="text-2xl font-bold text-white">{data.serviceRecords.length}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    const exportData = {
                      ...data,
                      exportDate: new Date().toISOString(),
                      version: '1.0'
                    };
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `fleet-guard-backup-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    saveData({ ...data, lastBackup: new Date().toISOString() });
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-400 hover:to-amber-500 transition-colors flex items-center gap-2"
                >
                  📥 Download Backup
                </button>

                <label className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-500 transition-colors cursor-pointer flex items-center gap-2">
                  📤 Restore Backup
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const restored = JSON.parse(event.target?.result as string);
                            if (window.confirm('This will replace all current data. Are you sure?')) {
                              handleRestoreData(restored);
                              alert('Data restored successfully!');
                            }
                          } catch {
                            alert('Invalid backup file');
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>

              {data.lastBackup && (
                <p className="mt-4 text-sm text-gray-500">
                  Last backup: {new Date(data.lastBackup).toLocaleString()}
                </p>
              )}
            </div>

            {/* User Info Section */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                👤 Account Information
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="text-sm text-gray-400">Username</p>
                    <p className="font-medium text-white">{currentUser?.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium text-white">{currentUser?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <p className="text-sm text-gray-400">Company</p>
                    <p className="font-medium text-white">{currentUser?.companyName || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-4 mt-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          <p>© 2026 {data.companySettings.companyName || 'Fleet Guard'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
