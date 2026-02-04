// Add these interfaces to your types file

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  url?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  slug: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  year: string;
}

export interface Review {
  id: string;
  name: string;
  country: string;
  rating: number;
  text: string;
  tour: string;
  avatar?: string;
}

export interface WeatherLocation {
  id: string;
  name: string;
  temp: string;
  condition: string;
  icon: string;
}

export interface HomepageSections {
  faq: {
    enabled: boolean;
    title: string;
    subtitle: string;
    items: FaqItem[];
  };
  team: {
    enabled: boolean;
    title: string;
    subtitle: string;
    members: TeamMember[];
  };
  partners: {
    enabled: boolean;
    title: string;
    items: Partner[];
  };
  videoGallery: {
    enabled: boolean;
    title: string;
    subtitle: string;
    videos: VideoItem[];
  };
  instagram: {
    enabled: boolean;
    username: string;
    images: string[];
  };
  blog: {
    enabled: boolean;
    title: string;
    posts: BlogPost[];
  };
  photoGallery: {
    enabled: boolean;
    title: string;
    images: GalleryImage[];
  };
  countdown: {
    enabled: boolean;
  };
  routeMap: {
    enabled: boolean;
    title: string;
    embedUrl: string;
  };
  awards: {
    enabled: boolean;
    title: string;
    items: Award[];
  };
  reviews: {
    enabled: boolean;
    title: string;
    items: Review[];
  };
  newsletter: {
    enabled: boolean;
    title: string;
    subtitle: string;
    discountText: string;
  };
  weather: {
    enabled: boolean;
    locations: WeatherLocation[];
  };
  whatsapp: {
    enabled: boolean;
    phoneNumber: string;
    message: string;
  };
}
// Bike type for fleet management
export interface Bike {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  image: string;
  gallery: string[];
  engineCapacity: string;
  power: string;
  torque: string;
  weight: string;
  seatHeight: string;
  fuelCapacity: string;
  transmission: string;
  topSpeed: string;
  description: string;
  features: string[];
  idealFor: string[];
  rentalPrice: number;
  upgradePrice: number;
  available: boolean;
  featured: boolean;
  category: 'adventure' | 'cruiser' | 'sport' | 'touring' | 'standard';
}

// Destination type for destinations section
export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  heroImage: string;
  gallery: { url: string; caption: string }[];
  highlights: string[];
  bestTimeToVisit: string;
  climate: string;
  terrain: string[];
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Expert';
  averageAltitude: string;
  popularRoutes: string[];
  thingsToKnow: string[];
  featured: boolean;
  status: 'published' | 'draft';
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryImage {
  id: string;
  url: string;
  caption: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  descriptionHtml?: string; // Rich text version
  distance?: string;
  elevation?: string;
  accommodation?: string;
  meals?: string[];
  highlights?: string[];
  highlightDetails?: { title: string; description: string; icon?: string }[]; // Enhanced highlights
  images?: ItineraryImage[];
  roadConditions?: string;
  ridingTime?: string;
  maxAltitude?: string;
}

// Page type for CMS pages
export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string; // Rich text HTML content
  excerpt?: string;
  featuredImage?: string;
  template: 'default' | 'full-width' | 'landing' | 'sidebar';
  status: 'published' | 'draft';
  showInMenu: boolean;
  menuOrder: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpgradeOption {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'accommodation' | 'bike' | 'gear' | 'experience';
}

export interface TourInclusion {
  included: string[];
  notIncluded: string[];
}

export interface TourImage {
  url: string;
  alt: string;
  isHero?: boolean;
}

// Typography Settings
export interface TypographySettings {
  headingFont: string;
  bodyFont: string;
  baseFontSize: number;
  headingScale: number;
  lineHeight: number;
  letterSpacing: number;
}

// Color Settings
export interface ColorSettings {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textLight: string;
  success: string;
  warning: string;
  error: string;
}

