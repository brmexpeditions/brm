import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  structuredData?: object;
}

export function SEOHead({ 
  title, 
  description, 
  keywords = [], 
  image = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop',
  url = window.location.href,
  type = 'website',
  structuredData
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Standard meta tags
    updateMeta('description', description);
    if (keywords.length > 0) {
      updateMeta('keywords', keywords.join(', '));
    }
    
    // Open Graph tags
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', image, true);
    updateMeta('og:url', url, true);
    updateMeta('og:type', type, true);
    updateMeta('og:site_name', 'BRM Expeditions', true);
    
    // Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
    
    // Structured Data (JSON-LD)
    const existingScript = document.querySelector('script[data-seo="structured-data"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'structured-data');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
    
    return () => {
      // Cleanup is handled by the next SEOHead mount
    };
  }, [title, description, keywords, image, url, type, structuredData]);
  
  return null;
}

// Helper to generate tour structured data
export function generateTourStructuredData(tour: {
  title: string;
  description: string;
  price: number;
  currency: string;
  heroImage: string;
  duration: string;
  startLocation: string;
  endLocation: string;
  departureDates: string[];
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.description,
    image: tour.heroImage,
    touristType: 'Adventure Traveler',
    offers: {
      '@type': 'Offer',
      price: tour.price,
      priceCurrency: tour.currency,
      availability: 'https://schema.org/InStock',
      validFrom: tour.departureDates[0] || new Date().toISOString(),
    },
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: parseInt(tour.duration) || 0,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'TouristAttraction',
            name: tour.startLocation,
          },
        },
        {
          '@type': 'ListItem',
          position: 2,
          item: {
            '@type': 'TouristAttraction',
            name: tour.endLocation,
          },
        },
      ],
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'BRM Expeditions',
      url: 'https://www.brmexpeditions.com',
    },
  };
}

// Organization structured data for the website
export const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'BRM Expeditions',
  url: 'https://www.brmexpeditions.com',
  logo: 'https://www.brmexpeditions.com/logo.png',
  description: 'Premium motorcycle tours through India\'s most spectacular landscapes',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Adventure Road',
    addressLocality: 'New Delhi',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-98765-43210',
    contactType: 'customer service',
  },
  sameAs: [
    'https://www.facebook.com/brmexpeditions',
    'https://www.instagram.com/brmexpeditions',
    'https://www.youtube.com/brmexpeditions',
  ],
};
