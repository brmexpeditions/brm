import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, ChevronRight, Shield, Award, Compass, Play, ArrowRight, Mountain, Globe, Trophy, Clock, Edit, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Layout } from '../components/Layout';
import { SEOHead, organizationStructuredData } from '../components/SEOHead';
import { Tour, Destination } from '../types';
import { ExternalLink } from 'lucide-react';

// Inline Edit Button Component
function EditButton({ section, label }: { section: string; label?: string }) {
  const { isAdmin } = useApp();
  const navigate = useNavigate();
  
  if (!isAdmin) return null;
  
  return (
    <button
      onClick={() => navigate(`/admin?tab=homepage&section=${section}`)}
      className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition shadow-lg z-50"
      title={`Edit ${label || section}`}
    >
      <Edit size={12} />
      Edit {label || section}
    </button>
  );
}

// Floating Edit Panel for Homepage
function HomepageEditPanel() {
  const { isAdmin } = useApp();
  const navigate = useNavigate();
  
  if (!isAdmin) return null;
  
  return (
    <div className="fixed top-24 right-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-64">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
        <Settings className="text-blue-600" size={18} />
        <h3 className="font-semibold text-gray-900">Edit Homepage</h3>
      </div>
      <div className="space-y-2">
        <button
          onClick={() => navigate('/admin?tab=homepage&section=hero')}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 flex items-center justify-between group"
        >
          <span>Hero Section</span>
          <Edit size={14} className="text-gray-400 group-hover:text-blue-600" />
        </button>
        <button
          onClick={() => navigate('/admin?tab=homepage&section=stats')}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 flex items-center justify-between group"
        >
          <span>Statistics</span>
          <Edit size={14} className="text-gray-400 group-hover:text-blue-600" />
        </button>
        <button
          onClick={() => navigate('/admin?tab=homepage&section=featured')}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 flex items-center justify-between group"
        >
          <span>Featured Tours</span>
          <Edit size={14} className="text-gray-400 group-hover:text-blue-600" />
        </button>
        <button
          onClick={() => navigate('/admin?tab=homepage&section=whyChooseUs')}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 flex items-center justify-between group"
        >
          <span>Why Choose Us</span>
          <Edit size={14} className="text-gray-400 group-hover:text-blue-600" />
        </button>
        <button
          onClick={() => navigate('/admin?tab=homepage&section=testimonials')}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 flex items-center justify-between group"
        >
          <span>Testimonials</span>
          <Edit size={14} className="text-gray-400 group-hover:text-blue-600" />
        </button>
        <button
          onClick={() => navigate('/admin?tab=homepage&section=cta')}
          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 flex items-center justify-between group"
        >
          <span>CTA Section</span>
          <Edit size={14} className="text-gray-400 group-hover:text-blue-600" />
        </button>
        <div className="pt-2 border-t mt-2">
          <button
            onClick={() => navigate('/admin?tab=theme')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-sm text-blue-600 font-medium flex items-center justify-between"
          >
            <span>🎨 Colors & Fonts</span>
            <ChevronRight size={14} />
          </button>
          <button
            onClick={() => navigate('/admin?tab=header')}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-sm text-blue-600 font-medium flex items-center justify-between"
          >
            <span>📱 Header & Logo</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function TourCard({ tour }: { tour: Tour }) {
  if (!tour) return null;
  
  const countries = tour?.countries || [];
  const duration = tour?.duration || '';
  const groupSize = tour?.groupSize || '';
  const price = tour?.price || 0;
  
  return (
    <Link to={`/tours/${tour?.slug || ''}`} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden">
        <img
          src={tour?.heroImage || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'}
          alt={tour?.title || 'Tour'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            tour?.difficulty === 'Expert' ? 'bg-red-500' :
            tour?.difficulty === 'Challenging' ? 'bg-orange-500' :
            tour?.difficulty === 'Moderate' ? 'bg-yellow-500' :
            'bg-green-500'
          } text-white`}>
            {tour?.difficulty || 'Moderate'}
          </span>
          {tour?.featured && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white">
              Featured
            </span>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-bold mb-1">{tour?.title || 'Tour'}</h3>
          <p className="text-gray-300 text-sm">{countries.join(' • ')}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour?.shortDescription || ''}</p>
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <Calendar size={16} className="text-amber-500" />
            <span>{duration.split('/')[0] || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin size={16} className="text-amber-500" />
            <span>{tour?.distance || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Users size={16} className="text-amber-500" />
            <span>{groupSize.split(' ')[0] || 'N/A'}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-gray-400 text-sm">From</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">${price.toLocaleString()}</span>
              {tour?.originalPrice && (
                <span className="text-sm text-gray-400 line-through">${tour.originalPrice.toLocaleString()}</span>
              )}
            </div>
          </div>
          <span className="flex items-center gap-1 text-amber-600 font-semibold group-hover:gap-2 transition-all">
            View Details <ChevronRight size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function DestinationCard({ destination }: { destination: Destination }) {
  if (!destination) return null;
  
  const terrain = destination?.terrain || [];
  
  return (
    <Link 
      to={`/destinations/${destination?.slug || ''}`} 
      className="group relative overflow-hidden rounded-2xl h-80"
    >
      <img
        src={destination?.heroImage || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'}
        alt={destination?.name || 'Destination'}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-1">
          {destination?.country || ''}
        </span>
        <h3 className="text-white text-2xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
          {destination?.name || ''}
        </h3>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{destination?.tagline || ''}</p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Mountain size={14} /> {destination?.difficulty || 'Moderate'}
          </span>
          <span className="flex items-center gap-1">
            <Globe size={14} /> {terrain.slice(0, 2).join(', ') || 'Various'}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-amber-500 font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">
          Explore Destination <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
}

function TourOfTheMonth({ tour }: { tour: Tour }) {
  if (!tour) return null;
  
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-500 rounded-2xl flex items-center justify-center z-10">
              <div className="text-center">
                <Trophy size={28} className="text-white mx-auto" />
                <span className="text-white text-xs font-bold">TOUR OF<br/>THE MONTH</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={tour?.heroImage || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'}
                alt={tour?.title || 'Tour'}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4">
              <div className="flex items-center gap-3">
                <div className="text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="inline fill-amber-500" />)}
                </div>
                <span className="text-gray-600 text-sm">4.9/5 Rating</span>
              </div>
            </div>
          </div>
          <div className="text-white">
            <span className="inline-block bg-amber-500/20 text-amber-400 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              ⭐ Highly Recommended
            </span>
            <h2 className="text-4xl font-bold mb-4">{tour?.title || 'Featured Tour'}</h2>
            <p className="text-gray-400 text-lg mb-6">{tour?.subtitle || tour?.shortDescription || ''}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <Calendar className="text-amber-500 mb-2" size={24} />
                <p className="text-white font-semibold">{tour?.duration || 'N/A'}</p>
                <p className="text-gray-400 text-sm">Duration</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <MapPin className="text-amber-500 mb-2" size={24} />
                <p className="text-white font-semibold">{tour?.distance || 'N/A'}</p>
                <p className="text-gray-400 text-sm">Distance</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <Mountain className="text-amber-500 mb-2" size={24} />
                <p className="text-white font-semibold">{tour?.difficulty || 'Moderate'}</p>
                <p className="text-gray-400 text-sm">Difficulty</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <Clock className="text-amber-500 mb-2" size={24} />
                <p className="text-white font-semibold">{tour?.nextDeparture ? new Date(tour.nextDeparture).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Multiple'}</p>
                <p className="text-gray-400 text-sm">Next Departure</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="text-gray-400">Starting from</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">${(tour?.price || 0).toLocaleString()}</span>
                  {tour?.originalPrice && (
                    <span className="text-gray-500 line-through">${tour.originalPrice.toLocaleString()}</span>
                  )}
                </div>
              </div>
              <Link
                to={`/tours/${tour?.slug || ''}`}
                className="bg-amber-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-amber-600 transition flex items-center gap-2"
              >
                View Tour <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UpcomingDepartures({ tours }: { tours: Tour[] }) {
  if (!tours || tours.length === 0) return null;
  
  const toursWithDates = (tours || [])
    .filter(t => t?.departureDates && t.departureDates.length > 0)
    .flatMap(t => (t?.departureDates || []).map(date => ({ ...t, departureDate: date })))
    .filter(t => new Date(t.departureDate) > new Date())
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())
    .slice(0, 6);

  if (toursWithDates.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold">UPCOMING ADVENTURES</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Next Departures</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our upcoming expeditions and ride with fellow adventurers from around the world
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toursWithDates.map((tour, i) => {
            const date = new Date(tour?.departureDate);
            const countries = tour?.countries || [];
            return (
              <Link
                key={`${tour?.id || i}-${i}`}
                to={`/tours/${tour?.slug || ''}`}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-amber-50 hover:shadow-lg transition group"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-amber-500 rounded-xl flex flex-col items-center justify-center text-white">
                  <span className="text-2xl font-bold">{date.getDate()}</span>
                  <span className="text-xs uppercase">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate group-hover:text-amber-600 transition">
                    {tour?.title || 'Tour'}
                  </h4>
                  <p className="text-sm text-gray-500">{tour?.duration || ''} • {countries[0] || ''}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-gray-900">${(tour?.price || 0).toLocaleString()}</span>
                  <p className="text-xs text-green-600 font-semibold">Spots Available</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700"
          >
            View All Tours <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
// 1. Add these helper components inside Home.tsx

function InstagramSection({ data }: { data: any }) {
  if (!data?.enabled) return null;
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">{data.title}</h2>
        <a href={`https://instagram.com/${data.username}`} target="_blank" className="text-amber-600 font-medium hover:underline mb-8 block flex items-center justify-center gap-2">
          @{data.username} <ExternalLink size={14} />
        </a>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {data.posts?.map((post: any) => (
            <a key={post.id} href={post.link} target="_blank" className="group relative aspect-square overflow-hidden block rounded-lg">
              <img src={post.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Insta" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold tracking-widest text-sm">VIEW POST</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection({ data }: { data: any }) {
  if (!data?.enabled) return null;
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">{data.title}</h2>
          <p className="text-gray-600 mt-2">{data.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {data.posts?.map((post: any) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden group border border-gray-100">
              <div className="h-48 overflow-hidden relative">
                <img src={post.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={post.title} />
                <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{post.category}</span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition leading-tight">{post.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                <button className="text-sm font-semibold text-amber-600 group-hover:text-amber-700 flex items-center gap-1">Read Article <ArrowRight size={14} /></button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// 2. Add them to your main Home return

function VideoSection() {
  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img
          src="https://images.unsplash.com/photo-1568772585407-9361bd37ec91?w=1600&h=900&fit=crop"
          alt="Motorcycle adventure"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <span className="inline-block bg-amber-500/20 text-amber-400 px-4 py-1 rounded-full text-sm font-semibold mb-6">
          Watch Our Story
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Experience the Thrill of<br/>
          <span className="text-amber-500">Himalayan Riding</span>
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          Join us on an unforgettable journey through the world's highest motorable roads, 
          ancient monasteries, and breathtaking landscapes.
        </p>
        <button className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-amber-500 hover:text-white transition group">
          <div className="w-12 h-12 bg-amber-500 group-hover:bg-white rounded-full flex items-center justify-center transition">
            <Play className="text-white group-hover:text-amber-500 fill-current" size={20} />
          </div>
          Watch Video
        </button>
      </div>
    </section>
  );
}

function BikesSection() {
  const appContext = useApp();
  if (!appContext) return null;
  
  const bikes = appContext.bikes || [];
  const availableBikes = bikes.filter(b => b.available).slice(0, 4);

  if (availableBikes.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold">OUR FLEET</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Premium Motorcycles</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ride the best adventure motorcycles in the world, meticulously maintained for the toughest terrains
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {availableBikes.map(bike => (
            <div key={bike.id} className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
              <div className="relative h-48 overflow-hidden">
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
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{bike.name}</h3>
                    <p className="text-gray-500 text-sm">{bike.brand} • {bike.engineCapacity}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="text-gray-400">Power:</span> {bike.power}
                  </div>
                  <div>
                    <span className="text-gray-400">Weight:</span> {bike.weight}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {bike.idealFor.slice(0, 2).map((ideal, i) => (
                    <span key={i} className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {ideal}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-xs text-gray-400">From</span>
                    <p className="text-amber-600 font-bold">${bike.rentalPrice}/day</p>
                  </div>
                  <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Available
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All bikes come with full insurance, riding gear, and roadside assistance
          </p>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition"
          >
            View Tours with Available Bikes <ChevronRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Partners() {
  const partners = [
    { name: 'Royal Enfield', logo: '🏍️' },
    { name: 'BMW Motorrad', logo: '🏍️' },
    { name: 'KTM', logo: '🏍️' },
    { name: 'Triumph', logo: '🏍️' },
    { name: 'Himalayan', logo: '🏔️' },
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <span className="text-gray-400 font-semibold uppercase tracking-wider text-sm">Our Partners:</span>
          {partners.map((partner, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition">
              <span className="text-2xl">{partner.logo}</span>
              <span className="font-semibold">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Home() {
  const appContext = useApp();
  
  // Safety check
  if (!appContext) {
    return <Layout><div className="min-h-screen flex items-center justify-center">Loading...</div></Layout>;
  }
  
  const { tours = [], destinations = [], siteSettings } = appContext;
  const featuredTours = tours.filter(t => t.featured && t.status === 'published');
  const allPublishedTours = tours.filter(t => t.status === 'published');
  const publishedDestinations = destinations.filter(d => d.status === 'published');
  const featuredDestinations = publishedDestinations.filter(d => d.featured).slice(0, 4);
  const sections = siteSettings?.homepageSections || {};
  
  // Tour of the month - first featured tour or most expensive
  const tourOfMonth = featuredTours[0] || allPublishedTours.sort((a, b) => b.price - a.price)[0];
  
  // Safe defaults for homepage settings
  const defaultHomepage = {
    hero: {
      title: 'Ride the Himalayas',
      subtitle: 'Experience the adventure of a lifetime',
      backgroundImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920',
      overlayOpacity: 60,
      ctaText: 'Explore Tours',
      ctaLink: '/tours',
      secondaryCtaText: 'Learn More',
      secondaryCtaLink: '/about'
    },
    stats: { enabled: true, items: [] },
    featuredSection: { enabled: true, title: 'Featured Tours', subtitle: '', maxItems: 6, showFeaturedOnly: true },
    whyChooseUs: { enabled: true, title: 'Why Choose Us', items: [] },
    testimonials: { enabled: true, title: 'What Our Riders Say', items: [] },
    ctaSection: { enabled: true, title: 'Ready for Adventure?', subtitle: '', backgroundImage: '', ctaText: 'Book Now', ctaLink: '/tours' }
  };
  
  // Merge with defaults to ensure all properties exist
  const homepage = {
  hero: { ...defaultHomepage.hero, ...(siteSettings?.homepage?.hero || {}) },
  stats: { ...defaultHomepage.stats, ...(siteSettings?.homepage?.stats || {}) },
  featuredSection: { ...defaultHomepage.featuredSection, ...(siteSettings?.homepage?.featuredSection || {}) },
  whyChooseUs: { ...defaultHomepage.whyChooseUs, ...(siteSettings?.homepage?.whyChooseUs || {}) },
  testimonials: { ...defaultHomepage.testimonials, ...(siteSettings?.homepage?.testimonials || {}) },
  ctaSection: { ...defaultHomepage.ctaSection, ...(siteSettings?.homepage?.ctaSection || {}) },

  // ✅ ADD THESE TWO LINES
  blogSection: siteSettings?.homepage?.blogSection || {
    enabled: false,
    title: 'From Our Blog',
    subtitle: '',
    posts: []
  },

  instagramSection: siteSettings?.homepage?.instagramSection || {
    enabled: false,
    title: 'Follow Our Journey',
    username: 'brmexpeditions',
    posts: []
  }
};
  
  // Safe access to featuredSection properties
  const maxItems = homepage.featuredSection?.maxItems || 6;
  const showFeaturedOnly = homepage.featuredSection?.showFeaturedOnly ?? true;
  
  // Display only featured tours when showFeaturedOnly is true
  // Otherwise show all published tours
  const displayTours = showFeaturedOnly 
    ? featuredTours.slice(0, maxItems)
    : allPublishedTours.slice(0, maxItems);
  
  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string; size?: number }>> = { Shield, Award, Compass, Star };
    return icons[iconName] || Star;
  };

  return (
    <Layout>
      <SEOHead
        title={siteSettings?.seo?.siteTitle || 'BRM Expeditions'}
        description={siteSettings?.seo?.siteDescription || 'Premium Motorcycle Tours'}
        keywords={siteSettings?.seo?.keywords || []}
        structuredData={organizationStructuredData}
      />
      
      {/* Floating Edit Panel for Admin */}
      <HomepageEditPanel />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] -mt-28 flex items-center group/hero">
        <div className="absolute inset-0">
          <img
            src={homepage.hero.backgroundImage}
            alt="Motorcycle adventure"
            className="w-full h-full object-cover"
          />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" 
            style={{ opacity: homepage.hero.overlayOpacity / 100 }}
          />
        </div>
        {/* Edit Button for Hero */}
        <div className="absolute top-32 left-4 opacity-0 group-hover/hero:opacity-100 transition-opacity">
          <EditButton section="hero" label="Hero" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 pt-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-6">
              Premium Motorcycle Tours Since 2015
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {homepage.hero.title.includes('Himalayas') ? (
                <>Ride the <span className="text-amber-500">Himalayas</span></>
              ) : (
                homepage.hero.title
              )}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {homepage.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={homepage.hero.ctaLink}
                className="bg-amber-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-700 transition text-lg flex items-center gap-2"
              >
                {homepage.hero.ctaText} <ChevronRight />
              </Link>
              <a
                href={homepage.hero.secondaryCtaLink}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition text-lg"
              >
                {homepage.hero.secondaryCtaText}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {homepage.stats.enabled && (
        <section className="bg-amber-600 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
              {homepage.stats.items.map((stat, i) => (
                <div key={i}>
                  <div className="text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-amber-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Destinations Section */}
      {publishedDestinations.length > 0 && (
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-amber-500 font-semibold">EXPLORE</span>
                <h2 className="text-4xl font-bold text-white mt-2 mb-4">Popular Destinations</h2>
                <p className="text-gray-400 max-w-xl">
                  Discover the world's most spectacular motorcycle routes through breathtaking landscapes
                </p>
              </div>
              <Link
                to="/destinations"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-amber-500 font-semibold hover:text-amber-400 transition"
              >
                View All Destinations <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(featuredDestinations.length > 0 ? featuredDestinations : publishedDestinations.slice(0, 4)).map(destination => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tour of the Month */}
      {tourOfMonth && <TourOfTheMonth tour={tourOfMonth} />}

      {/* Featured Tours */}
      {homepage.featuredSection.enabled && (
        <section id="featured" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-amber-600 font-semibold">OUR ADVENTURES</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{homepage.featuredSection.title}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {homepage.featuredSection.subtitle}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayTours.map(tour => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition"
              >
                View All Tours <ChevronRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Departures */}
      <UpcomingDepartures tours={allPublishedTours} />

      {/* Video Section */}
      <VideoSection />

      {/* Why Choose Us */}
      {homepage.whyChooseUs.enabled && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-amber-600 font-semibold">WHY BRM EXPEDITIONS</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{homepage.whyChooseUs.title}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {homepage.whyChooseUs.items.map((item, i) => {
                const IconComponent = getIcon(item.icon);
                return (
                  <div key={i} className="text-center p-6 rounded-2xl hover:bg-gray-50 transition">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="text-amber-600" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Our Fleet - Bikes Section */}
      <BikesSection />

      {/* Partners */}
      <Partners />

      {/* CTA Section */}
      {homepage.ctaSection.enabled && (
        <section className="py-20 bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src={homepage.ctaSection.backgroundImage}
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{homepage.ctaSection.title}</h2>
            <p className="text-xl text-gray-300 mb-8">
              {homepage.ctaSection.subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to={homepage.ctaSection.ctaLink}
                className="bg-amber-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-700 transition text-lg"
              >
                {homepage.ctaSection.ctaText}
              </Link>
              <Link
                to="/contact"
                className="border-2 border-amber-600 text-amber-500 px-8 py-4 rounded-full font-semibold hover:bg-amber-600 hover:text-white transition text-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {homepage.testimonials.enabled && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-amber-600 font-semibold">TESTIMONIALS</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{homepage.testimonials.title}</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {homepage.testimonials.items.map((review, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} size={20} className="fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{review.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-600 font-semibold">{review.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <p className="text-sm text-gray-500">{review.country}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
 {/* BLOG SECTION */}
      {homepage.blogSection?.enabled && (
        <BlogSection data={homepage.blogSection} />
      )}

      {/* INSTAGRAM SECTION */}
      {homepage.instagramSection?.enabled && (
        <InstagramSection data={homepage.instagramSection} />
      )}
    </Layout>
  );
}
