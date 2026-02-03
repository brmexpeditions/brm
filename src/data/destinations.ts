import { Destination } from '../types';

export const defaultDestinations: Destination[] = [
  {
    id: '1',
    slug: 'ladakh',
    name: 'Ladakh',
    country: 'India',
    tagline: 'The Land of High Passes',
    description: `Ladakh, often called "Little Tibet," is a high-altitude desert region in the northernmost part of India. This mystical land is characterized by dramatic landscapes of rugged mountains, pristine lakes, ancient Buddhist monasteries, and some of the highest motorable roads in the world.

Riding through Ladakh is a transformative experience. The journey takes you across legendary passes like Khardung La (18,380 ft), along the banks of the turquoise Pangong Lake, and through the magical Nubra Valley with its sand dunes and double-humped camels.

The region offers a perfect blend of adventure and spirituality, with centuries-old monasteries perched on clifftops, prayer flags fluttering in the mountain breeze, and some of the most hospitable people you'll ever meet.`,
    heroImage: 'https://images.unsplash.com/photo-1609766856923-7e0a0c06584d?w=1920&h=1080&fit=crop',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1609766856923-7e0a0c06584d?w=800&h=600&fit=crop', caption: 'Khardung La Pass' },
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', caption: 'Pangong Lake' },
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', caption: 'Thiksey Monastery' },
      { url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', caption: 'Mountain Landscapes' },
    ],
    highlights: [
      'Cross the world\'s highest motorable passes',
      'Camp by the stunning Pangong Lake',
      'Visit ancient Buddhist monasteries',
      'Experience unique Ladakhi culture',
      'Ride through the Nubra Valley',
      'See Magnetic Hill phenomenon',
    ],
    bestTimeToVisit: 'June to September',
    climate: 'High altitude desert - cold and dry. Summer days are pleasant (15-25°C), nights are cold (0-10°C).',
    terrain: ['Mountain Passes', 'Gravel Roads', 'River Crossings', 'Tarmac', 'Off-road Sections'],
    difficulty: 'Challenging',
    averageAltitude: '3,500m - 5,500m (11,500ft - 18,000ft)',
    popularRoutes: [
      'Manali to Leh Highway',
      'Srinagar to Leh Highway',
      'Khardung La Pass',
      'Nubra Valley Loop',
      'Pangong Lake Circuit',
      'Hanle & Tso Moriri Route',
    ],
    thingsToKnow: [
      'Acclimatization is essential - spend at least 2 days adjusting to altitude',
      'Inner Line Permits required for certain areas',
      'Carry cash as ATMs are scarce',
      'Mobile network is limited outside Leh',
      'Best to travel in groups for safety',
      'Carry basic medicines for altitude sickness',
    ],
    featured: true,
    status: 'published',
    seo: {
      metaTitle: 'Ladakh Motorcycle Tours | Ride the Himalayas',
      metaDescription: 'Experience the ultimate motorcycle adventure in Ladakh. Cross high passes, visit ancient monasteries, and camp by pristine lakes.',
      keywords: ['Ladakh motorcycle tour', 'Khardung La', 'Pangong Lake', 'Himalayan adventure'],
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: '2',
    slug: 'rajasthan',
    name: 'Rajasthan',
    country: 'India',
    tagline: 'The Land of Kings',
    description: `Rajasthan, India's largest state, is a vibrant tapestry of color, culture, and history. This royal land is home to magnificent forts, ornate palaces, ancient temples, and the golden sands of the Thar Desert.

Motorcycle touring through Rajasthan is like riding through a living museum. Every city tells a story - from the Pink City of Jaipur with its Amber Fort, to the Blue City of Jodhpur dominated by Mehrangarh Fort, the Golden City of Jaisalmer rising from the desert, and the Lake City of Udaipur with its romantic palaces.

The roads wind through colorful villages, past camel caravans, and into the heart of Rajput warrior culture. Stay in heritage hotels that were once royal residences, savor traditional Rajasthani cuisine, and witness folk performances under starlit skies.`,
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920&h=1080&fit=crop',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=600&fit=crop', caption: 'Jaipur Palace' },
      { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&h=600&fit=crop', caption: 'Colorful Streets' },
      { url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop', caption: 'Thar Desert' },
    ],
    highlights: [
      'Explore the magnificent Amber Fort in Jaipur',
      'Experience desert camping in Jaisalmer',
      'Visit the blue city of Jodhpur',
      'Cruise on Lake Pichola in Udaipur',
      'Stay in heritage palace hotels',
      'Witness traditional Rajasthani culture',
    ],
    bestTimeToVisit: 'October to March',
    climate: 'Hot and arid. Winters are pleasant (10-25°C), summers are extremely hot (30-45°C).',
    terrain: ['Tarmac Roads', 'Desert Tracks', 'Village Roads'],
    difficulty: 'Moderate',
    averageAltitude: '200m - 600m (650ft - 2,000ft)',
    popularRoutes: [
      'Delhi to Jaipur',
      'Jaipur to Jodhpur via Pushkar',
      'Jodhpur to Jaisalmer',
      'Jaisalmer Desert Loop',
      'Udaipur to Mount Abu',
    ],
    thingsToKnow: [
      'Carry plenty of water in summer months',
      'Best to avoid May-June due to extreme heat',
      'Heritage hotels should be booked in advance',
      'Respect local customs at temples and villages',
      'Bargaining is expected at local markets',
    ],
    featured: true,
    status: 'published',
    seo: {
      metaTitle: 'Rajasthan Motorcycle Tours | Royal Heritage Rides',
      metaDescription: 'Ride through the royal lands of Rajasthan. Explore magnificent forts, desert dunes, and experience incredible hospitality.',
      keywords: ['Rajasthan motorcycle tour', 'Jaipur tour', 'desert motorcycle ride', 'heritage tour India'],
    },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: '3',
    slug: 'spiti-valley',
    name: 'Spiti Valley',
    country: 'India',
    tagline: 'The Middle Land',
    description: `Spiti Valley, located in the northeastern part of Himachal Pradesh, is one of the most remote and pristine regions of the Himalayas. The name "Spiti" means "The Middle Land" - the land between Tibet and India.

This cold desert mountain valley remains cut off from the rest of the world for nearly six months each year. When accessible, it offers some of the most spectacular and challenging motorcycle riding on the planet.

Ancient Buddhist monasteries, some over a thousand years old, cling to cliffsides overlooking the Spiti River. Villages appear frozen in time, with traditional mud-brick houses and fields of buckwheat and barley. The region is also known for its unique fossils, with remains from the Tethys Sea that once covered this area millions of years ago.`,
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1920&h=1080&fit=crop',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop', caption: 'Key Monastery' },
      { url: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&h=600&fit=crop', caption: 'Spiti Valley' },
    ],
    highlights: [
      'Visit Key Monastery - largest in Spiti',
      'Explore the 1000-year-old Tabo Monastery',
      'Ride to Chandratal - the Moon Lake',
      'See the world\'s highest post office at Hikkim',
      'Cross Kunzum Pass at 15,060 ft',
      'Experience authentic Himalayan village life',
    ],
    bestTimeToVisit: 'June to September',
    climate: 'High altitude cold desert. Summer days 10-20°C, nights can drop below freezing.',
    terrain: ['Mountain Roads', 'Gravel', 'River Crossings', 'Rocky Sections'],
    difficulty: 'Expert',
    averageAltitude: '3,000m - 4,500m (10,000ft - 15,000ft)',
    popularRoutes: [
      'Shimla to Kaza via Kinnaur',
      'Kaza to Chandratal',
      'Kaza to Key Monastery Loop',
      'Manali to Kaza via Rohtang',
    ],
    thingsToKnow: [
      'Roads are extremely challenging - experience required',
      'Fuel stations are limited - plan carefully',
      'Inner Line Permits required for certain areas',
      'Weather can change rapidly',
      'Carry all essential supplies from Kaza',
    ],
    featured: true,
    status: 'published',
    seo: {
      metaTitle: 'Spiti Valley Motorcycle Tours | Adventure Expedition',
      metaDescription: 'Explore the remote Spiti Valley by motorcycle. Ancient monasteries, pristine landscapes, and challenging terrain await.',
      keywords: ['Spiti Valley tour', 'Himalayan expedition', 'Key Monastery', 'adventure motorcycle'],
    },
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: '4',
    slug: 'kerala',
    name: 'Kerala',
    country: 'India',
    tagline: 'God\'s Own Country',
    description: `Kerala, on India's tropical Malabar Coast, is a land of palm-fringed beaches, serene backwaters, lush tea plantations, and misty hill stations. Known as "God's Own Country," this southern state offers a completely different motorcycle touring experience.

Ride along winding roads through emerald tea estates of Munnar, cruise past tranquil backwaters, and feel the cool mountain air of the Western Ghats. The roads here are among the best maintained in India, with smooth tarmac winding through some of the country's most beautiful scenery.

Kerala offers a unique blend of natural beauty, rich culture, and incredible cuisine. Experience traditional Kathakali performances, Ayurvedic treatments, fresh seafood, and the warm hospitality that Kerala is famous for.`,
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1920&h=1080&fit=crop',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop', caption: 'Kerala Backwaters' },
      { url: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&h=600&fit=crop', caption: 'Tea Plantations' },
    ],
    highlights: [
      'Ride through Munnar tea plantations',
      'Experience Kerala backwaters',
      'Visit Periyar Wildlife Sanctuary',
      'Explore historic Fort Kochi',
      'Enjoy fresh Kerala cuisine',
      'Western Ghats mountain roads',
    ],
    bestTimeToVisit: 'September to March',
    climate: 'Tropical. Warm and humid year-round (25-35°C). Monsoon from June to August.',
    terrain: ['Smooth Tarmac', 'Mountain Twisties', 'Coastal Roads'],
    difficulty: 'Easy',
    averageAltitude: '0m - 2,000m (0ft - 6,500ft)',
    popularRoutes: [
      'Kochi to Munnar',
      'Munnar to Thekkady',
      'Alleppey Backwater Loop',
      'Wayanad Circuit',
    ],
    thingsToKnow: [
      'Monsoon season (June-August) can affect riding',
      'Roads are generally excellent',
      'Book houseboats in advance during peak season',
      'Traffic can be heavy in cities',
    ],
    featured: false,
    status: 'published',
    seo: {
      metaTitle: 'Kerala Motorcycle Tours | Tropical Paradise Rides',
      metaDescription: 'Discover Kerala by motorcycle. Tea plantations, backwaters, beaches, and incredible cuisine await in God\'s Own Country.',
      keywords: ['Kerala motorcycle tour', 'South India tour', 'Munnar', 'backwaters'],
    },
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: '5',
    slug: 'nepal',
    name: 'Nepal',
    country: 'Nepal',
    tagline: 'The Roof of the World',
    description: `Nepal, home to eight of the world's ten highest mountains including Mount Everest, offers some of the most dramatic motorcycle touring in the world. This small Himalayan nation is packed with adventure, spirituality, and incredible natural beauty.

Ride through the Kathmandu Valley with its ancient temples and stupas, venture into the Annapurna region, and experience the unique Nepali culture that blends Hindu and Buddhist traditions. The roads may be challenging, but the rewards are immeasurable.

From the bustling streets of Kathmandu to the serene mountain villages of the Himalayas, Nepal offers a motorcycle adventure unlike any other. Experience the legendary hospitality of the Nepali people and create memories that will last a lifetime.`,
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&h=1080&fit=crop',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop', caption: 'Himalayan Mountains' },
      { url: 'https://images.unsplash.com/photo-1565073182887-6bcefbe225b1?w=800&h=600&fit=crop', caption: 'Kathmandu Temple' },
    ],
    highlights: [
      'Views of Mount Everest and Annapurna',
      'Explore the ancient Kathmandu Valley',
      'Visit Pokhara lakeside',
      'Experience Nepali mountain culture',
      'Challenging Himalayan roads',
      'Spiritual sites and temples',
    ],
    bestTimeToVisit: 'March to May, September to November',
    climate: 'Varies by altitude. Kathmandu is pleasant (15-30°C), mountains are cold.',
    terrain: ['Mountain Roads', 'Gravel', 'Tarmac', 'Off-road Sections'],
    difficulty: 'Challenging',
    averageAltitude: '1,400m - 4,000m (4,500ft - 13,000ft)',
    popularRoutes: [
      'Kathmandu to Pokhara',
      'Annapurna Circuit',
      'Kathmandu Valley Loop',
      'Muktinath Route',
    ],
    thingsToKnow: [
      'Visa required for most nationalities',
      'Roads can be challenging - experience recommended',
      'Monsoon season (June-August) affects road conditions',
      'Altitude can be an issue in higher regions',
    ],
    featured: true,
    status: 'published',
    seo: {
      metaTitle: 'Nepal Motorcycle Tours | Himalayan Adventure',
      metaDescription: 'Ride through Nepal, home of the Himalayas. Experience Everest views, ancient temples, and incredible mountain roads.',
      keywords: ['Nepal motorcycle tour', 'Himalayan adventure', 'Kathmandu', 'Annapurna'],
    },
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
];
