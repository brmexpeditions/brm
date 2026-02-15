import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useApp } from '../context/AppContext';
import { Bike } from '../types';
import { Check, ChevronRight, X, ArrowRight, Trophy } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';

// ==========================================
// BIKE DETAIL MODAL COMPONENT
// ==========================================
function BikeDetailModal({ bike, onClose }: { bike: Bike, onClose: () => void }) {
  if (!bike) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 bg-gray-50 relative flex items-center justify-center p-8 border-r border-gray-100">
          <img 
            src={bike.image} 
            alt={bike.name} 
            className="w-full h-full object-contain mix-blend-multiply"
          />
          <div className="absolute top-6 left-6">
            <span className="bg-white/90 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-gray-200">
              {bike.brand}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/50 text-gray-900 rounded-full hover:bg-white md:hidden z-10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-white relative">
          {/* Sticky Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-white z-10">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wide">
                  {bike.category}
                </span>
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                  {bike.year}
                </span>
                {bike.featured && (
                  <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold flex items-center gap-1">
                    <Trophy size={10} /> Popular
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">{bike.name}</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors -mr-2 -mt-2"
            >
              <X size={24} />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <p className="text-gray-600 leading-relaxed">
              {bike.description || `The ${bike.name} is a trusted motorcycle for Nepal tours. Built for rugged Himalayan terrain, it offers stability and reliability for routes like Pokhara to Muktinath.`}
            </p>

            {/* Specs Table */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Technical Specifications</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-gray-100">
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-500 font-medium w-1/3">Engine</td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">{bike.engineCapacity}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-500 font-medium">Power</td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">{bike.power}</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-500 font-medium">Torque</td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">{bike.torque || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-500 font-medium">Weight</td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">{bike.weight}</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-500 font-medium">Seat Height</td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">{bike.seatHeight}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-500 font-medium">Fuel Tank</td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">{bike.fuelCapacity || 'N/A'}</td>
                    </tr>
                    <tr className="bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-500 font-medium">Top Speed</td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">{bike.topSpeed || 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Features */}
            {bike.features && bike.features.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bike.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ideal For Tags */}
            {bike.idealFor && bike.idealFor.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Ideal For</h3>
                <div className="flex flex-wrap gap-2">
                  {bike.idealFor.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between flex-shrink-0">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Daily Rental Rate</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">${bike.rentalPrice}</span>
                <span className="text-gray-500 text-sm font-medium">/ day</span>
              </div>
            </div>
            <Link 
              to="/contact" 
              className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center gap-2 shadow-lg shadow-gray-200"
            >
              Book Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MAIN BIKES PAGE
// ==========================================
export function Bikes() {
  const { bikes } = useApp();
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);

  // Removed Filter State and Logic
  
  return (
    <Layout>
      <SEOHead 
        title="Our Motorcycle Fleet | Nepal Bike Tours"
        description="Choose from our premium fleet of Royal Enfield, KTM, and BMW motorcycles for your Himalayan adventure."
      />
      
      {/* Hero Section */}
      <section className="relative py-24 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Motorcycle fleet" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-gray-900/60 to-gray-900" />
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">Our Motorcycles</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Meticulously maintained fleet of premium adventure bikes, ready to tackle the toughest Himalayan terrain.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-amber-500">{bikes.length}</div>
              <div className="text-sm text-gray-300">Total Bikes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-amber-500">3</div>
              <div className="text-sm text-gray-300">Brands</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-amber-500">100%</div>
              <div className="text-sm text-gray-300">Insured</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-amber-500">24/7</div>
              <div className="text-sm text-gray-300">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Introduction */}
          <div className="mb-16 grid md:grid-cols-2 gap-12 items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Handpicked for the Himalayas</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We don't just rent bikes; we provide adventure partners. Every motorcycle in our fleet is chosen for its ability to handle the extreme conditions of the Himalayas, from high-altitude passes to rough off-road trails.
              </p>
              <ul className="space-y-3">
                {[
                  "Fully serviced before every tour",
                  "Equipped with crash guards and luggage racks",
                  "Includes comprehensive insurance",
                  "Supported by expert mechanics on tour"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <Check size={14} />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-64 md:h-full min-h-[300px] rounded-2xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1558981285-6f0c94958bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Mechanic working" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white font-medium">Expertly maintained by our certified mechanics</p>
              </div>
            </div>
          </div>

          {/* Bikes Grid */}
          <div className="space-y-8">
            {bikes.map((bike, index) => (
              <div 
                key={bike.id} 
                className={`bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                {/* Image Side - Fixed Cropping Here */}
                <div className="w-full lg:w-3/5 relative h-64 lg:h-96 group overflow-hidden bg-gray-50 flex items-center justify-center p-6">
                  <img 
                    src={bike.image} 
                    alt={bike.name} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-gray-200">
                      {bike.brand}
                    </span>
                    {bike.featured && (
                      <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm flex items-center gap-1">
                        <Trophy size={14} /> Popular Choice
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    <span className="bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium">
                      {bike.category}
                    </span>
                    <span className="bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium">
                      {bike.year} Model
                    </span>
                  </div>
                </div>

                {/* Content Side */}
                <div className="w-full lg:w-2/5 p-8 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{bike.name}</h3>
                    <p className="text-gray-600 line-clamp-3 leading-relaxed">
                      {bike.description || "The perfect machine for Himalayan adventures. Powerful, reliable, and comfortable for long distances."}
                    </p>
                  </div>

                  {/* Specs Grid - Table Style */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Engine</span>
                        <span className="text-sm font-bold text-gray-900">{bike.engineCapacity}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Power</span>
                        <span className="text-sm font-bold text-gray-900">{bike.power}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Torque</span>
                        <span className="text-sm font-bold text-gray-900">{bike.torque}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Weight</span>
                        <span className="text-sm font-bold text-gray-900">{bike.weight}</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Seat Height</span>
                        <span className="text-sm font-bold text-gray-900">{bike.seatHeight}</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-xs text-gray-500 uppercase font-semibold">Speed</span>
                        <span className="text-sm font-bold text-gray-900">{bike.topSpeed}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {bike.idealFor.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Area */}
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Rental Price</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-amber-600">${bike.rentalPrice}</span>
                        <span className="text-gray-400 text-sm font-medium">/ day</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedBike(bike)}
                      className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      View Details <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Comparison Table */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Quick Comparison</h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-900 text-white">
                    <th className="py-4 px-6 text-left font-bold">Motorcycle</th>
                    <th className="py-4 px-6 text-center font-bold">Engine</th>
                    <th className="py-4 px-6 text-center font-bold">Power</th>
                    <th className="py-4 px-6 text-center font-bold">Torque</th>
                    <th className="py-4 px-6 text-center font-bold">Weight</th>
                    <th className="py-4 px-6 text-center font-bold">Seat Height</th>
                    <th className="py-4 px-6 text-center font-bold">Price/Day</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bikes.map((bike, index) => (
                    <tr 
                      key={bike.id} 
                      className={`hover:bg-amber-50/50 transition cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                      onClick={() => setSelectedBike(bike)}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img src={bike.image} alt="" className="w-12 h-12 rounded-lg object-contain bg-gray-100 p-1 border border-gray-200" />
                          <div>
                            <div className="font-bold text-gray-900">{bike.name}</div>
                            <div className="text-xs text-gray-500">{bike.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-medium text-gray-700">{bike.engineCapacity}</td>
                      <td className="py-4 px-6 text-center font-medium text-gray-700">{bike.power}</td>
                      <td className="py-4 px-6 text-center font-medium text-gray-700">{bike.torque}</td>
                      <td className="py-4 px-6 text-center font-medium text-gray-700">{bike.weight}</td>
                      <td className="py-4 px-6 text-center font-medium text-gray-700">{bike.seatHeight}</td>
                      <td className="py-4 px-6 text-center font-bold text-amber-600">${bike.rentalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to Start Your Adventure?</h2>
              <p className="text-xl text-amber-100 max-w-2xl mx-auto mb-8">
                Choose your ride and join us for the experience of a lifetime. We handle the logistics, you handle the throttle.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/tours" className="bg-white text-amber-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-lg flex items-center gap-2">
                  Browse Tours <ArrowRight size={20} />
                </Link>
                <Link to="/contact" className="bg-black/20 text-white border-2 border-white/30 px-8 py-4 rounded-full font-bold hover:bg-black/40 transition">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedBike && (
        <BikeDetailModal bike={selectedBike} onClose={() => setSelectedBike(null)} />
      )}
    </Layout>
  );
}
