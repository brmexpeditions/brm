import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar, Mountain, Thermometer, ChevronRight, Check, AlertCircle,
  Camera, X, ChevronLeft, Route
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Layout } from '../components/Layout';
import { SEOHead } from '../components/SEOHead';

export function DestinationDetail() {
  const { slug } = useParams();
  const { destinations, tours } = useApp();
  const destination = destinations.find((d: { slug: string }) => d.slug === slug);

  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Get tours for this destination
  const destinationTours = tours.filter(t =>
    t.status === 'published' &&
    (t.countries.some(c => c.toLowerCase() === destination?.country.toLowerCase()) ||
      t.title.toLowerCase().includes(destination?.name.toLowerCase() || ''))
  );

  if (!destination) {
    return (
      <Layout>
        <SEOHead
          title="Destination Not Found | BRM Expeditions"
          description="The destination you're looking for doesn't exist."
        />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
          <p className="text-gray-600 mb-8">The destination you're looking for doesn't exist.</p>
          <Link to="/destinations" className="bg-amber-600 text-white px-6 py-3 rounded-full font-semibold">
            Browse Destinations
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={destination.seo?.metaTitle || `${destination.name} Motorcycle Tours | BRM Expeditions`}
        description={destination.seo?.metaDescription || destination.tagline}
        keywords={destination.seo?.keywords || [destination.name, destination.country, 'motorcycle tour']}
        image={destination.heroImage}
      />

      {/* Hero Section - Full Height with Parallax Effect */}
      <section className="relative h-screen -mt-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative h-full flex flex-col justify-end pb-20">
          <div className="max-w-7xl mx-auto px-4 w-full">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Link to="/" className="hover:text-white">Home</Link>
                <span>/</span>
                <Link to="/destinations" className="hover:text-white">Destinations</Link>
                <span>/</span>
                <span className="text-amber-400">{destination.name}</span>
              </div>
            </nav>

            {/* Destination Title */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold rounded-full">
                {destination.country}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${destination.difficulty === 'Expert' ? 'bg-red-500' :
                  destination.difficulty === 'Challenging' ? 'bg-orange-500' :
                    destination.difficulty === 'Moderate' ? 'bg-yellow-500' :
                      'bg-green-500'
                } text-white`}>
                {destination.difficulty}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">{destination.name}</h1>
            <p className="text-2xl md:text-3xl text-amber-400 font-medium mb-8">{destination.tagline}</p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2 text-white">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Calendar size={20} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Best Time</p>
                  <p className="font-semibold">{destination.bestTimeToVisit}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Mountain size={20} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Altitude</p>
                  <p className="font-semibold">{destination.averageAltitude.split('(')[0].trim()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Route size={20} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Terrain</p>
                  <p className="font-semibold">{destination.terrain.slice(0, 2).join(', ')}</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/tours"
                className="bg-amber-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-600 transition flex items-center gap-2"
              >
                View Tours in {destination.name} <ChevronRight size={20} />
              </Link>
              <button
                onClick={() => setShowGallery(true)}
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition flex items-center gap-2"
              >
                <Camera size={20} /> View Gallery ({destination.gallery.length})
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <span className="text-amber-600 font-semibold tracking-widest">ABOUT</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-8">Discover {destination.name}</h2>
              <div
                className="prose prose-lg max-w-none text-gray-600"
                dangerouslySetInnerHTML={{ __html: destination.description }}
              />

              {/* Highlights */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Highlights</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {destination.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-start gap-3 bg-amber-50 p-4 rounded-xl">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={16} className="text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Quick Info Card */}
              <div className="bg-gray-900 rounded-2xl p-6 text-white sticky top-32">
                <h3 className="text-xl font-bold mb-6">Quick Info</h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-700">
                    <Calendar className="text-amber-400" size={20} />
                    <div>
                      <p className="text-gray-400 text-sm">Best Time to Visit</p>
                      <p className="font-semibold">{destination.bestTimeToVisit}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pb-4 border-b border-gray-700">
                    <Thermometer className="text-amber-400" size={20} />
                    <div>
                      <p className="text-gray-400 text-sm">Climate</p>
                      <p className="font-medium text-sm">{destination.climate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pb-4 border-b border-gray-700">
                    <Mountain className="text-amber-400" size={20} />
                    <div>
                      <p className="text-gray-400 text-sm">Altitude Range</p>
                      <p className="font-semibold">{destination.averageAltitude}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pb-4 border-b border-gray-700">
                    <Route className="text-amber-400" size={20} />
                    <div>
                      <p className="text-gray-400 text-sm">Difficulty</p>
                      <p className={`font-semibold ${destination.difficulty === 'Expert' ? 'text-red-400' :
                          destination.difficulty === 'Challenging' ? 'text-orange-400' :
                            destination.difficulty === 'Moderate' ? 'text-yellow-400' :
                              'text-green-400'
                        }`}>
                        {destination.difficulty}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <p className="text-gray-400 text-sm mb-2">Terrain Types</p>
                    <div className="flex flex-wrap gap-2">
                      {destination.terrain.map((t, i) => (
                        <span key={i} className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Link
                  to="/tours"
                  className="block w-full mt-6 bg-amber-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
                >
                  View Available Tours
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold tracking-widest">ROUTES</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Popular Routes in {destination.name}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destination.popularRoutes.map((route, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{route}</h3>
                    <p className="text-sm text-amber-600">Scenic Route</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Things to Know */}
      <section className="py-20 bg-amber-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-amber-200 font-semibold tracking-widest">TIPS</span>
            <h2 className="text-4xl font-bold text-white mt-2">Things to Know Before You Go</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destination.thingsToKnow.map((tip, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex items-start gap-4">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={16} className="text-white" />
                </div>
                <p className="text-white">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tours in this Destination */}
      {destinationTours.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-amber-600 font-semibold tracking-widest">TOURS</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">Tours in {destination.name}</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinationTours.map((tour) => (
                <Link
                  key={tour.id}
                  to={`/tours/${tour.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={tour.heroImage}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg">{tour.title}</h3>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-500 text-sm">{tour.duration}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${tour.difficulty === 'Expert' ? 'bg-red-100 text-red-700' :
                          tour.difficulty === 'Challenging' ? 'bg-orange-100 text-orange-700' :
                            tour.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                        }`}>
                        {tour.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-400 text-sm">From</span>
                        <p className="text-2xl font-bold text-gray-900">${tour.price.toLocaleString()}</p>
                      </div>
                      <span className="text-amber-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        View <ChevronRight size={18} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {destination.gallery.length > 0 && (
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-amber-500 font-semibold tracking-widest">GALLERY</span>
              <h2 className="text-4xl font-bold text-white mt-2">{destination.name} in Pictures</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {destination.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setGalleryIndex(i); setShowGallery(true); }}
                  className={`relative group rounded-xl overflow-hidden ${i === 0 ? 'col-span-2 row-span-2' : ''
                    } aspect-square`}
                >
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-sm">{img.caption}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Explore Other Destinations</h2>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              to="/destinations"
              className="bg-amber-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-600 transition flex items-center gap-2"
            >
              View All Destinations <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Lightbox */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white hover:text-amber-500 transition p-2"
          >
            <X size={32} />
          </button>
          <button
            onClick={() => setGalleryIndex((galleryIndex - 1 + destination.gallery.length) % destination.gallery.length)}
            className="absolute left-4 text-white hover:text-amber-500 transition p-2"
          >
            <ChevronLeft size={48} />
          </button>
          <button
            onClick={() => setGalleryIndex((galleryIndex + 1) % destination.gallery.length)}
            className="absolute right-4 text-white hover:text-amber-500 transition p-2"
          >
            <ChevronRight size={48} />
          </button>
          <div className="max-w-5xl max-h-[80vh] px-16">
            <img
              src={destination.gallery[galleryIndex]?.url}
              alt={destination.gallery[galleryIndex]?.caption}
              className="max-w-full max-h-[70vh] object-contain mx-auto"
            />
            {destination.gallery[galleryIndex]?.caption && (
              <p className="text-white text-center mt-4 text-lg">{destination.gallery[galleryIndex].caption}</p>
            )}
            <p className="text-gray-400 text-center mt-2">
              {galleryIndex + 1} / {destination.gallery.length}
            </p>
          </div>
        </div>
      )}
    </Layout>
  );
}
