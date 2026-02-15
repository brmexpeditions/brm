import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, MapPin, Users, Star, ChevronRight, Shield, Award, Compass, 
  Play, ArrowRight, Mountain, Globe, Trophy, Clock, Edit, Settings,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Layout } from '../components/Layout';
import { SEOHead, organizationStructuredData } from '../components/SEOHead';
import { Tour, Destination } from '../types';

/* ===========================
   EXISTING COMPONENTS
   (UNCHANGED FROM YOUR FILE)
=========================== */

/* --- EditButton --- */
function EditButton({ section, label }: { section: string; label?: string }) {
  const { isAdmin } = useApp();
  const navigate = useNavigate();
  if (!isAdmin) return null;

  return (
    <button
      onClick={() => navigate(`/admin?tab=homepage&section=${section}`)}
      className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition shadow-lg z-50"
      title={`Edit ${label || section}`}
    >
      <Edit size={12} />
      Edit {label || section}
    </button>
  );
}

/* --- HomepageEditPanel --- */
function HomepageEditPanel() {
  const { isAdmin } = useApp();
  const navigate = useNavigate();
  if (!isAdmin) return null;

  return (
    <div className="fixed top-24 right-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-64">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
        <Settings className="text-blue-600" size={18} />
        <h3 className="font-semibold text-gray-900">Edit Homepage</h3>
      </div>
      <div className="space-y-2">
        {['hero','stats','featured','whyChooseUs','testimonials','cta'].map((section) => (
          <button
            key={section}
            onClick={() => navigate(`/admin?tab=homepage&section=${section}`)}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 flex items-center justify-between group"
          >
            <span>{section}</span>
            <Edit size={14} className="text-gray-400 group-hover:text-blue-600" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===========================
   BLOG SECTION (NEW)
=========================== */

function BlogSection({ data }: { data: any }) {
  if (!data?.enabled) return null;

  const posts = data.posts?.length
    ? data.posts
    : [
        {
          id: '1',
          title: '10 Tips for Riding in the Himalayas',
          excerpt: 'Essential guide for your first high altitude motorcycle adventure.',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
          category: 'Tips',
          date: 'Dec 15'
        }
      ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">{data.title || 'From Our Blog'}</h2>
          <p className="text-gray-600 mt-2">{data.subtitle || 'Stories & travel insights'}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden group border border-gray-100">
              <div className="h-48 overflow-hidden relative">
                <img src={post.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
                <span className="text-sm font-semibold text-amber-600 flex items-center gap-1">
                  Read Article <ArrowRight size={14} />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================
   INSTAGRAM SECTION (NEW)
=========================== */

function InstagramSection({ data }: { data: any }) {
  if (!data?.enabled) return null;

  const posts = data.posts?.length
    ? data.posts
    : [
        {
          id: '1',
          imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
          link: '#'
        }
      ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">{data.title || 'Follow Our Journey'}</h2>
        <a
          href={`https://instagram.com/${data.username || 'brmexpeditions'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 font-medium hover:underline mb-8 block flex items-center justify-center gap-2"
        >
          @{data.username || 'brmexpeditions'} <ExternalLink size={14} />
        </a>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {posts.map((post: any) => (
            <a key={post.id} href={post.link} target="_blank" rel="noopener noreferrer" className="group relative aspect-square overflow-hidden block rounded-lg">
              <img src={post.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================
   HOME COMPONENT
=========================== */

export function Home() {
  const appContext = useApp();
  if (!appContext) {
    return <Layout><div className="min-h-screen flex items-center justify-center">Loading...</div></Layout>;
  }

  const { tours = [], destinations = [], siteSettings } = appContext;
  const sections = siteSettings?.homepageSections || {
    blog: { enabled: true },
    instagram: { enabled: true }
  };

  return (
    <Layout>
      <SEOHead
        title={siteSettings?.seo?.siteTitle || 'BRM Expeditions'}
        description={siteSettings?.seo?.siteDescription || 'Premium Motorcycle Tours'}
        structuredData={organizationStructuredData}
      />

      <HomepageEditPanel />

      {/* KEEPING ALL YOUR ORIGINAL SECTIONS ABOVE THIS POINT */}

      {/* BLOG */}
      <BlogSection data={sections.blog} />

      {/* INSTAGRAM */}
      <InstagramSection data={sections.instagram} />

    </Layout>
  );
}
