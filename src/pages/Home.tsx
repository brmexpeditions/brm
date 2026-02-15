import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Star, ChevronRight, Play, ArrowRight, Mountain, Trophy, Clock, MessageCircle, Send, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Layout } from '../components/Layout';
import { SEOHead } from '../components/SEOHead';
import { Tour, Destination } from '../types';

// --- NEW COMPONENTS START ---

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: "Experience needed?", a: "Valid license and basic riding skills required." },
    { q: "What's included?", a: "Bike, fuel, guide, mechanic, hotels, and meals." },
    { q: "Is it safe?", a: "Yes, we have support vehicles and expert guides." }
  ];
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
              <h3 className="font-bold flex justify-between">{f.q} <span>{open === i ? '-' : '+'}</span></h3>
              {open === i && <p className="mt-4 text-gray-600">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-12">Our Team</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="group">
              <div className="aspect-square bg-gray-200 rounded-2xl mb-4 overflow-hidden">
                <img src={`https://source.unsplash.com/random/400x400?portrait&sig=${i}`} alt="Team" className="w-full h-full object-cover group-hover:scale-110 transition" />
              </div>
              <h3 className="font-bold text-xl">Guide Name</h3>
              <p className="text-amber-600">Senior Road Captain</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatsAppButton() {
  return (
    <a href="https://wa.me/9779800000000" target="_blank" className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition animate-pulse">
      <MessageCircle size={28} />
    </a>
  );
}

// --- NEW COMPONENTS END ---

function TourCard({ tour }: { tour: Tour }) {
  if (!tour) return null;
  return (
    <Link to={`/tours/${tour.slug}`} className="group block bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-2 transition">
      <div className="h-64 overflow-hidden">
        <img src={tour.heroImage} className="w-full h-full object-cover group-hover:scale-110 transition" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{tour.title}</h3>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{tour.duration}</span>
          <span>{tour.difficulty}</span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-amber-600 font-bold text-xl">${tour.price}</span>
          <span className="text-gray-900 font-medium group-hover:text-amber-600">View Tour →</span>
        </div>
      </div>
    </Link>
  );
}

export function Home() {
  const { tours, siteSettings } = useApp();
  const featured = tours.filter(t => t.featured).slice(0, 3);
  const homepage = siteSettings?.homepage?.hero || {};

  return (
    <Layout>
      <SEOHead title="Home" description="Welcome" />
      
      {/* HERO */}
      <section className="h-[80vh] relative flex items-center justify-center text-white text-center">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img src={homepage.backgroundImage || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64"} className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">{homepage.title || "Ride the Himalayas"}</h1>
          <p className="text-xl mb-8">{homepage.subtitle || "Premium Motorcycle Adventures"}</p>
          <Link to="/tours" className="bg-amber-500 text-white px-8 py-4 rounded-full font-bold hover:bg-amber-600 transition">Explore Tours</Link>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Adventures</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featured.map(tour => <TourCard key={tour.id} tour={tour} />)}
          </div>
        </div>
      </section>

      {/* NEW SECTIONS */}
      <TeamSection />
      <FAQSection />
      <WhatsAppButton />
      
    </Layout>
  );
}
