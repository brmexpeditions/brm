export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
}

export const defaultPosts: BlogPost[] = [
    {
        id: 1,
        title: 'Top 10 Motorcycle Routes in Ladakh',
        slug: 'top-10-motorcycle-routes-ladakh',
        excerpt: 'Discover the most breathtaking passes and valleys in the Land of High Passes. From Khardung La to Pangong Tso, here are the routes you cannot miss.',
        image: 'https://images.unsplash.com/photo-1595842858599-23136ba97921?w=800&h=500&fit=crop',
        author: 'Raj Sharma',
        date: 'May 15, 2024',
        readTime: '8 min read',
        category: 'Routes'
    },
    {
        id: 2,
        title: 'Essential Gear for Himalayan Riding',
        slug: 'essential-gear-himalayan-riding',
        excerpt: 'Packing for the Himalayas requires careful planning. Here is our comprehensive guide on what to bring to stay safe, warm, and comfortable.',
        image: 'https://images.unsplash.com/photo-1625126596377-16035fce19a7?w=800&h=500&fit=crop',
        author: 'Vikram Singh',
        date: 'April 22, 2024',
        readTime: '6 min read',
        category: 'Tips & Gear'
    },
    {
        id: 3,
        title: 'Culture of Spiti Valley: A Rider\'s Guide',
        slug: 'culture-spiti-valley-riders-guide',
        excerpt: 'Beyond the landscapes, Spiti Valley offers a rich tapestry of Buddhist culture, ancient monasteries, and warm hospitality.',
        image: 'https://images.unsplash.com/photo-1566802830887-c42385eb2414?w=800&h=500&fit=crop',
        author: 'Priya Patel',
        date: 'June 10, 2024',
        readTime: '5 min read',
        category: 'Culture'
    },
    {
        id: 4,
        title: 'Royal Enfield Himalayan 450: First Impressions',
        slug: 'royal-enfield-himalayan-450-review',
        excerpt: 'We took the new Himalayan 450 for a spin in its natural habitat. Here is what we think about Royal Enfield\'s latest adventure tourer.',
        image: 'https://images.unsplash.com/photo-1622185196424-7033583bea52?w=800&h=500&fit=crop',
        author: 'Amit Kumar',
        date: 'March 05, 2024',
        readTime: '10 min read',
        category: 'Reviews'
    },
    {
        id: 5,
        title: 'Preparing for High Altitude Riding',
        slug: 'preparing-high-altitude-riding',
        excerpt: 'AMS can affect anyone. Learn how to acclimatize properly and stay healthy while riding at 18,000 feet.',
        image: 'https://images.unsplash.com/photo-1518204680879-11c210ab6453?w=800&h=500&fit=crop',
        author: 'Dr. Sarah Jenkin',
        date: 'February 18, 2024',
        readTime: '7 min read',
        category: 'Health & Safety'
    },
    {
        id: 6,
        title: 'Best Time to Visit Nepal for Motorcycling',
        slug: 'best-time-visit-nepal-motorcycling',
        excerpt: 'Timing is everything when planning a ride through Nepal. We break down the seasons to help you choose the perfect dates.',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=500&fit=crop',
        author: 'Raj Sharma',
        date: 'January 30, 2024',
        readTime: '4 min read',
        category: 'Planning'
    }
];
