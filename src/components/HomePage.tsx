import { useState, useEffect } from 'react';

interface HomePageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onAdminAccess?: () => void;
  siteSettings?: any;
}

export function HomePage({ onGetStarted, onLogin, onAdminAccess: _onAdminAccess, siteSettings: _siteSettings }: HomePageProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['home', 'features', 'how-it-works', 'pricing', 'reviews', 'contact'];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  const features = [
    {
      icon: '🏍️',
      title: 'Multi-Vehicle Support',
      description: 'Manage bikes, cars, trucks - all vehicle types in one place',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      image: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=400&q=80'
    },
    {
      icon: '🔔',
      title: 'Smart Reminders',
      description: 'Never miss insurance, PUC, or service deadlines again',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      image: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&q=80'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track expenses, service history, and fleet health',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-500/10',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80'
    },
    {
      icon: '📄',
      title: 'Document Vault',
      description: 'Store and access all vehicle documents digitally',
      color: 'from-rose-500 to-red-500',
      bgColor: 'bg-rose-500/10',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80'
    },
    {
      icon: '🔧',
      title: 'Service Tracking',
      description: 'Complete maintenance history at your fingertips',
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-500/10',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&q=80'
    },
    {
      icon: '📱',
      title: 'Works Everywhere',
      description: 'Access from phone, tablet, or computer - anytime',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-500/10',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80'
    },
  ];

  const reviews = [
    {
      name: 'Rajesh Kumar',
      role: 'Fleet Owner',
      company: 'Kumar Transport Services',
      location: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
      text: 'Fleet Guard has transformed how we manage our 50+ vehicle fleet. The reminders have saved us from countless penalty situations!',
      rating: 5,
    },
    {
      name: 'Priya Sharma',
      role: 'Operations Manager',
      company: 'Swift Bike Rentals',
      location: 'Bangalore',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
      text: 'Managing 30 rental bikes was a nightmare before Fleet Guard. Now everything is organized and automated. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Amit Patel',
      role: 'Business Owner',
      company: 'Patel Logistics',
      location: 'Delhi',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80',
      text: 'The analytics feature helps us understand our fleet costs better. We saved ₹2 lakhs in the first year by optimizing maintenance schedules.',
      rating: 5,
    },
    {
      name: 'Sneha Reddy',
      role: 'Founder',
      company: 'EcoRide Rentals',
      location: 'Hyderabad',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
      text: 'As a startup, we needed something simple yet powerful. Fleet Guard is exactly that. The free tier is perfect for small fleets!',
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: 'How does Fleet Guard help manage my vehicles?',
      answer: 'Fleet Guard provides a centralized dashboard to track all your vehicles, their documents, service history, and upcoming renewals. You get smart reminders before any document expires or service is due.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely! We use industry-standard encryption and your data is stored securely. You can also export backups anytime for extra peace of mind.',
    },
    {
      question: 'Can I try before I pay?',
      answer: 'Yes! Our Starter plan is completely free for up to 5 vehicles. No credit card required. You can upgrade anytime as your fleet grows.',
    },
    {
      question: 'Does it work for both personal and commercial vehicles?',
      answer: 'Yes! Fleet Guard supports both private and commercial vehicles with different document tracking requirements for each type.',
    },
    {
      question: 'Can I import my existing vehicle data?',
      answer: 'Absolutely! We provide an Excel template that you can fill with your vehicle data and import in bulk. No need to enter everything manually.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Sticky Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-amber-500/10 border-b border-amber-500/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span className="text-xl sm:text-2xl">🛡️</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Fleet Guard
                </span>
                <p className="text-[10px] text-gray-400 -mt-1 hidden sm:block">Protect Your Fleet</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeSection === link.id
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={onLogin}
                className="px-5 py-2.5 text-sm font-semibold text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/5 rounded-xl"
              >
                Login
              </button>
              <button
                onClick={onGetStarted}
                className="px-6 py-2.5 text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 rounded-xl hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300"
              >
                Start Free →
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gray-900/98 backdrop-blur-xl border-t border-gray-800">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeSection === link.id
                      ? 'text-amber-400 bg-amber-500/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <button onClick={onLogin} className="w-full py-3 text-gray-300 border border-gray-700 rounded-xl hover:bg-gray-800 transition-all">
                  Login
                </button>
                <button onClick={onGetStarted} className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-bold rounded-xl">
                  Start Free →
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Full Screen Background */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        {/* Full Screen Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1920&h=1080&fit=crop&q=80" 
            alt="Professional fleet management"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-white font-medium">Trusted by 800+ Fleet Operators Across India</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-8">
              Protect Your
              <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mt-2">
                Fleet Like Never Before
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              The smartest way to manage vehicles. Track services, documents, and never miss a deadline.
              <span className="text-amber-400 font-semibold"> Built for Indian fleet operators.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={onGetStarted}
                className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-2xl font-bold text-black text-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  🚀 Start Free Trial
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button
                onClick={onLogin}
                className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl font-bold text-white text-xl hover:bg-white/20 hover:border-amber-400 transition-all flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login to Dashboard
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: '15,000+', label: 'Vehicles Managed', icon: '🚗' },
                { value: '800+', label: 'Happy Customers', icon: '😊' },
                { value: '₹2 Crore+', label: 'Penalties Saved', icon: '💰' },
                { value: '99.9%', label: 'Uptime Guarantee', icon: '⚡' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-amber-500/50 transition-all hover:scale-105 hover:bg-white/15">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-black text-amber-400">{stat.value}</div>
                  <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white/60 text-sm font-medium">Scroll to explore</span>
            <div className="w-8 h-12 border-2 border-amber-500/50 rounded-full flex justify-center">
              <div className="w-1.5 h-3 bg-amber-400 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Showcase Section */}
      <section className="relative py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Images Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all group">
                    <img 
                      src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400&h=500&fit=crop" 
                      alt="Motorcycle" 
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-lg font-bold">Two Wheelers</div>
                      <div className="text-sm text-amber-400">Bikes & Scooters</div>
                    </div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all group">
                    <img 
                      src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop" 
                      alt="Luxury car" 
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-lg font-bold">Luxury Cars</div>
                      <div className="text-sm text-amber-400">Premium Fleet</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all group">
                    <img 
                      src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop" 
                      alt="SUV" 
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-lg font-bold">SUVs & MUVs</div>
                      <div className="text-sm text-amber-400">Adventure Ready</div>
                    </div>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all group">
                    <img 
                      src="https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=500&fit=crop" 
                      alt="Commercial vehicle" 
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-lg font-bold">Commercial</div>
                      <div className="text-sm text-amber-400">Business Fleet</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold px-8 py-4 rounded-full shadow-2xl shadow-amber-500/50 text-lg">
                🛡️ All Vehicle Types
              </div>
            </div>

            {/* Right - Content */}
            <div className="lg:pl-8">
              <div className="inline-block bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
                <span className="text-amber-400 text-sm font-semibold">MULTI-VEHICLE SUPPORT</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                One Platform,
                <span className="block text-amber-400">All Your Vehicles</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Whether you have a single bike or a fleet of 100+ vehicles, Fleet Guard handles everything. 
                From motorcycles to luxury cars, from personal vehicles to commercial fleets.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { icon: '🏍️', label: 'Motorcycles' },
                  { icon: '🛵', label: 'Scooters' },
                  { icon: '🚗', label: 'Cars' },
                  { icon: '🚙', label: 'SUVs' },
                  { icon: '🚐', label: 'Vans' },
                  { icon: '🚛', label: 'Commercial' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-amber-500/50 transition-all hover:bg-gray-800">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-white font-medium">{item.label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all hover:scale-105"
              >
                Get Started Now
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos Strip */}
      <section className="relative z-10 py-12 border-y border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-500 text-sm mb-8">Trusted by fleet operators managing these brands</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6 items-center justify-items-center">
            {[
              { name: 'Hero', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hero_MotoCorp_Logo.svg/200px-Hero_MotoCorp_Logo.svg.png' },
              { name: 'Honda', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Honda.svg/200px-Honda.svg.png' },
              { name: 'Bajaj', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Bajaj_Auto_Logo.svg/200px-Bajaj_Auto_Logo.svg.png' },
              { name: 'TVS', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/TVS_Motor_Company_Logo.svg/200px-TVS_Motor_Company_Logo.svg.png' },
              { name: 'Royal Enfield', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/Royal_Enfield_logo.svg/200px-Royal_Enfield_logo.svg.png' },
              { name: 'Maruti', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c9/Maruti_Suzuki.svg/200px-Maruti_Suzuki.svg.png' },
              { name: 'Tata', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tata_logo.svg/200px-Tata_logo.svg.png' },
              { name: 'Mahindra', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Mahindra_%26_Mahindra_Logo.svg/200px-Mahindra_%26_Mahindra_Logo.svg.png' },
            ].map((brand, i) => (
              <div key={i} className="text-lg font-bold text-gray-500 hover:text-amber-500 transition-colors cursor-default">
                {brand.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Images */}
      <section id="features" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-amber-500/10 text-amber-400 text-sm font-semibold rounded-full mb-4">
              ✨ Powerful Features
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Everything You Need to
              <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Manage Your Fleet
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From document tracking to expense analytics, Fleet Guard has all the tools you need
            </p>
          </div>

          {/* Features Grid with Images */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Feature Image */}
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent"></div>
                  <div className={`absolute bottom-4 left-4 w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm border border-white/10`}>
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>

                {/* Hover Glow */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Showcase Section */}
      <section className="relative z-10 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Images Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src="https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=400&q=80" 
                    alt="Motorcycle fleet"
                    className="w-full h-48 object-cover rounded-2xl border border-gray-700"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80" 
                    alt="Luxury car"
                    className="w-full h-64 object-cover rounded-2xl border border-gray-700"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img 
                    src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80" 
                    alt="Car fleet"
                    className="w-full h-64 object-cover rounded-2xl border border-gray-700"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1568772585407-9361bd6f0c4c?w=400&q=80" 
                    alt="Scooter"
                    className="w-full h-48 object-cover rounded-2xl border border-gray-700"
                  />
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-full shadow-2xl shadow-amber-500/50">
                All Vehicle Types
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <span className="inline-block px-4 py-2 bg-cyan-500/10 text-cyan-400 text-sm font-semibold rounded-full mb-4">
                🚗 Multi-Vehicle Support
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                One Platform for
                <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  All Your Vehicles
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Whether you manage bikes, cars, trucks, or a mixed fleet - Fleet Guard handles it all. 
                Track each vehicle's documents, services, and expenses in one unified dashboard.
              </p>
              
              <div className="space-y-4">
                {[
                  { icon: '🏍️', text: 'Motorcycles & Scooters' },
                  { icon: '🚗', text: 'Cars & SUVs' },
                  { icon: '🚚', text: 'Trucks & Commercial Vehicles' },
                  { icon: '🛺', text: 'Auto-rickshaws & Three-wheelers' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-gray-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-24 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-emerald-500/10 text-emerald-400 text-sm font-semibold rounded-full mb-4">
              🚀 Quick Setup
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Start managing your fleet in under 5 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-500"></div>

            {[
              {
                step: '01',
                icon: '📝',
                title: 'Sign Up Free',
                description: 'Create your account in seconds. No credit card required.',
                color: 'from-amber-500 to-orange-500',
                image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&q=80'
              },
              {
                step: '02',
                icon: '🚗',
                title: 'Add Your Vehicles',
                description: 'Enter vehicle details or import from Excel in bulk.',
                color: 'from-cyan-500 to-blue-500',
                image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&q=80'
              },
              {
                step: '03',
                icon: '🎉',
                title: 'Stay Protected',
                description: 'Get smart reminders and never miss a deadline again!',
                color: 'from-emerald-500 to-teal-500',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80'
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                {/* Image Card */}
                <div className="relative rounded-2xl overflow-hidden mb-6 border border-gray-700/50">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                  
                  {/* Step Circle */}
                  <div className={`absolute bottom-4 left-4 w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {item.icon}
                  </div>
                  
                  {/* Step Number */}
                  <div className={`absolute top-4 right-4 text-sm font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    Step {item.step}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 text-center">{item.title}</h3>
                <p className="text-gray-400 text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-amber-500/10 text-amber-400 text-sm font-semibold rounded-full mb-4">
              💰 Simple Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:border-gray-600 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <p className="text-gray-400 text-sm mb-6">Perfect for personal use</p>
              
              <div className="mb-6">
                <span className="text-5xl font-black text-white">FREE</span>
                <span className="text-gray-500 ml-2">forever</span>
              </div>

              <ul className="space-y-4 mb-8">
                {['Up to 5 vehicles', 'Basic reminders', 'Document tracking', 'Mobile access', 'Email support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <span className="text-emerald-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={onGetStarted}
                className="w-full py-3 border-2 border-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Professional */}
            <div className="relative bg-gradient-to-b from-amber-500/10 to-gray-800/50 backdrop-blur-sm border-2 border-amber-500/50 rounded-3xl p-8 transform md:-translate-y-4">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 text-sm font-bold rounded-full shadow-lg shadow-amber-500/30">
                Most Popular ⭐
              </div>

              <h3 className="text-xl font-bold text-white mb-2 mt-2">Professional</h3>
              <p className="text-gray-400 text-sm mb-6">For small fleet owners</p>
              
              <div className="mb-6">
                <span className="text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">₹2,000</span>
                <span className="text-gray-500 ml-2">/year</span>
              </div>

              <ul className="space-y-4 mb-8">
                {['Up to 30 vehicles', 'Smart reminders', 'Advanced analytics', 'Excel import/export', 'Priority support', 'Custom branding'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <span className="text-amber-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={onGetStarted}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300"
              >
                Start Free Trial
              </button>
            </div>

            {/* Enterprise */}
            <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:border-gray-600 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-gray-400 text-sm mb-6">For large fleets</p>
              
              <div className="mb-6">
                <span className="text-5xl font-black text-white">₹3,500</span>
                <span className="text-gray-500 ml-2">/year</span>
              </div>

              <ul className="space-y-4 mb-8">
                {['Unlimited vehicles', 'All Pro features', 'Multi-user access', 'API access', 'Dedicated support', 'Custom integrations'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <span className="text-cyan-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={onGetStarted}
                className="w-full py-3 border-2 border-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all duration-300"
              >
                Contact Sales
              </button>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
              <span className="text-2xl">🛡️</span>
              <span className="text-emerald-400 font-medium">30-Day Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="relative z-10 py-24 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-amber-500/10 text-amber-400 text-sm font-semibold rounded-full mb-4">
              💬 Customer Love
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join 800+ happy fleet operators across India
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">"{review.text}"</p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/30"
                  />
                  <div>
                    <div className="font-semibold text-white">{review.name}</div>
                    <div className="text-xs text-gray-500">{review.role}, {review.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-cyan-500/10 text-cyan-400 text-sm font-semibold rounded-full mb-4">
              ❓ FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-700/30 transition-all"
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  <span className={`text-amber-400 text-xl transition-transform duration-300 ${expandedFaq === index ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-24 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <span className="inline-block px-4 py-2 bg-amber-500/10 text-amber-400 text-sm font-semibold rounded-full mb-4">
                📞 Get In Touch
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Let's Talk About Your Fleet
              </h2>
              <p className="text-gray-400 mb-8">
                Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
              </p>

              <div className="space-y-6">
                {[
                  { icon: '📧', label: 'Email', value: 'hello@fleetguard.in' },
                  { icon: '📱', label: 'Phone', value: '+91 98765 43210' },
                  { icon: '💬', label: 'WhatsApp', value: '+91 98765 43210' },
                  { icon: '📍', label: 'Office', value: 'Mumbai, Maharashtra, India' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-2xl border border-gray-700">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{item.label}</div>
                      <div className="text-white font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8">
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Fleet Size</label>
                  <select className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors">
                    <option value="">Select fleet size</option>
                    <option value="1-5">1-5 vehicles</option>
                    <option value="6-30">6-30 vehicles</option>
                    <option value="31-100">31-100 vehicles</option>
                    <option value="100+">100+ vehicles</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300"
                >
                  Send Message →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative overflow-hidden rounded-3xl">
            {/* Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80" 
              alt="Fleet of cars"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/90 to-gray-900/95"></div>
            
            <div className="relative z-10 p-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to Guard Your Fleet?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join 800+ fleet operators who trust Fleet Guard to manage their vehicles. Start your free trial today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={onGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300"
                >
                  Start Free Trial →
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="px-8 py-4 border-2 border-white/30 text-white font-semibold text-lg rounded-2xl hover:bg-white/10 transition-all duration-300"
                >
                  View Pricing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  🛡️
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Fleet Guard
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-4">
                The smart way to manage your vehicle fleet. Track, protect, and grow with confidence.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'LinkedIn', 'Instagram'].map((social, i) => (
                  <a key={i} href="#" className="text-gray-500 hover:text-amber-400 transition-colors text-sm">
                    {social}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'How It Works', 'Reviews'].map((link, i) => (
                  <li key={i}>
                    <button onClick={() => scrollToSection(link.toLowerCase().replace(' ', '-'))} className="text-gray-500 hover:text-amber-400 transition-colors text-sm">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {['About Us', 'Blog', 'Careers', 'Contact'].map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Cookie Policy'].map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-500 hover:text-amber-400 transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 Fleet Guard. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm">
              Made with ❤️ in India
            </p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 rounded-full shadow-lg shadow-amber-500/30 hover:scale-110 transition-all duration-300 flex items-center justify-center"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default HomePage;