// Homepage Settings
export interface HomepageSettings {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    overlayOpacity: number;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    showStats: boolean;
  };
  stats: {
    enabled: boolean;
    items: { label: string; value: string }[];
  };
  featuredSection: {
    enabled: boolean;
    title: string;
    subtitle: string;
    showFeaturedOnly: boolean;
    maxItems: number;
  };
  whyChooseUs: {
    enabled: boolean;
    title: string;
    subtitle: string;
    items: { icon: string; title: string; description: string }[];
  };
  testimonials: {
    enabled: boolean;
    title: string;
    items: { name: string; country: string; text: string; rating: number; image?: string }[];
  };
  ctaSection: {
    enabled: boolean;
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText: string;
    ctaLink: string;
  };
}

// Header Settings
export interface HeaderSettings {
  style: 'transparent' | 'solid' | 'gradient';
  sticky: boolean;
  showTopBar: boolean;
  topBarText: string;
  logoType: 'text' | 'image' | 'both';
  logoImage: string;
  logoText: string;
  logoTagline: string;
  menuStyle: 'default' | 'centered' | 'minimal';
  showBookButton: boolean;
  bookButtonText: string;
}

// Footer Settings
export interface FooterSettings {
  style: 'default' | 'minimal' | 'centered';
  showNewsletter: boolean;
  newsletterTitle: string;
  newsletterSubtitle: string;
  copyrightText: string;
  showSocialLinks: boolean;
  columns: {
    title: string;
    links: { label: string; url: string }[];
  }[];
}

// Contact Settings
export interface ContactSettings {
  email: string;
  phone: string;
  phone2: string;
  whatsapp: string;
  address: string;
  city: string;
  country: string;
  mapEmbedUrl: string;
  businessHours: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
    twitter: string;
    linkedin: string;
  };
}

// SEO Settings
export interface SEOSettings {
  siteTitle: string;
  siteDescription: string;
  keywords: string[];
  ogImage: string;
  twitterHandle: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
  enableStructuredData: boolean;
}

// Complete Site Settings
export interface SiteSettings {
  general: {
    siteName: string;
    siteTagline: string;
    logo: string;
    favicon: string;
    language: string;
    timezone: string;
  };
  typography: TypographySettings;
  colors: ColorSettings;
  images: ImageSettings;
  homepage: HomepageSettings;
  header: HeaderSettings;
  footer: FooterSettings;
  contact: ContactSettings;
  seo: SEOSettings;
  menus: NavigationMenu[];
}

export interface TourSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
  structuredData: object;
}

