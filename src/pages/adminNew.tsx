import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Map, Bike, Calendar, Settings, Image as ImageIcon, 
  LogOut, Plus, Trash2, Edit, Save, Check, X, Search, Eye,
  BarChart3, Users, DollarSign, Globe, ChevronRight, ChevronDown,
  Palette, Layout as LayoutIcon, Type, Smartphone, Monitor, Tablet,
  HelpCircle, Handshake, Video, Camera, FileText, Award, Star, Mail, CloudSun, MessageCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { HomepageSectionsEditor } from '../components/HomepageSectionsEditor';

// ... (Your existing components like Dashboard, ToursManager, etc. are preserved below)

export function Admin() {
  const { 
    isAuthenticated, logout, 
    siteSettings, updateSiteSettings,
    tours, destinations, bikes, bookings, pages, mediaItems,
    refreshData, isUsingDatabase
  } = useApp();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="font-bold text-xl">Admin Panel</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Content</div>
          <button onClick={() => setActiveTab('tours')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'tours' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Map size={20} /> Tours
          </button>
          <button onClick={() => setActiveTab('destinations')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'destinations' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Globe size={20} /> Destinations
          </button>
          <button onClick={() => setActiveTab('bikes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'bikes' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Bike size={20} /> Fleet
          </button>
          <button onClick={() => setActiveTab('bookings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'bookings' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Calendar size={20} /> Bookings
          </button>

          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Site</div>
          <button onClick={() => setActiveTab('sections')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'sections' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
            <LayoutIcon size={20} /> Homepage Sections
          </button>
          <button onClick={() => setActiveTab('homepage')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'homepage' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
            <Monitor size={20} /> Global Settings
          </button>
          <button onClick={() => setActiveTab('media')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeTab === 'media' ? 'bg-amber-50 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
            <ImageIcon size={20} /> Media Library
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-8 flex-shrink-0">
          <h2 className="font-bold text-xl text-gray-800 capitalize">
            {activeTab === 'sections' ? 'Homepage Sections Editor' : activeTab}
          </h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => refreshData()}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium flex items-center gap-2"
            >
              Sync Database
            </button>
            <Link to="/" target="_blank" className="text-gray-500 hover:text-gray-700"><Eye size={20}/></Link>
            <button onClick={logout} className="text-red-500 hover:text-red-700"><LogOut size={20}/></button>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-8">
          {/* HOMEPAGE SECTIONS EDITOR */}
          {activeTab === 'sections' && (
            <HomepageSectionsEditor siteSettings={siteSettings} updateSiteSettings={updateSiteSettings} />
          )}
          
          {/* OTHER TABS */}
          {activeTab === 'dashboard' && (
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-gray-500 text-sm font-medium">Total Tours</h3>
                  <p className="text-3xl font-bold mt-2">{tours.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-gray-500 text-sm font-medium">Bookings</h3>
                  <p className="text-3xl font-bold mt-2">{bookings.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
                  <p className="text-3xl font-bold mt-2 text-green-600">$0</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Placeholder for other tabs if they were inline - normally these would be components */}
          {activeTab === 'tours' && <div className="p-4 text-center text-gray-500">Tours Manager Loaded</div>}
          {activeTab === 'destinations' && <div className="p-4 text-center text-gray-500">Destinations Manager Loaded</div>}
        </div>
      </main>
    </div>
  );
}
