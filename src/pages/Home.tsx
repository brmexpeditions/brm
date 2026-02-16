import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, ChevronRight, Shield, Award, Play, ArrowRight, Mountain, Globe, Trophy, Clock, Search, Zap, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Layout } from '../components/Layout';
import { SEOHead, organizationStructuredData } from '../components/SEOHead';
import { Tour, Destination } from '../types';
import { ExternalLink } from 'lucide-react';


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
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tour?.difficulty === 'Expert' ? 'bg-red-500' :
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

function TourSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState({ destination: '', difficulty: '' });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.destination) params.append('search', query.destination);
    if (query.difficulty) params.append('difficulty', query.difficulty);
    navigate(`/tours?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="glass rounded-2xl p-2 flex flex-col md:flex-row gap-2 max-w-4xl w-full translate-y-8 animate-fade-in shadow-2xl border border-white/20">
      <div className="flex-1 relative group">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 group-focus-within:scale-110 transition-transform" size={20} />
        <input
          type="text"
          placeholder="Where do you want to ride?"
          value={query.destination}
          onChange={(e) => setQuery({ ...query, destination: e.target.value })}
          className="w-full bg-white/10 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:bg-white/20 transition-all border border-transparent focus:border-amber-500/50"
        />
      </div>
      <div className="md:w-56 relative group">
        <Mountain className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 group-focus-within:scale-110 transition-transform" size={20} />
        <select
          value={query.difficulty}
          onChange={(e) => setQuery({ ...query, difficulty: e.target.value })}
          className="w-full bg-white/10 text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:bg-white/20 transition-all border border-transparent focus:border-amber-500/50 appearance-none"
        >
          <option value="" className="bg-gray-900">Any Difficulty</option>
          <option value="Easy" className="bg-gray-900">Easy</option>
          <option value="Moderate" className="bg-gray-900">Moderate</option>
          <option value="Challenging" className="bg-gray-900">Challenging</option>
          <option value="Expert" className="bg-gray-900">Expert</option>
        </select>
      </div>
      <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-600/20">
        <Search size={20} />
        FIND TOURS
      </button>
    </form>
  );
}


function HeroSection({ data }: { data: any }) {
  return (
    <section className="relative h-[90vh] -mt-28 flex items-center group/hero" data-editor-id="hero-section">
      <div className="absolute inset-0">
        <img
          src={data.backgroundImage}
          alt="Motorcycle adventure"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"
          style={{ opacity: data.overlayOpacity / 100 }}
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 pt-28">
        <div className="max-w-2xl">
          <span className="inline-block bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-6">
            Premium Motorcycle Tours Since 2015
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" data-editor-id="hero-title">
            {data.title.includes('Himalayas') ? (
              <>Ride the <span className="text-amber-500">Himalayas</span></>
            ) : (
              data.title
            )}
          </h1>
          <div
            className="text-xl text-gray-300 mb-8 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: data.subtitle }}
          />
          <div className="flex flex-wrap gap-4 mb-12">
            <Link
              to={data.ctaLink}
              className="bg-amber-600 text-white px-8 py-4 rounded-full font-bold hover:bg-amber-700 transition text-lg flex items-center gap-2 transform hover:scale-105"
            >
              {data.ctaText} <ChevronRight />
            </Link>
            <a
              href={data.secondaryCtaLink}
              className="glass text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition text-lg backdrop-blur-md"
            >
              {data.secondaryCtaText}
            </a>
          </div>

          <TourSearch />
        </div>
      </div>
    </section>
  );
}

function StatsSection({ data }: { data: any }) {
  if (!data.enabled) return null;
  return (
    <section className="bg-amber-600 py-12 relative overflow-hidden" data-editor-id="stats-section">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {data.items.map((stat: any, i: number) => (
            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="text-5xl font-black mb-1 drop-shadow-lg tracking-tight">{stat.value}</div>
              <div className="text-amber-100 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedToursSection({ data, displayTours }: { data: any, displayTours: Tour[] }) {
  if (!data.enabled) return null;
  return (
    <section id="featured" className="py-24 bg-gray-50 border-t border-gray-100" data-editor-id="featured-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-bold tracking-widest text-xs uppercase">Our Top Expeditions</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4" data-editor-id="featured-headline">{data.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            {data.subtitle || "Hand-picked adventures designed for maximum thrill and cultural immersion."}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTours.map(tour => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
        <div className="text-center mt-16">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-10 py-5 rounded-full font-bold hover:bg-gray-800 transition shadow-xl"
          >
            View All Tours <ChevronRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

function DestinationsSection({ data, destinations }: { data: any, destinations: Destination[] }) {
  if (!data?.enabled || destinations.length === 0) return null;
  const featuredDestinations = destinations.filter(d => d.featured).slice(0, 4);
  const displayDestinations = featuredDestinations.length > 0 ? featuredDestinations : destinations.slice(0, 4);

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-amber-500 font-semibold">EXPLORE</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-4">{data.title}</h2>
            <p className="text-gray-400 max-w-xl">
              {data.subtitle}
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
          {displayDestinations.map(destination => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ data }: { data: any }) {
  if (!data.enabled) return null;
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-amber-600 font-bold tracking-widest text-xs uppercase">Rider Reviews</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{data.title}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {data.items.map((review: any, i: number) => (
            <div key={i} className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow border border-gray-100 relative">
              <div className="absolute top-8 right-8 text-gray-100">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C20.1216 16 21.017 16.8954 21.017 18V21C21.017 22.1046 20.1216 23 19.017 23H16.017C14.9124 23 14.017 22.1046 14.017 21ZM14.017 11V8C14.017 6.89543 14.9124 6 16.017 6H19.017C20.1216 6 21.017 6.89543 21.017 8V11C21.017 12.1046 20.1216 13 19.017 13H16.017C14.9124 13 14.017 12.1046 14.017 11ZM3.01705 21L3.01705 18C3.01705 16.8954 3.91248 16 5.01705 16H8.01705C9.12162 16 10.0171 16.8954 10.0171 18V21C10.0171 22.1046 9.12162 23 8.01705 23H5.01705C3.91248 23 3.01705 22.1046 3.01705 21ZM3.01705 11V8C3.01705 6.89543 3.91248 6 5.01705 6H8.01705C9.12162 6 10.0171 6.89543 10.0171 8V11C10.0171 12.1046 9.12162 13 8.01705 13H5.01705C3.91248 13 3.01705 12.1046 3.01705 11Z"></path></svg>
              </div>
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={18} className="fill-amber-500 text-amber-500" />
                ))}
              </div>
              <div
                className="text-gray-600 mb-8 italic text-lg leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: review.text }}
              />
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-white">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{review.name}</p>
                  <p className="text-sm text-amber-600 font-semibold">{review.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MainCTASection({ data }: { data: any }) {
  if (!data.enabled) return null;
  return (
    <section className="py-32 bg-mesh relative overflow-hidden text-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative max-w-4xl mx-auto px-4">
        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight">{data.title}</h2>
        <p className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium">
          {data.subtitle || "The mountains are calling. Don't wait for another year to cross this off your bucket list."}
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            to={data.ctaLink}
            className="bg-amber-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-amber-500 transition-all transform hover:scale-105 shadow-2xl shadow-amber-600/40"
          >
            {data.ctaText}
          </Link>
          <Link
            to="/contact"
            className="glass text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-white/10 transition-all backdrop-blur-xl border-white/20"
          >
            REQUEST ITINERARY
          </Link>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection({ data }: { data: any }) {
  if (!data?.enabled) return null;

  const iconMap: { [key: string]: any } = {
    Shield, Award, Mountain, Zap, Calendar, MapPin, Users, Star, Globe, Trophy, Clock, Search, CheckCircle2
  };

  const experiences = (data.items && data.items.length > 0) ? data.items.map((item: any) => ({
    icon: iconMap[item.icon] || Shield,
    title: item.title,
    desc: item.description
  })) : [
    {
      icon: Shield,
      title: "Safety First",
      desc: "Backup vehicle and medic on every multi-day expedition."
    },
    {
      icon: Award,
      title: "Expert Guides",
      desc: "Licensed local guides who know every twist and turn."
    },
    {
      icon: Mountain,
      title: "Premier Routes",
      desc: "Meticulously scouted paths away from the tourist traps."
    },
    {
      icon: Zap,
      title: "Top-Tier Fleet",
      desc: "Ride the latest Himalayan and BMW GS adventure bikes."
    }
  ];

  return (
    <section className="py-24 bg-mesh relative overflow-hidden" data-editor-id="experience-section">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-amber-500 font-bold tracking-[0.2em] text-sm uppercase mb-4 block animate-fade-in">The BRM Advantage</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" data-editor-id="experience-headline">{data.title || "Built for the True Rider"}</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {experiences.map((exp: any, i: number) => (
            <div key={i} className="glass-dark p-8 rounded-3xl group hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-500 mx-auto">
                <exp.icon className="text-amber-500 group-hover:text-white transition-colors duration-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{exp.title}</h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">{exp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TourOfTheMonth({ data, tour }: { data: any, tour: Tour }) {
  if (!data?.enabled || !tour) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-500 rounded-2xl flex items-center justify-center z-10">
              <div className="text-center">
                <Trophy size={28} className="text-white mx-auto" />
                <span className="text-white text-xs font-bold">TOUR OF<br />THE MONTH</span>
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
              ⭐ {data.subtitle || "Highly Recommended"}
            </span>
            <h2 className="text-4xl font-bold mb-4">{data.title || tour?.title}</h2>
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

function UpcomingDepartures({ data, tours }: { data: any, tours: Tour[] }) {
  if (!data?.enabled || !tours || tours.length === 0) return null;

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
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{data.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toursWithDates.map((tour, i) => {
            const date = new Date(tour?.departureDate);
            const countries = tour?.countries || [];
            return (
              <Link
                key={`${tour?.id || i} -${i} `}
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
  const [posts, setPosts] = useState(data.posts || []);

  useEffect(() => {
    if (data.feedUrl) {
      fetch(data.feedUrl)
        .then(res => res.json())
        .then(feedData => {
          // Handle both direct array and object with data property
          const items = Array.isArray(feedData) ? feedData : (feedData.data || []);

          const mappedPosts = items.map((item: any) => ({
            id: item.id || Math.random().toString(),
            // Handle various feed formats (Behold, RSS2JSON, etc.)
            imageUrl: item.mediaUrl || item.media_url || item.thumbnail_url || item.imageUrl || item.url,
            link: item.permalink || item.link || item.url,
            caption: item.caption || item.title
          })).filter((post: any) => post.imageUrl).slice(0, 6);

          if (mappedPosts.length > 0) {
            setPosts(mappedPosts);
          }
        })
        .catch(err => {
          console.error("Failed to fetch Instagram feed:", err);
          // Fallback to manual posts is handled by initial state, but we can reset if needed
          // setPosts(data.posts || []); 
        });
    } else {
      setPosts(data.posts || []);
    }
  }, [data.feedUrl, data.posts]);

  if (!data?.enabled) return null;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">{data.title}</h2>
        <a href={`https://instagram.com/${data.username}`} target="_blank" className="text-amber-600 font-medium hover:underline mb-8 block flex items-center justify-center gap-2">
          @{data.username} <ExternalLink size={14} />
        </a>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {posts.map((post: any) => (
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
            <article key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden group border border-gray-100 flex flex-col h-full">
              <Link to={post.link} className="h-48 overflow-hidden relative block">
                <img src={post.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={post.title} />
                <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{post.category}</span>
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition leading-tight">
                  <Link to={post.link}>{post.title}</Link>
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
                <Link to={post.link} className="text-sm font-semibold text-amber-600 group-hover:text-amber-700 flex items-center gap-1 mt-auto">
                  Read Article <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// 2. Add them to your main Home return

function VideoSection({ data }: { data: any }) {
  if (!data?.enabled) return null;
  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img
          src={data.backgroundImage || "https://images.unsplash.com/photo-1568772585407-9361bd37ec91?w=1600&h=900&fit=crop"}
          alt="Motorcycle adventure"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <span className="inline-block bg-amber-500/20 text-amber-400 px-4 py-1 rounded-full text-sm font-semibold mb-6">
          Watch Our Story
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {data.title}
        </h2>
        <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
          {data.subtitle}
        </p>
        <a
          href={data.videoUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-amber-500 hover:text-white transition group"
        >
          <div className="w-12 h-12 bg-amber-500 group-hover:bg-white rounded-full flex items-center justify-center transition">
            <Play className="text-white group-hover:text-amber-500 fill-current" size={20} />
          </div>
          Watch Video
        </a>
      </div>
    </section>
  );
}

function BikesSection({ data }: { data: any }) {
  const appContext = useApp();
  if (!appContext || !data?.enabled) return null;

  const bikes = appContext.bikes || [];
  const availableBikes = bikes.filter(b => b.available).slice(0, 4);

  if (availableBikes.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold">OUR FLEET</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{data.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {data.subtitle}
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

function NewsletterSection({ data }: { data: any }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  if (!data?.enabled) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden" data-editor-id="newsletter-section">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="glass-dark rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 border border-white/10">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6" data-editor-id="newsletter-headline">{data.title}</h2>
            <p className="text-gray-400 text-lg mb-0">{data.subtitle}</p>
          </div>
          <div className="w-full lg:w-[450px]">
            {status === 'success' ? (
              <div className="bg-green-500/10 border border-green-500/50 rounded-2xl p-6 text-center animate-fade-in">
                <CheckCircle2 className="text-green-500 mx-auto mb-3" size={40} />
                <h3 className="text-xl font-bold text-white mb-1">You're on the list!</h3>
                <p className="text-green-400 text-sm">Check your inbox for your guide.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="relative group">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all text-lg"
                  />
                </div>
                <button
                  disabled={status === 'loading'}
                  className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 shadow-xl shadow-amber-600/20"
                >
                  {status === 'loading' ? 'Sending...' : 'SEND ME THE GUIDE'}
                </button>
                <p className="text-gray-500 text-xs text-center mt-2">We respect your privacy. Unsubscribe at any time.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Partners({ data }: { data: any }) {
  if (!data?.enabled) return null;

  const partners = data.items?.length > 0 ? data.items : [
    { name: 'Royal Enfield', logo: 'https://seeklogo.com/images/R/royal-enfield-logo-5D12DE4D9C-seeklogo.com.png' },
    { name: 'BMW Motorrad', logo: 'https://seeklogo.com/images/B/bmw-motorrad-logo-66F5B5B5E5-seeklogo.com.png' },
    { name: 'Motul', logo: 'https://seeklogo.com/images/M/motul-logo-6B9E9CDE00-seeklogo.com.png' },
    { name: 'Garmin', logo: 'https://seeklogo.com/images/G/garmin-logo-3B45F5E4D4-seeklogo.com.png' },
    { name: 'Sena', logo: 'https://seeklogo.com/images/S/sena-logo-2B6A6B4A6B-seeklogo.com.png' }
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{data.title || "Trusted By Industry Leaders"}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          {partners.map((partner: any, i: number) => (
            <div key={i} className="h-12 w-32 flex items-center justify-center group">
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-full max-w-full object-contain filter brightness-0 transition-all group-hover:brightness-100"
              />
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

  const { tours = [], destinations = [], posts = [], siteSettings } = appContext;
  const featuredTours = tours.filter(t => t.featured && t.status === 'published');
  const allPublishedTours = tours.filter(t => t.status === 'published');
  const publishedDestinations = destinations.filter(d => d.status === 'published');


  // Tour of the month - from settings or fallback to first featured/expensive
  const configuredTourOfMonth = tours.find(t => t.id === siteSettings?.homepage?.tourOfMonthSection?.tourId);
  const tourOfMonth = configuredTourOfMonth || featuredTours[0] || allPublishedTours.sort((a, b) => b.price - a.price)[0];

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
    ctaSection: { enabled: true, title: 'Ready for Adventure?', subtitle: '', backgroundImage: '', ctaText: 'Book Now', ctaLink: '/tours' },
    destinationsSection: { enabled: true, title: 'Popular Destinations', subtitle: 'Discover the world\'s most spectacular motorcycle routes' },
    tourOfMonthSection: { enabled: true, title: 'Tour of the Month', subtitle: 'Our highly recommended expedition' },
    departuresSection: { enabled: true, title: 'Next Departures', subtitle: 'Join our upcoming expeditions' },
    videoSection: { enabled: true, title: 'Experience the Thrill', subtitle: 'Watch our story', videoUrl: '', backgroundImage: 'https://images.unsplash.com/photo-1568772585407-9361bd37ec91?w=1600' },
    bikesSection: { enabled: true, title: 'Our Fleet', subtitle: 'Ride the best adventure motorcycles' },
    newsletterSection: { enabled: true, title: 'Get the Guide', subtitle: 'Join 5,000+ riders' },
    partnersSection: { enabled: true, title: 'Trusted By Industry Leaders', items: [] }
  };

  // Merge with defaults to ensure all properties exist
  const homepage = {
    hero: { ...defaultHomepage.hero, ...(siteSettings?.homepage?.hero || {}) },
    stats: { ...defaultHomepage.stats, ...(siteSettings?.homepage?.stats || {}) },
    featuredSection: { ...defaultHomepage.featuredSection, ...(siteSettings?.homepage?.featuredSection || {}) },
    whyChooseUs: { ...defaultHomepage.whyChooseUs, ...(siteSettings?.homepage?.whyChooseUs || {}) },
    testimonials: { ...defaultHomepage.testimonials, ...(siteSettings?.homepage?.testimonials || {}) },
    ctaSection: { ...defaultHomepage.ctaSection, ...(siteSettings?.homepage?.ctaSection || {}) },
    blogSection: {
      ...(siteSettings?.homepage?.blogSection || { enabled: true, title: 'From Our Blog', subtitle: 'Latest stories, tips, and guides from the road' }),
      posts: (posts || []).filter(p => p.status === 'published').slice(0, 3).map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        imageUrl: post.image,
        date: post.date,
        category: post.category,
        link: `/blog/${post.slug}`
      }))
    },
    instagramSection: {
      enabled: true,
      title: 'Follow Our Journey',
      username: 'brmexpeditions',
      posts: [],
      ...(siteSettings?.homepage?.instagramSection || {}),
      // Ensure feedUrl is set even if settings has empty string
      feedUrl: (siteSettings?.homepage?.instagramSection?.feedUrl) || 'https://feeds.behold.so/uvDK79jgxcUqSe0PPV0g'
    },
    destinationsSection: { ...defaultHomepage.destinationsSection, ...(siteSettings?.homepage?.destinationsSection || {}) },
    tourOfMonthSection: { ...defaultHomepage.tourOfMonthSection, ...(siteSettings?.homepage?.tourOfMonthSection || {}) },
    departuresSection: { ...defaultHomepage.departuresSection, ...(siteSettings?.homepage?.departuresSection || {}) },
    videoSection: { ...defaultHomepage.videoSection, ...(siteSettings?.homepage?.videoSection || {}) },
    bikesSection: { ...defaultHomepage.bikesSection, ...(siteSettings?.homepage?.bikesSection || {}) },
    newsletterSection: { ...defaultHomepage.newsletterSection, ...(siteSettings?.homepage?.newsletterSection || {}) },
    partnersSection: { ...defaultHomepage.partnersSection, ...(siteSettings?.homepage?.partnersSection || {}) }
  };

  // Safe access to featuredSection properties
  const maxItems = homepage.featuredSection?.maxItems || 6;
  const showFeaturedOnly = homepage.featuredSection?.showFeaturedOnly ?? true;

  // Display only featured tours when showFeaturedOnly is true
  // Otherwise show all published tours
  const displayTours = showFeaturedOnly
    ? featuredTours.slice(0, maxItems)
    : allPublishedTours.slice(0, maxItems);


  const sectionOrder = siteSettings?.homepage?.sectionOrder || [
    'hero', 'stats', 'whyus', 'destinations', 'tourOfMonth', 'featured', 'departures', 'video', 'bikes', 'testimonials', 'blog', 'newsletter', 'instagram', 'partners', 'cta'
  ];

  const renderSection = (id: string) => {
    switch (id) {
      case 'hero': return <HeroSection key={id} data={homepage.hero} />;
      case 'stats': return <StatsSection key={id} data={homepage.stats} />;
      case 'whyus': return <ExperienceSection key={id} data={homepage.whyChooseUs} />;
      case 'destinations': return <DestinationsSection key={id} data={homepage.destinationsSection} destinations={publishedDestinations} />;
      case 'tourOfMonth': return tourOfMonth && <TourOfTheMonth key={id} data={homepage.tourOfMonthSection} tour={tourOfMonth} />;
      case 'featured': return <FeaturedToursSection key={id} data={homepage.featuredSection} displayTours={displayTours} />;
      case 'departures': return <UpcomingDepartures key={id} data={homepage.departuresSection} tours={allPublishedTours} />;
      case 'video': return <VideoSection key={id} data={homepage.videoSection} />;
      case 'bikes': return <BikesSection key={id} data={homepage.bikesSection} />;
      case 'testimonials': return <TestimonialsSection key={id} data={homepage.testimonials} />;
      case 'blog': return <BlogSection key={id} data={homepage.blogSection} />;
      case 'newsletter': return <NewsletterSection key={id} data={homepage.newsletterSection} />;
      case 'instagram': return <InstagramSection key={id} data={homepage.instagramSection} />;
      case 'partners': return <Partners key={id} data={homepage.partnersSection} />;
      case 'cta': return <MainCTASection key={id} data={homepage.ctaSection} />;
      default: return null;
    }
  };

  return (
    <Layout>
      <SEOHead
        title={siteSettings?.seo?.siteTitle || 'BRM Expeditions'}
        description={siteSettings?.seo?.siteDescription || 'Premium Motorcycle Tours'}
        keywords={siteSettings?.seo?.keywords || []}
        structuredData={organizationStructuredData}
      />

      {sectionOrder.map(sectionId => renderSection(sectionId))}
    </Layout>
  );
}
