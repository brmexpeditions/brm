import { useState } from 'react';
import { Plus, Trash2, Save, X, Image as ImageIcon, HelpCircle, Users, Handshake, Video, Camera, Star, Award, FileText, Mail, CloudSun, Map, MessageCircle, Calendar } from 'lucide-react';
import { BulkImageUpload } from './BulkImageUpload';

export function HomepageSectionsEditor({ siteSettings, updateSiteSettings }: { siteSettings: any; updateSiteSettings: (settings: any) => void }) {
  const [activeSection, setActiveSection] = useState('faq');
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [bulkUploadTarget, setBulkUploadTarget] = useState('');
  
  const [sections, setSections] = useState(() => {
    const saved = siteSettings?.homepageSections || {};
    return {
      faq: { enabled: true, title: 'Frequently Asked Questions', items: [], ...saved.faq },
      team: { enabled: true, title: 'Meet Our Team', subtitle: '', members: [], ...saved.team },
      partners: { enabled: true, title: 'Our Partners', items: [], ...saved.partners },
      videoGallery: { enabled: true, title: 'Video Gallery', videos: [], ...saved.videoGallery },
      photoGallery: { enabled: true, title: 'Photo Gallery', images: [], ...saved.photoGallery },
      instagram: { enabled: true, username: '@nepalbiketours', images: [], ...saved.instagram },
      blog: { enabled: true, title: 'From Our Blog', posts: [], ...saved.blog },
      awards: { enabled: true, title: 'Awards & Certifications', items: [], ...saved.awards },
      reviews: { enabled: true, title: 'Customer Reviews', items: [], ...saved.reviews },
      newsletter: { enabled: true, title: 'Get 10% Off!', subtitle: 'Subscribe for deals', discountText: '10% OFF', ...saved.newsletter },
      weather: { enabled: true, locations: [], ...saved.weather },
      routeMap: { enabled: true, title: 'Our Routes', embedUrl: '', ...saved.routeMap },
      whatsapp: { enabled: true, phoneNumber: '', message: 'Hi! I\'m interested in your tours.', ...saved.whatsapp },
      countdown: { enabled: true, ...saved.countdown },
    };
  });

  const handleSave = async () => {
    await updateSiteSettings({ homepageSections: sections });
    alert('✅ Homepage sections saved successfully!');
  };

  const updateSection = (key: string, data: any) => {
    setSections((prev: any) => ({ ...prev, [key]: { ...prev[key], ...data } }));
  };

  const addItem = (sectionKey: string, itemsKey: string, newItem: any) => {
    setSections((prev: any) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [itemsKey]: [...(prev[sectionKey]?.[itemsKey] || []), { ...newItem, id: Date.now().toString() }]
      }
    }));
  };

  const removeItem = (sectionKey: string, itemsKey: string, itemId: string) => {
    setSections((prev: any) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [itemsKey]: prev[sectionKey]?.[itemsKey]?.filter((item: any) => item.id !== itemId) || []
      }
    }));
  };

  const updateItem = (sectionKey: string, itemsKey: string, itemId: string, data: any) => {
    setSections((prev: any) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [itemsKey]: prev[sectionKey]?.[itemsKey]?.map((item: any) => 
          item.id === itemId ? { ...item, ...data } : item
        ) || []
      }
    }));
  };

  const handleBulkImages = (images: { url: string; caption?: string }[]) => {
    if (bulkUploadTarget === 'photoGallery') {
      const newImages = images.map((img, i) => ({ id: Date.now().toString() + i, url: img.url, caption: img.caption || '' }));
      setSections((prev: any) => ({
        ...prev,
        photoGallery: { ...prev.photoGallery, images: [...(prev.photoGallery?.images || []), ...newImages] }
      }));
    } else if (bulkUploadTarget === 'instagram') {
      setSections((prev: any) => ({
        ...prev,
        instagram: { ...prev.instagram, images: [...(prev.instagram?.images || []), ...images.map(img => img.url)] }
      }));
    }
    setBulkUploadOpen(false);
  };

  const sectionsList = [
    { key: 'faq', label: 'FAQ', icon: HelpCircle },
    { key: 'team', label: 'Team', icon: Users },
    { key: 'partners', label: 'Partners', icon: Handshake },
    { key: 'videoGallery', label: 'Videos', icon: Video },
    { key: 'photoGallery', label: 'Photo Gallery', icon: Camera },
    { key: 'instagram', label: 'Instagram', icon: Camera },
    { key: 'reviews', label: 'Reviews', icon: Star },
    { key: 'awards', label: 'Awards', icon: Award },
    { key: 'blog', label: 'Blog', icon: FileText },
    { key: 'newsletter', label: 'Newsletter', icon: Mail },
    { key: 'weather', label: 'Weather', icon: CloudSun },
    { key: 'routeMap', label: 'Route Map', icon: Map },
    { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { key: 'countdown', label: 'Countdown', icon: Calendar },
  ];

  return (
    <div className="flex h-[calc(100vh-140px)]">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r overflow-y-auto p-4 flex-shrink-0">
        <h3 className="font-bold text-gray-900 mb-4 px-2">Sections</h3>
        <div className="space-y-1">
          {sectionsList.map(section => {
            const Icon = section.icon;
            const isEnabled = sections[section.key]?.enabled;
            return (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${
                  activeSection === section.key ? 'bg-amber-100 text-amber-700 font-medium' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Icon size={18} />
                <span className="flex-1">{section.label}</span>
                <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-gray-300'}`} />
              </button>
            );
          })}
        </div>
        <div className="mt-8 pt-4 border-t">
          <button onClick={handleSave} className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 font-medium">
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* FAQ Editor */}
          {activeSection === 'faq' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">FAQ Section</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={sections.faq?.enabled} onChange={(e) => updateSection('faq', { enabled: e.target.checked })} className="w-5 h-5 text-amber-600 rounded" />
                  <span className="font-medium">Enable Section</span>
                </label>
              </div>
              <input type="text" value={sections.faq?.title} onChange={(e) => updateSection('faq', { title: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Section Title" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Questions</h3>
                  <button onClick={() => addItem('faq', 'items', { question: '', answer: '' })} className="text-amber-600 flex items-center gap-1"><Plus size={16}/> Add</button>
                </div>
                {sections.faq?.items?.map((item: any) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-xl space-y-3 relative group">
                    <button onClick={() => removeItem('faq', 'items', item.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                    <input type="text" value={item.question} onChange={(e) => updateItem('faq', 'items', item.id, { question: e.target.value })} placeholder="Question" className="w-full p-2 border rounded" />
                    <textarea value={item.answer} onChange={(e) => updateItem('faq', 'items', item.id, { answer: e.target.value })} placeholder="Answer" className="w-full p-2 border rounded" rows={2} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Editor */}
          {activeSection === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Team Section</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={sections.team?.enabled} onChange={(e) => updateSection('team', { enabled: e.target.checked })} className="w-5 h-5 text-amber-600 rounded" />
                  <span className="font-medium">Enable</span>
                </label>
              </div>
              <input type="text" value={sections.team?.title} onChange={(e) => updateSection('team', { title: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Section Title" />
              
              <div className="grid md:grid-cols-2 gap-4">
                {sections.team?.members?.map((member: any) => (
                  <div key={member.id} className="bg-gray-50 p-4 rounded-xl space-y-3 relative group">
                    <button onClick={() => removeItem('team', 'members', member.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                    <div className="flex gap-3">
                      <img src={member.image || 'https://via.placeholder.com/100'} className="w-16 h-16 rounded-full object-cover bg-gray-200" alt="" />
                      <div className="flex-1 space-y-2">
                        <input type="text" value={member.name} onChange={(e) => updateItem('team', 'members', member.id, { name: e.target.value })} placeholder="Name" className="w-full p-1 border rounded text-sm" />
                        <input type="text" value={member.role} onChange={(e) => updateItem('team', 'members', member.id, { role: e.target.value })} placeholder="Role" className="w-full p-1 border rounded text-sm" />
                      </div>
                    </div>
                    <input type="text" value={member.image} onChange={(e) => updateItem('team', 'members', member.id, { image: e.target.value })} placeholder="Image URL" className="w-full p-1 border rounded text-sm" />
                    <input type="text" value={member.bio} onChange={(e) => updateItem('team', 'members', member.id, { bio: e.target.value })} placeholder="Bio" className="w-full p-1 border rounded text-sm" />
                  </div>
                ))}
                <button onClick={() => addItem('team', 'members', { name: '', role: '', image: '', bio: '' })} className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-amber-500 hover:text-amber-500 transition h-full">
                  <Plus size={24} />
                  <span>Add Member</span>
                </button>
              </div>
            </div>
          )}

          {/* Photo Gallery Editor */}
          {activeSection === 'photoGallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Photo Gallery</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={sections.photoGallery?.enabled} onChange={(e) => updateSection('photoGallery', { enabled: e.target.checked })} className="w-5 h-5 text-amber-600 rounded" />
                  <span className="font-medium">Enable</span>
                </label>
              </div>
              <input type="text" value={sections.photoGallery?.title} onChange={(e) => updateSection('photoGallery', { title: e.target.value })} className="w-full p-2 border rounded-lg" placeholder="Section Title" />
              
              <div className="flex gap-3">
                <button onClick={() => { setBulkUploadTarget('photoGallery'); setBulkUploadOpen(true); }} className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center gap-2">
                  <ImageIcon size={18} /> Bulk Add Images
                </button>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                {sections.photoGallery?.images?.map((img: any) => (
                  <div key={img.id} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeItem('photoGallery', 'images', img.id)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                      <X size={14} />
                    </button>
                    <input 
                      type="text" 
                      value={img.caption || ''} 
                      onChange={(e) => updateItem('photoGallery', 'images', img.id, { caption: e.target.value })} 
                      placeholder="Caption"
                      className="absolute bottom-0 left-0 right-0 p-1 text-xs bg-black/50 text-white border-none outline-none text-center opacity-0 group-hover:opacity-100 transition"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ... Add other section editors here if needed ... */}

        </div>
      </div>

      <BulkImageUpload 
        isOpen={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        onAddImages={handleBulkImages}
      />
    </div>
  );
}
