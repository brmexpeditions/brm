import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, Mountain } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Layout } from '../components/Layout';
import { SEOHead } from '../components/SEOHead';

export function Destinations() {
  const { destinations } = useApp();
  const publishedDestinations = destinations.filter(d => d.status === 'published');
  const featuredDestinations = publishedDestinations.filter(d => d.featured);
  const otherDestinations = publishedDestinations.filter(d => !d.featured);

  return (
    <Layout>
      <SEOHead
        title="Motorcycle Tour Destinations | BRM Expeditions"
        description="Explore our motorcycle tour destinations across India and beyond. From the Himalayas to the deserts, find your perfect adventure."
        keywords={['motorcycle destinations', 'India destinations', 'Ladakh', 'Rajasthan', 'Spiti Valley']}
      />

      {/* Hero Section - Full Width Mosaic */}
      <section className="relative h-[90vh] -mt-28 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-2">
          {featuredDestinations.slice(0, 4).map((dest, i) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.slug}`}
              className={`relative group overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''
                }`}
            >
              <img
                src={dest.heroImage}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-amber-400 text-sm font-semibold">{dest.country}</span>
                <h3 className="text-white text-2xl font-bold">{dest.name}</h3>
                <p className="text-gray-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {dest.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl">
              Our <span className="text-amber-400">Destinations</span>
            </h1>
            <p className="text-xl text-gray-200 mt-4 max-w-2xl mx-auto drop-shadow-lg">
              Discover extraordinary places for your next motorcycle adventure
            </p>
          </div>
        </div>
      </section>

      {/* Destinations Grid - Vintage Rides Style */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-semibold tracking-widest">EXPLORE</span>
            <h2 className="text-4xl font-bold text-white mt-2">Where Will You Ride?</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Each destination offers unique landscapes, cultures, and riding experiences. Choose your adventure.
            </p>
          </div>

          {/* Featured Destinations - Large Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {featuredDestinations.slice(0, 2).map((dest) => (
              <Link
                key={dest.id}
                to={`/destinations/${dest.slug}`}
                className="group relative h-[500px] rounded-3xl overflow-hidden"
              >
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="mb-4">
                    <span className="inline-block bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                      FEATURED
                    </span>
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full ml-2">
                      {dest.country}
                    </span>
                  </div>

                  <h3 className="text-4xl font-bold text-white mb-2">{dest.name}</h3>
                  <p className="text-xl text-amber-400 font-medium mb-4">{dest.tagline}</p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Calendar size={16} className="text-amber-400" />
                      {dest.bestTimeToVisit}
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Mountain size={16} className="text-amber-400" />
                      {dest.difficulty}
                    </div>
                  </div>

                  <p className="text-gray-300 line-clamp-2 mb-6">{dest.description.substring(0, 150)}...</p>

                  <div className="flex items-center gap-2 text-amber-400 font-semibold group-hover:gap-4 transition-all">
                    Explore {dest.name} <ChevronRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Other Destinations - Smaller Cards */}
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...featuredDestinations.slice(2), ...otherDestinations].map((dest) => (
              <Link
                key={dest.id}
                to={`/destinations/${dest.slug}`}
                className="group relative h-[350px] rounded-2xl overflow-hidden"
              >
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <span className="text-amber-400 text-xs font-semibold">{dest.country}</span>
                  <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{dest.tagline}</p>

                  <div className="flex items-center gap-3 text-white/70 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {dest.bestTimeToVisit.split(' ')[0]}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${dest.difficulty === 'Expert' ? 'bg-red-500/80' :
                        dest.difficulty === 'Challenging' ? 'bg-orange-500/80' :
                          dest.difficulty === 'Moderate' ? 'bg-yellow-500/80' :
                            'bg-green-500/80'
                      } text-white`}>
                      {dest.difficulty}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Ride With Us */}
      <section className="py-20 bg-amber-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '15+', label: 'Destinations' },
              { value: '50+', label: 'Routes' },
              { value: '500+', label: 'Happy Riders' },
              { value: '9', label: 'Years Experience' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-amber-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold">RIDE THE MAP</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Destinations Across Asia</h2>
          </div>

          <div className="relative bg-gray-200 rounded-3xl overflow-hidden h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400&h=600&fit=crop"
              alt="Map"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-8">
                {publishedDestinations.map((dest) => (
                  <Link
                    key={dest.id}
                    to={`/destinations/${dest.slug}`}
                    className="bg-white rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 text-center"
                  >
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover mb-3 border-4 border-amber-500"
                    />
                    <h3 className="font-bold text-gray-900">{dest.name}</h3>
                    <p className="text-xs text-gray-500">{dest.country}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Can't Decide Where to Go?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Let our experts help you choose the perfect destination based on your experience level and interests.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="bg-amber-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-600 transition"
            >
              Talk to an Expert
            </Link>
            <Link
              to="/tours"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition"
            >
              Browse All Tours
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
