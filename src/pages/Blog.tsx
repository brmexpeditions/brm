

import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { SEOHead } from '../components/SEOHead';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Blog() {
  const { posts } = useApp();
  const publishedPosts = posts.filter(p => p.status === 'published');

  return (
    <Layout>
      <SEOHead
        title="Blog | BRM Expeditions - Motorcycle Touring Tips & Stories"
        description="Read the latest stories, tips, and guides from the world of motorcycle adventure touring. Expert advice on routes, gear, and more."
        keywords={['motorcycle blog', 'adventure touring tips', 'Himalayan riding guide', 'motorcycle stories']}
      />

      {/* Hero Section */}
      <section className="relative py-24 bg-gray-900 -mt-28 pt-48">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&h=800&fit=crop"
            alt="Motorcycle Blog"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/0 via-gray-900/60 to-gray-900" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block bg-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm border border-amber-500/20">
            Adventure Journal
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Stories from the Road
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Tips, tales, and guides from our team of expert riders and explorers.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <Link to={`/blog/${post.slug}`} className="block relative overflow-hidden aspect-[16/10]">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 uppercase tracking-wide">
                    {post.category}
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <User size={14} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{post.author}</span>
                    </div>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-amber-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read Post <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 rounded-full text-gray-600 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all">
              Load More Stories
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to our Newsletter</h2>
          <p className="text-gray-400 mb-8">Get the latest routes, tips, and tour updates delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-6 py-3 text-white focus:outline-none focus:border-amber-500 transition"
            />
            <button className="bg-amber-500 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-600 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
