import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Calendar, Plus, Edit, Trash2,
  Eye, ChevronLeft, ChevronRight, Save, X, Menu, BarChart3, Image, Search,
  Globe, Palette, FileText, Bell, ChevronDown,
  ExternalLink, Check, AlertCircle,
  Monitor, Smartphone, Home, Layout, Mail, Maximize2,
  MapPin, File, Star, Clock, Mountain, Camera, Bike as BikeIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Tour, ItineraryDay, UpgradeOption, ItineraryImage, Destination, Bike, Page } from '../types';
import { RichTextEditor, HighlightsEditor } from '../components/SmartEditors';
import { HomepageSectionsEditor } from '../components/HomepageSectionsEditor'; // Make sure this is imported!

// Sidebar Component
function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tours', label: 'Tours', icon: Map },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'bikes', label: 'Bikes / Fleet', icon: BikeIcon },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'divider1', type: 'divider' },
    // NEW SECTION ADDED HERE
    { id: 'sections', label: 'Homepage Sections', icon: Layout },
    { id: 'pages', label: 'Pages', icon: File },
    { id: 'menus', label: 'Menu Builder', icon: Menu },
    { id: 'theme', label: 'Theme Customizer', icon: Palette },
    { id: 'homepage', label: 'Global Settings', icon: Home },
    { id: 'header-footer', label: 'Header & Footer', icon: Layout },
    { id: 'images', label: 'Image Settings', icon: Image },
    { id: 'divider2', type: 'divider' },
    { id: 'seo', label: 'SEO Settings', icon: Globe },
    { id: 'contact', label: 'Contact Info', icon: Mail },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'database', label: 'Database Status', icon: BarChart3 },
  ];

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)} />
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">BRM Admin</h1>
              <p className="text-xs text-gray-500">Site Management</p>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-3">
          {menuItems.map((item, i) => {
            if (item.type === 'divider') {
              return <div key={i} className="h-px bg-gray-100 my-3" />;
            }
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${
                  activeTab === item.id
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon && <item.icon size={18} />}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100 bg-gray-50">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition p-2 text-sm">
            <ExternalLink size={16} /> View Website
          </Link>
        </div>
      </aside>
    </>
  );
}

// Top Header
function TopHeader({ setSidebarOpen, onLogout, onRefresh }: { setSidebarOpen: (open: boolean) => void; onLogout: () => void; onRefresh?: () => void }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };
  
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-3">
          {/* Refresh from Database Button */}
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              isRefreshing 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
            title="Refresh data from database"
          >
            <svg 
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRefreshing ? 'Syncing...' : 'Sync Database'}
          </button>
          <Link to="/" target="_blank" className="text-sm text-gray-500 hover:text-amber-600 flex items-center gap-1">
            <ExternalLink size={14} /> Preview Site
          </Link>
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell size={18} className="text-gray-500" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center hover:bg-amber-600 transition"
            >
              <span className="text-white font-semibold text-sm">A</span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium text-gray-900 text-sm">Admin User</p>
                  <p className="text-xs text-gray-500">Logged in</p>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Section Card Component
