import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, Mail, Instagram, Facebook, Youtube, ChevronDown, Settings, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DynamicStyles } from './DynamicStyles';
import { VisualEditor } from './VisualEditor';

// Apply typography and color settings globally
function GlobalStyles() {
  const appContext = useApp();

  // Safety check for undefined context or settings
  if (!appContext || !appContext.siteSettings) {
    return null;
  }

  const { siteSettings } = appContext;
  const typography = siteSettings.typography || {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseFontSize: 16,
    lineHeight: 1.6,
    letterSpacing: 0,
    headingScale: 1.25
  };
  const colors = siteSettings.colors || {
    primary: '#f59e0b',
    secondary: '#1f2937',
    accent: '#fbbf24',
    background: '#ffffff',
    text: '#1f2937',
    textLight: '#6b7280'
  };

  useEffect(() => {
    // Apply CSS variables to :root
    const root = document.documentElement;

    // Typography
    root.style.setProperty('--font-heading', typography.headingFont);
    root.style.setProperty('--font-body', typography.bodyFont);
    root.style.setProperty('--font-size-base', `${typography.baseFontSize}px`);
    root.style.setProperty('--line-height', typography.lineHeight.toString());
    root.style.setProperty('--letter-spacing', `${typography.letterSpacing}px`);

    // Colors
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-light', colors.textLight);

    // Apply to body
    document.body.style.fontFamily = `${typography.bodyFont}, system-ui, sans-serif`;
    document.body.style.fontSize = `${typography.baseFontSize}px`;
    document.body.style.lineHeight = typography.lineHeight.toString();
    document.body.style.letterSpacing = `${typography.letterSpacing}px`;
    document.body.style.color = colors.text;
    document.body.style.backgroundColor = colors.background;

    // Load Google Fonts
    const fontLink = document.getElementById('google-fonts-link') as HTMLLinkElement;

    // Collect all unique fonts from global settings and section overrides
    const sectionFonts = Object.values(siteSettings.homepageSections || {})
      .map((s: any) => s.fontFamily)
      .filter(Boolean);

    const allFonts = [typography.headingFont, typography.bodyFont, ...sectionFonts]
      .filter((f, i, a) => a.indexOf(f) === i); // Deduplicate

    const fontUrl = `https://fonts.googleapis.com/css2?${allFonts.map(f => `family=${f.replace(' ', '+')}:wght@100;200;300;400;500;600;700;800;900`).join('&')}&display=swap`;

    if (fontLink) {
      fontLink.href = fontUrl;
    } else {
      const link = document.createElement('link');
      link.id = 'google-fonts-link';
      link.rel = 'stylesheet';
      link.href = fontUrl;
      document.head.appendChild(link);
    }
  }, [typography, colors, siteSettings.homepageSections]);

  return (
    <style>{`
      h1, h2, h3, h4, h5, h6 {
        font-family: ${typography.headingFont}, system-ui, sans-serif;
      }
      .btn-primary {
        background-color: ${colors.primary};
      }
      .btn-primary:hover {
        background-color: ${colors.accent};
      }
      .text-primary {
        color: ${colors.primary};
      }
      .bg-primary {
        background-color: ${colors.primary};
      }
      .border-primary {
        border-color: ${colors.primary};
      }
      ::selection {
        background-color: ${colors.primary};
        color: white;
      }
    `}</style>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToursOpen, setIsToursOpen] = useState(false);
  const location = useLocation();
  const appContext = useApp();

  // Safety check
  if (!appContext) {
    return <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 h-16"></header>;
  }

  const { tours = [], isAuthenticated = false, siteSettings, destinations = [] } = appContext;
  const publishedTours = tours.filter(t => t.status === 'published');
  const publishedDestinations = destinations.filter(d => d.status === 'published');

  // Safe defaults
  const header = siteSettings?.header || { logoType: 'text', logoText: 'BRM EXPEDITIONS', logoTagline: 'PREMIUM MOTORCYCLE TOURS', style: 'transparent', showTopBar: false, showBookButton: true, bookButtonText: 'Book Now' };
  const contact = siteSettings?.contact || { phone: '', email: '', socialLinks: {} };
  const menus = siteSettings?.menus || [];
  const general = siteSettings?.general || { logo: '' };
  // Colors accessed directly from siteSettings where needed
  const mainMenu = menus?.find(m => m.location === 'header')?.items || [];

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItem = (item: typeof mainMenu[0]) => {
    if (item.type === 'dropdown' && item.label === 'Tours') {
      return (
        <div
          key={item.id}
          className="relative group"
          onMouseEnter={() => setIsToursOpen(true)}
          onMouseLeave={() => setIsToursOpen(false)}
        >
          <Link
            to={item.url}
            className={`text-white hover:text-amber-500 transition flex items-center gap-1 ${location.pathname.includes('/tours') ? 'text-amber-500' : ''}`}
          >
            {item.label} <ChevronDown size={16} />
          </Link>
          {isToursOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-gray-900 rounded-lg shadow-xl py-2 border border-gray-800">
              {publishedTours.map(tour => (
                <Link
                  key={tour.id}
                  to={`/tours/${tour.slug}`}
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-amber-500"
                >
                  {tour.title}
                </Link>
              ))}
              <div className="border-t border-gray-800 mt-2 pt-2">
                <Link to="/tours" className="block px-4 py-2 text-amber-500 hover:bg-gray-800">
                  View All Tours →
                </Link>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (item.type === 'dropdown' && item.label === 'Destinations') {
      return (
        <div key={item.id} className="relative group">
          <Link
            to={item.url}
            className={`text-white hover:text-amber-500 transition flex items-center gap-1 ${location.pathname.includes('/destinations') ? 'text-amber-500' : ''}`}
          >
            {item.label} <ChevronDown size={16} />
          </Link>
          <div className="absolute top-full left-0 mt-2 w-72 bg-gray-900 rounded-lg shadow-xl py-2 border border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            {publishedDestinations.map(dest => (
              <Link
                key={dest.id}
                to={`/destinations/${dest.slug}`}
                className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-amber-500"
              >
                {dest.name}
              </Link>
            ))}
            <div className="border-t border-gray-800 mt-2 pt-2">
              <Link to="/destinations" className="block px-4 py-2 text-amber-500 hover:bg-gray-800">
                View All Destinations →
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.url}
        target={item.target}
        className={`text-white hover:text-amber-500 transition flex items-center gap-1 ${isActive(item.url) ? 'text-amber-500' : ''}`}
      >
        {item.label}
        {item.target === '_blank' && <ExternalLink size={14} />}
      </Link>
    );
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${header.style === 'solid' ? 'bg-gray-900' : 'bg-black/90'} backdrop-blur-sm`}>
      {header.showTopBar && (
        <div className="text-white text-sm py-1" style={{ backgroundColor: siteSettings?.colors?.primary || '#f59e0b' }}>
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <a href={`tel:${contact.phone}`} className="flex items-center gap-1 hover:text-amber-200">
                <Phone size={14} /> {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`} className="hidden sm:flex items-center gap-1 hover:text-amber-200">
                <Mail size={14} /> {contact.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              {contact.socialLinks?.instagram && <a href={contact.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-amber-200"><Instagram size={16} /></a>}
              {contact.socialLinks?.facebook && <a href={contact.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-amber-200"><Facebook size={16} /></a>}
              {contact.socialLinks?.youtube && <a href={contact.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-amber-200"><Youtube size={16} /></a>}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            {(header.logoType === 'image' || header.logoType === 'both') && (header.logoImage || general.logo) && (
              <img src={header.logoImage || general.logo} alt={header.logoText} className="h-12 w-auto" />
            )}
            {(header.logoType === 'text' || (header.logoType === 'both' && !(header.logoImage || general.logo))) && (
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: siteSettings?.colors?.primary || '#f59e0b' }}>
                <span className="text-white font-bold text-lg">BRM</span>
              </div>
            )}
            {(header.logoType === 'text' || header.logoType === 'both') && (
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-xl">{header.logoText || 'BRM EXPEDITIONS'}</h1>
                <p className="text-xs tracking-widest" style={{ color: siteSettings?.colors?.primary || '#f59e0b' }}>{header.logoTagline || 'PREMIUM MOTORCYCLE TOURS'}</p>
              </div>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {mainMenu.sort((a, b) => a.order - b.order).map(item => renderMenuItem(item))}

            {isAuthenticated && (
              <Link to="/admin" className="flex items-center gap-1 hover:text-amber-400 transition font-semibold" style={{ color: siteSettings?.colors?.primary || '#f59e0b' }}>
                <Settings size={16} /> Admin
              </Link>
            )}
            {header.showBookButton && (
              <Link
                to="/tours"
                className="text-white px-6 py-2 rounded-full hover:opacity-90 transition font-semibold"
                style={{ backgroundColor: siteSettings?.colors?.primary || '#f59e0b' }}
              >
                {header.bookButtonText || 'Book Now'}
              </Link>
            )}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white p-2"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
            <div className="flex flex-col gap-4">
              {mainMenu.sort((a, b) => a.order - b.order).map(item => (
                <Link
                  key={item.id}
                  to={item.url}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:text-amber-500"
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && (
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="font-semibold" style={{ color: siteSettings?.colors?.primary || '#f59e0b' }}>Admin Panel</Link>
              )}
              {header.showBookButton && (
                <Link
                  to="/tours"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white px-6 py-2 rounded-full text-center font-semibold"
                  style={{ backgroundColor: siteSettings?.colors?.primary || '#f59e0b' }}
                >
                  {header.bookButtonText || 'Book Now'}
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  const appContext = useApp();

  // Safety check
  if (!appContext) {
    return <footer className="bg-gray-900 text-gray-300 py-8"><div className="text-center">Loading...</div></footer>;
  }

  const { tours = [], isAuthenticated = false, siteSettings, destinations = [] } = appContext;
  const navigate = useNavigate();
  const publishedTours = tours.filter(t => t.status === 'published');
  const publishedDestinations = destinations.filter(d => d.status === 'published');

  // Safe defaults
  const footer = siteSettings?.footer || { style: 'default', copyrightText: '© 2024 BRM Expeditions', showSocialLinks: true, showNewsletter: false };
  const contact = siteSettings?.contact || { phone: '', phone2: '', email: '', socialLinks: {} };
  const colors = siteSettings?.colors || { primary: '#f59e0b', secondary: '#1f2937', accent: '#fbbf24', background: '#ffffff', text: '#1f2937' };
  const menus = siteSettings?.menus || [];
  const general = siteSettings?.general || { siteName: 'BRM Expeditions', siteTagline: 'Premium Motorcycle Tours' };
  const footerMenu = menus?.find(m => m.location === 'footer')?.items || [];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              {((siteSettings?.header?.logoType === 'image' || siteSettings?.header?.logoType === 'both') && (siteSettings?.header?.logoImage || siteSettings?.general?.logo)) ? (
                <img src={siteSettings?.header?.logoImage || siteSettings?.general?.logo} alt={siteSettings?.header?.logoText || 'BRM Expeditions'} className="h-12 w-auto" />
              ) : (
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                  <span className="text-white font-bold text-lg">BRM</span>
                </div>
              )}
              {(siteSettings?.header?.logoType !== 'image') && (
                <div>
                  <h3 className="text-white font-bold text-xl">{general.siteName || 'BRM EXPEDITIONS'}</h3>
                  <p className="text-xs tracking-widest" style={{ color: colors.primary }}>{general.siteTagline || 'PREMIUM MOTORCYCLE TOURS'}</p>
                </div>
              )}
            </Link>
            <p className="text-sm mb-4">
              Experience the thrill of motorcycle adventures through India's most spectacular landscapes with our expertly guided tours.
            </p>
            {footer.showSocialLinks && (
              <div className="flex gap-4">
                {contact.socialLinks?.instagram && (
                  <a href={contact.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:opacity-90 transition" style={{ ['--tw-bg-opacity' as string]: 1 }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}>
                    <Instagram size={18} />
                  </a>
                )}
                {contact.socialLinks?.facebook && (
                  <a href={contact.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:opacity-90 transition" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}>
                    <Facebook size={18} />
                  </a>
                )}
                {contact.socialLinks?.youtube && (
                  <a href={contact.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:opacity-90 transition" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}>
                    <Youtube size={18} />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Our Tours</h4>
            <ul className="space-y-2">
              {publishedTours.slice(0, 5).map(tour => (
                <li key={tour.id}>
                  <Link to={`/tours/${tour.slug}`} className="hover:text-amber-500 transition text-sm" style={{ ['--tw-text-opacity' as string]: 1 }} onMouseEnter={(e) => e.currentTarget.style.color = colors.primary} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
                    {tour.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/tours" className="text-sm" style={{ color: colors.primary }}>View All Tours →</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Destinations</h4>
            <ul className="space-y-2">
              {publishedDestinations.slice(0, 5).map(dest => (
                <li key={dest.id}>
                  <Link to={`/destinations/${dest.slug}`} className="hover:text-amber-500 transition text-sm" onMouseEnter={(e) => e.currentTarget.style.color = colors.primary} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
                    {dest.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/destinations" className="text-sm" style={{ color: colors.primary }}>View All Destinations →</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {footerMenu.sort((a, b) => a.order - b.order).map(item => (
                <li key={item.id}>
                  <Link to={item.url} className="hover:text-amber-500 transition" onMouseEnter={(e) => e.currentTarget.style.color = colors.primary} onMouseLeave={(e) => e.currentTarget.style.color = ''}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-white font-semibold mt-6 mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-1" style={{ color: colors.primary }} />
                <div>
                  <p>{contact.phone}</p>
                  {contact.phone2 && <p>{contact.phone2}</p>}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-1" style={{ color: colors.primary }} />
                <p>{contact.email}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">{footer.copyrightText || '© 2024 BRM Expeditions. All rights reserved.'}</p>
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/admin')}
              className="text-xs text-gray-600 hover:text-gray-400 flex items-center gap-1"
            >
              <Settings size={12} /> Admin Panel
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-xs text-gray-600 hover:text-gray-400"
            >
              Admin Login
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const appContext = useApp();
  const [isEditMode, setIsEditMode] = useState(false);

  // Safety check
  if (!appContext) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  const { siteSettings, isAdmin } = appContext;
  const bgColor = siteSettings?.colors?.background || '#ffffff';

  return (
    <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
      <GlobalStyles />
      <DynamicStyles />

      <Header />

      {isAdmin && (
        <>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`fixed bottom-8 left-8 z-[10000] p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center gap-2 font-bold ${isEditMode ? 'bg-amber-500 text-white' : 'bg-gray-900 text-white'
              }`}
          >
            <Settings className={isEditMode ? 'animate-spin-slow' : ''} size={20} />
            {isEditMode ? 'Exit Editor' : 'Visual Editor'}
          </button>
          <VisualEditor isOpen={isEditMode} onClose={() => setIsEditMode(false)} />
        </>
      )}

      <main className="pt-28">{children}</main>
      <Footer />
    </div>
  );
}
