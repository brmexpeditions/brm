import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { Bike } from '../types';

export function Bikes() {
  const { bikes } = useApp();
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    document.title = 'Our Motorcycles | BRM Expeditions';
    window.scrollTo(0, 0);
  }, []);

  const getBrandLogo = (brand: string) => {
    const logos: Record<string, string> = {
      'Royal Enfield': '👑',
      'BMW': '🔵',
      'KTM': '🟠',
      'Triumph': '🔷',
      'Honda': '🔴',
      'Kawasaki': '🟢',
      'Suzuki': '🟡',
      'Ducati': '❤️',
      'Harley-Davidson': '🦅',
      'Yamaha': '🎵'
    };
    return logos[brand] || '🏍️';
  };

  const availableBikes = bikes.filter(b => b.available);

  return (
    <Layout>
      {/* Hero Section - Clean and Minimal */}
      <section className="relative bg-gray-900 py-20 md:py-28">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Our Motorcycles
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We offer a diverse fleet of well-maintained motorcycles suitable for all types of riders. 
            Each bike is carefully selected for reliability, comfort, and performance on the diverse terrains of our tours.
          </p>
          
          {/* Breadcrumb */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-amber-500">Our Motorcycles</span>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Premium Fleet for Your Adventure
            </h2>
            <div className="prose prose-lg text-gray-600">
              <p className="mb-4">
                At BRM Expeditions, we understand that the motorcycle you ride can make all the difference in your touring experience. 
                That's why we've carefully curated a fleet of motorcycles that combine reliability, comfort, and performance.
              </p>
              <p>
                All our motorcycles are regularly serviced and maintained to the highest standards. 
                We provide full insurance coverage and 24/7 roadside assistance on all our tours.
              </p>
            </div>
            
            {/* Key Points */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Fully Serviced</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Fully Insured</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">Modern Fleet</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bikes List - Alternating Left/Right Layout (Original) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-16">
            {availableBikes.map((bike, index) => (
              <div 
                key={bike.id} 
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
              >
                {/* Image */}
                <div className="w-full lg:w-1/2 relative group">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-200 shadow-lg">
                    <img 
                      src={bike.image} 
                      alt={bike.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Brand Badge */}
                  <div className="absolute top-4 left-4 bg-white rounded-lg px-4 py-2 shadow-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getBrandLogo(bike.brand)}</span>
                      <span className="font-bold text-gray-900">{bike.brand}</span>
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {bike.featured && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Popular Choice
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-black/70 text-white px-3 py-1 rounded text-sm backdrop-blur-sm uppercase tracking-wider">
                      {bike.category}
                    </span>
                    <span className="bg-black/70 text-white px-3 py-1 rounded text-sm backdrop-blur-sm">
                      {bike.year}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full lg:w-1/2">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                    {bike.name}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {bike.description}
                  </p>

                  {/* Specifications Table */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="px-4 py-2.5 bg-gray-50 text-gray-600 font-medium w-2/5">Engine</td>
                          <td className="px-4 py-2.5 text-gray-900 font-medium">{bike.engineCapacity}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="px-4 py-2.5 bg-gray-50 text-gray-600 font-medium">Power</td>
                          <td className="px-4 py-2.5 text-gray-900">{bike.power}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="px-4 py-2.5 bg-gray-50 text-gray-600 font-medium">Torque</td>
                          <td className="px-4 py-2.5 text-gray-900">{bike.torque}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="px-4 py-2.5 bg-gray-50 text-gray-600 font-medium">Weight</td>
                          <td className="px-4 py-2.5 text-gray-900">{bike.weight}</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="px-4 py-2.5 bg-gray-50 text-gray-600 font-medium">Seat Height</td>
                          <td className="px-4 py-2.5 text-gray-900">{bike.seatHeight}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 bg-gray-50 text-gray-600 font-medium">Top Speed</td>
                          <td className="px-4 py-2.5 text-gray-900">{bike.topSpeed}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Ideal For Tags */}
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Ideal For
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {bike.idealFor.map((ideal, i) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center gap-1.5 text-sm bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {ideal}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Daily Rate</div>
                      <div className="text-2xl font-bold text-gray-900">
                        ${bike.rentalPrice}
                        <span className="text-base font-normal text-gray-500">/day</span>
                      </div>
                      {bike.upgradePrice > 0 && (
                        <div className="text-sm text-amber-600 mt-1">
                          +${bike.upgradePrice} upgrade on tours
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedBike(bike);
                        setImageIndex(0);
                      }}
                      className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      <span>View Details</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Bikes Message */}
          {availableBikes.length === 0 && (
            <div className="text-center py-20 bg-white rounded-lg">
              <div className="text-6xl mb-4">🏍️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No motorcycles available</h3>
              <p className="text-gray-600">Please check back later or contact us for more information.</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Comparison Table (Horizontal) */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Quick Comparison
            </h2>
            <p className="text-gray-600">
              Compare all our motorcycles at a glance.
            </p>
          </div>

          {/* Horizontal Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left px-4 py-4 font-semibold">Motorcycle</th>
                  <th className="text-left px-4 py-4 font-semibold">Engine</th>
                  <th className="text-left px-4 py-4 font-semibold">Power</th>
                  <th className="text-left px-4 py-4 font-semibold">Torque</th>
                  <th className="text-left px-4 py-4 font-semibold">Weight</th>
                  <th className="text-left px-4 py-4 font-semibold">Seat Height</th>
                  <th className="text-right px-4 py-4 font-semibold">Price/Day</th>
                </tr>
              </thead>
              <tbody>
                {availableBikes.map((bike, index) => (
                  <tr 
                    key={bike.id}
                    onClick={() => {
                      setSelectedBike(bike);
                      setImageIndex(0);
                    }}
                    className={`border-b border-gray-100 cursor-pointer hover:bg-amber-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={bike.image} 
                          alt={bike.name} 
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{bike.name}</div>
                          <div className="text-xs text-gray-500">{bike.brand} • {bike.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{bike.engineCapacity}</td>
                    <td className="px-4 py-4 text-gray-700">{bike.power.split('@')[0].trim()}</td>
                    <td className="px-4 py-4 text-gray-700">{bike.torque.split('@')[0].trim()}</td>
                    <td className="px-4 py-4 text-gray-700">{bike.weight}</td>
                    <td className="px-4 py-4 text-gray-700">{bike.seatHeight}</td>
                    <td className="px-4 py-4 text-right font-bold text-gray-900">${bike.rentalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Choose your perfect motorcycle and join us on an unforgettable journey through breathtaking landscapes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/tours"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              <span>Browse Our Tours</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Bike Detail Modal */}
      function BikeDetailModal({ bike, onClose }: { bike: Bike, onClose: () => void }) {
  if (!bike) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 bg-gray-100 relative group h-64 md:h-auto">
          <img 
            src={bike.image} 
            alt={bike.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
              {bike.brand}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 md:hidden z-10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-white relative">
          {/* Close Button (Desktop) */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full hidden md:block"
          >
            <X size={24} />
          </button>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{bike.name}</h2>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                {bike.model}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                {bike.year}
              </span>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium border border-amber-100">
                {bike.category}
              </span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Engine</span>
                    <span className="font-medium text-gray-900 text-sm">{bike.engineCapacity}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Power</span>
                    <span className="font-medium text-gray-900 text-sm">{bike.power}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Weight</span>
                    <span className="font-medium text-gray-900 text-sm">{bike.weight}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500 text-sm">Seat Height</span>
                    <span className="font-medium text-gray-900 text-sm">{bike.seatHeight}</span>
                  </div>
                </div>
              </div>

              {bike.features && bike.features.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Key Features</h3>
                  <ul className="grid grid-cols-1 gap-2">
                    {bike.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between mt-auto">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Daily Rate</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-amber-600">${bike.rentalPrice}</span>
                <span className="text-gray-400 text-sm">/ day</span>
              </div>
            </div>
            <Link 
              to="/contact" 
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Book This Bike <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
                  
                  {/* Image Navigation */}
                  {selectedBike.gallery && selectedBike.gallery.length > 1 && (
                    <>
                      <button 
                        onClick={() => setImageIndex(prev => prev === 0 ? selectedBike.gallery!.length - 1 : prev - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setImageIndex(prev => prev === selectedBike.gallery!.length - 1 ? 0 : prev + 1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {/* Dots */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {selectedBike.gallery.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setImageIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              i === imageIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Brand Badge */}
                <div className="absolute top-4 left-4 bg-white rounded-lg px-4 py-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getBrandLogo(selectedBike.brand)}</span>
                    <span className="font-bold text-gray-900">{selectedBike.brand}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium uppercase">
                      {selectedBike.category}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {selectedBike.year}
                    </span>
                    {selectedBike.featured && (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                        ★ Popular
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {selectedBike.name}
                  </h2>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {selectedBike.description}
                </p>

                {/* Full Specifications */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Technical Specifications
                  </h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-600 w-1/3">Engine</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{selectedBike.engineCapacity}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-600">Power</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{selectedBike.power}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-600">Torque</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{selectedBike.torque}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-600">Weight</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{selectedBike.weight}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-600">Seat Height</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{selectedBike.seatHeight}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-600">Fuel Capacity</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{selectedBike.fuelCapacity}</td>
                        </tr>
                        <tr className="border-b border-gray-200">
                          <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-600">Transmission</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{selectedBike.transmission}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 bg-gray-50 text-sm font-medium text-gray-600">Top Speed</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{selectedBike.topSpeed}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Features */}
                {selectedBike.features && selectedBike.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                      Key Features
                    </h3>
                    <ul className="grid grid-cols-2 gap-2">
                      {selectedBike.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Ideal For */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                    Ideal For
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBike.idealFor.map((ideal, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center gap-1.5 text-sm bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200"
                      >
                        {ideal}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Daily Rental Rate</div>
                      <div className="text-3xl font-bold text-gray-900">
                        ${selectedBike.rentalPrice}
                        <span className="text-lg font-normal text-gray-500">/day</span>
                      </div>
                    </div>
                    {selectedBike.upgradePrice > 0 && (
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Upgrade on Tours</div>
                        <div className="text-xl font-bold text-amber-600">+${selectedBike.upgradePrice}</div>
                      </div>
                    )}
                  </div>
                  <Link 
                    to="/tours"
                    onClick={() => setSelectedBike(null)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    <span>Book This Bike on a Tour</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
