import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  MapPin, Users, Clock, Mountain, Compass, ChevronDown, ChevronLeft, ChevronRight,
  Check, X, Plus, Minus, Star, Camera, Bike, Home as HomeIcon, Sparkles, Share2, Heart,
  Calendar, Map, Settings, ImageIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Layout } from '../components/Layout';
import { SEOHead, generateTourStructuredData } from '../components/SEOHead';

export function TourDetail() {
  const { slug } = useParams();
  const { tours, addBooking, bikes } = useApp();
  const tour = tours.find(t => t.slug === slug);

  const [activeTab, setActiveTab] = useState('overview');
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const [selectedUpgrades, setSelectedUpgrades] = useState<string[]>([]);
  const [riders, setRiders] = useState(1);
  const [passengers, setPassengers] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{ url: string; caption: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'hero' | 'itinerary'>('all');
  const contentRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Function to handle tab change with scroll
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Scroll to content area with offset for sticky header
    setTimeout(() => {
      if (contentRef.current) {
        const yOffset = -200; // Offset for sticky nav
        const element = contentRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  // Collect all images for gallery
  const allGalleryImages = [
    { url: tour?.heroImage || '', caption: 'Tour Hero Image', category: 'hero' },
    ...(tour?.gallery || []).map(g => ({ url: g.url, caption: g.alt, category: 'hero' })),
    ...(tour?.itinerary || []).flatMap((day) =>
      (day.images || []).map(img => ({ url: img.url, caption: `Day ${day.day}: ${img.caption || day.title}`, category: 'itinerary' }))
    )
  ].filter(img => img.url);

  if (!tour) {
    return (
      <Layout>
        <SEOHead
          title="Tour Not Found | BRM Expeditions"
          description="The tour you're looking for doesn't exist or has been removed."
        />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tour Not Found</h1>
          <p className="text-gray-600 mb-8">The tour you're looking for doesn't exist or has been removed.</p>
          <Link to="/tours" className="bg-amber-600 text-white px-6 py-3 rounded-full font-semibold">
            Browse All Tours
          </Link>
        </div>
      </Layout>
    );
  }

  const toggleDay = (day: number) => {
    setExpandedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleUpgrade = (id: string) => {
    setSelectedUpgrades(prev =>
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const upgradeTotal = selectedUpgrades.reduce((sum, id) => {
    const upgrade = tour.upgrades.find(u => u.id === id);
    return sum + (upgrade?.price || 0);
  }, 0);

  // Use pricing config if available, otherwise fallback to old calculation
  const riderPrice = tour.pricing?.riderPrice || tour.price;
  const pillionPrice = tour.pricing?.pillionPrice || Math.round(tour.price * 0.7);
  const baseTotal = (riderPrice * riders) + (pillionPrice * passengers);
  const grandTotal = baseTotal + (upgradeTotal * riders);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const booking = {
      id: Date.now().toString(),
      tourId: tour.id,
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      departureDate: selectedDate,
      riders,
      passengers,
      selectedUpgrades,
      totalPrice: grandTotal,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      notes: formData.notes
    };
    addBooking(booking);
    setBookingSubmitted(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'accommodation': return HomeIcon;
      case 'bike': return Bike;
      case 'gear': return Compass;
      case 'experience': return Sparkles;
      default: return Plus;
    }
  };

  const openLightbox = (images: { url: string; caption: string }[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  // SEO data
  const seoTitle = tour.seo?.metaTitle || `${tour.title} | BRM Expeditions`;
  const seoDescription = tour.seo?.metaDescription || tour.shortDescription;
  const seoKeywords = tour.seo?.keywords || [tour.title, 'motorcycle tour', 'India', ...tour.countries];
  const seoImage = tour.seo?.ogImage || tour.heroImage;
  const structuredData = generateTourStructuredData(tour);

  return (
    <Layout>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image={seoImage}
        type="article"
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <section className="relative h-[75vh] -mt-28">
        <div className="absolute inset-0">
          <img src={tour.heroImage} alt={tour.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        <div className="relative h-full flex items-end pb-12">
          <div className="max-w-7xl mx-auto px-4 w-full">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm">
              <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
              <span className="mx-2 text-gray-500">/</span>
              <Link to="/tours" className="text-gray-400 hover:text-white">Tours</Link>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-amber-500">{tour.title}</span>
            </nav>

            <div className="flex gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${tour.difficulty === 'Expert' ? 'bg-red-500' :
                  tour.difficulty === 'Challenging' ? 'bg-orange-500' :
                    tour.difficulty === 'Moderate' ? 'bg-yellow-500' :
                      'bg-green-500'
                } text-white`}>
                {tour.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20 text-white backdrop-blur-sm">
                {tour.countries.join(' • ')}
              </span>
              {tour.featured && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-amber-500 text-white">
                  ★ Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{tour.title}</h1>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl">{tour.subtitle}</p>

            <div className="flex flex-wrap gap-6 text-white">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Clock className="text-amber-500" size={20} />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <MapPin className="text-amber-500" size={20} />
                <span>{tour.distance}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Users className="text-amber-500" size={20} />
                <span>{tour.groupSize}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Mountain className="text-amber-500" size={20} />
                <span>{tour.terrain.slice(0, 2).join(', ')}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-6">
              <button className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white hover:bg-white/20 transition">
                <Share2 size={18} /> Share
              </button>
              <button className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white hover:bg-white/20 transition">
                <Heart size={18} /> Save
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Strip */}
      {tour.gallery.length > 0 && (
        <section className="bg-gray-900 py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tour.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => openLightbox(tour.gallery.map(g => ({ url: g.url, caption: g.alt })), i)}
                  className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition border-transparent opacity-70 hover:opacity-100 hover:border-amber-500"
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
              <button
                onClick={() => openLightbox(tour.gallery.map(g => ({ url: g.url, caption: g.alt })), 0)}
                className="flex-shrink-0 w-24 h-16 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition"
              >
                <Camera size={20} className="mr-1" />
                <span className="text-sm">{tour.gallery.length}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Navigation Tabs - Clean Professional Design */}
      <div className="sticky top-28 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: Compass },
              { id: 'itinerary', label: 'Itinerary', icon: Calendar },
              { id: 'gallery', label: 'Gallery', icon: ImageIcon },
              { id: 'inclusions', label: 'Inclusions', icon: Check },
              { id: 'upgrades', label: 'Upgrades', icon: Settings },
              { id: 'map', label: 'Route Map', icon: Map },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`group relative flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all duration-200 border-b-2 -mb-[2px] ${isActive
                      ? 'text-gray-900 border-gray-900'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon size={18} className={`transition-colors ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12" ref={contentRef}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Quick Facts - FIRST */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100">
                    {/* Title Style 3: Icon badge with horizontal lines */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-transparent to-gray-200"></div>
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                          <Compass size={18} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Quick Facts</h2>
                        <div className="hidden sm:block h-px flex-1 bg-gradient-to-l from-transparent to-gray-200"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Left Column */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <MapPin size={18} className="text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Start</p>
                            <p className="font-medium text-gray-900">{tour.startLocation}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <MapPin size={18} className="text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">End</p>
                            <p className="font-medium text-gray-900">{tour.endLocation}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Calendar size={18} className="text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Best Season</p>
                            <p className="font-medium text-gray-900">{tour.bestSeason}</p>
                          </div>
                        </div>
                      </div>
                      {/* Right Column */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Users size={18} className="text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Group Size</p>
                            <p className="font-medium text-gray-900">{tour.groupSize}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Mountain size={18} className="text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Terrain</p>
                            <p className="font-medium text-gray-900">{tour.terrain.join(', ')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Compass size={18} className="text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Distance</p>
                            <p className="font-medium text-gray-900">{tour.distance}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{tour.duration.split(' ')[0]}</p>
                          <p className="text-xs text-gray-500 mt-1">Days</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{tour.itinerary.length}</p>
                          <p className="text-xs text-gray-500 mt-1">Riding Days</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{tour.countries.length}</p>
                          <p className="text-xs text-gray-500 mt-1">Countries</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{tour.highlights.length}</p>
                          <p className="text-xs text-gray-500 mt-1">Highlights</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About This Tour - SECOND */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  {/* Title Style 1: Accent underline */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">About This Tour</h2>
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-amber-500 rounded-full"></div>
                      <div className="w-3 h-1 bg-amber-300 rounded-full"></div>
                      <div className="w-1.5 h-1 bg-amber-200 rounded-full"></div>
                    </div>
                  </div>
                  <div
                    className="prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: tour.description }}
                  />
                </div>

                {/* Tour Highlights - Clean Professional Design */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100">
                    {/* Title Style 2: Side accent bar */}
                    <div className="flex items-start gap-4">
                      <div className="w-1 h-12 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-amber-600 font-semibold">Discover</span>
                        <h2 className="text-xl font-bold text-gray-900 mt-0.5">Tour Highlights</h2>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-4">
                      {tour.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                              <Check size={14} className="text-white" />
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Available Bikes for this Tour */}
                {tour.availableBikes && tour.availableBikes.length > 0 && (() => {
                  const tourBikes = bikes.filter(b => tour.availableBikes.includes(b.id));
                  if (tourBikes.length === 0) return null;
                  return (
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                      {/* Title Style 4: Split design with number badge */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                              <Bike size={16} className="text-amber-600" />
                            </div>
                            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Our Fleet</span>
                          </div>
                          <h2 className="text-2xl font-bold text-gray-900">Available Motorcycles</h2>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                          <span className="text-2xl font-bold text-gray-900">{tourBikes.length}</span>
                          <span className="text-sm text-gray-500">bikes</span>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        {tourBikes.map(bike => (
                          <div key={bike.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition group">
                            <div className="relative h-40 overflow-hidden">
                              <img
                                src={bike.image}
                                alt={bike.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                  {bike.category}
                                </span>
                              </div>
                              {bike.featured && (
                                <div className="absolute top-3 right-3">
                                  <span className="bg-white text-amber-600 text-xs font-bold px-2 py-1 rounded-full">
                                    ⭐ Popular
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-bold text-gray-900 text-lg">{bike.name}</h3>
                                  <p className="text-gray-500 text-sm">{bike.brand} • {bike.engineCapacity}</p>
                                </div>
                                {bike.upgradePrice > 0 && (
                                  <span className="bg-amber-100 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full">
                                    +${bike.upgradePrice}
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                <div className="bg-gray-50 p-2 rounded-lg">
                                  <span className="text-gray-400 text-xs">Power</span>
                                  <p className="font-semibold text-gray-700">{bike.power}</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-lg">
                                  <span className="text-gray-400 text-xs">Weight</span>
                                  <p className="font-semibold text-gray-700">{bike.weight}</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-lg">
                                  <span className="text-gray-400 text-xs">Seat Height</span>
                                  <p className="font-semibold text-gray-700">{bike.seatHeight}</p>
                                </div>
                                <div className="bg-gray-50 p-2 rounded-lg">
                                  <span className="text-gray-400 text-xs">Top Speed</span>
                                  <p className="font-semibold text-gray-700">{bike.topSpeed}</p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {bike.idealFor.slice(0, 3).map((ideal: string, i: number) => (
                                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    {ideal}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Itinerary with Images - New Modern Layout */}
            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                {/* Itinerary Header Card */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Your Journey</h2>
                      <p className="text-gray-500 mt-1">Day-by-day adventure breakdown</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                        <Calendar size={16} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{tour.itinerary.length} Days</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                        <MapPin size={16} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{tour.distance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Journey Progress Bar */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-500">{tour.startLocation}</span>
                      </div>
                      <div className="flex-1 h-1 bg-gradient-to-r from-green-500 via-amber-500 to-red-500 rounded-full"></div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">{tour.endLocation}</span>
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day Cards */}
                <div className="space-y-4">
                  {tour.itinerary.map((day, index) => (
                    <div
                      key={day.day}
                      className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${expandedDays.includes(day.day)
                          ? 'border-amber-200 shadow-lg'
                          : 'border-gray-100 hover:border-gray-200 hover:shadow-md'
                        }`}
                    >
                      {/* Day Header */}
                      <button
                        onClick={() => toggleDay(day.day)}
                        className="w-full text-left"
                      >
                        <div className="flex">
                          {/* Day Number Column */}
                          <div className={`w-20 sm:w-24 flex-shrink-0 flex flex-col items-center justify-center py-6 transition-colors ${expandedDays.includes(day.day)
                              ? 'bg-gradient-to-b from-amber-500 to-orange-500'
                              : 'bg-gray-100'
                            }`}>
                            <span className={`text-xs font-semibold uppercase tracking-wider ${expandedDays.includes(day.day) ? 'text-amber-100' : 'text-gray-400'
                              }`}>Day</span>
                            <span className={`text-3xl sm:text-4xl font-bold ${expandedDays.includes(day.day) ? 'text-white' : 'text-gray-700'
                              }`}>{String(day.day).padStart(2, '0')}</span>
                            {index < tour.itinerary.length - 1 && (
                              <div className={`w-px h-4 mt-2 ${expandedDays.includes(day.day) ? 'bg-white/30' : 'bg-gray-300'
                                }`}></div>
                            )}
                          </div>

                          {/* Day Content */}
                          <div className="flex-1 p-5 sm:p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{day.title}</h3>

                                {/* Quick Stats Row */}
                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
                                  {day.distance && (
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                      <MapPin size={14} className="text-amber-500" />
                                      <span>{day.distance}</span>
                                    </div>
                                  )}
                                  {day.elevation && (
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                      <Mountain size={14} className="text-blue-500" />
                                      <span>{day.elevation}</span>
                                    </div>
                                  )}
                                  {day.ridingTime && (
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                      <Clock size={14} className="text-green-500" />
                                      <span>{day.ridingTime}</span>
                                    </div>
                                  )}
                                  {day.accommodation && (
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                      <HomeIcon size={14} className="text-purple-500" />
                                      <span className="hidden sm:inline">{day.accommodation}</span>
                                      <span className="sm:hidden">Hotel</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Expand Button & Photo Count */}
                              <div className="flex items-center gap-3">
                                {day.images && day.images.length > 0 && (
                                  <div className="hidden sm:flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                                    <Camera size={14} />
                                    <span className="text-sm font-medium">{day.images.length}</span>
                                  </div>
                                )}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${expandedDays.includes(day.day)
                                    ? 'bg-amber-500 text-white rotate-180'
                                    : 'bg-gray-100 text-gray-400'
                                  }`}>
                                  <ChevronDown size={20} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {expandedDays.includes(day.day) && (
                        <div className="border-t border-gray-100">
                          {/* Day Images - Full Width Gallery */}
                          {day.images && day.images.length > 0 && (
                            <div className="relative">
                              <div className="flex overflow-x-auto gap-1 scrollbar-hide">
                                {day.images.map((img, idx) => (
                                  <button
                                    key={img.id}
                                    onClick={() => openLightbox(day.images!.map(i => ({ url: i.url, caption: i.caption })), idx)}
                                    className="relative flex-shrink-0 w-48 sm:w-64 aspect-[4/3] overflow-hidden group"
                                  >
                                    <img
                                      src={img.url}
                                      alt={img.caption}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                      <span className="text-white text-xs">{img.caption}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                              <div className="absolute right-2 bottom-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                <Camera size={12} className="inline mr-1" />
                                {day.images.length} photos
                              </div>
                            </div>
                          )}

                          <div className="p-6 sm:p-8 space-y-6">
                            {/* Description */}
                            {day.descriptionHtml ? (
                              <div
                                className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: day.descriptionHtml }}
                              />
                            ) : (
                              <p className="text-gray-600 leading-relaxed">{day.description}</p>
                            )}

                            {/* Info Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {/* Riding Info Card */}
                              {(day.ridingTime || day.roadConditions || day.maxAltitude) && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Riding Info</h4>
                                  <div className="space-y-2">
                                    {day.ridingTime && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Duration</span>
                                        <span className="text-sm font-medium text-gray-900">{day.ridingTime}</span>
                                      </div>
                                    )}
                                    {day.roadConditions && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Road</span>
                                        <span className="text-sm font-medium text-gray-900">{day.roadConditions}</span>
                                      </div>
                                    )}
                                    {day.maxAltitude && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Max Altitude</span>
                                        <span className="text-sm font-medium text-gray-900">{day.maxAltitude}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Accommodation Card */}
                              {day.accommodation && (
                                <div className="bg-blue-50 rounded-xl p-4">
                                  <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">Accommodation</h4>
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <HomeIcon size={18} className="text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-900">{day.accommodation}</p>
                                      <p className="text-xs text-gray-500">or similar</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Meals Card */}
                              {day.meals && day.meals.length > 0 && (
                                <div className="bg-green-50 rounded-xl p-4">
                                  <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-3">Meals Included</h4>
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                      <span className="text-lg">🍽️</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {day.meals.map((meal, i) => (
                                        <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                          {meal}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Day Highlights */}
                            {day.highlights && day.highlights.length > 0 && (
                              <div className="bg-amber-50/50 rounded-xl p-5">
                                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                  <Sparkles size={16} className="text-amber-500" />
                                  Today's Highlights
                                </h4>
                                <div className="grid gap-2">
                                  {day.highlights.map((h, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                      <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <Check size={12} className="text-white" />
                                      </div>
                                      <span className="text-gray-700">{h}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* End of Journey Card */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white text-center">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">End of Adventure</h3>
                  <p className="text-gray-400">
                    Tour ends in {tour.endLocation} • {tour.itinerary.length} unforgettable days
                  </p>
                </div>
              </div>
            )}

            {/* Inclusions - Clean Design */}
            {activeTab === 'inclusions' && (
              <div className="space-y-6">
                {/* Section Header */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-8 py-6">
                    {/* Title Style 6: Double line with center text */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="h-px bg-gray-200"></div>
                        <div className="h-px bg-gray-100"></div>
                      </div>
                      <div className="text-center px-4">
                        <h2 className="text-xl font-bold text-gray-900">What's Included</h2>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider">Tour Package Details</p>
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="h-px bg-gray-200"></div>
                        <div className="h-px bg-gray-100"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Included Section */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check size={14} className="text-white" />
                        </div>
                        Included
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {tour.inclusions.included.map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700 text-sm">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Not Included Section */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                          <X size={14} className="text-white" />
                        </div>
                        Not Included
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        {tour.inclusions.notIncluded.map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <X size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-600 text-sm">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">Full Insurance</h4>
                    <p className="text-gray-500 text-xs">Comprehensive travel and medical insurance included</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">24/7 Support</h4>
                    <p className="text-gray-500 text-xs">Our team is available around the clock</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm">Flexible Booking</h4>
                    <p className="text-gray-500 text-xs">Free cancellation up to 30 days before</p>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Important Notes</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>Valid passport with minimum 6 months validity required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>International driving permit recommended for some destinations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span>Please inform us of any dietary requirements at time of booking</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Upgrades */}
            {activeTab === 'upgrades' && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                {/* Title Style 7: Gradient background strip */}
                <div className="mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 rounded-xl -z-10"></div>
                    <div className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Settings size={20} className="text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">Customize Your Experience</h2>
                          <p className="text-gray-600 text-sm">Enhance your adventure with premium upgrades</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {['accommodation', 'bike', 'gear', 'experience'].map(category => {
                    const categoryUpgrades = tour.upgrades.filter(u => u.category === category);
                    if (categoryUpgrades.length === 0) return null;

                    const Icon = getCategoryIcon(category);
                    const categoryColors = {
                      accommodation: 'from-blue-500 to-indigo-500',
                      bike: 'from-red-500 to-orange-500',
                      gear: 'from-green-500 to-teal-500',
                      experience: 'from-purple-500 to-pink-500',
                    };

                    return (
                      <div key={category}>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3 capitalize">
                          <div className={`w-10 h-10 bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} rounded-xl flex items-center justify-center shadow-lg`}>
                            <Icon size={20} className="text-white" />
                          </div>
                          {category} Upgrades
                        </h3>
                        <div className="grid gap-4">
                          {categoryUpgrades.map(upgrade => (
                            <label
                              key={upgrade.id}
                              className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedUpgrades.includes(upgrade.id)
                                  ? 'border-amber-500 bg-amber-50 shadow-lg'
                                  : 'border-gray-200 hover:border-amber-300 hover:shadow-md'
                                }`}
                            >
                              <div className="flex items-center gap-4">
                                <input
                                  type="checkbox"
                                  checked={selectedUpgrades.includes(upgrade.id)}
                                  onChange={() => toggleUpgrade(upgrade.id)}
                                  className="w-6 h-6 rounded-lg border-gray-300 text-amber-500 focus:ring-amber-500"
                                />
                                <div>
                                  <h4 className="font-bold text-gray-900 text-lg">{upgrade.name}</h4>
                                  <p className="text-gray-500">{upgrade.description}</p>
                                </div>
                              </div>
                              <span className="font-bold text-2xl text-amber-600 whitespace-nowrap">
                                +${upgrade.price}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Gallery */}
            {activeTab === 'gallery' && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                {/* Title Style 8: Photo strip design */}
                <div className="mb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {allGalleryImages.slice(0, 4).map((img, i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {allGalleryImages.length > 4 && (
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-900 flex items-center justify-center text-white text-xs font-bold shadow-md">
                          +{allGalleryImages.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900">Tour Gallery</h2>
                      <p className="text-gray-500 text-sm">{allGalleryImages.length} photos from this adventure</p>
                    </div>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 mb-6">
                  {[
                    { id: 'all', label: 'All Photos' },
                    { id: 'hero', label: 'Tour Photos' },
                    { id: 'itinerary', label: 'Itinerary Photos' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setGalleryFilter(filter.id as 'all' | 'hero' | 'itinerary')}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${galleryFilter === filter.id
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {allGalleryImages
                    .filter(img => galleryFilter === 'all' || img.category === galleryFilter)
                    .map((img, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const filteredImages = allGalleryImages.filter(
                            img => galleryFilter === 'all' || img.category === galleryFilter
                          );
                          openLightbox(
                            filteredImages.map(im => ({ url: im.url, caption: im.caption })),
                            i
                          );
                        }}
                        className="relative group aspect-[4/3] rounded-xl overflow-hidden"
                      >
                        <img
                          src={img.url}
                          alt={img.caption}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                          <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <p className="text-white text-xs truncate">{img.caption}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${img.category === 'hero' ? 'bg-amber-500/80' : 'bg-blue-500/80'
                            } text-white`}>
                            {img.category === 'hero' ? 'Tour' : 'Itinerary'}
                          </span>
                        </div>
                      </button>
                    ))}
                </div>

                {allGalleryImages.filter(img => galleryFilter === 'all' || img.category === galleryFilter).length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <Camera size={40} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No photos available in this category</p>
                  </div>
                )}

                {/* Photo Count */}
                <div className="mt-6 text-center text-gray-500 text-sm">
                  {allGalleryImages.filter(img => galleryFilter === 'all' || img.category === galleryFilter).length} photos •
                  {' '}{tour.gallery.length} tour photos •
                  {' '}{tour.itinerary.reduce((sum, day) => sum + (day.images?.length || 0), 0)} itinerary photos
                </div>
              </div>
            )}

            {/* Map */}
            {activeTab === 'map' && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                {/* Title Style 9: Map pin connector */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/30"></div>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-green-500 via-amber-500 to-red-500"></div>
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/30"></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Route Map</h2>
                    <p className="text-gray-500 text-sm">{tour.startLocation} → {tour.endLocation}</p>
                  </div>
                </div>
                <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                  <iframe
                    src={tour.mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Tour Route Map"
                  />
                </div>
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                    <span className="text-sm text-green-600 font-semibold">🚀 Start Point</span>
                    <p className="font-bold text-gray-900 text-lg mt-1">{tour.startLocation}</p>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 rounded-xl border border-red-100">
                    <span className="text-sm text-red-600 font-semibold">🏁 End Point</span>
                    <p className="font-bold text-gray-900 text-lg mt-1">{tour.endLocation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-44">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Pricing Table Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white">
                  {/* Title Style 10: Price tag style */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center transform rotate-3">
                        <span className="text-white text-lg font-bold">$</span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <h3 className="text-lg font-semibold">Tour Pricing</h3>
                  </div>

                  {/* Pricing Table */}
                  <div className="bg-white/10 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Type</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-gray-300">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/10">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-amber-400">🏍️</span>
                              <span className="font-medium">Rider</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-2xl font-bold">${tour.pricing?.riderPrice?.toLocaleString() || tour.price.toLocaleString()}</span>
                          </td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-amber-400">👤</span>
                              <span className="font-medium">Pillion Passenger</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="text-2xl font-bold">${tour.pricing?.pillionPrice?.toLocaleString() || Math.round(tour.price * 0.7).toLocaleString()}</span>
                          </td>
                        </tr>
                        {tour.pricing?.singleRoomSupplement && tour.pricing.singleRoomSupplement > 0 && (
                          <tr>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="text-amber-400">🛏️</span>
                                <span className="font-medium text-sm">Single Room Supplement</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="text-lg font-bold">+${tour.pricing.singleRoomSupplement.toLocaleString()}</span>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Deposit Info */}
                  {tour.pricing?.deposit && (
                    <div className="mt-4 bg-amber-500/20 rounded-lg p-3 text-center">
                      <span className="text-amber-300 text-sm">
                        Deposit: {tour.pricing.depositType === 'percentage'
                          ? `${tour.pricing.deposit}% to confirm`
                          : `$${tour.pricing.deposit} to confirm`}
                      </span>
                    </div>
                  )}

                  {/* Discounts */}
                  {tour.pricing?.earlyBirdDiscount?.enabled && (
                    <div className="mt-3 bg-green-500/20 rounded-lg p-3 text-center">
                      <span className="text-green-300 text-sm">
                        🎉 Early Bird: {tour.pricing.earlyBirdDiscount.percentage}% off if booked {tour.pricing.earlyBirdDiscount.deadlineDays} days in advance!
                      </span>
                    </div>
                  )}
                  {tour.pricing?.groupDiscount?.enabled && (
                    <div className="mt-2 bg-blue-500/20 rounded-lg p-3 text-center">
                      <span className="text-blue-300 text-sm">
                        👥 Group Discount: {tour.pricing.groupDiscount.percentage}% off for {tour.pricing.groupDiscount.minRiders}+ riders!
                      </span>
                    </div>
                  )}

                  {tour.originalPrice && (
                    <div className="mt-4 text-center">
                      <span className="inline-block bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                        Save ${(tour.originalPrice - tour.price).toLocaleString()}!
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-5">
                  {/* Departure Date */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Select Departure Date
                    </label>
                    <select
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium"
                    >
                      <option value="">Choose a date</option>
                      {tour.departureDates.map(date => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Riders */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Riders</label>
                    <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl px-4 py-3">
                      <button
                        onClick={() => setRiders(Math.max(1, riders - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-amber-100 hover:text-amber-600 transition"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-bold text-xl">{riders}</span>
                      <button
                        onClick={() => setRiders(riders + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-amber-100 hover:text-amber-600 transition"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Passengers */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pillion Passengers</label>
                    <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl px-4 py-3">
                      <button
                        onClick={() => setPassengers(Math.max(0, passengers - 1))}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-amber-100 hover:text-amber-600 transition"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-bold text-xl">{passengers}</span>
                      <button
                        onClick={() => setPassengers(passengers + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-amber-100 hover:text-amber-600 transition"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Passengers pay 70% of rider price</p>
                  </div>

                  {/* Selected Upgrades Summary */}
                  {selectedUpgrades.length > 0 && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
                      <h4 className="font-bold text-amber-800 mb-2">Selected Upgrades</h4>
                      {selectedUpgrades.map(id => {
                        const upgrade = tour.upgrades.find(u => u.id === id);
                        return upgrade && (
                          <div key={id} className="flex justify-between text-sm text-amber-700">
                            <span>{upgrade.name}</span>
                            <span className="font-semibold">+${upgrade.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="border-t-2 border-gray-100 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{riders} Rider(s) × ${riderPrice.toLocaleString()}</span>
                      <span className="font-medium">${(riderPrice * riders).toLocaleString()}</span>
                    </div>
                    {passengers > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{passengers} Pillion(s) × ${pillionPrice.toLocaleString()}</span>
                        <span className="font-medium">${(pillionPrice * passengers).toLocaleString()}</span>
                      </div>
                    )}
                    {upgradeTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Upgrades × {riders}</span>
                        <span className="font-medium">${(upgradeTotal * riders).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-xl pt-3 border-t-2 border-gray-100">
                      <span>Total</span>
                      <span className="text-amber-600">${grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowBookingForm(true)}
                    disabled={!selectedDate}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transition disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg"
                  >
                    {selectedDate ? 'Book This Tour' : 'Select a Date to Book'}
                  </button>

                  <p className="text-center text-sm text-gray-500">
                    <Star size={14} className="inline text-amber-500" /> Free cancellation up to 30 days before
                  </p>
                </div>
              </div>

              {/* Next Departure */}
              <div className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
                <h3 className="font-bold mb-2">Next Departure</h3>
                <p className="text-3xl font-bold">
                  {new Date(tour.nextDeparture).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </p>
                <p className="text-amber-100 mt-1">Limited spots available!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-amber-500 transition"
          >
            <X size={32} />
          </button>
          <button
            onClick={() => setLightboxIndex((lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length)}
            className="absolute left-4 text-white hover:text-amber-500 transition"
          >
            <ChevronLeft size={48} />
          </button>
          <button
            onClick={() => setLightboxIndex((lightboxIndex + 1) % lightboxImages.length)}
            className="absolute right-4 text-white hover:text-amber-500 transition"
          >
            <ChevronRight size={48} />
          </button>
          <div className="max-w-5xl max-h-[80vh] px-16">
            <img
              src={lightboxImages[lightboxIndex]?.url}
              alt={lightboxImages[lightboxIndex]?.caption}
              className="max-w-full max-h-[70vh] object-contain mx-auto"
            />
            {lightboxImages[lightboxIndex]?.caption && (
              <p className="text-white text-center mt-4 text-lg">{lightboxImages[lightboxIndex].caption}</p>
            )}
            <p className="text-gray-400 text-center mt-2">
              {lightboxIndex + 1} / {lightboxImages.length}
            </p>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {bookingSubmitted ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={40} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted!</h3>
                <p className="text-gray-600 mb-6">
                  Thank you for your booking request. Our team will contact you within 24 hours to confirm your reservation.
                </p>
                <button
                  onClick={() => {
                    setShowBookingForm(false);
                    setBookingSubmitted(false);
                  }}
                  className="bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Complete Your Booking</h3>
                  <button onClick={() => setShowBookingForm(false)} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-gray-900">{tour.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </p>
                    <p className="text-xl font-bold text-amber-600 mt-2">Total: ${grandTotal.toLocaleString()}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Special Requests</label>
                    <textarea
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                      placeholder="Any dietary requirements, special requests, etc."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition"
                  >
                    Submit Booking Request
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    By submitting, you agree to our terms and conditions.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