function SectionCard({ title, description, children, actions, className }: {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className || ''}`}>
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// Form Field Component
function FormField({ label, hint, children, required }: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

// Dashboard Component with Enhanced UI
function Dashboard() {
  const { tours, bookings, destinations, bikes } = useApp();
  const publishedTours = tours.filter(t => t.status === 'published');
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const recentBookings = bookings.slice(0, 5);
  const featuredTours = tours.filter(t => t.featured);

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header with Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-8 text-white">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-amber-100 font-medium">{getGreeting()}, Admin 👋</p>
          <h1 className="text-3xl font-bold mt-1">Dashboard Overview</h1>
          <p className="text-amber-100 mt-2 max-w-xl">
            Welcome to your motorcycle tours management dashboard. Here's a quick summary of your business.
          </p>
        </div>
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Live</span>
        </div>
      </div>

      {/* Stats Grid - Enhanced Design */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Tours', value: tours.length, icon: Map, color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50', textColor: 'text-blue-600', change: '+2 this month' },
          { label: 'Destinations', value: destinations.length, icon: MapPin, color: 'from-emerald-500 to-emerald-600', bgLight: 'bg-emerald-50', textColor: 'text-emerald-600', change: 'Active locations' },
          { label: 'Fleet Size', value: bikes.length, icon: BikeIcon, color: 'from-violet-500 to-violet-600', bgLight: 'bg-violet-50', textColor: 'text-violet-600', change: 'Motorcycles' },
          { label: 'Pending', value: pendingBookings.length, icon: Clock, color: 'from-amber-500 to-amber-600', bgLight: 'bg-amber-50', textColor: 'text-amber-600', change: 'Awaiting confirmation' },
          { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: BarChart3, color: 'from-green-500 to-green-600', bgLight: 'bg-green-50', textColor: 'text-green-600', change: 'Total earnings' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg hover:border-gray-200 transition-all duration-300 group">
            <div className="flex items-start justify-between">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="text-white" size={22} />
              </div>
              <div className={`${stat.bgLight} ${stat.textColor} text-xs font-medium px-2 py-1 rounded-full`}>
                Live
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm font-medium text-gray-600 mt-1">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
            <div>
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Calendar size={18} className="text-amber-500" />
                Recent Bookings
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">{bookings.length} total bookings</p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
              {pendingBookings.length} pending
            </span>
          </div>
          <div className="p-6">
            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {booking.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        booking.status === 'confirmed' ? 'bg-green-500' :
                        booking.status === 'pending' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 truncate">{booking.customerName}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{tours.find(t => t.id === booking.tourId)?.title || 'Tour booking'}</p>
                      <p className="text-xs text-gray-400 mt-1">{booking.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${booking.totalPrice.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{booking.riders} rider{booking.riders > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar size={28} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No bookings yet</p>
                <p className="text-sm text-gray-400 mt-1">Bookings will appear here once customers start booking tours</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Stats - Takes 1 column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-amber-500" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.hash = '#/admin?tab=tours'}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:from-amber-600 hover:to-orange-600 transition shadow-lg shadow-amber-500/25"
              >
                <Plus size={18} />
                Create New Tour
              </button>
              <button 
                onClick={() => window.location.hash = '#/admin?tab=destinations'}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                <MapPin size={18} />
                Add Destination
              </button>
              <button 
                onClick={() => window.location.hash = '#/admin?tab=bikes'}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                <BikeIcon size={18} />
                Add Motorcycle
              </button>
            </div>
          </div>

          {/* Featured Tours */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star size={18} className="text-amber-500" />
              Featured Tours
            </h3>
            {featuredTours.length > 0 ? (
              <div className="space-y-3">
                {featuredTours.slice(0, 3).map(tour => (
                  <div key={tour.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                    <img src={tour.heroImage} alt={tour.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{tour.title}</p>
                      <p className="text-xs text-gray-500">${tour.price.toLocaleString()}</p>
                    </div>
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No featured tours yet</p>
            )}
          </div>

          {/* Site Status */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Monitor size={18} className="text-amber-400" />
              Site Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Published Tours</span>
                <span className="font-medium">{publishedTours.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Active Destinations</span>
                <span className="font-medium">{destinations.filter(d => d.status === 'published').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Available Bikes</span>
                <span className="font-medium">{bikes.filter(b => b.available).length}</span>
              </div>
              <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
                <span className="text-gray-400 text-sm">Status</span>
                <span className="flex items-center gap-2 text-green-400 font-medium">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Destinations Manager
function DestinationsManager({ onEditDestination }: { onEditDestination: (destination: Destination | 'new') => void }) {
  const { destinations, deleteDestination } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredDestinations = destinations.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
          <p className="text-gray-500 mt-1">{destinations.length} destinations total</p>
        </div>
        <button
          onClick={() => onEditDestination('new')}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition flex items-center gap-2"
        >
          <Plus size={18} /> New Destination
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredDestinations.map(destination => (
            <div key={destination.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
              <img src={destination.heroImage} alt={destination.name} className="w-24 h-16 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 truncate">{destination.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    destination.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {destination.status}
                  </span>
                  {destination.featured && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Featured</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{destination.country} • {destination.difficulty}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{destination.tagline}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditDestination(destination)}
                  className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => navigate(`/destinations/${destination.slug}`)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => { if (confirm('Delete this destination?')) deleteDestination(destination.id); }}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <MapPin size={40} className="mx-auto text-gray-300 mb-3" />
            <p>No destinations found</p>
            <button
              onClick={() => onEditDestination('new')}
              className="mt-3 text-amber-600 font-medium"
            >
              + Add First Destination
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Destination Editor
function DestinationEditor({ destination, onSave, onCancel }: {
  destination: Destination | null;
  onSave: (destination: Destination) => void;
  onCancel: () => void;
}) {
  const isNew = !destination;
  const [formData, setFormData] = useState<Destination>(destination || {
    id: Date.now().toString(),
    slug: '',
    name: '',
    country: 'India',
    tagline: '',
    description: '',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=900&fit=crop',
    gallery: [],
    highlights: [],
    bestTimeToVisit: '',
    climate: '',
    terrain: [],
    difficulty: 'Moderate',
    averageAltitude: '',
    popularRoutes: [],
    thingsToKnow: [],
    featured: false,
    status: 'draft',
    seo: { metaTitle: '', metaDescription: '', keywords: [] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'details', label: 'Details' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'seo', label: 'SEO' },
  ];

  const handleSave = () => {
    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    onSave({ ...formData, slug, updatedAt: new Date().toISOString() });
  };

  const addGalleryImage = () => {
    const url = prompt('Enter image URL:');
    if (!url) return;
    const caption = prompt('Enter caption (optional):') || '';
    setFormData({ ...formData, gallery: [...formData.gallery, { url, caption }] });
  };

  const removeGalleryImage = (index: number) => {
    setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="font-semibold text-gray-900">{isNew ? 'Create Destination' : formData.name || 'Edit Destination'}</h2>
            <p className="text-sm text-gray-500">{formData.status === 'published' ? '🟢 Published' : '🟡 Draft'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFormData({ ...formData, status: formData.status === 'published' ? 'draft' : 'published' })}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              formData.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {formData.status === 'published' ? 'Published' : 'Draft'}
          </button>
          <button onClick={onCancel} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">Cancel</button>
          <button onClick={handleSave} className="px-4 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium flex items-center gap-1">
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition ${
                activeTab === tab.id ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Basic Info */}
          {activeTab === 'basic' && (
            <div className="space-y-4 max-w-2xl">
              <FormField label="Destination Name" required>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., Ladakh"
                />
              </FormField>

              <FormField label="Country">
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., India"
                />
              </FormField>

              <FormField label="Tagline" hint="Short catchy phrase">
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., Land of High Passes"
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <FormField label="Hero Image URL" hint="Recommended: 1920x1080px">
                <input
                  type="url"
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              {formData.heroImage && (
                <img src={formData.heroImage} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Difficulty">
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Destination['difficulty'] })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Expert">Expert</option>
                  </select>
                </FormField>
                <FormField label="Average Altitude">
                  <input
                    type="text"
                    value={formData.averageAltitude}
                    onChange={(e) => setFormData({ ...formData, averageAltitude: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g., 3,500 - 5,600m"
                  />
                </FormField>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500"
                />
                <span className="text-sm text-gray-700">⭐ Featured Destination</span>
              </label>
            </div>
          )}

          {/* Details */}
          {activeTab === 'details' && (
            <div className="space-y-4 max-w-2xl">
              <FormField label="Best Time to Visit">
                <input
                  type="text"
                  value={formData.bestTimeToVisit}
                  onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., June to September"
                />
              </FormField>

              <FormField label="Climate">
                <input
                  type="text"
                  value={formData.climate}
                  onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., Cold desert climate"
                />
              </FormField>

              <FormField label="Terrain Types (one per line)">
                <textarea
                  value={formData.terrain.join('\n')}
                  onChange={(e) => setFormData({ ...formData, terrain: e.target.value.split('\n').filter(t => t.trim()) })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="Mountain passes&#10;River crossings&#10;Gravel roads"
                />
              </FormField>

              <FormField label="Highlights (one per line)">
                <textarea
                  value={formData.highlights.join('\n')}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value.split('\n').filter(h => h.trim()) })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="Khardung La Pass&#10;Pangong Lake&#10;Nubra Valley"
                />
              </FormField>

              <FormField label="Popular Routes (one per line)">
                <textarea
                  value={formData.popularRoutes.join('\n')}
                  onChange={(e) => setFormData({ ...formData, popularRoutes: e.target.value.split('\n').filter(r => r.trim()) })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="Manali to Leh Highway&#10;Srinagar to Leh Road"
                />
              </FormField>

              <FormField label="Things to Know (one per line)">
                <textarea
                  value={formData.thingsToKnow.join('\n')}
                  onChange={(e) => setFormData({ ...formData, thingsToKnow: e.target.value.split('\n').filter(t => t.trim()) })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="Permits required for certain areas&#10;Acclimatization important"
                />
              </FormField>
            </div>
          )}

          {/* Gallery */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">{formData.gallery.length} images</p>
                <button
                  onClick={addGalleryImage}
                  className="text-sm text-amber-600 font-medium flex items-center gap-1"
                >
                  <Plus size={16} /> Add Image
                </button>
              </div>

              {formData.gallery.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.gallery.map((img, index) => (
                    <div key={index} className="relative group aspect-video rounded-lg overflow-hidden">
                      <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button
                          onClick={() => removeGalleryImage(index)}
                          className="p-2 bg-red-500 text-white rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                          {img.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <Image size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500 mb-2">No images in gallery</p>
                  <button onClick={addGalleryImage} className="text-amber-600 font-medium text-sm">
                    + Add First Image
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-4 max-w-2xl">
              <FormField label="SEO Title" hint="50-60 characters recommended">
                <input
                  type="text"
                  value={formData.seo.metaTitle}
                  onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <FormField label="Meta Description" hint="150-160 characters recommended">
                <textarea
                  value={formData.seo.metaDescription}
                  onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <FormField label="Keywords (comma separated)">
                <input
                  type="text"
                  value={formData.seo.keywords.join(', ')}
                  onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value.split(',').map(k => k.trim()) } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">GOOGLE PREVIEW</p>
                <p className="text-blue-600 hover:underline cursor-pointer">
                  {formData.seo.metaTitle || `${formData.name} - Motorcycle Tours | BRM Expeditions`}
                </p>
                <p className="text-green-700 text-sm">www.brmexpeditions.com/destinations/{formData.slug || 'destination-slug'}</p>
                <p className="text-gray-600 text-sm">{formData.seo.metaDescription || formData.tagline}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Theme Customizer
function ThemeCustomizer() {
  const { siteSettings, updateSiteSettings } = useApp();
  const [activePreview, setActivePreview] = useState<'desktop' | 'mobile'>('desktop');
  const [colors, setColors] = useState(siteSettings.colors);
  const [typography, setTypography] = useState(siteSettings.typography);

  const handleColorChange = (key: keyof typeof colors, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    updateSiteSettings({ ...siteSettings, colors: newColors });
  };

  const handleTypographyChange = (key: keyof typeof typography, value: string | number) => {
    const newTypography = { ...typography, [key]: value };
    setTypography(newTypography);
    updateSiteSettings({ ...siteSettings, typography: newTypography });
  };

  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Raleway', 'Playfair Display', 'Oswald'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theme Customizer</h1>
          <p className="text-gray-500 mt-1">Customize fonts, colors, and design elements</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActivePreview('desktop')}
            className={`p-2 rounded-md transition ${activePreview === 'desktop' ? 'bg-white shadow-sm' : ''}`}
          >
            <Monitor size={18} className={activePreview === 'desktop' ? 'text-amber-600' : 'text-gray-500'} />
          </button>
          <button
            onClick={() => setActivePreview('mobile')}
            className={`p-2 rounded-md transition ${activePreview === 'mobile' ? 'bg-white shadow-sm' : ''}`}
          >
            <Smartphone size={18} className={activePreview === 'mobile' ? 'text-amber-600' : 'text-gray-500'} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Color Settings */}
        <SectionCard title="Colors" description="Customize your brand colors">
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'primary', label: 'Primary' },
              { key: 'secondary', label: 'Secondary' },
              { key: 'accent', label: 'Accent' },
              { key: 'background', label: 'Background' },
              { key: 'text', label: 'Text' },
              { key: 'textLight', label: 'Text Light' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="color"
                  value={colors[key as keyof typeof colors]}
                  onChange={(e) => handleColorChange(key as keyof typeof colors, e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  <p className="text-xs text-gray-500 uppercase">{colors[key as keyof typeof colors]}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Typography Settings */}
        <SectionCard title="Typography" description="Font settings and sizes">
          <div className="space-y-4">
            <FormField label="Heading Font">
              <select
                value={typography.headingFont}
                onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {fonts.map(font => <option key={font} value={font}>{font}</option>)}
              </select>
            </FormField>

            <FormField label="Body Font">
              <select
                value={typography.bodyFont}
                onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                {fonts.map(font => <option key={font} value={font}>{font}</option>)}
              </select>
            </FormField>

            <FormField label={`Base Font Size: ${typography.baseFontSize}px`}>
              <input
                type="range"
                min="12"
                max="20"
                value={typography.baseFontSize}
                onChange={(e) => handleTypographyChange('baseFontSize', parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </FormField>

            <FormField label={`Line Height: ${typography.lineHeight}`}>
              <input
                type="range"
                min="1.2"
                max="2"
                step="0.1"
                value={typography.lineHeight}
                onChange={(e) => handleTypographyChange('lineHeight', parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </FormField>
          </div>
        </SectionCard>

        {/* Font Preview */}
        <SectionCard title="Preview" description="See how your fonts look" className="lg:col-span-2">
          <div className="bg-gray-50 rounded-lg p-6 space-y-4" style={{ fontFamily: typography.bodyFont }}>
            <h1 className="text-3xl font-bold" style={{ fontFamily: typography.headingFont, color: colors.text }}>
              This is a Heading
            </h1>
            <h2 className="text-2xl font-semibold" style={{ fontFamily: typography.headingFont, color: colors.text }}>
              This is a Subheading
            </h2>
            <p className="text-base" style={{ fontSize: typography.baseFontSize, lineHeight: typography.lineHeight, color: colors.text }}>
              This is body text that shows how your content will look. The quick brown fox jumps over the lazy dog. 
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <div className="flex gap-3 pt-2">
              <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: colors.primary }}>
                Primary Button
              </button>
              <button className="px-4 py-2 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: colors.secondary }}>
                Secondary Button
              </button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// Homepage Editor
function HomepageEditor() {
  const { siteSettings, updateSiteSettings } = useApp();
  
  // Default values for all homepage sections
  const defaultHero = {
    title: 'Adventure Awaits',
    subtitle: 'Experience the thrill of motorcycle touring',
    backgroundImage: '',
    overlayOpacity: 50,
    ctaText: 'Explore Tours',
    ctaLink: '/tours',
    secondaryCtaText: 'Learn More',
    secondaryCtaLink: '/about'
  };
  
  const defaultStats = {
    enabled: true,
    items: [
      { value: '500+', label: 'Happy Riders' },
      { value: '50+', label: 'Tours Completed' },
      { value: '10+', label: 'Years Experience' }
    ]
  };
  
  const defaultFeatured = {
    enabled: true,
    title: 'Featured Tours',
    subtitle: 'Explore our most popular adventures',
    maxItems: 6,
    showFeaturedOnly: false
  };
  
  const defaultWhyUs = {
    enabled: true,
    title: 'Why Choose Us',
    items: []
  };
  
  const defaultTestimonials = {
    enabled: true,
    title: 'What Our Riders Say',
    items: []
  };
  
  const defaultCta = {
    enabled: true,
    title: 'Ready for Adventure?',
    subtitle: 'Book your dream motorcycle tour today',
    backgroundImage: '',
    ctaText: 'Browse Tours',
    ctaLink: '/tours'
  };
  
  const [hero, setHero] = useState(siteSettings?.homepage?.hero || defaultHero);
  const [stats, setStats] = useState(siteSettings?.homepage?.stats || defaultStats);
  const [featured, setFeatured] = useState(siteSettings?.homepage?.featuredSection || defaultFeatured);
  const [whyUs, setWhyUs] = useState(siteSettings?.homepage?.whyChooseUs || defaultWhyUs);
  const [testimonials, setTestimonials] = useState(siteSettings?.homepage?.testimonials || defaultTestimonials);
  const [cta, setCta] = useState(siteSettings?.homepage?.ctaSection || defaultCta);
  const [activeSection, setActiveSection] = useState('hero');

  const saveChanges = () => {
    updateSiteSettings({
      homepage: { hero, stats, featuredSection: featured, whyChooseUs: whyUs, testimonials, ctaSection: cta }
    });
  };

  useEffect(() => {
    saveChanges();
  }, [hero, stats, featured, whyUs, testimonials, cta]);

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: Maximize2 },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'featured', label: 'Featured Tours', icon: Map },
    { id: 'whyus', label: 'Why Choose Us', icon: Check },
    { id: 'testimonials', label: 'Testimonials', icon: FileText },
    { id: 'cta', label: 'CTA Section', icon: ChevronRight },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Homepage Editor</h1>
        <p className="text-gray-500 mt-1">Customize your homepage content and layout</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-3 sticky top-20">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">Sections</p>
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition mb-1 ${
                  activeSection === section.id
                    ? 'bg-amber-50 text-amber-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <section.icon size={16} />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Hero Section */}
          {activeSection === 'hero' && (
            <SectionCard title="Hero Section" description="Main banner on your homepage">
              <div className="space-y-4">
                <FormField label="Title" required>
                  <input
                    type="text"
                    value={hero.title}
                    onChange={(e) => setHero({ ...hero, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="Ride the Himalayas"
                  />
                </FormField>

                <FormField label="Subtitle">
                  <textarea
                    value={hero.subtitle}
                    onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="Your adventure starts here..."
                  />
                </FormField>

                <FormField label="Background Image URL" hint="Recommended size: 1920x1080px">
                  <input
                    type="url"
                    value={hero.backgroundImage}
                    onChange={(e) => setHero({ ...hero, backgroundImage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>

                {hero.backgroundImage && (
                  <div className="relative rounded-lg overflow-hidden h-40">
                    <img src={hero.backgroundImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black" style={{ opacity: hero.overlayOpacity / 100 }} />
                  </div>
                )}

                <FormField label={`Overlay Opacity: ${hero.overlayOpacity}%`}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hero.overlayOpacity}
                    onChange={(e) => setHero({ ...hero, overlayOpacity: parseInt(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Primary CTA Text">
                    <input
                      type="text"
                      value={hero.ctaText}
                      onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </FormField>
                  <FormField label="Primary CTA Link">
                    <input
                      type="text"
                      value={hero.ctaLink}
                      onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </FormField>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Stats Section */}
          {activeSection === 'stats' && (
            <SectionCard 
              title="Statistics Section" 
              description="Show key numbers and achievements"
              actions={
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stats.enabled}
                    onChange={(e) => setStats({ ...stats, enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500"
                  />
                  <span className="text-sm">Enabled</span>
                </label>
              }
            >
              <div className="space-y-3">
                {(stats.items || []).map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => {
                        const newItems = [...stats.items];
                        newItems[index].value = e.target.value;
                        setStats({ ...stats, items: newItems });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                      placeholder="500+"
                    />
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const newItems = [...stats.items];
                        newItems[index].label = e.target.value;
                        setStats({ ...stats, items: newItems });
                      }}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                      placeholder="Happy Riders"
                    />
                    <button
                      onClick={() => setStats({ ...stats, items: stats.items.filter((_, i) => i !== index) })}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setStats({ ...stats, items: [...(stats.items || []), { value: '', label: '' }] })}
                  className="text-sm text-amber-600 font-medium flex items-center gap-1 hover:text-amber-700"
                >
                  <Plus size={16} /> Add Stat
                </button>
              </div>
            </SectionCard>
          )}

          {/* Featured Section */}
          {activeSection === 'featured' && (
            <SectionCard 
              title="Featured Tours Section" 
              actions={
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured.enabled}
                    onChange={(e) => setFeatured({ ...featured, enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500"
                  />
                  <span className="text-sm">Enabled</span>
                </label>
              }
            >
              <div className="space-y-4">
                <FormField label="Section Title">
                  <input
                    type="text"
                    value={featured.title}
                    onChange={(e) => setFeatured({ ...featured, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
                <FormField label="Subtitle">
                  <textarea
                    value={featured.subtitle}
                    onChange={(e) => setFeatured({ ...featured, subtitle: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Max Tours to Show">
                    <input
                      type="number"
                      value={featured.maxItems}
                      onChange={(e) => setFeatured({ ...featured, maxItems: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      min="1"
                      max="12"
                    />
                  </FormField>
                  <FormField label="">
                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                      <input
                        type="checkbox"
                        checked={featured.showFeaturedOnly}
                        onChange={(e) => setFeatured({ ...featured, showFeaturedOnly: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-amber-500"
                      />
                      <span className="text-sm">Show featured tours only</span>
                    </label>
                  </FormField>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Why Choose Us */}
          {activeSection === 'whyus' && (
            <SectionCard 
              title="Why Choose Us Section"
              actions={
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whyUs.enabled}
                    onChange={(e) => setWhyUs({ ...whyUs, enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500"
                  />
                  <span className="text-sm">Enabled</span>
                </label>
              }
            >
              <div className="space-y-4">
                <FormField label="Section Title">
                  <input
                    type="text"
                    value={whyUs.title}
                    onChange={(e) => setWhyUs({ ...whyUs, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>

                <p className="text-sm font-medium text-gray-700">Features</p>
                {(whyUs.items || []).map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Feature #{index + 1}</span>
                      <button
                        onClick={() => setWhyUs({ ...whyUs, items: whyUs.items.filter((_, i) => i !== index) })}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...whyUs.items];
                        newItems[index].title = e.target.value;
                        setWhyUs({ ...whyUs, items: newItems });
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      placeholder="Feature title"
                    />
                    <textarea
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...whyUs.items];
                        newItems[index].description = e.target.value;
                        setWhyUs({ ...whyUs, items: newItems });
                      }}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      placeholder="Feature description"
                    />
                  </div>
                ))}
                <button
                  onClick={() => setWhyUs({ ...whyUs, items: [...(whyUs.items || []), { icon: 'Star', title: '', description: '' }] })}
                  className="text-sm text-amber-600 font-medium flex items-center gap-1 hover:text-amber-700"
                >
                  <Plus size={16} /> Add Feature
                </button>
              </div>
            </SectionCard>
          )}

          {/* Testimonials */}
          {activeSection === 'testimonials' && (
            <SectionCard 
              title="Testimonials Section"
              actions={
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={testimonials.enabled}
                    onChange={(e) => setTestimonials({ ...testimonials, enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500"
                  />
                  <span className="text-sm">Enabled</span>
                </label>
              }
            >
              <div className="space-y-4">
                <FormField label="Section Title">
                  <input
                    type="text"
                    value={testimonials.title}
                    onChange={(e) => setTestimonials({ ...testimonials, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>

                {(testimonials.items || []).map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Testimonial #{index + 1}</span>
                      <button
                        onClick={() => setTestimonials({ ...testimonials, items: testimonials.items.filter((_, i) => i !== index) })}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...testimonials.items];
                          newItems[index].name = e.target.value;
                          setTestimonials({ ...testimonials, items: newItems });
                        }}
                        className="px-3 py-2 border border-gray-200 rounded-lg"
                        placeholder="Name"
                      />
                      <input
                        type="text"
                        value={item.country}
                        onChange={(e) => {
                          const newItems = [...testimonials.items];
                          newItems[index].country = e.target.value;
                          setTestimonials({ ...testimonials, items: newItems });
                        }}
                        className="px-3 py-2 border border-gray-200 rounded-lg"
                        placeholder="Country"
                      />
                    </div>
                    <textarea
                      value={item.text}
                      onChange={(e) => {
                        const newItems = [...testimonials.items];
                        newItems[index].text = e.target.value;
                        setTestimonials({ ...testimonials, items: newItems });
                      }}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      placeholder="Testimonial text"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Rating:</span>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => {
                            const newItems = [...testimonials.items];
                            newItems[index].rating = star;
                            setTestimonials({ ...testimonials, items: newItems });
                          }}
                          className={star <= item.rating ? 'text-amber-500' : 'text-gray-300'}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setTestimonials({ ...testimonials, items: [...(testimonials.items || []), { name: '', country: '', text: '', rating: 5 }] })}
                  className="text-sm text-amber-600 font-medium flex items-center gap-1 hover:text-amber-700"
                >
                  <Plus size={16} /> Add Testimonial
                </button>
              </div>
            </SectionCard>
          )}

          {/* CTA Section */}
          {activeSection === 'cta' && (
            <SectionCard 
              title="Call to Action Section"
              actions={
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cta.enabled}
                    onChange={(e) => setCta({ ...cta, enabled: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500"
                  />
                  <span className="text-sm">Enabled</span>
                </label>
              }
            >
              <div className="space-y-4">
                <FormField label="Title">
                  <input
                    type="text"
                    value={cta.title}
                    onChange={(e) => setCta({ ...cta, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
                <FormField label="Subtitle">
                  <textarea
                    value={cta.subtitle}
                    onChange={(e) => setCta({ ...cta, subtitle: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
                <FormField label="Background Image URL">
                  <input
                    type="url"
                    value={cta.backgroundImage}
                    onChange={(e) => setCta({ ...cta, backgroundImage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Button Text">
                    <input
                      type="text"
                      value={cta.ctaText}
                      onChange={(e) => setCta({ ...cta, ctaText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </FormField>
                  <FormField label="Button Link">
                    <input
                      type="text"
                      value={cta.ctaLink}
                      onChange={(e) => setCta({ ...cta, ctaLink: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    />
                  </FormField>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}

// Header & Footer Editor (keeping existing code structure)
function HeaderFooterEditor() {
  const { siteSettings, updateSiteSettings } = useApp();
  const [header, setHeader] = useState(siteSettings.header);
  const [footer, setFooter] = useState(siteSettings.footer);
  const [activeTab, setActiveTab] = useState('header');

  useEffect(() => {
    updateSiteSettings({ header, footer });
  }, [header, footer]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Header & Footer</h1>
        <p className="text-gray-500 mt-1">Customize your site navigation and footer</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {['header', 'footer'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition -mb-px ${
              activeTab === tab
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'header' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <SectionCard title="Logo Settings">
            <div className="space-y-4">
              <FormField label="Logo Type">
                <select
                  value={header.logoType}
                  onChange={(e) => setHeader({ ...header, logoType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="text">Text Only</option>
                  <option value="image">Image Only</option>
                  <option value="both">Image + Text</option>
                </select>
              </FormField>

              <FormField label="Logo Text">
                <input
                  type="text"
                  value={header.logoText}
                  onChange={(e) => setHeader({ ...header, logoText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <FormField label="Logo Tagline">
                <input
                  type="text"
                  value={header.logoTagline}
                  onChange={(e) => setHeader({ ...header, logoTagline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <FormField label="Logo Image URL">
                <input
                  type="url"
                  value={header.logoImage}
                  onChange={(e) => setHeader({ ...header, logoImage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard title="Header Options">
            <div className="space-y-4">
              <FormField label="Header Style">
                <select
                  value={header.style}
                  onChange={(e) => setHeader({ ...header, style: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="transparent">Transparent</option>
                  <option value="solid">Solid</option>
                  <option value="gradient">Gradient</option>
                </select>
              </FormField>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Sticky Header</span>
                <input
                  type="checkbox"
                  checked={header.sticky}
                  onChange={(e) => setHeader({ ...header, sticky: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Show Top Bar</span>
                <input
                  type="checkbox"
                  checked={header.showTopBar}
                  onChange={(e) => setHeader({ ...header, showTopBar: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Show Book Button</span>
                <input
                  type="checkbox"
                  checked={header.showBookButton}
                  onChange={(e) => setHeader({ ...header, showBookButton: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500"
                />
              </div>

              {header.showBookButton && (
                <FormField label="Book Button Text">
                  <input
                    type="text"
                    value={header.bookButtonText}
                    onChange={(e) => setHeader({ ...header, bookButtonText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
              )}
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === 'footer' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <SectionCard title="Footer Settings">
            <div className="space-y-4">
              <FormField label="Footer Style">
                <select
                  value={footer.style}
                  onChange={(e) => setFooter({ ...footer, style: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="default">Default (Multi-column)</option>
                  <option value="minimal">Minimal</option>
                  <option value="centered">Centered</option>
                </select>
              </FormField>

              <FormField label="Copyright Text">
                <input
                  type="text"
                  value={footer.copyrightText}
                  onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Show Social Links</span>
                <input
                  type="checkbox"
                  checked={footer.showSocialLinks}
                  onChange={(e) => setFooter({ ...footer, showSocialLinks: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Show Newsletter</span>
                <input
                  type="checkbox"
                  checked={footer.showNewsletter}
                  onChange={(e) => setFooter({ ...footer, showNewsletter: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Footer Links" actions={
            <button
              onClick={() => setFooter({ ...footer, columns: [...footer.columns, { title: 'New Column', links: [] }] })}
              className="text-sm text-amber-600 font-medium"
            >
              <Plus size={16} className="inline" /> Add Column
            </button>
          }>
            <div className="space-y-4">
              {footer.columns.map((col, colIndex) => (
                <div key={colIndex} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) => {
                        const newCols = [...footer.columns];
                        newCols[colIndex].title = e.target.value;
                        setFooter({ ...footer, columns: newCols });
                      }}
                      className="font-medium text-gray-900 border-none p-0 focus:ring-0"
                      placeholder="Column Title"
                    />
                    <button
                      onClick={() => setFooter({ ...footer, columns: footer.columns.filter((_, i) => i !== colIndex) })}
                      className="text-red-500 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {col.links.map((link, linkIndex) => (
                    <div key={linkIndex} className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const newCols = [...footer.columns];
                          newCols[colIndex].links[linkIndex].label = e.target.value;
                          setFooter({ ...footer, columns: newCols });
                        }}
                        className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded"
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const newCols = [...footer.columns];
                          newCols[colIndex].links[linkIndex].url = e.target.value;
                          setFooter({ ...footer, columns: newCols });
                        }}
                        className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded"
                        placeholder="URL"
                      />
                      <button
                        onClick={() => {
                          const newCols = [...footer.columns];
                          newCols[colIndex].links = newCols[colIndex].links.filter((_, i) => i !== linkIndex);
                          setFooter({ ...footer, columns: newCols });
                        }}
                        className="text-red-500"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newCols = [...footer.columns];
                      newCols[colIndex].links.push({ label: '', url: '' });
                      setFooter({ ...footer, columns: newCols });
                    }}
                    className="text-xs text-amber-600 mt-2"
                  >
                    + Add Link
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}

// SEO Settings
function SEOSettingsEditor() {
  const { siteSettings, updateSiteSettings } = useApp();
  
  // Default SEO values
  const defaultSeo = {
    siteTitle: '',
    siteDescription: '',
    keywords: [] as string[],
    ogImage: '',
    twitterHandle: '',
    googleAnalyticsId: '',
    facebookPixelId: ''
  };
  
  const [seo, setSeo] = useState(siteSettings?.seo || defaultSeo);

  useEffect(() => {
    updateSiteSettings({ seo });
  }, [seo]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SEO Settings</h1>
        <p className="text-gray-500 mt-1">Optimize your site for search engines</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SectionCard title="Global SEO">
          <div className="space-y-4">
            <FormField label="Site Title" hint="Appears in browser tab and search results">
              <input
                type="text"
                value={seo.siteTitle}
                onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
              <div className="mt-1 text-xs text-gray-400">{(seo.siteTitle || '').length}/60 characters</div>
            </FormField>

            <FormField label="Site Description" hint="Appears in search results">
              <textarea
                value={seo.siteDescription}
                onChange={(e) => setSeo({ ...seo, siteDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
              <div className="mt-1 text-xs text-gray-400">{(seo.siteDescription || '').length}/160 characters</div>
            </FormField>

            <FormField label="Keywords" hint="Comma-separated">
              <input
                type="text"
                value={(seo.keywords || []).join(', ')}
                  onChange={(e) => setSeo({ ...seo, keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k) })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard title="Social & Analytics">
          <div className="space-y-4">
            <FormField label="Social Share Image URL" hint="1200x630px recommended">
              <input
                type="url"
                value={seo.ogImage}
                onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </FormField>

            <FormField label="Twitter Handle">
              <input
                type="text"
                value={seo.twitterHandle}
                onChange={(e) => setSeo({ ...seo, twitterHandle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="@brmexpeditions"
              />
            </FormField>

            <FormField label="Google Analytics ID">
              <input
                type="text"
                value={seo.googleAnalyticsId}
                onChange={(e) => setSeo({ ...seo, googleAnalyticsId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="G-XXXXXXXXXX"
              />
            </FormField>

            <FormField label="Facebook Pixel ID">
              <input
                type="text"
                value={seo.facebookPixelId}
                onChange={(e) => setSeo({ ...seo, facebookPixelId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </FormField>
          </div>
        </SectionCard>

        {/* Google Preview */}
        <SectionCard title="Google Preview" description="How your site appears in search results" className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-2xl">
            <p className="text-blue-600 text-lg hover:underline cursor-pointer">{seo.siteTitle || 'Your Site Title'}</p>
            <p className="text-green-700 text-sm">www.brmexpeditions.com</p>
            <p className="text-gray-600 text-sm mt-1">{seo.siteDescription || 'Your site description will appear here...'}</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// Contact Settings
function ContactSettingsEditor() {
  const { siteSettings, updateSiteSettings } = useApp();
  const [contact, setContact] = useState(siteSettings.contact);

  useEffect(() => {
    updateSiteSettings({ contact });
  }, [contact]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Information</h1>
        <p className="text-gray-500 mt-1">Update your business contact details</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SectionCard title="Contact Details">
          <div className="space-y-4">
            <FormField label="Email Address">
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </FormField>

            <FormField label="Primary Phone">
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </FormField>

            <FormField label="Secondary Phone">
              <input
                type="tel"
                value={contact.phone2}
                onChange={(e) => setContact({ ...contact, phone2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </FormField>

            <FormField label="WhatsApp Number">
              <input
                type="tel"
                value={contact.whatsapp}
                onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </FormField>

            <FormField label="Business Hours">
              <input
                type="text"
                value={contact.businessHours}
                onChange={(e) => setContact({ ...contact, businessHours: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard title="Address">
          <div className="space-y-4">
            <FormField label="Street Address">
              <input
                type="text"
                value={contact.address}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </FormField>

            <FormField label="City">
              <input
                type="text"
                value={contact.city}
                onChange={(e) => setContact({ ...contact, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </FormField>

            <FormField label="Country">
              <input
                type="text"
                value={contact.country}
                onChange={(e) => setContact({ ...contact, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </FormField>

            <FormField label="Google Maps Embed URL">
              <input
                type="url"
                value={contact.mapEmbedUrl}
                onChange={(e) => setContact({ ...contact, mapEmbedUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard title="Social Media Links" className="lg:col-span-2">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(contact.socialLinks).map(([key, value]) => (
              <FormField key={key} label={key.charAt(0).toUpperCase() + key.slice(1)}>
                <input
                  type="url"
                  value={value}
                  onChange={(e) => setContact({ ...contact, socialLinks: { ...contact.socialLinks, [key]: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder={`https://${key}.com/...`}
                />
              </FormField>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// Tours Manager
function ToursManager({ onEditTour }: { onEditTour: (tour: Tour | 'new') => void }) {
  const { tours, deleteTour } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredTours = tours.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tours</h1>
          <p className="text-gray-500 mt-1">{tours.length} tours total</p>
        </div>
        <button
          onClick={() => onEditTour('new')}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition flex items-center gap-2"
        >
          <Plus size={18} /> New Tour
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tours..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredTours.map(tour => (
            <div key={tour.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
              <img src={tour.heroImage} alt={tour.title} className="w-20 h-14 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 truncate">{tour.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    tour.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tour.status}
                  </span>
                  {tour.featured && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Featured</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{tour.duration} • ${tour.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditTour(tour)}
                  className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => navigate(`/tours/${tour.slug}`)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => { if (confirm('Delete this tour?')) deleteTour(tour.id); }}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTours.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Map size={40} className="mx-auto text-gray-300 mb-3" />
            <p>No tours found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Bookings Manager
function BookingsManager() {
  const { bookings, tours, updateBooking } = useApp();
  const getTourTitle = (id: string) => tours.find(t => t.id === id)?.title || 'Unknown';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="text-gray-500 mt-1">{bookings.length} total bookings</p>
      </div>

      {bookings.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Tour</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{booking.customerName}</p>
                    <p className="text-sm text-gray-500">{booking.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{getTourTitle(booking.tourId)}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(booking.departureDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">${booking.totalPrice.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.status}
                      onChange={(e) => updateBooking(booking.id, { status: e.target.value as any })}
                      className={`text-sm px-2 py-1 rounded-lg border-0 ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No bookings yet</p>
        </div>
      )}
    </div>
  );
}

// Media Library with Upload Instructions and Image Management
function MediaLibrary() {
  const [images, setImages] = useState<Array<{id: string; url: string; name: string; category: string; uploadedAt: string}>>(() => {
    const saved = localStorage.getItem('brm_media_library');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadGuide, setShowUploadGuide] = useState(false);
  const [newImage, setNewImage] = useState({ url: '', name: '', category: 'general' });
  const [filter, setFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = ['general', 'tours', 'destinations', 'bikes', 'team', 'gallery', 'heroes'];

  const saveImages = (newImages: typeof images) => {
    setImages(newImages);
    localStorage.setItem('brm_media_library', JSON.stringify(newImages));
  };

  const handleAddImage = () => {
    if (!newImage.url) return;
    const image = {
      id: Date.now().toString(),
      url: newImage.url,
      name: newImage.name || 'Untitled',
      category: newImage.category,
      uploadedAt: new Date().toISOString()
    };
    saveImages([image, ...images]);
    setNewImage({ url: '', name: '', category: 'general' });
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this image from library?')) {
      saveImages(images.filter(img => img.id !== id));
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredImages = filter === 'all' ? images : images.filter(img => img.category === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
          <p className="text-gray-500 mt-1">Manage all your website images in one place</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUploadGuide(true)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <AlertCircle size={18} />
            How to Upload
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2"
          >
            <Plus size={18} />
            Add Image
          </button>
        </div>
      </div>

      {/* Upload Guide Modal */}
      {showUploadGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold">How to Upload Images</h3>
              <button onClick={() => setShowUploadGuide(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-800">
                  <strong>Note:</strong> This website uses image URLs. Upload your images to an external hosting service and then add the URL here.
                </p>
              </div>

              {/* Option 1: Cloudinary */}
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-lg">Cloudinary (Recommended - Free)</h4>
                    <p className="text-gray-500 text-sm">Best for tour websites, free tier available</p>
                  </div>
                </div>
                <ol className="space-y-2 text-gray-700 text-sm">
                  <li>1. Go to <a href="https://cloudinary.com" target="_blank" className="text-blue-600 underline">cloudinary.com</a> and create a free account</li>
                  <li>2. Click "Media Library" → "Upload" button</li>
                  <li>3. Upload your image (drag & drop or browse)</li>
                  <li>4. Click on the image → Copy the URL from the right panel</li>
                  <li>5. Paste the URL in our Media Library</li>
                </ol>
              </div>

              {/* Option 2: ImgBB */}
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-lg">ImgBB (Quick & Easy - Free)</h4>
                    <p className="text-gray-500 text-sm">No signup required for quick uploads</p>
                  </div>
                </div>
                <ol className="space-y-2 text-gray-700 text-sm">
                  <li>1. Go to <a href="https://imgbb.com" target="_blank" className="text-blue-600 underline">imgbb.com</a></li>
                  <li>2. Click "Start uploading" and select your image</li>
                  <li>3. After upload, copy the "Direct link" URL</li>
                  <li>4. Paste the URL in our Media Library</li>
                </ol>
              </div>

              {/* Recommended Image Sizes */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-bold text-lg mb-4">📐 Recommended Image Sizes</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="font-medium">Hero Images</p>
                    <p className="text-gray-500">1920 x 1080 px (16:9)</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="font-medium">Tour Cards</p>
                    <p className="text-gray-500">800 x 600 px (4:3)</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="font-medium">Gallery Images</p>
                    <p className="text-gray-500">1200 x 800 px (3:2)</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="font-medium">Bike Images</p>
                    <p className="text-gray-500">1000 x 667 px (3:2)</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h4 className="font-bold text-blue-900 mb-3">💡 Pro Tips</h4>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• Optimize images before uploading (use tinypng.com)</li>
                  <li>• Use descriptive file names for SEO</li>
                  <li>• Keep file sizes under 500KB for fast loading</li>
                  <li>• Use JPG for photos, PNG for logos/graphics</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Image Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold">Add Image to Library</h3>
            </div>
            <div className="p-6 space-y-4">
              <FormField label="Image URL" required>
                <input
                  type="url"
                  value={newImage.url}
                  onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </FormField>
              {newImage.url && (
                <div className="border border-gray-200 rounded-lg p-2">
                  <img 
                    src={newImage.url} 
                    alt="Preview" 
                    className="w-full h-40 object-cover rounded"
                    onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+URL'}
                  />
                </div>
              )}
              <FormField label="Image Name">
                <input
                  type="text"
                  value={newImage.name}
                  onChange={(e) => setNewImage({ ...newImage, name: e.target.value })}
                  placeholder="e.g., Ladakh Tour Hero"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </FormField>
              <FormField label="Category">
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </FormField>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => { setShowAddModal(false); setNewImage({ url: '', name: '', category: 'general' }); }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddImage}
                disabled={!newImage.url}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
              >
                Add to Library
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-lg">
            <X size={28} />
          </button>
          <img src={selectedImage} alt="Full view" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Filter & Stats */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === 'all' ? 'bg-amber-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
          >
            All ({images.length})
          </button>
          {categories.map(cat => {
            const count = images.filter(img => img.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filter === cat ? 'bg-amber-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Images Grid */}
      {filteredImages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No images yet</h3>
          <p className="text-gray-500 mb-6">Add your first image to get started</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowUploadGuide(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              How to Upload
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              Add Your First Image
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredImages.map(image => (
            <div key={image.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div 
                className="aspect-square relative cursor-pointer overflow-hidden"
                onClick={() => setSelectedImage(image.url)}
              >
                <img 
                  src={image.url} 
                  alt={image.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Error'}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">{image.category}</span>
                </div>
              </div>
              <div className="p-3">
                <p className="font-medium text-gray-900 truncate text-sm">{image.name}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(image.uploadedAt).toLocaleDateString()}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => copyToClipboard(image.url, image.id)}
                    className={`flex-1 px-3 py-1.5 text-xs rounded-lg transition-colors ${copiedId === image.id ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    {copiedId === image.id ? '✓ Copied!' : 'Copy URL'}
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
            <AlertCircle size={20} className="text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 mb-2">Quick Tips for Using Images</h4>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Click <strong>"Copy URL"</strong> on any image, then paste it in tour/destination image fields</li>
              <li>• Use categories to organize your images (tours, destinations, bikes, etc.)</li>
              <li>• Click on any image to view it in full size</li>
              <li>• For best results, use <strong>Cloudinary</strong> for permanent, reliable image hosting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Page Editor Component (extracted to avoid hooks rules violation)
function PageEditor({ page, onSave, onCancel }: {
  page: Page;
  onSave: (page: Page) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Page>(page);
  const [activeTab, setActiveTab] = useState('content');

  const handleSave = () => {
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    onSave({ ...formData, slug, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="font-semibold text-gray-900">{formData.title || 'New Page'}</h2>
            <p className="text-sm text-gray-500">{formData.status === 'published' ? '🟢 Published' : '🟡 Draft'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFormData({ ...formData, status: formData.status === 'published' ? 'draft' : 'published' })}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              formData.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {formData.status === 'published' ? 'Published' : 'Draft'}
          </button>
          <button onClick={onCancel} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">Cancel</button>
          <button 
            onClick={handleSave} 
            className="px-4 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium flex items-center gap-1"
          >
            <Save size={16} /> Save Page
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-100">
          {['content', 'settings', 'seo'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize border-b-2 -mb-px transition ${
                activeTab === tab ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'content' && (
            <div className="space-y-4">
              <FormField label="Page Title" required>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg"
                  placeholder="Enter page title"
                />
              </FormField>

              <FormField label="Page Slug" hint="URL-friendly version of the title">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">yoursite.com/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="page-slug"
                  />
                </div>
              </FormField>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Page Content</label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your page content here..."
                  minHeight={400}
                />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-xl">
              <FormField label="Template">
                <select
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value as Page['template'] })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="default">Default (with sidebar)</option>
                  <option value="full-width">Full Width</option>
                  <option value="landing">Landing Page</option>
                  <option value="sidebar">With Sidebar</option>
                </select>
              </FormField>

              <FormField label="Featured Image">
                <input
                  type="url"
                  value={formData.featuredImage || ''}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="https://..."
                />
              </FormField>

              {formData.featuredImage && (
                <img src={formData.featuredImage} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
              )}

              <FormField label="Excerpt" hint="Short description for listings">
                <textarea
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Show in Navigation Menu</p>
                  <p className="text-sm text-gray-500">Display this page in the main menu</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.showInMenu}
                  onChange={(e) => setFormData({ ...formData, showInMenu: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500"
                />
              </div>

              {formData.showInMenu && (
                <FormField label="Menu Order">
                  <input
                    type="number"
                    value={formData.menuOrder}
                    onChange={(e) => setFormData({ ...formData, menuOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    min="0"
                  />
                </FormField>
              )}
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4 max-w-xl">
              <FormField label="SEO Title" hint="50-60 characters recommended">
                <input
                  type="text"
                  value={formData.seo.metaTitle}
                  onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaTitle: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <FormField label="Meta Description" hint="150-160 characters recommended">
                <textarea
                  value={formData.seo.metaDescription}
                  onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, metaDescription: e.target.value } })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <FormField label="Keywords (comma separated)">
                <input
                  type="text"
                  value={formData.seo.keywords.join(', ')}
                  onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value.split(',').map(k => k.trim()) } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">GOOGLE PREVIEW</p>
                <p className="text-blue-600 hover:underline cursor-pointer">
                  {formData.seo.metaTitle || `${formData.title} | BRM Expeditions`}
                </p>
                <p className="text-green-700 text-sm">www.brmexpeditions.com/{formData.slug || 'page-slug'}</p>
                <p className="text-gray-600 text-sm">{formData.seo.metaDescription || formData.excerpt}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Pages Manager
function PagesManager() {
  const [pages, setPages] = useState<Page[]>(() => {
    const saved = localStorage.getItem('brm-pages');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        slug: 'about',
        title: 'About Us',
        content: '<h2>About BRM Expeditions</h2><p>We are passionate motorcycle tour operators...</p>',
        excerpt: 'Learn about our story and team',
        template: 'default',
        status: 'published',
        showInMenu: true,
        menuOrder: 1,
        seo: { metaTitle: 'About Us | BRM Expeditions', metaDescription: '', keywords: [] },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        slug: 'contact',
        title: 'Contact Us',
        content: '<h2>Get in Touch</h2><p>We would love to hear from you...</p>',
        excerpt: 'Contact our team',
        template: 'default',
        status: 'published',
        showInMenu: true,
        menuOrder: 2,
        seo: { metaTitle: 'Contact Us | BRM Expeditions', metaDescription: '', keywords: [] },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  });
  const [editingPage, setEditingPage] = useState<Page | 'new' | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('brm-pages', JSON.stringify(pages));
  }, [pages]);

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const savePage = (page: Page) => {
    if (editingPage === 'new') {
      setPages([...pages, page]);
    } else {
      setPages(pages.map(p => p.id === page.id ? page : p));
    }
    setEditingPage(null);
  };

  const deletePage = (id: string) => {
    if (confirm('Delete this page?')) {
      setPages(pages.filter(p => p.id !== id));
    }
  };

  const emptyPage: Page = {
    id: Date.now().toString(),
    slug: '',
    title: '',
    content: '',
    excerpt: '',
    template: 'default',
    status: 'draft',
    showInMenu: false,
    menuOrder: pages.length + 1,
    seo: { metaTitle: '', metaDescription: '', keywords: [] },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // If editing, render the PageEditor component
  if (editingPage) {
    const pageToEdit = editingPage === 'new' ? emptyPage : editingPage;
    return (
      <PageEditor
        page={pageToEdit}
        onSave={savePage}
        onCancel={() => setEditingPage(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-500 mt-1">{pages.length} pages total</p>
        </div>
        <button
          onClick={() => setEditingPage('new')}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition flex items-center gap-2"
        >
          <Plus size={18} /> New Page
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredPages.map(page => (
            <div key={page.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 truncate">{page.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {page.status}
                  </span>
                  {page.showInMenu && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">In Menu</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">/{page.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingPage(page)}
                  className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => window.open(`/${page.slug}`, '_blank')}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => deletePage(page.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPages.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <FileText size={40} className="mx-auto text-gray-300 mb-3" />
            <p>No pages found</p>
            <button
              onClick={() => setEditingPage('new')}
              className="mt-3 text-amber-600 font-medium"
            >
              + Create First Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Bikes Manager
function BikesManager() {
  const { bikes, addBike, updateBike, deleteBike } = useApp();
  const [editingBike, setEditingBike] = useState<Bike | 'new' | null>(null);
  const [search, setSearch] = useState('');

  const filteredBikes = bikes.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.brand.toLowerCase().includes(search.toLowerCase())
  );

  const emptyBike: Bike = {
    id: '',
    name: '',
    brand: 'Royal Enfield',
    model: '',
    year: 2024,
    description: '',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    gallery: [],
    engineCapacity: '',
    power: '',
    torque: '',
    weight: '',
    seatHeight: '',
    fuelCapacity: '',
    transmission: '',
    topSpeed: '',
    features: [],
    idealFor: [],
    rentalPrice: 0,
    upgradePrice: 0,
    available: true,
    featured: false,
    category: 'adventure'
  };

  if (editingBike) {
    const bike = editingBike === 'new' ? { ...emptyBike, id: Date.now().toString() } : editingBike;
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setEditingBike(null)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="font-semibold text-gray-900">
                {editingBike === 'new' ? 'Add New Bike' : `Edit: ${bike.name}`}
              </h2>
              <p className="text-sm text-gray-500">{bike.available ? '🟢 Available' : '🔴 Not Available'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setEditingBike(null)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
              Cancel
            </button>
            <button 
              onClick={async () => {
                if (editingBike === 'new') {
                  await addBike(bike);
                } else {
                  await updateBike(bike.id, bike);
                }
                setEditingBike(null);
              }} 
              className="px-4 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium flex items-center gap-1"
            >
              <Save size={16} /> Save Bike
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <SectionCard title="Basic Information" description="Bike details and specifications">
            <div className="space-y-4">
              <FormField label="Bike Name" required>
                <input
                  type="text"
                  value={bike.name}
                  onChange={(e) => setEditingBike({ ...bike, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., Royal Enfield Himalayan"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Brand">
                  <select
                    value={bike.brand}
                    onChange={(e) => setEditingBike({ ...bike, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="Royal Enfield">Royal Enfield</option>
                    <option value="BMW">BMW</option>
                    <option value="KTM">KTM</option>
                    <option value="Triumph">Triumph</option>
                    <option value="Honda">Honda</option>
                    <option value="Kawasaki">Kawasaki</option>
                    <option value="Harley-Davidson">Harley-Davidson</option>
                    <option value="Ducati">Ducati</option>
                  </select>
                </FormField>
                <FormField label="Model">
                  <input
                    type="text"
                    value={bike.model}
                    onChange={(e) => setEditingBike({ ...bike, model: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g., Himalayan 450"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Engine Capacity">
                  <input
                    type="text"
                    value={bike.engineCapacity}
                    onChange={(e) => setEditingBike({ ...bike, engineCapacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="411cc"
                  />
                </FormField>
                <FormField label="Rental Price ($)">
                  <input
                    type="number"
                    value={bike.rentalPrice}
                    onChange={(e) => setEditingBike({ ...bike, rentalPrice: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="50"
                  />
                </FormField>
              </div>

              <FormField label="Description">
                <textarea
                  value={bike.description}
                  onChange={(e) => setEditingBike({ ...bike, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="Describe this motorcycle..."
                />
              </FormField>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bike.available}
                    onChange={(e) => setEditingBike({ ...bike, available: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500"
                  />
                  <span className="text-sm text-gray-700">Available for tours</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bike.featured}
                    onChange={(e) => setEditingBike({ ...bike, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-amber-500"
                  />
                  <span className="text-sm text-gray-700">⭐ Featured bike</span>
                </label>
              </div>
            </div>
          </SectionCard>

          {/* Specifications */}
          <SectionCard title="Technical Specifications" description="Engine and performance details">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Power">
                  <input
                    type="text"
                    value={bike.power}
                    onChange={(e) => setEditingBike({ ...bike, power: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g., 24.3 bhp"
                  />
                </FormField>
                <FormField label="Torque">
                  <input
                    type="text"
                    value={bike.torque}
                    onChange={(e) => setEditingBike({ ...bike, torque: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g., 32 Nm"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Weight">
                  <input
                    type="text"
                    value={bike.weight}
                    onChange={(e) => setEditingBike({ ...bike, weight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g., 199 kg"
                  />
                </FormField>
                <FormField label="Seat Height">
                  <input
                    type="text"
                    value={bike.seatHeight}
                    onChange={(e) => setEditingBike({ ...bike, seatHeight: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g., 800 mm"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Fuel Capacity">
                  <input
                    type="text"
                    value={bike.fuelCapacity}
                    onChange={(e) => setEditingBike({ ...bike, fuelCapacity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g., 15 liters"
                  />
                </FormField>
                <FormField label="Top Speed">
                  <input
                    type="text"
                    value={bike.topSpeed}
                    onChange={(e) => setEditingBike({ ...bike, topSpeed: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g., 130 km/h"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Transmission">
                  <input
                    type="text"
                    value={bike.transmission}
                    onChange={(e) => setEditingBike({ ...bike, transmission: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="e.g., 5-speed manual"
                  />
                </FormField>
                <FormField label="Category">
                  <select
                    value={bike.category}
                    onChange={(e) => setEditingBike({ ...bike, category: e.target.value as Bike['category'] })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="adventure">Adventure</option>
                    <option value="cruiser">Cruiser</option>
                    <option value="sport">Sport</option>
                    <option value="touring">Touring</option>
                    <option value="standard">Standard</option>
                  </select>
                </FormField>
              </div>
            </div>
          </SectionCard>

          {/* Image */}
          <SectionCard title="Bike Image" description="Main photo of the motorcycle">
            <div className="space-y-4">
              <FormField label="Image URL">
                <input
                  type="url"
                  value={bike.image}
                  onChange={(e) => setEditingBike({ ...bike, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="https://..."
                />
              </FormField>
              {bike.image && (
                <img src={bike.image} alt={bike.name} className="w-full h-48 object-cover rounded-xl" />
              )}
            </div>
          </SectionCard>

          {/* Features & Suitability */}
          <SectionCard title="Features & Suitability" description="What makes this bike special">
            <div className="space-y-4">
              <FormField label="Features (one per line)" hint="Key features of this motorcycle">
                <textarea
                  value={bike.features.join('\n')}
                  onChange={(e) => setEditingBike({ ...bike, features: e.target.value.split('\n').filter(f => f.trim()) })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="ABS braking&#10;Tubeless tires&#10;LED headlamp"
                />
              </FormField>

              <FormField label="Ideal For (one per line)" hint="Types of riding this bike is good for">
                <textarea
                  value={bike.idealFor.join('\n')}
                  onChange={(e) => setEditingBike({ ...bike, idealFor: e.target.value.split('\n').filter(s => s.trim()) })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="Mountain passes&#10;Long distance touring&#10;Off-road trails"
                />
              </FormField>
            </div>
          </SectionCard>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bikes / Fleet</h1>
          <p className="text-gray-500 mt-1">{bikes.length} motorcycles in your fleet</p>
        </div>
        <button
          onClick={() => setEditingBike('new')}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition flex items-center gap-2"
        >
          <Plus size={18} /> Add Bike
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bikes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>

        {filteredBikes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredBikes.map(bike => (
              <div key={bike.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition group">
                <div className="relative h-40">
                  <img src={bike.image} alt={bike.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {bike.featured && (
                      <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">Featured</span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${bike.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {bike.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{bike.name}</h3>
                      <p className="text-sm text-gray-500">{bike.brand} • {bike.engineCapacity}</p>
                    </div>
                    <p className="text-amber-600 font-bold">${bike.rentalPrice}/day</p>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {bike.idealFor.slice(0, 2).map((tag: string, i: number) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setEditingBike(bike)}
                      className="flex-1 py-1.5 text-sm text-amber-600 hover:bg-amber-50 rounded-lg font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this bike?')) deleteBike(bike.id); }}
                      className="flex-1 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={24} className="text-gray-400" />
            </div>
            <p className="font-medium text-gray-900 mb-1">No bikes found</p>
            <p className="text-sm text-gray-500 mb-4">Add motorcycles to your fleet to get started</p>
            <button
              onClick={() => setEditingBike('new')}
              className="text-amber-600 font-medium"
            >
              + Add First Bike
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Menu Builder Component
function MenuBuilder() {
  const { siteSettings, updateSiteSettings, tours, destinations } = useApp();
  const [menus, setMenus] = useState(siteSettings.menus || []);
  const [editingMenu, setEditingMenu] = useState<string | null>(null);
  const [newItemUrl, setNewItemUrl] = useState('');
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemType, setNewItemType] = useState<'custom' | 'page' | 'tour' | 'destination' | 'dropdown'>('custom');

  useEffect(() => {
    updateSiteSettings({ menus });
  }, [menus]);

  const publishedTours = tours.filter(t => t.status === 'published');
  const publishedDestinations = destinations.filter(d => d.status === 'published');

  const addMenuItem = (menuId: string) => {
    if (!newItemLabel.trim()) return;
    
    const newItem = {
      id: `menu-${Date.now()}`,
      label: newItemLabel,
      url: newItemUrl || '#',
      target: '_self' as const,
      type: newItemType,
      order: (menus.find(m => m.id === menuId)?.items.length || 0) + 1
    };

    setMenus(menus.map(m => 
      m.id === menuId 
        ? { ...m, items: [...m.items, newItem] }
        : m
    ));
    setNewItemLabel('');
    setNewItemUrl('');
  };

  const removeMenuItem = (menuId: string, itemId: string) => {
    setMenus(menus.map(m => 
      m.id === menuId 
        ? { ...m, items: m.items.filter(i => i.id !== itemId) }
        : m
    ));
  };

  const updateMenuItem = (menuId: string, itemId: string, updates: Partial<typeof menus[0]['items'][0]>) => {
    setMenus(menus.map(m => 
      m.id === menuId 
        ? { ...m, items: m.items.map(i => i.id === itemId ? { ...i, ...updates } : i) }
        : m
    ));
  };

  const moveItem = (menuId: string, itemId: string, direction: 'up' | 'down') => {
    const menu = menus.find(m => m.id === menuId);
    if (!menu) return;
    
    const index = menu.items.findIndex(i => i.id === itemId);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === menu.items.length - 1) return;
    
    const newItems = [...menu.items];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    newItems.forEach((item, i) => item.order = i + 1);
    
    setMenus(menus.map(m => m.id === menuId ? { ...m, items: newItems } : m));
  };

  const addNewMenu = () => {
    const name = prompt('Enter menu name:');
    if (!name) return;
    const location = prompt('Enter location (header/footer/mobile):') as 'header' | 'footer' | 'mobile';
    if (!['header', 'footer', 'mobile'].includes(location)) {
      alert('Invalid location. Use header, footer, or mobile.');
      return;
    }
    setMenus([...menus, { id: `menu-${Date.now()}`, name, location, items: [] }]);
  };

  const deleteMenu = (menuId: string) => {
    if (confirm('Delete this menu?')) {
      setMenus(menus.filter(m => m.id !== menuId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Builder</h1>
          <p className="text-gray-500 mt-1">Create and manage your site navigation menus</p>
        </div>
        <button
          onClick={addNewMenu}
          className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition flex items-center gap-2"
        >
          <Plus size={18} /> New Menu
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Menu List */}
        <div className="space-y-4">
          {menus.map(menu => (
            <div key={menu.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div 
                className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => setEditingMenu(editingMenu === menu.id ? null : menu.id)}
              >
                <div>
                  <h3 className="font-semibold text-gray-900">{menu.name}</h3>
                  <p className="text-sm text-gray-500">Location: {menu.location} • {menu.items.length} items</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteMenu(menu.id); }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                  <ChevronDown 
                    className={`text-gray-400 transition ${editingMenu === menu.id ? 'rotate-180' : ''}`} 
                    size={20} 
                  />
                </div>
              </div>

              {editingMenu === menu.id && (
                <div className="p-4 space-y-4">
                  {/* Menu Items */}
                  {menu.items.sort((a, b) => a.order - b.order).map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group">
                      <div className="flex flex-col gap-1">
                        <button 
                          onClick={() => moveItem(menu.id, item.id, 'up')}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronLeft size={14} className="rotate-90" />
                        </button>
                        <button 
                          onClick={() => moveItem(menu.id, item.id, 'down')}
                          disabled={index === menu.items.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronRight size={14} className="rotate-90" />
                        </button>
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => updateMenuItem(menu.id, item.id, { label: e.target.value })}
                          className="px-2 py-1.5 border border-gray-200 rounded text-sm"
                          placeholder="Label"
                        />
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => updateMenuItem(menu.id, item.id, { url: e.target.value })}
                          className="px-2 py-1.5 border border-gray-200 rounded text-sm"
                          placeholder="URL"
                        />
                        <select
                          value={item.type}
                          onChange={(e) => updateMenuItem(menu.id, item.id, { type: e.target.value as any })}
                          className="px-2 py-1.5 border border-gray-200 rounded text-sm"
                        >
                          <option value="custom">Custom Link</option>
                          <option value="page">Page</option>
                          <option value="tour">Tour</option>
                          <option value="destination">Destination</option>
                          <option value="dropdown">Dropdown</option>
                        </select>
                      </div>
                      <button
                        onClick={() => removeMenuItem(menu.id, item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {menu.items.length === 0 && (
                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                      <p className="text-sm">No menu items yet</p>
                    </div>
                  )}

                  {/* Add New Item */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Add Menu Item</p>
                    <div className="grid grid-cols-4 gap-2">
                      <input
                        type="text"
                        value={newItemLabel}
                        onChange={(e) => setNewItemLabel(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        placeholder="Label"
                      />
                      <input
                        type="text"
                        value={newItemUrl}
                        onChange={(e) => setNewItemUrl(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        placeholder="URL (e.g., /about)"
                      />
                      <select
                        value={newItemType}
                        onChange={(e) => setNewItemType(e.target.value as any)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      >
                        <option value="custom">Custom Link</option>
                        <option value="dropdown">Dropdown</option>
                      </select>
                      <button
                        onClick={() => addMenuItem(menu.id)}
                        className="bg-amber-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-600"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {menus.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Menu size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 mb-3">No menus created yet</p>
              <button
                onClick={addNewMenu}
                className="text-amber-600 font-medium"
              >
                + Create First Menu
              </button>
            </div>
          )}
        </div>

        {/* Quick Add from Content */}
        <div className="space-y-4">
          <SectionCard title="Quick Add: Tours" description="Add tour links to your menu">
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {publishedTours.map(tour => (
                <div key={tour.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{tour.title}</span>
                  <button
                    onClick={() => {
                      setNewItemLabel(tour.title);
                      setNewItemUrl(`/tours/${tour.slug}`);
                      setNewItemType('tour');
                    }}
                    className="text-xs text-amber-600 font-medium hover:text-amber-700"
                  >
                    Select
                  </button>
                </div>
              ))}
              {publishedTours.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No published tours</p>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Quick Add: Destinations" description="Add destination links to your menu">
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {publishedDestinations.map(dest => (
                <div key={dest.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{dest.name}</span>
                  <button
                    onClick={() => {
                      setNewItemLabel(dest.name);
                      setNewItemUrl(`/destinations/${dest.slug}`);
                      setNewItemType('destination');
                    }}
                    className="text-xs text-amber-600 font-medium hover:text-amber-700"
                  >
                    Select
                  </button>
                </div>
              ))}
              {publishedDestinations.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No published destinations</p>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Common Links" description="Frequently used page links">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Home', url: '/' },
                { label: 'Tours', url: '/tours' },
                { label: 'Destinations', url: '/destinations' },
                { label: 'About Us', url: '/about' },
                { label: 'Contact', url: '/contact' },
                { label: 'Privacy Policy', url: '/privacy' },
              ].map(link => (
                <button
                  key={link.url}
                  onClick={() => {
                    setNewItemLabel(link.label);
                    setNewItemUrl(link.url);
                    setNewItemType('custom');
                  }}
                  className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// Image Settings Component  
function ImageSettings() {
  const { siteSettings, updateSiteSettings } = useApp();
  const [images, setImages] = useState(siteSettings.images || {
    heroAspectRatio: '21:9',
    heroHeight: 'large',
    cardAspectRatio: '16:9',
    galleryAspectRatio: '4:3',
    thumbnailSize: 'medium',
    lazyLoading: true,
    showCaptions: true,
  });

  useEffect(() => {
    updateSiteSettings({ images });
  }, [images]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Image Settings</h1>
        <p className="text-gray-500 mt-1">Configure image dimensions, aspect ratios, and display options</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hero Image Settings */}
        <SectionCard title="Hero Images" description="Settings for hero/banner images">
          <div className="space-y-4">
            <FormField label="Aspect Ratio" hint="Width to height ratio for hero images">
              <select
                value={images.heroAspectRatio}
                onChange={(e) => setImages({ ...images, heroAspectRatio: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="21:9">21:9 (Ultra-wide/Cinematic)</option>
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="4:3">4:3 (Standard)</option>
                <option value="3:2">3:2 (Classic)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </FormField>

            <FormField label="Hero Height" hint="Vertical size of hero sections">
              <select
                value={images.heroHeight}
                onChange={(e) => setImages({ ...images, heroHeight: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="small">Small (50vh)</option>
                <option value="medium">Medium (70vh)</option>
                <option value="large">Large (90vh)</option>
                <option value="full">Full Screen (100vh)</option>
              </select>
            </FormField>

            {/* Preview */}
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-medium"
                style={{ 
                  aspectRatio: images.heroAspectRatio.replace(':', '/'),
                  maxHeight: '200px'
                }}
              >
                {images.heroAspectRatio} Preview
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Card Image Settings */}
        <SectionCard title="Card Images" description="Settings for tour/destination cards">
          <div className="space-y-4">
            <FormField label="Card Aspect Ratio" hint="For tour and destination cards">
              <select
                value={images.cardAspectRatio}
                onChange={(e) => setImages({ ...images, cardAspectRatio: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="4:3">4:3 (Standard)</option>
                <option value="3:2">3:2 (Classic)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </FormField>

            <FormField label="Thumbnail Size" hint="Size for small preview images">
              <select
                value={images.thumbnailSize}
                onChange={(e) => setImages({ ...images, thumbnailSize: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="small">Small (100px)</option>
                <option value="medium">Medium (150px)</option>
                <option value="large">Large (200px)</option>
              </select>
            </FormField>

            {/* Preview */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(i => (
                <div 
                  key={i}
                  className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                  style={{ aspectRatio: images.cardAspectRatio.replace(':', '/') }}
                >
                  Card {i}
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Gallery Settings */}
        <SectionCard title="Gallery Images" description="Settings for image galleries">
          <div className="space-y-4">
            <FormField label="Gallery Aspect Ratio" hint="For gallery grids and lightbox">
              <select
                value={images.galleryAspectRatio}
                onChange={(e) => setImages({ ...images, galleryAspectRatio: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
              >
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="4:3">4:3 (Standard)</option>
                <option value="3:2">3:2 (Classic)</option>
                <option value="1:1">1:1 (Square)</option>
              </select>
            </FormField>

            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Show Captions</p>
                <p className="text-sm text-gray-500">Display image captions in galleries</p>
              </div>
              <input
                type="checkbox"
                checked={images.showCaptions}
                onChange={(e) => setImages({ ...images, showCaptions: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-amber-500"
              />
            </div>
          </div>
        </SectionCard>

        {/* Performance Settings */}
        <SectionCard title="Performance" description="Optimize image loading">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Lazy Loading</p>
                <p className="text-sm text-gray-500">Load images only when they enter viewport</p>
              </div>
              <input
                type="checkbox"
                checked={images.lazyLoading}
                onChange={(e) => setImages({ ...images, lazyLoading: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-amber-500"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">💡 Image Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Hero images: Use 1920x1080px or larger</li>
                <li>• Card images: Use 800x450px (16:9)</li>
                <li>• Gallery images: Use at least 1200px width</li>
                <li>• Use WebP format for better compression</li>
                <li>• Compress images before uploading</li>
              </ul>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// Bikes Tab Content for Tour Editor
function BikesTabContent({ selectedBikes, onUpdate }: { selectedBikes: string[], onUpdate: (bikes: string[]) => void }) {
  const { bikes } = useApp();

  const toggleBike = (bikeId: string) => {
    if (selectedBikes.includes(bikeId)) {
      onUpdate(selectedBikes.filter(id => id !== bikeId));
    } else {
      onUpdate([...selectedBikes, bikeId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium text-gray-900">Available Bikes for this Tour</h3>
          <p className="text-sm text-gray-500">{selectedBikes.length} bikes selected</p>
        </div>
      </div>

      {bikes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bikes.map(bike => {
            const isSelected = selectedBikes.includes(bike.id);
            return (
              <div 
                key={bike.id} 
                onClick={() => toggleBike(bike.id)}
                className={`border-2 rounded-xl overflow-hidden cursor-pointer transition ${
                  isSelected 
                    ? 'border-amber-500 bg-amber-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="relative h-32">
                  <img src={bike.image} alt={bike.name} className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-gray-900">{bike.name}</h4>
                  <p className="text-sm text-gray-500">{bike.brand} • {bike.engineCapacity}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{bike.category}</span>
                    <span className="text-amber-600 font-medium text-sm">${bike.rentalPrice}/day</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <MapPin size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 mb-2">No bikes in fleet</p>
          <p className="text-sm text-gray-400">Add bikes in the Bikes section first</p>
        </div>
      )}
    </div>
  );
}

// Tour Editor Component
function TourEditor({ tour, onSave, onCancel }: {
  tour: Tour | null;
  onSave: (tour: Tour) => void;
  onCancel: () => void;
}) {
  const isNew = !tour;
  const [formData, setFormData] = useState<Tour>(tour || {
    id: Date.now().toString(),
    slug: '',
    title: '',
    subtitle: '',
    description: '',
    shortDescription: '',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=900&fit=crop',
    gallery: [],
    duration: '',
    durationDays: 7,
    distance: '',
    difficulty: 'Moderate',
    groupSize: '6-12 riders',
    startLocation: '',
    endLocation: '',
    countries: ['India'],
    terrain: [],
    bestSeason: '',
    price: 0,
    currency: 'USD',
    nextDeparture: '',
    departureDates: [],
    itinerary: [],
    inclusions: { included: [], notIncluded: [] },
    upgrades: [],
    highlights: [],
    mapUrl: '',
    availableBikes: [],
    featured: false,
    status: 'draft',
    seo: { metaTitle: '', metaDescription: '', keywords: [], ogImage: '', canonicalUrl: '', structuredData: {} },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'pricing', label: '💰 Pricing' },
    { id: 'details', label: 'Details' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'inclusions', label: 'Inclusions' },
    { id: 'upgrades', label: 'Upgrades' },
    { id: 'bikes', label: 'Bikes' },
    { id: 'media', label: 'Media' },
    { id: 'seo', label: 'SEO' },
  ];

  const handleSave = () => {
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    onSave({ ...formData, slug, updatedAt: new Date().toISOString() });
  };

  const addItineraryDay = () => {
    const newDay: ItineraryDay = {
      day: formData.itinerary.length + 1,
      title: `Day ${formData.itinerary.length + 1}`,
      description: '',
      meals: [],
      highlights: [],
      images: []
    };
    setFormData({ ...formData, itinerary: [...formData.itinerary, newDay] });
    setExpandedDay(formData.itinerary.length);
  };

  const updateDay = (index: number, updates: Partial<ItineraryDay>) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = { ...newItinerary[index], ...updates };
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const removeDay = (index: number) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const addDayImage = (dayIndex: number) => {
    const url = prompt('Enter image URL:');
    if (!url) return;
    const caption = prompt('Enter caption (optional):') || '';
    const newImage: ItineraryImage = { id: `img-${Date.now()}`, url, caption };
    const newImages = [...(formData.itinerary[dayIndex].images || []), newImage];
    updateDay(dayIndex, { images: newImages });
  };

  const removeDayImage = (dayIndex: number, imageId: string) => {
    const newImages = (formData.itinerary[dayIndex].images || []).filter(img => img.id !== imageId);
    updateDay(dayIndex, { images: newImages });
  };

  const addUpgrade = () => {
    const newUpgrade: UpgradeOption = { id: `u${Date.now()}`, name: '', description: '', price: 0, category: 'accommodation' };
    setFormData({ ...formData, upgrades: [...formData.upgrades, newUpgrade] });
  };

  const updateUpgrade = (index: number, updates: Partial<UpgradeOption>) => {
    const newUpgrades = [...formData.upgrades];
    newUpgrades[index] = { ...newUpgrades[index], ...updates };
    setFormData({ ...formData, upgrades: newUpgrades });
  };

  const removeUpgrade = (index: number) => {
    setFormData({ ...formData, upgrades: formData.upgrades.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="font-semibold text-gray-900">{isNew ? 'Create Tour' : formData.title || 'Edit Tour'}</h2>
            <p className="text-sm text-gray-500">{formData.status === 'published' ? '🟢 Published' : '🟡 Draft'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFormData({ ...formData, status: formData.status === 'published' ? 'draft' : 'published' })}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              formData.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {formData.status === 'published' ? 'Published' : 'Draft'}
          </button>
          <button onClick={onCancel} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">Cancel</button>
          <button onClick={handleSave} className="px-4 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium flex items-center gap-1">
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition ${
                activeTab === tab.id ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Basic Info */}
          {activeTab === 'basic' && (
            <div className="space-y-4 max-w-2xl">
              <FormField label="Tour Title" required>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="e.g., Ladakh Himalayan Odyssey"
                />
              </FormField>

              <FormField label="Subtitle">
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <FormField label="Short Description" hint="For tour cards">
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <FormField label="Full Description">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <div className="grid grid-cols-3 gap-4">
                <FormField label="Price (USD)" required>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
                <FormField label="Original Price">
                  <input
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
                <FormField label="Status">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </FormField>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500"
                />
                <span className="text-sm text-gray-700">⭐ Featured Tour</span>
              </label>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 max-w-3xl">
              {/* Base Pricing */}
              <SectionCard title="💰 Base Pricing" description="Set rider and pillion prices for this tour">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField label="Rider Price (USD)" required hint="Price per rider">
                      <input
                        type="number"
                        value={formData.pricing?.riderPrice || formData.price}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          pricing: { 
                            ...formData.pricing!, 
                            riderPrice: parseInt(e.target.value) || 0 
                          },
                          price: parseInt(e.target.value) || 0
                        })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg font-semibold"
                      />
                    </FormField>
                    <FormField label="Pillion Price (USD)" required hint="Price per passenger">
                      <input
                        type="number"
                        value={formData.pricing?.pillionPrice || Math.round((formData.pricing?.riderPrice || formData.price) * 0.7)}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          pricing: { 
                            ...formData.pricing!, 
                            pillionPrice: parseInt(e.target.value) || 0 
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg font-semibold"
                      />
                    </FormField>
                    <FormField label="Single Room Supplement" hint="Extra charge for single room">
                      <input
                        type="number"
                        value={formData.pricing?.singleRoomSupplement || 0}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          pricing: { 
                            ...formData.pricing!, 
                            singleRoomSupplement: parseInt(e.target.value) || 0 
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </FormField>
                  </div>

                  {/* Price Display Preview */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="font-semibold text-amber-800 mb-3">💵 Price Display Preview</h4>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-amber-200">
                          <th className="text-left py-2 text-amber-700">Type</th>
                          <th className="text-right py-2 text-amber-700">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-amber-100">
                          <td className="py-2">🏍️ Rider</td>
                          <td className="py-2 text-right font-bold text-lg">${(formData.pricing?.riderPrice || formData.price).toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-amber-100">
                          <td className="py-2">👤 Pillion Passenger</td>
                          <td className="py-2 text-right font-bold text-lg">${(formData.pricing?.pillionPrice || Math.round((formData.pricing?.riderPrice || formData.price) * 0.7)).toLocaleString()}</td>
                        </tr>
                        {(formData.pricing?.singleRoomSupplement || 0) > 0 && (
                          <tr>
                            <td className="py-2">🛏️ Single Room Supplement</td>
                            <td className="py-2 text-right font-bold">+${formData.pricing?.singleRoomSupplement?.toLocaleString()}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </SectionCard>

              {/* Deposit Settings */}
              <SectionCard title="💳 Deposit Settings" description="Configure deposit requirements">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Deposit Amount">
                      <input
                        type="number"
                        value={formData.pricing?.deposit || 0}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          pricing: { 
                            ...formData.pricing!, 
                            deposit: parseInt(e.target.value) || 0 
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      />
                    </FormField>
                    <FormField label="Deposit Type">
                      <select
                        value={formData.pricing?.depositType || 'percentage'}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          pricing: { 
                            ...formData.pricing!, 
                            depositType: e.target.value as 'percentage' | 'fixed' 
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                      </select>
                    </FormField>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formData.pricing?.depositType === 'percentage' 
                      ? `Customers will pay ${formData.pricing?.deposit || 0}% as deposit to confirm booking` 
                      : `Customers will pay $${formData.pricing?.deposit || 0} as deposit to confirm booking`}
                  </p>
                </div>
              </SectionCard>

              {/* Discounts */}
              <SectionCard title="🎉 Discounts" description="Configure early bird and group discounts">
                <div className="space-y-6">
                  {/* Early Bird Discount */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-green-800">🕐 Early Bird Discount</h4>
                        <p className="text-sm text-green-600">Offer discounts for bookings made in advance</p>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.pricing?.earlyBirdDiscount?.enabled || false}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            pricing: { 
                              ...formData.pricing!, 
                              earlyBirdDiscount: { 
                                ...(formData.pricing?.earlyBirdDiscount || { percentage: 10, deadlineDays: 60 }),
                                enabled: e.target.checked 
                              }
                            }
                          })}
                          className="w-4 h-4 rounded border-gray-300 text-green-500"
                        />
                        <span className="text-sm font-medium text-green-700">Enable</span>
                      </label>
                    </div>
                    
                    {formData.pricing?.earlyBirdDiscount?.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField label="Discount Percentage">
                          <input
                            type="number"
                            value={formData.pricing?.earlyBirdDiscount?.percentage || 10}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              pricing: { 
                                ...formData.pricing!, 
                                earlyBirdDiscount: { 
                                  ...formData.pricing?.earlyBirdDiscount!,
                                  percentage: parseInt(e.target.value) || 0 
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-green-200 rounded-lg bg-white"
                            min="0"
                            max="100"
                          />
                        </FormField>
                        <FormField label="Days Before Departure">
                          <input
                            type="number"
                            value={formData.pricing?.earlyBirdDiscount?.deadlineDays || 60}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              pricing: { 
                                ...formData.pricing!, 
                                earlyBirdDiscount: { 
                                  ...formData.pricing?.earlyBirdDiscount!,
                                  deadlineDays: parseInt(e.target.value) || 0 
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-green-200 rounded-lg bg-white"
                          />
                        </FormField>
                      </div>
                    )}
                  </div>

                  {/* Group Discount */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-blue-800">👥 Group Discount</h4>
                        <p className="text-sm text-blue-600">Offer discounts for larger groups</p>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.pricing?.groupDiscount?.enabled || false}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            pricing: { 
                              ...formData.pricing!, 
                              groupDiscount: { 
                                ...(formData.pricing?.groupDiscount || { minRiders: 4, percentage: 5 }),
                                enabled: e.target.checked 
                              }
                            }
                          })}
                          className="w-4 h-4 rounded border-gray-300 text-blue-500"
                        />
                        <span className="text-sm font-medium text-blue-700">Enable</span>
                      </label>
                    </div>
                    
                    {formData.pricing?.groupDiscount?.enabled && (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField label="Minimum Riders">
                          <input
                            type="number"
                            value={formData.pricing?.groupDiscount?.minRiders || 4}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              pricing: { 
                                ...formData.pricing!, 
                                groupDiscount: { 
                                  ...formData.pricing?.groupDiscount!,
                                  minRiders: parseInt(e.target.value) || 0 
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white"
                            min="2"
                          />
                        </FormField>
                        <FormField label="Discount Percentage">
                          <input
                            type="number"
                            value={formData.pricing?.groupDiscount?.percentage || 5}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              pricing: { 
                                ...formData.pricing!, 
                                groupDiscount: { 
                                  ...formData.pricing?.groupDiscount!,
                                  percentage: parseInt(e.target.value) || 0 
                                }
                              }
                            })}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white"
                            min="0"
                            max="100"
                          />
                        </FormField>
                      </div>
                    )}
                  </div>
                </div>
              </SectionCard>

              {/* Original/Sale Price */}
              <SectionCard title="🏷️ Sale Price" description="Show crossed-out original price">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Original Price (USD)" hint="Higher price to show as crossed out">
                    <input
                      type="number"
                      value={formData.originalPrice || ''}
                      onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value) || undefined })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      placeholder="e.g., 3500"
                    />
                  </FormField>
                  <div className="flex items-end">
                    {formData.originalPrice && formData.originalPrice > formData.price && (
                      <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                        Save ${(formData.originalPrice - formData.price).toLocaleString()} ({Math.round((1 - formData.price / formData.originalPrice) * 100)}% off)
                      </div>
                    )}
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* Details */}
          {activeTab === 'details' && (
            <div className="space-y-4 max-w-3xl">
              <div className="grid grid-cols-3 gap-4">
                <FormField label="Duration">
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="14 Days / 13 Nights"
                  />
                </FormField>
                <FormField label="Days (number)">
                  <input
                    type="number"
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
                <FormField label="Distance">
                  <input
                    type="text"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    placeholder="2,100 km"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField label="Difficulty">
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Tour['difficulty'] })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Expert">Expert</option>
                  </select>
                </FormField>
                <FormField label="Group Size">
                  <input
                    type="text"
                    value={formData.groupSize}
                    onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
                <FormField label="Best Season">
                  <input
                    type="text"
                    value={formData.bestSeason}
                    onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Start Location">
                  <input
                    type="text"
                    value={formData.startLocation}
                    onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
                <FormField label="End Location">
                  <input
                    type="text"
                    value={formData.endLocation}
                    onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
              </div>

              <FormField label="Highlights (one per line)">
                <textarea
                  value={formData.highlights.join('\n')}
                  onChange={(e) => setFormData({ ...formData, highlights: e.target.value.split('\n').filter(h => h.trim()) })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <FormField label="Departure Dates (YYYY-MM-DD, one per line)">
                <textarea
                  value={formData.departureDates.join('\n')}
                  onChange={(e) => {
                    const dates = e.target.value.split('\n').filter(d => d.trim());
                    setFormData({ ...formData, departureDates: dates, nextDeparture: dates[0] || '' });
                  }}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>
            </div>
          )}

          {/* Itinerary */}
          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{formData.itinerary.length} days added</p>
                  <p className="text-xs text-gray-400">Click on a day to expand and edit details</p>
                </div>
                <button onClick={addItineraryDay} className="text-sm text-amber-600 font-medium flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100">
                  <Plus size={16} /> Add Day
                </button>
              </div>

              {formData.itinerary.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white hover:from-amber-50 hover:to-white transition"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg">
                        {day.day}
                      </span>
                      <div className="text-left">
                        <span className="font-semibold text-gray-900 block">{day.title}</span>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          {day.distance && <span className="flex items-center gap-1"><MapPin size={12} /> {day.distance}</span>}
                          {day.elevation && <span className="flex items-center gap-1"><Mountain size={12} /> {day.elevation}</span>}
                          {day.ridingTime && <span className="flex items-center gap-1"><Clock size={12} /> {day.ridingTime}</span>}
                          {day.images && day.images.length > 0 && (
                            <span className="flex items-center gap-1 text-blue-600"><Camera size={12} /> {day.images.length} photos</span>
                          )}
                          {day.highlightDetails && day.highlightDetails.length > 0 && (
                            <span className="flex items-center gap-1 text-amber-600"><Star size={12} /> {day.highlightDetails.length} highlights</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); removeDay(index); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                      <ChevronDown className={`transition text-gray-400 ${expandedDay === index ? 'rotate-180' : ''}`} size={20} />
                    </div>
                  </button>

                  {expandedDay === index && (
                    <div className="p-5 space-y-5 bg-white border-t border-gray-100">
                      {/* Basic Info Section */}
                      <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Basic Information</h4>
                        
                        <FormField label="Day Title" required>
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) => updateDay(index, { title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-lg font-medium"
                            placeholder="e.g., Manali to Jispa - Into the Mountains"
                          />
                        </FormField>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <FormField label="Distance" hint="e.g., 145 km">
                            <input
                              type="text"
                              value={day.distance || ''}
                              onChange={(e) => updateDay(index, { distance: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                            />
                          </FormField>
                          <FormField label="Max Elevation" hint="e.g., 4,550m">
                            <input
                              type="text"
                              value={day.elevation || ''}
                              onChange={(e) => updateDay(index, { elevation: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                            />
                          </FormField>
                          <FormField label="Riding Time" hint="e.g., 5-6 hours">
                            <input
                              type="text"
                              value={day.ridingTime || ''}
                              onChange={(e) => updateDay(index, { ridingTime: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                            />
                          </FormField>
                          <FormField label="Road Conditions">
                            <select
                              value={day.roadConditions || ''}
                              onChange={(e) => updateDay(index, { roadConditions: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                            >
                              <option value="">Select...</option>
                              <option value="Excellent tarmac">Excellent tarmac</option>
                              <option value="Good tarmac">Good tarmac</option>
                              <option value="Mixed surfaces">Mixed surfaces</option>
                              <option value="Mostly off-road">Mostly off-road</option>
                              <option value="Challenging terrain">Challenging terrain</option>
                            </select>
                          </FormField>
                        </div>
                      </div>

                      {/* Description Section with Rich Text */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Day Description</h4>
                        <RichTextEditor
                          value={day.descriptionHtml || day.description}
                          onChange={(html) => updateDay(index, { descriptionHtml: html, description: html.replace(/<[^>]*>/g, '') })}
                          placeholder="Describe what happens on this day..."
                          minHeight={150}
                        />
                      </div>

                      {/* Accommodation & Meals */}
                      <div className="bg-blue-50 rounded-xl p-4 space-y-4">
                        <h4 className="font-semibold text-blue-900 text-sm uppercase tracking-wide">🏨 Accommodation & Meals</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField label="Accommodation">
                            <input
                              type="text"
                              value={day.accommodation || ''}
                              onChange={(e) => updateDay(index, { accommodation: e.target.value })}
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white"
                              placeholder="e.g., Mountain Lodge, Leh"
                            />
                          </FormField>
                          <FormField label="Meals Included">
                            <input
                              type="text"
                              value={(day.meals || []).join(', ')}
                              onChange={(e) => updateDay(index, { meals: e.target.value.split(',').map(m => m.trim()).filter(m => m) })}
                              className="w-full px-3 py-2 border border-blue-200 rounded-lg bg-white"
                              placeholder="e.g., Breakfast, Lunch, Dinner"
                            />
                          </FormField>
                        </div>
                      </div>

                      {/* Day Highlights Section */}
                      <div className="bg-amber-50 rounded-xl p-4 space-y-4">
                        <h4 className="font-semibold text-amber-900 text-sm uppercase tracking-wide">⭐ Day Highlights</h4>
                        <p className="text-xs text-amber-700">Add key attractions, experiences, or points of interest for this day</p>
                        <HighlightsEditor
                          highlights={day.highlightDetails || []}
                          onChange={(highlights) => updateDay(index, { highlightDetails: highlights, highlights: highlights.map(h => h.title) })}
                        />
                      </div>

                      {/* Day Photos Section */}
                      <div className="bg-purple-50 rounded-xl p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-purple-900 text-sm uppercase tracking-wide">📸 Day Photos</h4>
                            <p className="text-xs text-purple-700">Add photos to showcase this day's experience</p>
                          </div>
                          <button onClick={() => addDayImage(index)} className="text-sm text-purple-600 font-medium bg-white px-3 py-1.5 rounded-lg border border-purple-200 hover:bg-purple-100">
                            + Add Photo
                          </button>
                        </div>
                        {(!day.images || day.images.length === 0) ? (
                          <div className="bg-white rounded-lg p-6 text-center text-sm text-purple-500 border-2 border-dashed border-purple-200">
                            <Camera size={32} className="mx-auto mb-2 text-purple-300" />
                            <p>No photos added yet</p>
                            <button onClick={() => addDayImage(index)} className="mt-2 text-purple-600 font-medium text-sm">
                              + Add First Photo
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                            {day.images.map((img) => (
                              <div key={img.id} className="relative group aspect-video rounded-xl overflow-hidden border-2 border-white shadow-md">
                                <img src={img.url} alt={img.caption} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                  <button
                                    onClick={() => removeDayImage(index, img.id)}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                                {img.caption && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 truncate">
                                    {img.caption}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {formData.itinerary.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-gray-500 mb-2">No itinerary days added</p>
                  <button onClick={addItineraryDay} className="text-amber-600 font-medium text-sm">
                    + Add First Day
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Inclusions */}
          {activeTab === 'inclusions' && (
            <div className="grid md:grid-cols-2 gap-6">
              <FormField label="What's Included (one per line)">
                <textarea
                  value={formData.inclusions.included.join('\n')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    inclusions: { ...formData.inclusions, included: e.target.value.split('\n').filter(i => i.trim()) }
                  })}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>
              <FormField label="Not Included (one per line)">
                <textarea
                  value={formData.inclusions.notIncluded.join('\n')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    inclusions: { ...formData.inclusions, notIncluded: e.target.value.split('\n').filter(i => i.trim()) }
                  })}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>
            </div>
          )}

          {/* Upgrades */}
          {activeTab === 'upgrades' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button onClick={addUpgrade} className="text-sm text-amber-600 font-medium flex items-center gap-1">
                  <Plus size={16} /> Add Upgrade
                </button>
              </div>

              {formData.upgrades.map((upgrade, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500">Upgrade #{index + 1}</span>
                    <button onClick={() => removeUpgrade(index)} className="text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={upgrade.name}
                        onChange={(e) => updateUpgrade(index, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        placeholder="Upgrade name"
                      />
                    </div>
                    <select
                      value={upgrade.category}
                      onChange={(e) => updateUpgrade(index, { category: e.target.value as UpgradeOption['category'] })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                    >
                      <option value="accommodation">Accommodation</option>
                      <option value="bike">Bike</option>
                      <option value="gear">Gear</option>
                      <option value="experience">Experience</option>
                    </select>
                    <input
                      type="number"
                      value={upgrade.price}
                      onChange={(e) => updateUpgrade(index, { price: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                      placeholder="Price"
                    />
                  </div>
                  <input
                    type="text"
                    value={upgrade.description}
                    onChange={(e) => updateUpgrade(index, { description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg mt-2"
                    placeholder="Description"
                  />
                </div>
              ))}

              {formData.upgrades.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <p className="text-gray-500">No upgrade options added</p>
                </div>
              )}
            </div>
          )}

          {/* Media */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="max-w-2xl">
                <FormField label="Hero Image URL" hint="Recommended: 1920x1080px">
                  <input
                    type="url"
                    value={formData.heroImage}
                    onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
                {formData.heroImage && (
                  <img src={formData.heroImage} alt="Preview" className="w-full h-48 object-cover rounded-lg mt-2" />
                )}
              </div>

              {/* Tour Gallery */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Tour Gallery</h3>
                    <p className="text-sm text-gray-500">Add photos to showcase this tour ({formData.gallery.length} photos)</p>
                  </div>
                  <button
                    onClick={() => {
                      const url = prompt('Enter image URL:');
                      if (!url) return;
                      const alt = prompt('Enter image description/alt text:') || '';
                      setFormData({ 
                        ...formData, 
                        gallery: [...formData.gallery, { url, alt, isHero: false }] 
                      });
                    }}
                    className="text-sm text-amber-600 font-medium flex items-center gap-1 hover:text-amber-700"
                  >
                    <Plus size={16} /> Add Image
                  </button>
                </div>

                {formData.gallery.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.gallery.map((img, index) => (
                      <div key={index} className="relative group aspect-video rounded-xl overflow-hidden border border-gray-200">
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              const newAlt = prompt('Edit description:', img.alt);
                              if (newAlt !== null) {
                                const newGallery = [...formData.gallery];
                                newGallery[index].alt = newAlt;
                                setFormData({ ...formData, gallery: newGallery });
                              }
                            }}
                            className="p-2 bg-white/20 text-white rounded-full hover:bg-white/40"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== index) })}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                          {img.alt || 'No description'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Image size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 mb-2">No gallery images added</p>
                    <button 
                      onClick={() => {
                        const url = prompt('Enter image URL:');
                        if (!url) return;
                        const alt = prompt('Enter image description:') || '';
                        setFormData({ 
                          ...formData, 
                          gallery: [...formData.gallery, { url, alt, isHero: false }] 
                        });
                      }}
                      className="text-amber-600 font-medium text-sm"
                    >
                      + Add First Image
                    </button>
                  </div>
                )}
              </div>

              <div className="max-w-2xl border-t border-gray-200 pt-6">
                <FormField label="Map Embed URL" hint="Google Maps embed URL for the route map">
                  <input
                    type="url"
                    value={formData.mapUrl}
                    onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </FormField>
                {formData.mapUrl && (
                  <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      src={formData.mapUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      title="Map Preview"
                    />
                  </div>
                )}
              </div>

              {/* Gallery Stats */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-medium text-amber-800 mb-2">📸 Gallery Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-amber-600 font-bold text-lg">{formData.gallery.length}</span>
                    <p className="text-amber-700">Tour Photos</p>
                  </div>
                  <div>
                    <span className="text-amber-600 font-bold text-lg">
                      {formData.itinerary.reduce((sum, day) => sum + (day.images?.length || 0), 0)}
                    </span>
                    <p className="text-amber-700">Itinerary Photos</p>
                  </div>
                  <div>
                    <span className="text-amber-600 font-bold text-lg">
                      {formData.gallery.length + formData.itinerary.reduce((sum, day) => sum + (day.images?.length || 0), 0) + 1}
                    </span>
                    <p className="text-amber-700">Total (incl. Hero)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bikes */}
          {activeTab === 'bikes' && (
            <BikesTabContent 
              selectedBikes={formData.availableBikes} 
              onUpdate={(bikes) => setFormData({ ...formData, availableBikes: bikes })} 
            />
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-4 max-w-2xl">
              <FormField label="SEO Title" hint="50-60 characters recommended">
                <input
                  type="text"
                  value={formData.seo?.metaTitle || ''}
                  onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo!, metaTitle: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <FormField label="Meta Description" hint="150-160 characters recommended">
                <textarea
                  value={formData.seo?.metaDescription || ''}
                  onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo!, metaDescription: e.target.value } })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              <FormField label="Keywords (comma separated)">
                <input
                  type="text"
                  value={(formData.seo?.keywords || []).join(', ')}
                  onChange={(e) => setFormData({ ...formData, seo: { ...formData.seo!, keywords: e.target.value.split(',').map(k => k.trim()) } })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                />
              </FormField>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">GOOGLE PREVIEW</p>
                <p className="text-blue-600 hover:underline cursor-pointer">
                  {formData.seo?.metaTitle || `${formData.title} | BRM Expeditions`}
                </p>
                <p className="text-green-700 text-sm">www.brmexpeditions.com/tours/{formData.slug || 'tour-slug'}</p>
                <p className="text-gray-600 text-sm">{formData.seo?.metaDescription || formData.shortDescription}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Admin Component
export function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | 'new' | null>(null);
  const [editingDestination, setEditingDestination] = useState<Destination | 'new' | null>(null);
  const { isAuthenticated, logout, addTour, siteSettings, updateTour, addDestination, updateDestination, updateSiteSettings  , refreshFromDatabase } = useApp();
  const navigate = useNavigate();

  const handleSaveTour = async (tour: Tour) => {
    if (editingTour === 'new') {
      await addTour(tour);
    } else {
      await updateTour(tour.id, tour);
    }
    setEditingTour(null);
  };

  const handleSaveDestination = async (destination: Destination) => {
    if (editingDestination === 'new') {
      await addDestination(destination);
    } else {
      await updateDestination(destination.id, destination);
    }
    setEditingDestination(null);
  };

  // Check authentication - redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m5-6a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Login Required</h1>
          <p className="text-gray-600 mb-6">
            Please log in to access the admin panel.
          </p>
          <Link to="/login" className="inline-block bg-amber-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-600 transition">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (editingTour) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="lg:ml-64 p-6">
          <TourEditor
            tour={editingTour === 'new' ? null : editingTour}
            onSave={handleSaveTour}
            onCancel={() => setEditingTour(null)}
          />
        </div>
      </div>
    );
  }

  if (editingDestination) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="lg:ml-64 p-6">
          <DestinationEditor
            destination={editingDestination === 'new' ? null : editingDestination}
            onSave={handleSaveDestination}
            onCancel={() => setEditingDestination(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="lg:ml-64">
        <TopHeader setSidebarOpen={setSidebarOpen} onLogout={() => { logout(); navigate('/login'); }} onRefresh={refreshFromDatabase} />
        <main className="p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          activeTab === 'sections' && (
  <HomepageSectionsEditor 
    siteSettings={siteSettings} 
    updateSiteSettings={updateSiteSettings} 
  />
)
          {activeTab === 'tours' && <ToursManager onEditTour={setEditingTour} />}
          {activeTab === 'destinations' && <DestinationsManager onEditDestination={setEditingDestination} />}
          {activeTab === 'bookings' && <BookingsManager />}
          {activeTab === 'pages' && <PagesManager />}
          {activeTab === 'menus' && <MenuBuilder />}
          {activeTab === 'theme' && <ThemeCustomizer />}
          {activeTab === 'homepage' && <HomepageEditor />}
          {activeTab === 'header-footer' && <HeaderFooterEditor />}
          {activeTab === 'images' && <ImageSettings />}
          {activeTab === 'seo' && <SEOSettingsEditor />}
          {activeTab === 'contact' && <ContactSettingsEditor />}
          {activeTab === 'bikes' && <BikesManager />}
          {activeTab === 'media' && <MediaLibrary />}
          {activeTab === 'database' && <DatabaseStatus />}
        </main>
      </div>
    </div>
  );
}

// Database Status Component
function DatabaseStatus() {
  const [status, setStatus] = useState<{
    checking: boolean;
    connected: boolean;
    error: string | null;
    details: {
      urlSet: boolean;
      keySet: boolean;
      tables: { name: string; count: number; status: 'ok' | 'error' | 'checking' }[];
    };
  }>({
    checking: true,
    connected: false,
    error: null,
    details: {
      urlSet: false,
      keySet: false,
      tables: []
    }
  });

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    setStatus(prev => ({ ...prev, checking: true }));
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const urlSet = !!supabaseUrl && supabaseUrl !== 'your-supabase-url';
    const keySet = !!supabaseKey && supabaseKey !== 'your-supabase-anon-key';
    
    if (!urlSet || !keySet) {
      setStatus({
        checking: false,
        connected: false,
        error: 'Environment variables not configured',
        details: {
          urlSet,
          keySet,
          tables: []
        }
      });
      return;
    }

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const tableNames = ['tours', 'destinations', 'bikes', 'bookings', 'pages', 'site_settings', 'media'];
      const tableResults: { name: string; count: number; status: 'ok' | 'error' | 'checking' }[] = [];
      
      for (const tableName of tableNames) {
        try {
          const { error, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });
          
          if (error) {
            tableResults.push({ name: tableName, count: 0, status: 'error' });
          } else {
            tableResults.push({ name: tableName, count: count || 0, status: 'ok' });
          }
        } catch {
          tableResults.push({ name: tableName, count: 0, status: 'error' });
        }
      }
      
      const allTablesOk = tableResults.every(t => t.status === 'ok');
      
      setStatus({
        checking: false,
        connected: allTablesOk,
        error: allTablesOk ? null : 'Some tables are missing or inaccessible',
        details: {
          urlSet,
          keySet,
          tables: tableResults
        }
      });
    } catch (err) {
      setStatus({
        checking: false,
        connected: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        details: {
          urlSet,
          keySet,
          tables: []
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Database Status</h2>
          <p className="text-gray-500">Check your Supabase connection</p>
        </div>
        <button
          onClick={checkDatabase}
          disabled={status.checking}
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 flex items-center gap-2"
        >
          {status.checking ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Re-check
            </>
          )}
        </button>
      </div>

      {/* Connection Status Card */}
      <div className={`p-6 rounded-xl border-2 ${
        status.checking 
          ? 'bg-gray-50 border-gray-200' 
          : status.connected 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center gap-4">
          {status.checking ? (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : status.connected ? (
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
          <div>
            <h3 className={`text-xl font-bold ${
              status.checking ? 'text-gray-600' : status.connected ? 'text-green-700' : 'text-red-700'
            }`}>
              {status.checking ? 'Checking Connection...' : status.connected ? 'Connected to Supabase!' : 'Not Connected'}
            </h3>
            <p className={`${
              status.checking ? 'text-gray-500' : status.connected ? 'text-green-600' : 'text-red-600'
            }`}>
              {status.checking 
                ? 'Please wait while we verify your database connection...' 
                : status.connected 
                  ? 'Your database is set up correctly and all tables are accessible.' 
                  : status.error || 'Unable to connect to database.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Environment Variables
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">VITE_SUPABASE_URL</p>
              <p className="text-sm text-gray-500">Your Supabase project URL</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              status.details.urlSet ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {status.details.urlSet ? '✓ Set' : '✗ Not Set'}
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">VITE_SUPABASE_ANON_KEY</p>
              <p className="text-sm text-gray-500">Your Supabase anon public key</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              status.details.keySet ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {status.details.keySet ? '✓ Set' : '✗ Not Set'}
            </div>
          </div>
        </div>
      </div>

      {/* Table Status */}
      {status.details.tables.length > 0 && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            Database Tables
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {status.details.tables.map((table) => (
              <div 
                key={table.name}
                className={`p-4 rounded-lg border-2 ${
                  table.status === 'ok' 
                    ? 'bg-green-50 border-green-200' 
                    : table.status === 'checking'
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">{table.name}</span>
                  {table.status === 'ok' ? (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : table.status === 'checking' ? (
                    <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <p className={`text-sm ${table.status === 'ok' ? 'text-green-600' : table.status === 'checking' ? 'text-gray-500' : 'text-red-600'}`}>
                  {table.status === 'ok' ? `${table.count} records` : table.status === 'checking' ? 'Checking...' : 'Table not found'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Setup Instructions */}
      {!status.connected && !status.checking && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Setup Instructions
          </h3>
          
          {!status.details.urlSet || !status.details.keySet ? (
            <div className="space-y-4">
              <p className="text-amber-700">Environment variables are not configured. Follow these steps:</p>
              <ol className="list-decimal list-inside space-y-2 text-amber-700">
                <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">supabase.com</a> and create a project</li>
                <li>Go to Project Settings → API</li>
                <li>Copy your <strong>Project URL</strong> and <strong>anon public key</strong></li>
                <li>Go to Vercel → Your Project → Settings → Environment Variables</li>
                <li>Add <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> with your Project URL</li>
                <li>Add <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> with your anon key</li>
                <li>Redeploy your project</li>
              </ol>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-amber-700">Environment variables are set but some tables are missing. Create missing tables in Supabase SQL Editor.</p>
              <p className="text-sm text-amber-600">Go to your Supabase Dashboard → SQL Editor → Run the table creation queries.</p>
            </div>
          )}
        </div>
      )}

      {/* Current Storage Mode */}
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <strong>Current Mode:</strong> {status.connected ? 'Using Supabase Database' : 'Using Local Storage (data saved in browser only)'}
          </span>
        </p>
      </div>
    </div>
  );
}
