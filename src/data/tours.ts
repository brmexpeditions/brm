import { Tour } from '../types';

export const defaultTours: Tour[] = [
  {
    id: '1',
    slug: 'ladakh-himalayan-odyssey',
    title: 'Ladakh Himalayan Odyssey',
    subtitle: 'Conquer the World\'s Highest Motorable Roads',
    description: `Experience the ultimate Himalayan motorcycle adventure through the mystical land of Ladakh. This epic journey takes you through some of the world's highest motorable passes, ancient Buddhist monasteries, and landscapes that seem to belong to another planet.

From the lush green valleys of Manali to the stark, beautiful moonscapes of Ladakh, this tour offers an unforgettable blend of challenging riding, rich culture, and breathtaking scenery. Navigate through Rohtang Pass, tackle the legendary Khardung La at 18,380 feet, and cruise alongside the pristine Pangong Lake.

This is more than a motorcycle tour - it's a life-changing expedition that will push your limits and reward you with memories that last a lifetime.`,
    shortDescription: 'Ride through the world\'s highest motorable roads, ancient monasteries, and breathtaking Himalayan landscapes on this 14-day adventure.',
    heroImage: 'https://images.unsplash.com/photo-1609766856923-7e0a0c06584d?w=1600&h=900&fit=crop',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1609766856923-7e0a0c06584d?w=800&h=600&fit=crop', alt: 'Ladakh mountain road' },
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', alt: 'Himalayan peaks' },
      { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', alt: 'Mountain landscape' },
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', alt: 'Buddhist monastery' },
    ],
    duration: '14 Days / 13 Nights',
    durationDays: 14,
    distance: '2,100 km',
    difficulty: 'Challenging',
    groupSize: '6-12 riders',
    startLocation: 'Delhi, India',
    endLocation: 'Delhi, India',
    countries: ['India'],
    terrain: ['Mountain Passes', 'Gravel Roads', 'Tarmac', 'River Crossings'],
    bestSeason: 'June - September',
    price: 4500,
    originalPrice: 5200,
    currency: 'USD',
    nextDeparture: '2024-06-15',
    departureDates: ['2024-06-15', '2024-07-10', '2024-08-05', '2024-09-01'],
    highlights: [
      'Cross Khardung La - World\'s highest motorable pass at 18,380 ft',
      'Camp by the stunning Pangong Lake',
      'Visit ancient Thiksey and Hemis monasteries',
      'Ride through Nubra Valley and see double-humped camels',
      'Experience local Ladakhi culture and cuisine',
      'Professional photography and videography included'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Delhi',
        description: 'Welcome to India! Arrive at Delhi International Airport where our team will greet you. Transfer to our partner hotel for orientation, bike fitting, and welcome dinner with the group.',
        accommodation: 'The Oberoi, New Delhi (5-star)',
        meals: ['Dinner'],
        highlights: ['Airport pickup', 'Bike fitting session', 'Welcome dinner', 'Trip briefing'],
        images: [
          { id: 'img1-1', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop', caption: 'Delhi Airport Arrival' },
          { id: 'img1-2', url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop', caption: 'Welcome Dinner' }
        ]
      },
      {
        day: 2,
        title: 'Delhi to Manali',
        description: 'Early morning flight to Kullu followed by a scenic drive to Manali. Spend the afternoon acclimatizing and exploring the charming town of Old Manali.',
        distance: '50 km',
        elevation: '2,050 m',
        accommodation: 'The Himalayan, Manali',
        meals: ['Breakfast', 'Dinner'],
        highlights: ['Scenic flight over Himalayas', 'Old Manali exploration', 'Hot springs visit'],
        images: [
          { id: 'img2-1', url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=400&fit=crop', caption: 'Manali Valley View' }
        ]
      },
      {
        day: 3,
        title: 'Manali Acclimatization Day',
        description: 'Rest day for altitude acclimatization. Optional short ride to Solang Valley or visit to Hadimba Temple. Bike check and preparation for the journey ahead.',
        elevation: '2,050 m',
        accommodation: 'The Himalayan, Manali',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        highlights: ['Hadimba Temple visit', 'Solang Valley ride', 'Local market exploration'],
        images: [
          { id: 'img3-1', url: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=600&h=400&fit=crop', caption: 'Hadimba Temple' },
          { id: 'img3-2', url: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&h=400&fit=crop', caption: 'Solang Valley' }
        ]
      },
      {
        day: 4,
        title: 'Manali to Jispa',
        description: 'The adventure begins! Cross the mighty Rohtang Pass (13,050 ft) and descend into the Lahaul Valley. The landscape transforms dramatically as we enter the rain shadow region.',
        distance: '140 km',
        elevation: '3,200 m',
        accommodation: 'Himalayan Camp, Jispa',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        highlights: ['Rohtang Pass crossing', 'Lahaul Valley views', 'Riverside camping'],
        images: [
          { id: 'img4-1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', caption: 'Rohtang Pass' },
          { id: 'img4-2', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop', caption: 'Lahaul Valley' }
        ]
      },
      {
        day: 5,
        title: 'Jispa to Sarchu',
        description: 'Cross Baralacha La (16,040 ft) and ride through the stunning Suraj Tal lake. Camp at Sarchu, a remote plateau surrounded by towering peaks.',
        distance: '85 km',
        elevation: '4,290 m',
        accommodation: 'Luxury Tent Camp, Sarchu',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        highlights: ['Baralacha La Pass', 'Suraj Tal Lake', 'High altitude camping'],
        images: []
      },
      {
        day: 6,
        title: 'Sarchu to Leh',
        description: 'Epic riding day with multiple high passes including Nakee La, Lachulung La, and Tanglang La (17,480 ft). Arrive in Leh, the heart of Ladakh.',
        distance: '260 km',
        elevation: '3,500 m',
        accommodation: 'The Grand Dragon, Leh (4-star)',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        highlights: ['Multiple pass crossings', 'Gata Loops', 'Arrival in Leh'],
        images: [
          { id: 'img6-1', url: 'https://images.unsplash.com/photo-1609766856923-7e0a0c06584d?w=600&h=400&fit=crop', caption: 'Tanglang La Pass' }
        ]
      },
      {
        day: 7,
        title: 'Leh Rest & Exploration',
        description: 'Rest day in Leh for acclimatization. Visit Leh Palace, Shanti Stupa, and the bustling local market. Optional visit to Thiksey Monastery.',
        accommodation: 'The Grand Dragon, Leh',
        meals: ['Breakfast', 'Dinner'],
        highlights: ['Leh Palace', 'Shanti Stupa', 'Local market', 'Thiksey Monastery'],
        images: [
          { id: 'img7-1', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop', caption: 'Thiksey Monastery' }
        ]
      },
      {
        day: 8,
        title: 'Leh to Nubra Valley',
        description: 'Conquer Khardung La (18,380 ft) - the world\'s highest motorable road! Descend into the magical Nubra Valley and visit the sand dunes of Hunder.',
        distance: '125 km',
        elevation: '3,050 m',
        accommodation: 'Nubra Organic Retreat',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        highlights: ['Khardung La Pass', 'Nubra Valley', 'Bactrian camels', 'Diskit Monastery'],
        images: []
      },
      {
        day: 9,
        title: 'Nubra Valley Exploration',
        description: 'Explore the valley at leisure. Visit Diskit Monastery with its giant Maitreya Buddha statue. Optional ride to Turtuk - India\'s last village before Pakistan.',
        distance: '80 km (optional)',
        accommodation: 'Nubra Organic Retreat',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        highlights: ['Diskit Monastery', 'Maitreya Buddha statue', 'Turtuk village'],
        images: []
      },
      {
        day: 10,
        title: 'Nubra to Pangong Lake',
        description: 'Cross Shyok River and ride through the stunning Shyok Valley. Arrive at the legendary Pangong Lake, famous for its ever-changing colors.',
        distance: '165 km',
        elevation: '4,350 m',
        accommodation: 'Pangong Lakeside Camp',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        highlights: ['Shyok Valley', 'Pangong Lake', 'Lakeside camping', 'Stargazing'],
        images: []
      },
      {
        day: 11,
        title: 'Pangong Lake Sunrise & Return to Leh',
        description: 'Wake early for a magical sunrise over Pangong Lake. Return to Leh via Chang La pass (17,590 ft) and visit Hemis Monastery.',
        distance: '160 km',
        elevation: '3,500 m',
        accommodation: 'The Grand Dragon, Leh',
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        highlights: ['Pangong sunrise', 'Chang La Pass', 'Hemis Monastery'],
        images: []
      },
      {
        day: 12,
        title: 'Leh Leisure Day',
        description: 'Free day to explore Leh at your own pace. Optional activities include rafting on the Indus, visiting Alchi Monastery, or shopping for souvenirs.',
        accommodation: 'The Grand Dragon, Leh',
        meals: ['Breakfast', 'Farewell Dinner'],
        highlights: ['Optional rafting', 'Alchi Monastery', 'Souvenir shopping', 'Farewell dinner'],
        images: []
      },
      {
        day: 13,
        title: 'Leh to Delhi',
        description: 'Morning flight from Leh to Delhi. Free time for shopping or sightseeing in Delhi. Group dinner to celebrate the adventure.',
        accommodation: 'The Oberoi, New Delhi',
        meals: ['Breakfast', 'Dinner'],
        highlights: ['Scenic flight', 'Delhi sightseeing', 'Celebration dinner'],
        images: []
      },
      {
        day: 14,
        title: 'Departure',
        description: 'Transfer to Delhi International Airport for your onward journey. Bid farewell to new friends and take home memories of a lifetime.',
        meals: ['Breakfast'],
        highlights: ['Airport transfer', 'Fond farewells'],
        images: []
      }
    ],
    inclusions: {
      included: [
        'Royal Enfield Himalayan 450 motorcycle (or upgrade options)',
        'All fuel costs throughout the tour',
        'Experienced English-speaking tour leader',
        'Backup vehicle with mechanic',
        'All accommodations (twin sharing)',
        'All meals as per itinerary',
        'Inner Line Permits and Protected Area Permits',
        'Professional photography and videography',
        'First aid and emergency oxygen',
        'Airport transfers in Delhi',
        'Domestic flight Delhi-Kullu-Delhi',
        'Welcome and farewell dinners',
        'Tour jersey and memorabilia'
      ],
      notIncluded: [
        'International flights to/from Delhi',
        'Travel and medical insurance (mandatory)',
        'Visa fees',
        'Personal riding gear',
        'Alcoholic beverages',
        'Tips and gratuities',
        'Personal expenses',
        'Single room supplement ($600)',
        'Any services not mentioned in inclusions'
      ]
    },
    upgrades: [
      {
        id: 'u1',
        name: 'Single Room Supplement',
        description: 'Enjoy your own private room throughout the tour',
        price: 600,
        category: 'accommodation'
      },
      {
        id: 'u2',
        name: 'BMW GS 310 Upgrade',
        description: 'Upgrade to BMW G310GS for the entire tour',
        price: 450,
        category: 'bike'
      },
      {
        id: 'u3',
        name: 'KTM 390 Adventure Upgrade',
        description: 'Upgrade to KTM 390 Adventure for enhanced performance',
        price: 550,
        category: 'bike'
      },
      {
        id: 'u4',
        name: 'Premium Riding Gear Package',
        description: 'Full Alpinestars riding gear rental (jacket, pants, gloves, boots)',
        price: 350,
        category: 'gear'
      },
      {
        id: 'u5',
        name: 'Drone Photography Package',
        description: 'Personal drone coverage with edited highlight reel',
        price: 400,
        category: 'experience'
      },
      {
        id: 'u6',
        name: 'Private Guide Experience',
        description: 'Personal guide for cultural excursions and monastery visits',
        price: 300,
        category: 'experience'
      }
    ],
    seo: {
      metaTitle: 'Ladakh Himalayan Odyssey - 14 Day Motorcycle Tour | BRM Expeditions',
      metaDescription: 'Experience the ultimate Ladakh motorcycle adventure. Cross Khardung La, camp at Pangong Lake, and explore ancient monasteries on this 14-day guided tour.',
      keywords: ['Ladakh motorcycle tour', 'Himalayan motorcycle adventure', 'Khardung La', 'Pangong Lake', 'India motorcycle tour'],
      ogImage: 'https://images.unsplash.com/photo-1609766856923-7e0a0c06584d?w=1200&h=630&fit=crop',
      canonicalUrl: 'https://www.brmexpeditions.com/tours/ladakh-himalayan-odyssey',
      structuredData: {}
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d3379071.9574566893!2d75.85252325!3d33.2959078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x390d013547eb9bdd%3A0xcbae4e33b987ba01!2sManali%2C%20Himachal%20Pradesh!3m2!1d32.2395807!2d77.1887145!4m5!1s0x38fdea08134ff743%3A0x7dd1bf9c2c587216!2sLeh%2C%20Ladakh!3m2!1d34.1525864!2d77.5770712!5e0!3m2!1sen!2sin!4v1652345678901!5m2!1sen!2sin',
    availableBikes: ['bike-1', 'bike-2', 'bike-3', 'bike-4', 'bike-5'],
    featured: true,
    status: 'published',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z'
  },
  {
    id: '2',
    slug: 'rajasthan-royal-ride',
    title: 'Rajasthan Royal Ride',
    subtitle: 'Explore the Land of Kings on Two Wheels',
    description: `Journey through the vibrant colors and rich heritage of Rajasthan, India's most colorful state. This tour takes you through magnificent forts, ornate palaces, ancient temples, and the golden sands of the Thar Desert.

Ride past camel caravans, through medieval cities, and into the heart of Rajput culture. Experience the warm hospitality of heritage hotels, savor royal cuisine, and witness spectacular sunsets over sand dunes.

From the Pink City of Jaipur to the Blue City of Jodhpur, the Golden City of Jaisalmer to the Lake City of Udaipur - this tour is a sensory feast that showcases the best of incredible India.`,
    shortDescription: 'Experience the vibrant colors, magnificent forts, and rich culture of Rajasthan on this 10-day royal motorcycle adventure.',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1600&h=900&fit=crop',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=600&fit=crop', alt: 'Rajasthan palace' },
      { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop', alt: 'Colorful streets' },
      { url: 'https://images.unsplash.com/photo-1506461883276-594a12b09fe70e?w=800&h=600&fit=crop', alt: 'Desert landscape' },
    ],
    duration: '10 Days / 9 Nights',
    durationDays: 10,
    distance: '1,400 km',
    difficulty: 'Moderate',
    groupSize: '6-14 riders',
    startLocation: 'Delhi, India',
    endLocation: 'Delhi, India',
    countries: ['India'],
    terrain: ['Tarmac', 'Desert Tracks', 'Village Roads'],
    bestSeason: 'October - March',
    price: 3200,
    currency: 'USD',
    nextDeparture: '2024-10-20',
    departureDates: ['2024-10-20', '2024-11-15', '2024-12-10', '2025-01-05'],
    highlights: [
      'Explore Jaipur\'s Amber Fort and City Palace',
      'Desert camping under the stars in Jaisalmer',
      'Visit the magnificent Mehrangarh Fort in Jodhpur',
      'Romantic boat ride on Lake Pichola in Udaipur',
      'Stay in authentic heritage hotels and palaces',
      'Camel safari in the Thar Desert'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Delhi', description: 'Welcome to India! Airport pickup, hotel check-in, and welcome dinner with trip briefing.', accommodation: 'Imperial Hotel, Delhi', meals: ['Dinner'], images: [] },
      { day: 2, title: 'Delhi to Jaipur', description: 'Ride to the Pink City. Visit Amber Fort and explore the colorful bazaars.', distance: '280 km', accommodation: 'Rambagh Palace', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 3, title: 'Jaipur Exploration', description: 'City tour including City Palace, Hawa Mahal, and Jantar Mantar observatory.', accommodation: 'Rambagh Palace', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 4, title: 'Jaipur to Jodhpur', description: 'Ride through rural Rajasthan to the Blue City. Evening visit to Mehrangarh Fort.', distance: '340 km', accommodation: 'Umaid Bhawan Palace', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 5, title: 'Jodhpur to Jaisalmer', description: 'Ride into the Thar Desert. Evening camel safari and dinner in the dunes.', distance: '290 km', accommodation: 'Desert Camp', meals: ['Breakfast', 'Lunch', 'Dinner'], images: [] },
      { day: 6, title: 'Jaisalmer Exploration', description: 'Explore the Golden Fort, Jain temples, and the havelies of Jaisalmer.', accommodation: 'Suryagarh Hotel', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 7, title: 'Jaisalmer to Udaipur', description: 'Long but scenic ride to the City of Lakes through the Aravalli hills.', distance: '520 km', accommodation: 'Taj Lake Palace', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 8, title: 'Udaipur Exploration', description: 'Boat ride on Lake Pichola, City Palace visit, and sunset at Monsoon Palace.', accommodation: 'Taj Lake Palace', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 9, title: 'Udaipur to Delhi', description: 'Morning flight to Delhi. Afternoon sightseeing and farewell dinner.', accommodation: 'Imperial Hotel', meals: ['Breakfast', 'Farewell Dinner'], images: [] },
      { day: 10, title: 'Departure', description: 'Airport transfer for your onward journey.', meals: ['Breakfast'], images: [] }
    ],
    inclusions: {
      included: [
        'Royal Enfield Classic 350 motorcycle',
        'All fuel costs',
        'Experienced tour leader and support vehicle',
        'All accommodations including heritage hotels',
        'Meals as per itinerary',
        'Monument entrance fees',
        'Domestic flight Udaipur-Delhi',
        'Camel safari in Jaisalmer',
        'Airport transfers'
      ],
      notIncluded: [
        'International flights',
        'Travel insurance',
        'Visa fees',
        'Personal expenses',
        'Alcoholic beverages',
        'Tips and gratuities',
        'Single room supplement ($450)'
      ]
    },
    upgrades: [
      { id: 'u1', name: 'Single Room Supplement', description: 'Private room throughout the tour', price: 450, category: 'accommodation' },
      { id: 'u2', name: 'Royal Enfield Interceptor 650', description: 'Upgrade to the powerful Interceptor 650', price: 300, category: 'bike' }
    ],
    seo: {
      metaTitle: 'Rajasthan Royal Ride - 10 Day Motorcycle Tour | BRM Expeditions',
      metaDescription: 'Explore Rajasthan by motorcycle. Visit magnificent forts, royal palaces, and the Thar Desert on this 10-day guided tour through India.',
      keywords: ['Rajasthan motorcycle tour', 'India motorcycle adventure', 'Jaipur tour', 'desert motorcycle ride'],
      ogImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&h=630&fit=crop',
      canonicalUrl: 'https://www.brmexpeditions.com/tours/rajasthan-royal-ride',
      structuredData: {}
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m46!1m12!1m3!1d3622093.0744599635!2d73.08241462499998!3d26.4611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m31!3e0!4m5!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi!3m2!1d28.6139391!2d77.2090212!4m5!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!3m2!1d26.9124336!2d75.7872709!4m5!1s0x39418c4eaa06ccb9%3A0x8114ea5b0ae1abb8!2sJodhpur%2C%20Rajasthan!3m2!1d26.2389469!2d73.0242936!4m5!1s0x3947bd8a8a7c13b9%3A0xd9a69ac6cc7dc2d4!2sJaisalmer%2C%20Rajasthan!3m2!1d26.9157!2d70.9083!4m5!1s0x396d667be52c239f%3A0x7e6d92d8c5ec88ba!2sUdaipur%2C%20Rajasthan!3m2!1d24.5853904!2d73.7125337!5e0!3m2!1sen!2sin!4v1652345678901!5m2!1sen!2sin',
    availableBikes: ['bike-1', 'bike-6', 'bike-7'],
    featured: true,
    status: 'published',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z'
  },
  {
    id: '3',
    slug: 'spiti-valley-expedition',
    title: 'Spiti Valley Expedition',
    subtitle: 'The Middle Land - Where India Meets Tibet',
    description: `Discover the remote and mystical Spiti Valley, one of the least explored regions of the Himalayas. This challenging expedition takes you through ancient Buddhist villages, prehistoric fossil sites, and landscapes that have remained unchanged for centuries.

Spiti offers a raw, untouched beauty that few places on Earth can match. Ride through narrow mountain roads carved into cliffs, cross high passes, and visit monasteries that have stood for over a thousand years.`,
    shortDescription: 'Journey through the remote Spiti Valley, ancient monasteries, and pristine Himalayan wilderness on this challenging 12-day expedition.',
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&h=900&fit=crop',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop', alt: 'Spiti Valley' },
    ],
    duration: '12 Days / 11 Nights',
    durationDays: 12,
    distance: '1,800 km',
    difficulty: 'Expert',
    groupSize: '4-10 riders',
    startLocation: 'Delhi, India',
    endLocation: 'Delhi, India',
    countries: ['India'],
    terrain: ['Mountain Roads', 'Gravel', 'River Crossings', 'High Passes'],
    bestSeason: 'June - September',
    price: 3800,
    currency: 'USD',
    nextDeparture: '2024-06-25',
    departureDates: ['2024-06-25', '2024-07-20', '2024-08-15'],
    highlights: [
      'Visit Key Monastery - largest in Spiti',
      'Explore Tabo Monastery - the Ajanta of the Himalayas',
      'Cross Kunzum Pass at 15,060 ft',
      'See the world\'s highest post office in Hikkim',
      'Stay in traditional homestays'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Delhi', description: 'Arrival and welcome dinner.', meals: ['Dinner'], images: [] },
      { day: 2, title: 'Delhi to Shimla', description: 'Scenic ride to the former British summer capital.', distance: '350 km', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 3, title: 'Shimla to Sangla', description: 'Enter the Kinnaur Valley through apple orchards.', distance: '220 km', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 4, title: 'Sangla to Tabo', description: 'Cross into Spiti via Khab confluence.', distance: '170 km', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 5, title: 'Tabo to Kaza', description: 'Visit Tabo Monastery and ride to Spiti headquarters.', distance: '50 km', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 6, title: 'Kaza Rest Day', description: 'Explore Key Monastery, Kibber village, and Chicham bridge.', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 7, title: 'Kaza to Chandratal', description: 'Ride to the magical Moon Lake via Kunzum Pass.', distance: '80 km', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 8, title: 'Chandratal to Manali', description: 'Cross Rohtang Pass to reach Manali.', distance: '110 km', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 9, title: 'Manali Rest Day', description: 'Rest and explore Manali.', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 10, title: 'Manali to Chandigarh', description: 'Ride through Kullu Valley to the plains.', distance: '310 km', meals: ['Breakfast', 'Dinner'], images: [] },
      { day: 11, title: 'Chandigarh to Delhi', description: 'Final ride to Delhi and farewell dinner.', distance: '250 km', meals: ['Breakfast', 'Farewell Dinner'], images: [] },
      { day: 12, title: 'Departure', description: 'Airport transfers.', meals: ['Breakfast'], images: [] }
    ],
    inclusions: {
      included: [
        'Royal Enfield Himalayan 450',
        'All fuel',
        'Experienced guide',
        'Support vehicle',
        'Accommodations',
        'All meals',
        'Permits'
      ],
      notIncluded: [
        'International flights',
        'Insurance',
        'Personal expenses',
        'Tips'
      ]
    },
    upgrades: [
      { id: 'u1', name: 'Single Room Supplement', description: 'Private room where available', price: 400, category: 'accommodation' }
    ],
    seo: {
      metaTitle: 'Spiti Valley Expedition - 12 Day Motorcycle Tour | BRM Expeditions',
      metaDescription: 'Explore the remote Spiti Valley by motorcycle. Visit ancient monasteries and pristine Himalayan wilderness on this 12-day expedition.',
      keywords: ['Spiti Valley motorcycle tour', 'Himalayan expedition', 'Key Monastery', 'adventure motorcycle tour'],
      ogImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&h=630&fit=crop',
      canonicalUrl: 'https://www.brmexpeditions.com/tours/spiti-valley-expedition',
      structuredData: {}
    },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d435513.2831648124!2d77.8143!3d32.2463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390673e2fc1e1939%3A0x4fe6b7e1a5e7c0c1!2sSpiti%20Valley!5e0!3m2!1sen!2sin!4v1652345678901!5m2!1sen!2sin',
    availableBikes: ['bike-1', 'bike-3', 'bike-4', 'bike-8'],
    featured: false,
    status: 'published',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z'
  }
];