// Pricing Configuration for Tours
export interface TourPricing {
  riderPrice: number;
  pillionPrice: number;
  singleRoomSupplement: number;
  deposit: number;
  depositType: 'percentage' | 'fixed';
  earlyBirdDiscount?: {
    enabled: boolean;
    percentage: number;
    deadlineDays: number;
  };
  groupDiscount?: {
    enabled: boolean;
    minRiders: number;
    percentage: number;
  };
  customPricing?: {
    id: string;
    name: string;
    riderPrice: number;
    pillionPrice: number;
    description: string;
  }[];
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  shortDescription: string;
  heroImage: string;
  gallery: TourImage[];
  duration: string;
  durationDays: number;
  distance: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Expert';
  groupSize: string;
  startLocation: string;
  endLocation: string;
  countries: string[];
  terrain: string[];
  bestSeason: string;
  price: number;
  originalPrice?: number;
  pricing?: TourPricing;
  currency: string;
  nextDeparture: string;
  departureDates: string[];
  itinerary: ItineraryDay[];
  inclusions: TourInclusion;
  upgrades: UpgradeOption[];
  highlights: string[];
  mapUrl: string;
  availableBikes: string[]; // Array of Bike IDs
  featured: boolean;
  status: 'published' | 'draft';
  seo?: TourSEO;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  tourId: string;
  customerName: string;
  email: string;
  phone: string;
  departureDate: string;
  riders: number;
  passengers: number;
  selectedUpgrades: string[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  notes?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'video';
  size: number;
  uploadedAt: string;
  alt?: string;
}

// Custom Menu Item
export interface MenuItem {
  id: string;
  label: string;
  url: string;
  target: '_self' | '_blank';
  type: 'page' | 'tour' | 'destination' | 'custom' | 'dropdown';
  parentId?: string;
  children?: MenuItem[];
  order: number;
  icon?: string;
}

// Navigation Menu
export interface NavigationMenu {
  id: string;
  name: string;
  location: 'header' | 'footer' | 'mobile';
  items: MenuItem[];
}

// Image Settings
export interface ImageSettings {
  heroAspectRatio: '16:9' | '21:9' | '4:3' | '3:2' | '1:1';
  heroHeight: 'small' | 'medium' | 'large' | 'full';
  cardAspectRatio: '16:9' | '4:3' | '3:2' | '1:1';
  galleryAspectRatio: '16:9' | '4:3' | '3:2' | '1:1';
  thumbnailSize: 'small' | 'medium' | 'large';
  lazyLoading: boolean;
  showCaptions: boolean;
}

// Element Style Configuration for frontend editor
export interface ElementStyleConfig {
  // Typography
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  color: string;
  // Spacing
  paddingTop: string;
  paddingBottom: string;
  paddingLeft: string;
  paddingRight: string;
  marginTop: string;
  marginBottom: string;
  // Background
  backgroundColor: string;
  backgroundGradient: string;
  // Border
  borderWidth: string;
  borderStyle: 'none' | 'solid' | 'dashed' | 'dotted';
  borderColor: string;
  borderRadius: string;
  // Shadow
  boxShadow: string;
  // Size
  width: string;
  maxWidth: string;
  minHeight: string;
  // Effects
  opacity: string;
  hoverEffect: 'none' | 'lift' | 'glow' | 'scale' | 'darken';
}

export interface ComponentStylePreset {
  id: string;
  name: string;
  styles: Partial<ElementStyleConfig>;
}

// Component-specific styles that can be edited
export interface ComponentStyles {
  // Global
  global: {
    bodyBackground: string;
    contentMaxWidth: string;
    sectionPadding: string;
  };
  // Buttons
  buttons: {
    primary: Partial<ElementStyleConfig>;
    secondary: Partial<ElementStyleConfig>;
    outline: Partial<ElementStyleConfig>;
  };
  // Cards
  cards: {
    tour: Partial<ElementStyleConfig>;
    destination: Partial<ElementStyleConfig>;
    bike: Partial<ElementStyleConfig>;
    testimonial: Partial<ElementStyleConfig>;
  };
  // Forms
  forms: {
    container: Partial<ElementStyleConfig>;
    input: Partial<ElementStyleConfig>;
    select: Partial<ElementStyleConfig>;
    label: Partial<ElementStyleConfig>;
    button: Partial<ElementStyleConfig>;
  };
  // Navigation
  navigation: {
    header: Partial<ElementStyleConfig>;
    navLink: Partial<ElementStyleConfig>;
    navLinkHover: Partial<ElementStyleConfig>;
    dropdown: Partial<ElementStyleConfig>;
  };
  // Sections
  sections: {
    hero: Partial<ElementStyleConfig>;
    title: Partial<ElementStyleConfig>;
    subtitle: Partial<ElementStyleConfig>;
    content: Partial<ElementStyleConfig>;
  };
  // Footer
  footer: {
    container: Partial<ElementStyleConfig>;
    link: Partial<ElementStyleConfig>;
    copyright: Partial<ElementStyleConfig>;
  };
  // Pricing/Booking
  booking: {
    container: Partial<ElementStyleConfig>;
    priceDisplay: Partial<ElementStyleConfig>;
    depositBadge: Partial<ElementStyleConfig>;
  };
  // Misc
  badges: Partial<ElementStyleConfig>;
  priceTag: Partial<ElementStyleConfig>;
}
