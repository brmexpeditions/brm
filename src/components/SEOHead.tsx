import { Helmet } from 'react-helmet-async';

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
  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={url} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="BRM Expeditions" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
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
