import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, ChevronRight, Shield, Award, Compass, Play, ArrowRight, Mountain, Globe, Trophy, Clock, Edit, Settings, ChevronDown, MessageCircle, Send, X, Image, CloudSun } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Layout } from '../components/Layout';
import { SEOHead, organizationStructuredData } from '../components/SEOHead';
import { Tour, Destination } from '../types';

// ============================================
// WHATSAPP CHAT BUTTON (Point 14)
// ============================================
function WhatsAppButton() {
  const context = useApp();
  const phone = context?.siteSettings?.contact?.whatsapp || context?.siteSettings?.contact?.phone || '+977 1234567890';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  
  return (
    <a
      href={`https://wa.me/${cleanPhone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 animate-pulse"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}

// ============================================
// FAQ SECTION (Point 1)
// ============================================
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqs = [
    { q: "What experience level do I need for your tours?", a: "Our tours cater to various skill levels. Most tours require basic riding experience with a valid motorcycle license. We'll help match you with the right tour based on your experience level." },
    { q: "What's included in the tour price?", a: "Tours typically include motorcycle rental, accommodation, meals (as specified), professional guide, support vehicle, fuel, and all necessary permits. International flights and personal expenses are not included." },
    { q: "What motorcycles do you use?", a: "We use well-maintained Royal Enfield Himalayan, KTM Adventure, and BMW GS series motorcycles. All bikes are serviced before each tour and suited for mountain terrain." },
    { q: "Is it safe to ride in the Himalayas?", a: "Yes! Safety is our top priority. Our experienced guides know the routes intimately. We provide comprehensive safety briefings, quality riding gear, and have support vehicles accompanying all tours." },
    { q: "What should I bring on the tour?", a: "We provide riding gear including helmet, jacket, and gloves. You should bring personal clothing for varying weather, any medications, camera, and a sense of adventure! We'll send a detailed packing list upon booking." },
    { q: "Can I customize or extend my trip?", a: "Absolutely! We specialize in custom itineraries. We can arrange additional days, alternative routes, or even multi-country adventures. Contact us to discuss your dream trip." }
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600">Everything you need to know before your adventure</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown size={20} className={`text-amber-500 transition-transform flex-shrink-0 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 text-gray-600 border-t border-gray-100 pt-4">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TEAM SECTION (Point 2)
// ============================================
function TeamSection() {
  const team = [
    { name: "Raj Thapa", role: "Founder & Lead Guide", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face", bio: "15+ years of Himalayan riding experience" },
    { name: "Maya Sherpa", role: "Operations Manager", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face", bio: "Expert in tour logistics and customer care" },
    { name: "Karma Lama", role: "Senior Guide", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face", bio: "Mountain terrain specialist" },
    { name: "Dawa Tamang", role: "Chief Mechanic", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face", bio: "Keeps our fleet running perfectly" }
  ];
  
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold uppercase tracking-wider">Our Team</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Meet Your Expert Guides</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our passionate team of riders and adventurers are dedicated to giving you the experience of a lifetime</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <div key={i} className="text-center group">
              <div className="relative mb-6 overflow-hidden rounded-2xl aspect-square">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <p className="text-white text-sm px-4">{member.bio}</p>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-xl">{member.name}</h3>
              <p className="text-amber-600 font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PARTNERS SECTION (Point 3)
// ============================================
function PartnersSection() {
  const partners = [
    { name: 'Royal Enfield', logo: '🏍️' },
    { name: 'BMW Motorrad', logo: '🏍️' },
    { name: 'KTM', logo: '🏍️' },
    { name: 'Triumph', logo: '🏍️' },
    { name: 'REV\'IT!', logo: '🧥' },
    { name: 'Shoei Helmets', logo: '⛑️' }
  ];
  
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-amber-500 font-semibold uppercase tracking-wider">Trusted By The Best</span>
          <h3 className="text-2xl font-bold text-white mt-2">Our Partners & Sponsors</h3>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {partners.map((partner, i) => (
            <div key={i} className="flex items-center gap-3 text-gray-400 hover:text-white transition group cursor-pointer">
              <span className="text-4xl group-hover:scale-110 transition-transform">{partner.logo}</span>
              <span className="font-semibold text-lg">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// VIDEO GALLERY (Point 4)
// ============================================
function VideoGallery() {
  const videos = [
    { title: "Ladakh Adventure 2024", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop", duration: "4:32" },
    { title: "Nepal Himalayan Ride", thumbnail: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600&h=400&fit=crop", duration: "6:15" },
    { title: "Spiti Valley Journey", thumbnail: "https://images.unsplash.com/photo-1568772585407-9361bd37ec91?w=600&h=400&fit=crop", duration: "5:48" }
  ];
  
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-500 font-semibold uppercase tracking-wider">Watch & Explore</span>
          <h2 className="text-4xl font-bold text-white mt-2 mb-4">Video Gallery</h2>
          <p className="text-gray-400">Experience our adventures through the lens</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {videos.map((video, i) => (
            <div key={i} className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-xl">
              <img src={video.thumbnail} alt={video.title} className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="text-white fill-white ml-1" size={32} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white font-bold text-lg">{video.title}</h3>
                <span className="text-gray-300 text-sm">{video.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// INSTAGRAM FEED (Point 5)
// ============================================
function InstagramFeed() {
  const posts = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1568772585407-9361bd37ec91?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop"
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-amber-600 font-semibold uppercase tracking-wider">📸 Follow Our Journey</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">@nepalbiketours</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {posts.map((post, i) => (
            <a key={i} href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="aspect-square overflow-hidden group">
              <img src={post} alt={`Instagram post ${i+1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// BLOG PREVIEW (Point 6)
// ============================================
function BlogPreview() {
  const posts = [
    { title: "10 Essential Tips for Himalayan Motorcycle Tours", excerpt: "Everything you need to know before embarking on your first high-altitude adventure...", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop", date: "Dec 15, 2024", category: "Tips" },
    { title: "Best Time to Ride in Nepal", excerpt: "Seasonal guide to help you plan the perfect motorcycle tour in Nepal...", image: "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=600&h=400&fit=crop", date: "Dec 10, 2024", category: "Guide" },
    { title: "Gear Guide: What to Pack", excerpt: "Complete packing list for your Himalayan motorcycle adventure...", image: "https://images.unsplash.com/photo-1568772585407-9361bd37ec91?w=600&h=400&fit=crop", date: "Dec 5, 2024", category: "Gear" }
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-amber-600 font-semibold uppercase tracking-wider">From Our Blog</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Travel Tips & Stories</h2>
          </div>
          <Link to="/blog" className="mt-4 md:mt-0 inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700">
            View All Posts <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <article key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition group">
              <div className="relative h-48 overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">{post.category}</span>
              </div>
              <div className="p-6">
                <span className="text-gray-400 text-sm">{post.date}</span>
                <h3 className="font-bold text-gray-900 text-lg mt-2 mb-3 group-hover:text-amber-600 transition">{post.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                <Link to="/blog" className="inline-flex items-center gap-1 text-amber-600 font-semibold mt-4 text-sm hover:gap-2 transition-all">
                  Read More <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// PHOTO GALLERY (Point 7)
// ============================================
function PhotoGallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  
  const photos = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800",
    "https://images.unsplash.com/photo-1568772585407-9361bd37ec91?w=800",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800",
    "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800"
  ];
  
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold uppercase tracking-wider">Gallery</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Captured Moments</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo, i) => (
            <div 
              key={i} 
              className={`overflow-hidden rounded-xl cursor-pointer group ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              onClick={() => { setCurrentImage(i); setLightboxOpen(true); }}
            >
              <img src={photo} alt={`Gallery ${i+1}`} className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${i === 0 ? 'h-full' : 'aspect-square'}`} />
            </div>
          ))}
        </div>
        
        {/* Lightbox */}
        {lightboxOpen && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
            <button className="absolute top-4 right-4 text-white hover:text-amber-500" onClick={() => setLightboxOpen(false)}>
              <X size={32} />
            </button>
            <img src={photos[currentImage]} alt="Gallery" className="max-h-[90vh] max-w-[90vw] object-contain" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {photos.map((_, i) => (
                <button 
                  key={i} 
                  className={`w-2 h-2 rounded-full ${i === currentImage ? 'bg-amber-500' : 'bg-white/50'}`}
                  onClick={(e) => { e.stopPropagation(); setCurrentImage(i); }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================
// COUNTDOWN TIMER (Point 8)
// ============================================
function CountdownSection({ tours }: { tours: Tour[] }) {
  const nextTour = tours.find(t => t.nextDeparture && new Date(t.nextDeparture) > new Date());
  if (!nextTour) return null;
  
  const targetDate = new Date(nextTour.nextDeparture!);
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return (
    <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-500">
      <div className="max-w-4xl mx-auto px-4 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">⏰ Next Adventure Begins In:</h2>
        <div className="flex justify-center gap-4 md:gap-8 my-8">
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
            <div className="text-4xl md:text-5xl font-bold">{days}</div>
            <div className="text-sm opacity-80">Days</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
            <div className="text-4xl md:text-5xl font-bold">{hours}</div>
            <div className="text-sm opacity-80">Hours</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
            <div className="text-4xl md:text-5xl font-bold">{minutes}</div>
            <div className="text-sm opacity-80">Minutes</div>
          </div>
        </div>
        <h3 className="text-xl md:text-2xl font-semibold mb-6">{nextTour.title}</h3>
        <Link to={`/tours/${nextTour.slug}`} className="inline-flex items-center gap-2 bg-white text-amber-600 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
          Book Your Spot Now <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
}

// ============================================
// ROUTE MAP (Point 9)
// ============================================
function RouteMapSection() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold uppercase tracking-wider">Our Routes</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Explore Our Tour Routes</h2>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="aspect-video bg-gray-200 flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin size={64} className="text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive Route Map</h3>
              <p className="text-gray-600 mb-4">Explore all our tour routes across the Himalayas</p>
              <Link to="/tours" className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-600 transition">
                View All Tours <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// AWARDS SECTION (Point 10)
// ============================================
function AwardsSection() {
  const awards = [
    { title: "Best Adventure Tour Operator", org: "Nepal Tourism Board", year: "2023" },
    { title: "Excellence in Safety", org: "Adventure Travel Association", year: "2023" },
    { title: "Travelers' Choice Award", org: "TripAdvisor", year: "2024" },
    { title: "Eco-Friendly Operator", org: "Green Travel Council", year: "2022" }
  ];
  
  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-amber-500 font-semibold uppercase tracking-wider">Recognized Excellence</span>
          <h2 className="text-3xl font-bold text-white mt-2">Awards & Certifications</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {awards.map((award, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-2xl text-center hover:bg-gray-700 transition group">
              <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-white text-sm md:text-base">{award.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{award.org}</p>
              <p className="text-amber-500 font-bold mt-2">{award.year}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// TOUR COMPARISON (Point 11)
// ============================================
function TourComparison({ tours }: { tours: Tour[] }) {
  const compareTours = tours.slice(0, 3);
  if (compareTours.length < 2) return null;
  
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold uppercase tracking-wider">Compare Tours</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Find Your Perfect Adventure</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-500">Feature</th>
                {compareTours.map(tour => (
                  <th key={tour.id} className="text-center py-4 px-4">
                    <div className="font-bold text-gray-900">{tour.title}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-600">Duration</td>
                {compareTours.map(tour => (
                  <td key={tour.id} className="text-center py-4 px-4 font-semibold">{tour.duration}</td>
                ))}
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="py-4 px-4 text-gray-600">Distance</td>
                {compareTours.map(tour => (
                  <td key={tour.id} className="text-center py-4 px-4 font-semibold">{tour.distance}</td>
                ))}
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-600">Difficulty</td>
                {compareTours.map(tour => (
                  <td key={tour.id} className="text-center py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      tour.difficulty === 'Expert' ? 'bg-red-100 text-red-600' :
                      tour.difficulty === 'Challenging' ? 'bg-orange-100 text-orange-600' :
                      'bg-green-100 text-green-600'
                    }`}>{tour.difficulty}</span>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="py-4 px-4 text-gray-600">Price</td>
                {compareTours.map(tour => (
                  <td key={tour.id} className="text-center py-4 px-4">
                    <span className="text-2xl font-bold text-amber-600">${tour.price?.toLocaleString()}</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-4 px-4"></td>
                {compareTours.map(tour => (
                  <td key={tour.id} className="text-center py-4 px-4">
                    <Link to={`/tours/${tour.slug}`} className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-amber-600 transition text-sm">
                      View Tour <ArrowRight size={16} />
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ============================================
// REVIEWS SECTION (Point 12)
// ============================================
function ReviewsSection() {
  const reviews = [
    { name: "John Smith", country: "USA", rating: 5, text: "Absolutely incredible experience! The guides were professional, the bikes were perfect, and the scenery was breathtaking. Can't wait to come back!", tour: "Ladakh Adventure" },
    { name: "Emma Wilson", country: "UK", rating: 5, text: "This was the trip of a lifetime. Every detail was perfectly planned. The team went above and beyond to make sure we had an amazing time.", tour: "Nepal Himalayan" },
    { name: "Hans Mueller", country: "Germany", rating: 5, text: "Professional organization, excellent bikes, and stunning routes. The support team was always there when needed. Highly recommended!", tour: "Spiti Valley" },
    { name: "Sophie Martin", country: "France", rating: 5, text: "An unforgettable adventure through the most beautiful landscapes. The local guides' knowledge and hospitality made it extra special.", tour: "Upper Mustang" }
  ];
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-amber-600 font-semibold uppercase tracking-wider">Testimonials</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">What Our Riders Say</h2>
          <div className="flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={24} className="fill-amber-500 text-amber-500" />)}
            <span className="text-gray-600 ml-2">4.9/5 from 500+ reviews</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={16} className="fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic line-clamp-4">"{review.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-600 font-bold">{review.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.country} • {review.tour}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// NEWSLETTER (Point 13)
// ============================================
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };
  
  return (
    <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-500">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">🎉 Get 10% Off Your First Tour!</h2>
        <p className="text-amber-100 text-lg mb-8">Subscribe to our newsletter for exclusive deals, travel tips, and adventure stories.</p>
        {subscribed ? (
          <div className="bg-white/20 backdrop-blur rounded-2xl p-8 inline-block">
            <p className="text-white text-2xl font-bold">🎉 Thanks for subscribing!</p>
            <p className="text-amber-100 mt-2">Check your email for your discount code.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:ring-4 focus:ring-white/30 outline-none"
              required
            />
            <button type="submit" className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-lg">
              Subscribe <Send size={18} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ============================================
// WEATHER WIDGET (Point 15)
// ============================================
function WeatherWidget() {
  const destinations = [
    { name: "Kathmandu", temp: "22°C", condition: "Sunny", icon: "☀️" },
    { name: "Ladakh", temp: "15°C", condition: "Clear", icon: "🌤️" },
    { name: "Manali", temp: "18°C", condition: "Cloudy", icon: "⛅" }
  ];
  
  return (
    <section className="py-12 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <CloudSun className="text-blue-500" size={32} />
            <div>
              <h3 className="font-bold text-gray-900">Current Weather</h3>
              <p className="text-gray-600 text-sm">At our popular destinations</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {destinations.map((dest, i) => (
              <div key={i} className="bg-white px-6 py-3 rounded-xl shadow-sm flex items-center gap-4">
                <span className="text-3xl">{dest.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900">{dest.name}</p>
                  <p className="text-sm text-gray-500">{dest.temp} • {dest.condition}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// EXISTING COMPONENTS (Keep these as is)
// ============================================

function TourCard({ tour }: { tour: Tour }) {
  if (!tour) return null;
  const countries = tour?.countries || [];
  const duration = tour?.duration || '';
  const groupSize = tour?.groupSize || '';
  const price = tour?.price || 0;
  
  return (
    <Link to={`/tours/${tour?.slug || ''}`} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden">
        <img src={tour?.heroImage || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'} alt={tour?.title || 'Tour'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tour?.difficulty === 'Expert' ? 'bg-red-500' : tour?.difficulty === 'Challenging' ? 'bg-orange-500' : tour?.difficulty === 'Moderate' ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>{tour?.difficulty || 'Moderate'}</span>
          {tour?.featured && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white">Featured</span>}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-bold mb-1">{tour?.title || 'Tour'}</h3>
          <p className="text-gray-300 text-sm">{countries.join(' • ')}</p>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour?.shortDescription || ''}</p>
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1 text-gray-500"><Calendar size={16} className="text-amber-500" /><span>{duration.split('/')[0] || 'N/A'}</span></div>
          <div className="flex items-center gap-1 text-gray-500"><MapPin size={16} className="text-amber-500" /><span>{tour?.distance || 'N/A'}</span></div>
          <div className="flex items-center gap-1 text-gray-500"><Users size={16} className="text-amber-500" /><span>{groupSize.split(' ')[0] || 'N/A'}</span></div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-gray-400 text-sm">From</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">${price.toLocaleString()}</span>
              {tour?.originalPrice && <span className="text-sm text-gray-400 line-through">${tour.originalPrice.toLocaleString()}</span>}
            </div>
          </div>
          <span className="flex items-center gap-1 text-amber-600 font-semibold group-hover:gap-2 transition-all">View Details <ChevronRight size={18} /></span>
        </div>
      </div>
    </Link>
  );
}

function DestinationCard({ destination }: { destination: Destination }) {
  if (!destination) return null;
  const terrain = destination?.terrain || [];
  
  return (
    <Link to={`/destinations/${destination?.slug || ''}`} className="group relative overflow-hidden rounded-2xl h-80">
      <img src={destination?.heroImage || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'} alt={destination?.name || 'Destination'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider mb-1">{destination?.country || ''}</span>
        <h3 className="text-white text-2xl font-bold mb-2 group-hover:text-amber-400 transition-colors">{destination?.name || ''}</h3>
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{destination?.tagline || ''}</p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Mountain size={14} /> {destination?.difficulty || 'Moderate'}</span>
          <span className="flex items-center gap-1"><Globe size={14} /> {terrain.slice(0, 2).join(', ') || 'Various'}</span>
        </div>
        <div className="mt-4 flex items-center gap-2 text-amber-500 font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all">Explore Destination <ArrowRight size={18} /></div>
      </div>
    </Link>
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
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {availableBikes.map(bike => (
            <div key={bike.id} className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
              <div className="relative h-48 overflow-hidden">
                <img src={bike.image} alt={bike.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">{bike.category}</span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg">{bike.name}</h3>
                <p className="text-gray-500 text-sm">{bike.brand} • {bike.engineCapacity}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                  <p className="text-amber-600 font-bold">${bike.rentalPrice}/day</p>
                  <span className="text-green-600 text-sm font-semibold">✓ Available</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// MAIN HOME COMPONENT
// ============================================
export function Home() {
  const appContext = useApp();
  
  if (!appContext) {
    return <Layout><div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div></div></Layout>;
  }
  
  const { tours = [], destinations = [], siteSettings } = appContext;
  const featuredTours = tours.filter(t => t.featured && t.status === 'published');
  const allPublishedTours = tours.filter(t => t.status === 'published');
  const publishedDestinations = destinations.filter(d => d.status === 'published');
  
  const homepage = {
    hero: {
      title: 'Ride the Himalayas',
      subtitle: 'Experience the adventure of a lifetime on two wheels',
      backgroundImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920',
      overlayOpacity: 60,
      ctaText: 'Explore Tours',
      ctaLink: '/tours',
      ...siteSettings?.homepage?.hero
    }
  };

  const displayTours = featuredTours.length > 0 ? featuredTours.slice(0, 6) : allPublishedTours.slice(0, 6);

  return (
    <Layout>
      <SEOHead
        title={siteSettings?.seo?.siteTitle || 'Nepal Bike Tours - Premium Motorcycle Adventures'}
        description={siteSettings?.seo?.siteDescription || 'Experience the thrill of motorcycle touring through the Himalayas'}
        keywords={siteSettings?.seo?.keywords || []}
        structuredData={organizationStructuredData}
      />
      
      {/* HERO SECTION */}
      <section className="relative h-[90vh] -mt-28 flex items-center">
        <div className="absolute inset-0">
          <img src={homepage.hero.backgroundImage} alt="Motorcycle adventure" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" style={{ opacity: homepage.hero.overlayOpacity / 100 }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 pt-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-6">Premium Motorcycle Tours Since 2015</span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">Ride the <span className="text-amber-500">Himalayas</span></h1>
            <p className="text-xl text-gray-300 mb-8">{homepage.hero.subtitle}</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/tours" className="bg-amber-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-700 transition text-lg flex items-center gap-2">Explore Tours <ChevronRight /></Link>
              <Link to="/about" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition text-lg">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-amber-600 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div><div className="text-4xl font-bold mb-1">500+</div><div className="text-amber-200">Happy Riders</div></div>
            <div><div className="text-4xl font-bold mb-1">50+</div><div className="text-amber-200">Tours Completed</div></div>
            <div><div className="text-4xl font-bold mb-1">10+</div><div className="text-amber-200">Years Experience</div></div>
            <div><div className="text-4xl font-bold mb-1">100%</div><div className="text-amber-200">Safety Record</div></div>
          </div>
        </div>
      </section>

      {/* NEW SECTIONS - ALL 15 */}
      <CountdownSection tours={allPublishedTours} />
      
      {/* DESTINATIONS */}
      {publishedDestinations.length > 0 && (
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-amber-500 font-semibold">EXPLORE</span>
              <h2 className="text-4xl font-bold text-white mt-2 mb-4">Popular Destinations</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {publishedDestinations.slice(0, 4).map(destination => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          </div>
        </section>
      )}

      <TourComparison tours={allPublishedTours} />

      {/* FEATURED TOURS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold">OUR ADVENTURES</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Featured Tours</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTours.map(tour => <TourCard key={tour.id} tour={tour} />)}
          </div>
          <div className="text-center mt-12">
            <Link to="/tours" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition">View All Tours <ChevronRight /></Link>
          </div>
        </div>
      </section>

      <VideoGallery />
      <PhotoGallery />
      <TeamSection />
      <FAQSection />
      <ReviewsSection />
      <AwardsSection />
      <BlogPreview />
      <InstagramFeed />
      <PartnersSection />
      <NewsletterSection />
      <WeatherWidget />
      <RouteMapSection />
      <BikesSection />

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready for Your Adventure?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of riders who have experienced the thrill of Himalayan motorcycle touring.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/tours" className="bg-amber-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-amber-700 transition text-lg">Browse Tours</Link>
            <Link to="/contact" className="border-2 border-amber-600 text-amber-500 px-8 py-4 rounded-full font-semibold hover:bg-amber-600 hover:text-white transition text-lg">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* WHATSAPP BUTTON */}
      <WhatsAppButton />
    </Layout>
  );
}
