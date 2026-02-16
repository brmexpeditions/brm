import { Link } from 'react-router-dom';
import { ChevronRight, Play, Check, Quote, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Layout } from '../components/Layout';
import { SEOHead } from '../components/SEOHead';
import { useState } from 'react';

export function About() {
  const [showVideo, setShowVideo] = useState(false);

  const stats = [
    { value: '9+', label: 'Years Experience' },
    { value: '500+', label: 'Happy Riders' },
    { value: '50+', label: 'Tours Completed' },
    { value: '100K+', label: 'Kilometers Covered' },
  ];

  const team = [
    {
      name: 'Raj Sharma',
      role: 'Founder & Lead Guide',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'With over 15 years of riding experience across 20+ countries, Raj founded BRM to share his passion for motorcycle adventures.',
      social: { instagram: '#', facebook: '#' }
    },
    {
      name: 'Vikram Singh',
      role: 'Senior Tour Leader',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      bio: 'A certified motorcycle instructor with extensive knowledge of Himalayan routes and local cultures.',
      social: { instagram: '#', facebook: '#' }
    },
    {
      name: 'Priya Patel',
      role: 'Operations Manager',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      bio: 'Priya ensures every tour runs smoothly, from logistics to customer satisfaction.',
      social: { instagram: '#', facebook: '#' }
    },
    {
      name: 'Amit Kumar',
      role: 'Head Mechanic',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'Expert mechanic specializing in Royal Enfield and adventure bikes with 12 years of experience.',
      social: { instagram: '#', facebook: '#' }
    },
  ];

  const milestones = [
    { year: '2015', title: 'The Beginning', description: 'BRM Expeditions was founded with just 2 bikes and a dream.' },
    { year: '2017', title: 'Expansion', description: 'Fleet expanded to 15 bikes. Launched Ladakh and Spiti tours.' },
    { year: '2019', title: 'Recognition', description: 'Awarded "Best Motorcycle Tour Operator" by India Tourism.' },
    { year: '2021', title: 'Growth', description: 'Reached 300+ happy customers. Introduced international tours.' },
    { year: '2023', title: 'Today', description: 'Leading operator with 30+ bikes and tours across 5 countries.' },
  ];

  const testimonials = [
    {
      name: 'Michael Thompson',
      country: 'United Kingdom',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      text: 'The Ladakh tour was life-changing. The team took care of everything perfectly. Highly recommend BRM!',
      rating: 5,
      tour: 'Ladakh Adventure'
    },
    {
      name: 'Sarah Mueller',
      country: 'Germany',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      text: 'Professional, friendly, and incredibly knowledgeable. The best motorcycle tour experience ever.',
      rating: 5,
      tour: 'Spiti Valley'
    },
    {
      name: 'David Chen',
      country: 'Australia',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      text: 'From the bikes to the accommodation, everything was top notch. Already planning my next trip!',
      rating: 5,
      tour: 'Rajasthan Royale'
    },
  ];

  return (
    <Layout>
      <SEOHead
        title="About Us | BRM Expeditions - Premium Motorcycle Tours"
        description="Learn about BRM Expeditions - crafting unforgettable motorcycle adventures through India's most breathtaking landscapes since 2015."
        keywords={['about BRM Expeditions', 'motorcycle tour company', 'India adventure tours']}
      />

      {/* Hero Section - Split Design */}
      <section className="relative h-[90vh] -mt-28 flex items-center overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop"
            alt="About BRM Expeditions"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/90 to-amber-900/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-28 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">Since 2015</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1]">
                About<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">BRM Expeditions</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                Crafting unforgettable motorcycle adventures through the world's most spectacular landscapes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/tours"
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                >
                  Explore Tours
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => setShowVideo(true)}
                  className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-6 py-4 rounded-full font-semibold hover:bg-white/20 transition border border-white/20"
                >
                  <span className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Play size={14} className="text-gray-900 ml-0.5" fill="currentColor" />
                  </span>
                  Watch Story
                </button>
              </div>
            </div>

            {/* Right Stats Cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition ${i === 0 ? 'translate-y-8' : i === 3 ? 'translate-y-8' : ''}`}
                >
                  <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-amber-600">Home</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">About Us</span>
          </div>
        </div>
      </div>

      {/* Our Story Section - Magazine Style */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left - Large Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop"
                  alt="BRM Expeditions"
                  className="rounded-2xl shadow-2xl w-full aspect-[3/4] object-cover"
                />
                {/* Floating Card */}
                <div className="absolute -bottom-8 -right-8 bg-white rounded-xl shadow-xl p-6 max-w-[200px]">
                  <div className="text-5xl font-bold text-gray-900">9<span className="text-amber-500">+</span></div>
                  <div className="text-gray-500 text-sm mt-1">Years crafting unforgettable adventures</div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="lg:col-span-7">
              <span className="inline-block bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">Our Story</span>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Born from a Passion for<br />Riding & Adventure
              </h2>

              <div className="prose prose-lg text-gray-600 mb-8">
                <p className="leading-relaxed">
                  BRM Expeditions was founded in 2015 by a group of passionate motorcyclists who shared a common dream – to help riders from around the world experience the magic of India's incredible landscapes.
                </p>
                <p className="leading-relaxed">
                  What started as a small operation with just two bikes has grown into one of India's premier motorcycle tour operators. Today, we operate tours across India, Nepal, Bhutan, and beyond.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: '✓', text: 'Licensed & Insured' },
                  { icon: '✓', text: 'Expert Guides' },
                  { icon: '✓', text: 'Quality Bikes' },
                  { icon: '✓', text: 'Small Groups' },
                  { icon: '✓', text: '24/7 Support' },
                  { icon: '✓', text: 'Fair Pricing' }
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                      <Check size={12} />
                    </span>
                    <span className="text-gray-700 text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Founder */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                  alt="Raj Sharma"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="font-bold text-gray-900">Raj Sharma</div>
                  <div className="text-gray-500 text-sm">Founder & CEO</div>
                </div>
                <Link to="/contact" className="text-amber-600 font-medium text-sm hover:text-amber-700">
                  Contact →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Clean Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">Our Purpose</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Mission & Vision
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="group bg-white rounded-2xl p-10 border border-gray-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              {/* Background Icon */}
              <div className="absolute -top-10 -right-10 text-[150px] opacity-5 group-hover:opacity-10 transition-opacity">
                🎯
              </div>

              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To provide world-class motorcycle touring experiences that are safe, authentic, and unforgettable. We aim to create journeys that go beyond ordinary travel, connecting riders with incredible landscapes, cultures, and fellow adventurers.
                </p>

                {/* Key Points */}
                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                  {['Safety First', 'Authentic', 'Unforgettable'].map((point, i) => (
                    <span key={i} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="group bg-gray-900 rounded-2xl p-10 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              {/* Background Icon */}
              <div className="absolute -top-10 -right-10 text-[150px] opacity-5 group-hover:opacity-10 transition-opacity">
                👁️
              </div>

              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">👁️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Our Vision</h3>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To be the most trusted and recommended motorcycle tour operator in Asia, known for exceptional service, sustainable tourism practices, and creating life-changing adventures for riders from around the world.
                </p>

                {/* Key Points */}
                <div className="mt-6 pt-6 border-t border-gray-700 flex flex-wrap gap-2">
                  {['Trusted', 'Sustainable', 'Life-changing'].map((point, i) => (
                    <span key={i} className="bg-white/10 text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Professional Icons with Colors */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-full mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Why Riders Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Sets Us Apart
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Six reasons why thousands of riders trust BRM Expeditions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                ),
                color: 'emerald',
                bgLight: 'bg-emerald-50',
                bgIcon: 'bg-emerald-500',
                borderHover: 'hover:border-emerald-300',
                textHover: 'group-hover:text-emerald-600',
                title: 'Expert Local Guides',
                desc: 'Our guides have decades of combined experience navigating the most challenging and beautiful routes across the region.'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                ),
                color: 'blue',
                bgLight: 'bg-blue-50',
                bgIcon: 'bg-blue-500',
                borderHover: 'hover:border-blue-300',
                textHover: 'group-hover:text-blue-600',
                title: 'Premium Motorcycles',
                desc: 'We maintain a fleet of late-model adventure and touring bikes, fully serviced and ready for any terrain you encounter.'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                ),
                color: 'violet',
                bgLight: 'bg-violet-50',
                bgIcon: 'bg-violet-500',
                borderHover: 'hover:border-violet-300',
                textHover: 'group-hover:text-violet-600',
                title: 'Small Group Sizes',
                desc: 'Maximum 12 riders per tour ensures personalized attention, authentic experiences, and lasting friendships.'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                ),
                color: 'amber',
                bgLight: 'bg-amber-50',
                bgIcon: 'bg-amber-500',
                borderHover: 'hover:border-amber-300',
                textHover: 'group-hover:text-amber-600',
                title: 'Authentic Experiences',
                desc: 'We take you beyond tourist spots to discover hidden gems, local cultures, and unforgettable encounters.'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
                color: 'rose',
                bgLight: 'bg-rose-50',
                bgIcon: 'bg-rose-500',
                borderHover: 'hover:border-rose-300',
                textHover: 'group-hover:text-rose-600',
                title: '24/7 Safety Support',
                desc: 'Full backup vehicle support, emergency assistance, and comprehensive insurance throughout your journey.'
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                ),
                color: 'teal',
                bgLight: 'bg-teal-50',
                bgIcon: 'bg-teal-500',
                borderHover: 'hover:border-teal-300',
                textHover: 'group-hover:text-teal-600',
                title: 'Best Value Guarantee',
                desc: 'Premium experiences at competitive prices with transparent pricing. No hidden costs or last-minute surprises.'
              }
            ].map((item, i) => (
              <div
                key={i}
                className={`group relative bg-white rounded-2xl p-8 border-2 border-gray-100 ${item.borderHover} shadow-sm hover:shadow-xl transition-all duration-300`}
              >
                {/* Colored Top Border on Hover */}
                <div className={`absolute top-0 left-6 right-6 h-1 ${item.bgIcon} rounded-b-full opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>

                {/* Icon Container */}
                <div className={`w-16 h-16 ${item.bgIcon} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {item.icon}
                </div>

                {/* Content */}
                <h3 className={`text-xl font-bold text-gray-900 mb-3 ${item.textHover} transition-colors`}>
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  {item.desc}
                </p>

                {/* Learn More Link */}
                <div className="pt-4 border-t border-gray-100">
                  <button className={`inline-flex items-center gap-2 text-sm font-semibold text-gray-400 ${item.textHover} transition-colors`}>
                    Learn more
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Stats Bar */}
          <div className="mt-20 bg-gray-900 rounded-3xl p-10 md:p-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '9+', label: 'Years Experience', color: 'text-emerald-400' },
                { value: '2,500+', label: 'Happy Riders', color: 'text-blue-400' },
                { value: '150+', label: 'Tours Completed', color: 'text-violet-400' },
                { value: '98%', label: 'Satisfaction Rate', color: 'text-amber-400' }
              ].map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline / Milestones - Original Alternating Style */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 text-amber-600 mb-4">
              <span className="w-12 h-1 bg-amber-600 rounded"></span>
              <span className="text-sm font-bold uppercase tracking-wider">Our Journey</span>
              <span className="w-12 h-1 bg-amber-600 rounded"></span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Milestones Along the Way
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">From humble beginnings to becoming a trusted name in motorcycle adventures</p>
          </div>

          {/* Vertical Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-amber-200 hidden md:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, i) => (
                <div key={i} className={`flex items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition">
                      <div className={`inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold mb-3 ${i % 2 === 0 ? 'md:float-right md:ml-4' : ''}`}>
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-amber-500 rounded-full border-4 border-white shadow"></div>

                  {/* Empty Space */}
                  <div className="hidden md:block w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Modern Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
            <div>
              <span className="inline-block bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">Our Team</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Meet the Crew
              </h2>
            </div>
            <p className="text-gray-500 max-w-md mt-4 lg:mt-0 lg:text-right">
              The passionate riders and experts behind every unforgettable adventure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="group">
                <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full aspect-[4/5] object-cover group-hover:scale-110 transition duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-80"></div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                      <a href={member.social.instagram} className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-amber-500 transition">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                      </a>
                      <a href={member.social.facebook} className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-amber-500 transition">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                      </a>
                    </div>
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-amber-400 text-sm font-medium">{member.role}</p>
                  </div>
                </div>

                {/* Bio Card */}
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Dark Theme */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="diag" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 0 10 L 10 0" stroke="white" strokeWidth="0.5" fill="none" />
            </pattern>
            <rect width="100" height="100" fill="url(#diag)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Quote size={20} className="text-white" />
                </div>
                <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">Testimonials</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Rider Stories
              </h2>
            </div>
            <div className="flex gap-1 mt-6 md:mt-0">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-gray-400 ml-2">500+ Reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.text}"</p>

                {/* Tour Badge */}
                <div className="inline-block bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-medium mb-6">
                  {testimonial.tour}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-700/50">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-500/30"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Bar - Minimal */}
      <section className="py-12 bg-gray-100 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <MapPin className="text-amber-500 mx-auto md:mx-0 mb-2" size={20} />
              <h4 className="text-gray-900 font-semibold text-sm">Office</h4>
              <p className="text-gray-500 text-sm">Manali, India</p>
            </div>
            <div className="text-center md:text-left">
              <Phone className="text-amber-500 mx-auto md:mx-0 mb-2" size={20} />
              <h4 className="text-gray-900 font-semibold text-sm">Phone</h4>
              <p className="text-gray-500 text-sm">+91 98765 43210</p>
            </div>
            <div className="text-center md:text-left">
              <Mail className="text-amber-500 mx-auto md:mx-0 mb-2" size={20} />
              <h4 className="text-gray-900 font-semibold text-sm">Email</h4>
              <p className="text-gray-500 text-sm">info@brmexpeditions.com</p>
            </div>
            <div className="text-center md:text-left">
              <Clock className="text-amber-500 mx-auto md:mx-0 mb-2" size={20} />
              <h4 className="text-gray-900 font-semibold text-sm">Hours</h4>
              <p className="text-gray-500 text-sm">Mon - Sat: 9AM - 6PM</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Modern Split Design */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative bg-gray-900 rounded-3xl overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=600&fit=crop"
                alt=""
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/80"></div>
            </div>

            <div className="relative grid lg:grid-cols-2 gap-12 p-12 lg:p-16">
              {/* Left Content */}
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Ready to Start Your<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Next Adventure?</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  Join thousands of riders who have experienced the thrill of exploring with BRM Expeditions. Your journey begins with a single step.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/tours"
                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-bold hover:shadow-lg hover:shadow-amber-500/30 transition-all text-lg"
                  >
                    Browse Tours
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition text-lg border border-white/20"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Right - Quick Contact */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-white font-bold text-xl mb-6">Quick Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Phone className="text-amber-400" size={20} />
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Call Us</div>
                      <div className="text-white font-semibold">+91 98765 43210</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Mail className="text-amber-400" size={20} />
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Email</div>
                      <div className="text-white font-semibold">info@brmexpeditions.com</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <MapPin className="text-amber-400" size={20} />
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Office</div>
                      <div className="text-white font-semibold">Manali, India</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition z-10"
            >
              ✕
            </button>
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <Play size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg opacity-50">Video player placeholder</p>
                <p className="text-sm opacity-30">Add your YouTube/Vimeo embed here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
