import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ChevronRight, Filter, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Layout } from '../components/Layout';
import { SEOHead } from '../components/SEOHead';

export function Tours() {
  const { tours } = useApp();
  const publishedTours = tours.filter(t => t.status === 'published');

  const [filters, setFilters] = useState({
    difficulty: '',
    duration: '',
    priceRange: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredTours = publishedTours.filter(tour => {
    if (filters.difficulty && tour.difficulty !== filters.difficulty) return false;
    if (filters.duration) {
      if (filters.duration === 'short' && tour.durationDays > 7) return false;
      if (filters.duration === 'medium' && (tour.durationDays < 8 || tour.durationDays > 12)) return false;
      if (filters.duration === 'long' && tour.durationDays < 13) return false;
    }
    if (filters.priceRange) {
      if (filters.priceRange === 'budget' && tour.price > 3000) return false;
      if (filters.priceRange === 'mid' && (tour.price < 3000 || tour.price > 4500)) return false;
      if (filters.priceRange === 'premium' && tour.price < 4500) return false;
    }
    return true;
  });

  const clearFilters = () => {
    setFilters({ difficulty: '', duration: '', priceRange: '' });
  };

  const hasActiveFilters = filters.difficulty || filters.duration || filters.priceRange;

  return (
    <Layout>
      <SEOHead
        title="Motorcycle Tours in India | BRM Expeditions"
        description="Explore our collection of premium motorcycle tours across India. From Ladakh to Rajasthan, find your perfect adventure."
        keywords={['motorcycle tours', 'India tours', 'Ladakh tour', 'Rajasthan tour', 'adventure tours']}
      />
      {/* Hero */}
      <section className="relative h-[90vh] -mt-28 flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=600&fit=crop"
            alt="Tours"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 pt-28 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Our Motorcycle Tours</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our collection of carefully crafted motorcycle adventures across India's most stunning landscapes.
          </p>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-amber-500 transition"
                >
                  <Filter size={18} /> Filters {hasActiveFilters && <span className="w-2 h-2 bg-amber-500 rounded-full"></span>}
                </button>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-amber-600 flex items-center gap-1">
                    <X size={14} /> Clear all
                  </button>
                )}
              </div>
              <p className="text-gray-600">{filteredTours.length} tours available</p>
            </div>

            {showFilters && (
              <div className="mt-4 p-6 bg-white rounded-xl border border-gray-200">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={filters.difficulty}
                      onChange={e => setFilters({ ...filters, difficulty: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">All Difficulties</option>
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Challenging">Challenging</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Duration</label>
                    <select
                      value={filters.duration}
                      onChange={e => setFilters({ ...filters, duration: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">All Durations</option>
                      <option value="short">Short (Up to 7 days)</option>
                      <option value="medium">Medium (8-12 days)</option>
                      <option value="long">Long (13+ days)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                    <select
                      value={filters.priceRange}
                      onChange={e => setFilters({ ...filters, priceRange: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="">All Prices</option>
                      <option value="budget">Under $3,000</option>
                      <option value="mid">$3,000 - $4,500</option>
                      <option value="premium">Above $4,500</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tours Grid */}
          {filteredTours.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map(tour => (
                <Link
                  key={tour.id}
                  to={`/tours/${tour.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={tour.heroImage}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tour.difficulty === 'Expert' ? 'bg-red-500' :
                          tour.difficulty === 'Challenging' ? 'bg-orange-500' :
                            tour.difficulty === 'Moderate' ? 'bg-yellow-500' :
                              'bg-green-500'
                        } text-white`}>
                        {tour.difficulty}
                      </span>
                      {tour.featured && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white">Featured</span>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-xl font-bold mb-1">{tour.title}</h3>
                      <p className="text-gray-300 text-sm">{tour.countries.join(' • ')}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.shortDescription}</p>
                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar size={16} className="text-amber-500" />
                        <span>{tour.duration.split('/')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin size={16} className="text-amber-500" />
                        <span>{tour.distance}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Users size={16} className="text-amber-500" />
                        <span>{tour.groupSize.split(' ')[0]}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-gray-400 text-sm">From</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">${tour.price.toLocaleString()}</span>
                          {tour.originalPrice && (
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
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">No tours match your filters.</p>
              <button onClick={clearFilters} className="text-amber-600 font-semibold hover:text-amber-700">
                Clear filters to see all tours
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
