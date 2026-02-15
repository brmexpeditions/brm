import { useParams, Link, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { SEOHead } from '../components/SEOHead';
import { Calendar, User, Clock, ArrowLeft, Tag, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const { posts } = useApp();

    const post = posts.find(p => p.slug === slug && p.status === 'published');

    if (!post) {
        return <Navigate to="/blog" replace />;
    }

    return (
        <Layout>
            <SEOHead
                title={`${post.title} - BRM Expeditions`}
                description={post.excerpt}
            />

            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[400px]">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-4xl mx-auto px-4 text-center text-white">
                        <Link
                            to="/blog"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft size={20} /> Back to Blog
                        </Link>
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {post.category}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-6 text-white/90">
                            <span className="flex items-center gap-2">
                                <User size={18} className="text-amber-500" />
                                {post.author}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar size={18} className="text-amber-500" />
                                {post.date}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock size={18} className="text-amber-500" />
                                {post.readTime}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <article className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    {/* Main Content */}
                    <div className="prose prose-lg prose-slate max-w-none text-gray-600">
                        <p className="lead text-xl md:text-2xl text-gray-800 font-medium mb-8">
                            {post.excerpt}
                        </p>

                        {/* Placeholder Content for now since we only have mock excerpts */}
                        <p className="mb-6">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                            et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                            aliquip ex ea commodo consequat.
                        </p>
                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">The Journey Begins</h2>
                        <p className="mb-6">
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        <p className="mb-6">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                            totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
                            dicta sunt explicabo.
                        </p>

                        <figure className="my-12">
                            <img
                                src="https://images.unsplash.com/photo-1558981806-ec527fa84f3d?w=1200&h=600&fit=crop"
                                alt="Motorcycle on the road"
                                className="w-full rounded-xl shadow-lg"
                            />
                            <figcaption className="text-center text-sm text-gray-500 mt-4">
                                Riding through the majestic landscapes
                            </figcaption>
                        </figure>

                        <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Key Takeaways</h2>
                        <ul className="space-y-4 mb-8 list-none pl-0">
                            {[1, 2, 3].map((item) => (
                                <li key={item} className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                                    </div>
                                    <span>Important detailed point regarding {post.title.toLowerCase()} that every rider should know.</span>
                                </li>
                            ))}
                        </ul>

                        <p>
                            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                            magni dolores eos qui ratione voluptatem sequi nesciunt.
                        </p>
                    </div>

                    {/* Share & Tags */}
                    <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Tag size={18} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-600">Tags:</span>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition cursor-pointer">Adventure</span>
                                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition cursor-pointer">Motorcycling</span>
                                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-gray-200 transition cursor-pointer">{post.category}</span>
                            </div>
                        </div>

                        <button className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition">
                            <Share2 size={18} />
                            <span className="font-medium">Share Article</span>
                        </button>
                    </div>
                </div>
            </article>

            {/* Related Posts */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">More Stories</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {posts
                            .filter(p => p.id !== post.id && p.status === 'published')
                            .slice(0, 3)
                            .map((relatedPost) => (
                                <Link
                                    key={relatedPost.id}
                                    to={`/blog/${relatedPost.slug}`}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition group"
                                >
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={relatedPost.image}
                                            alt={relatedPost.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <span className="text-amber-600 text-xs font-bold uppercase tracking-wider mb-2 block">
                                            {relatedPost.category}
                                        </span>
                                        <h4 className="font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition">
                                            {relatedPost.title}
                                        </h4>
                                        <span className="text-sm text-gray-500">{relatedPost.readTime}</span>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
