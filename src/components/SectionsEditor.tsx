import { useState } from 'react';
import { 
  Plus, Trash2, ChevronDown, ChevronUp, Save, Image, 
  MessageCircle, Users, Award, Video, Camera, FileText,
  Map, Star, Mail, CloudSun, HelpCircle, Handshake
} from 'lucide-react';
import { BulkImageUpload } from './BulkImageUpload';

interface SectionsEditorProps {
  sections: any;
  onSave: (sections: any) => void;
}

export function SectionsEditor({ sections, onSave }: SectionsEditorProps) {
  const [activeSection, setActiveSection] = useState<string | null>('faq');
  const [localSections, setLocalSections] = useState(sections || getDefaultSections());
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [bulkUploadTarget, setBulkUploadTarget] = useState<string>('');

  const handleSave = () => {
    onSave(localSections);
  };

  const updateSection = (sectionKey: string, data: any) => {
    setLocalSections((prev: any) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], ...data }
    }));
  };

  const addItem = (sectionKey: string, itemsKey: string, newItem: any) => {
    setLocalSections((prev: any) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [itemsKey]: [...(prev[sectionKey]?.[itemsKey] || []), { ...newItem, id: Date.now().toString() }]
      }
    }));
  };

  const removeItem = (sectionKey: string, itemsKey: string, itemId: string) => {
    setLocalSections((prev: any) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [itemsKey]: prev[sectionKey]?.[itemsKey]?.filter((item: any) => item.id !== itemId) || []
      }
    }));
  };

  const updateItem = (sectionKey: string, itemsKey: string, itemId: string, data: any) => {
    setLocalSections((prev: any) => ({
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
      const newImages = images.map(img => ({
        id: Date.now().toString() + Math.random(),
        url: img.url,
        caption: img.caption || ''
      }));
      setLocalSections((prev: any) => ({
        ...prev,
        photoGallery: {
          ...prev.photoGallery,
          images: [...(prev.photoGallery?.images || []), ...newImages]
        }
      }));
    } else if (bulkUploadTarget === 'instagram') {
      setLocalSections((prev: any) => ({
        ...prev,
        instagram: {
          ...prev.instagram,
          images: [...(prev.instagram?.images || []), ...images.map(img => img.url)]
        }
      }));
    }
    setBulkUploadOpen(false);
  };

  const sectionsList = [
    { key: 'faq', label: 'FAQ Section', icon: HelpCircle },
    { key: 'team', label: 'Team Section', icon: Users },
    { key: 'partners', label: 'Partners', icon: Handshake },
    { key: 'videoGallery', label: 'Video Gallery', icon: Video },
    { key: 'photoGallery', label: 'Photo Gallery', icon: Camera },
    { key: 'instagram', label: 'Instagram Feed', icon: Camera },
    { key: 'blog', label: 'Blog Preview', icon: FileText },
    { key: 'awards', label: 'Awards', icon: Award },
    { key: 'reviews', label: 'Reviews', icon: Star },
    { key: 'newsletter', label: 'Newsletter', icon: Mail },
    { key: 'weather', label: 'Weather Widget', icon: CloudSun },
    { key: 'routeMap', label: 'Route Map', icon: Map },
    { key: 'whatsapp', label: 'WhatsApp Button', icon: MessageCircle },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r overflow-y-auto">
        <div className="p-4 border-b bg-white sticky top-0">
          <h3 className="font-bold text-gray-900">Homepage Sections</h3>
          <p className="text-xs text-gray-500 mt-1">Click to edit each section</p>
        </div>
        <div className="p-2">
          {sectionsList.map(section => {
            const Icon = section.icon;
            const isEnabled = localSections[section.key]?.enabled !== false;
            return (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition mb-1 ${
                  activeSection === section.key 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon size={18} />
                <span className="flex-1 text-sm font-medium">{section.label}</span>
                <span className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-gray-300'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* FAQ Section Editor */}
          {activeSection === 'faq' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">FAQ Section</h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localSections.faq?.enabled !== false}
                    onChange={(e) => updateSection('faq', { enabled: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-amber-500"
                  />
                  <span className="text-sm text-gray-600">Enable Section</span>
                </label>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={localSections.faq?.title || 'Frequently Asked Questions'}
                    onChange={(e) => updateSection('faq', { title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Questions</h3>
                  <button
                    onClick={() => addItem('faq', 'items', { question: '', answer: '' })}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                  >
                    <Plus size={18} /> Add Question
                  </button>
                </div>

                {(localSections.faq?.items || []).map((item: any, index: number) => (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <span className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </span>
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => updateItem('faq', 'items', item.id, { question: e.target.value })}
                          placeholder="Question..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium"
                        />
                        <textarea
                          value={item.answer}
                          onChange={(e) => updateItem('faq', 'items', item.id, { answer: e.target.value })}
                          placeholder="Answer..."
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                        />
                      </div>
                      <button
                        onClick={() => removeItem('faq', 'items', item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Section Editor */}
          {activeSection === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Team Section</h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localSections.team?.enabled !== false}
                    onChange={(e) => updateSection('team', { enabled: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-amber-500"
                  />
                  <span className="text-sm text-gray-600">Enable Section</span>
                </label>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={localSections.team?.title || 'Meet Our Team'}
                    onChange={(e) => updateSection('team', { title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Team Members</h3>
                  <button
                    onClick={() => addItem('team', 'members', { name: '', role: '', image: '', bio: '' })}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                  >
                    <Plus size={18} /> Add Member
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {(localSections.team?.members || []).map((member: any) => (
                    <div key={member.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                          {member.image ? (
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Users size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => updateItem('team', 'members', member.id, { name: e.target.value })}
                            placeholder="Name"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium"
                          />
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => updateItem('team', 'members', member.id, { role: e.target.value })}
                            placeholder="Role"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <button
                          onClick={() => removeItem('team', 'members', member.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={member.image}
                        onChange={(e) => updateItem('team', 'members', member.id, { image: e.target.value })}
                        placeholder="Image URL"
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        value={member.bio}
                        onChange={(e) => updateItem('team', 'members', member.id, { bio: e.target.value })}
                        placeholder="Short bio"
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Photo Gallery Editor */}
          {activeSection === 'photoGallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Photo Gallery</h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localSections.photoGallery?.enabled !== false}
                    onChange={(e) => updateSection('photoGallery', { enabled: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-amber-500"
                  />
                  <span className="text-sm text-gray-600">Enable Section</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setBulkUploadTarget('photoGallery');
                    setBulkUploadOpen(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition font-semibold"
                >
                  <Image size={20} /> Add Multiple Images
                </button>
                <button
                  onClick={() => addItem('photoGallery', 'images', { url: '', caption: '' })}
                  className="flex items-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  <Plus size={18} /> Add Single Image
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(localSections.photoGallery?.images || []).map((image: any) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                      {image.url ? (
                        <img src={image.url} alt={image.caption || 'Gallery'} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Camera size={32} />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem('photoGallery', 'images', image.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                    <input
                      type="text"
                      value={image.url}
                      onChange={(e) => updateItem('photoGallery', 'images', image.id, { url: e.target.value })}
                      placeholder="Image URL"
                      className="w-full mt-2 px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instagram Feed Editor */}
          {activeSection === 'instagram' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Instagram Feed</h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localSections.instagram?.enabled !== false}
                    onChange={(e) => updateSection('instagram', { enabled: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-amber-500"
                  />
                  <span className="text-sm text-gray-600">Enable Section</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Username</label>
                <input
                  type="text"
                  value={localSections.instagram?.username || ''}
                  onChange={(e) => updateSection('instagram', { username: e.target.value })}
                  placeholder="@yourusername"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setBulkUploadTarget('instagram');
                    setBulkUploadOpen(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition font-semibold"
                >
                  <Image size={20} /> Add Multiple Images
                </button>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {(localSections.instagram?.images || []).map((url: string, index: number) => (
                  <div key={index} className="relative group aspect-square">
                    <img src={url} alt={`Instagram ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => {
                        setLocalSections((prev: any) => ({
                          ...prev,
                          instagram: {
                            ...prev.instagram,
                            images: prev.instagram?.images?.filter((_: any, i: number) => i !== index) || []
                          }
                        }));
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Editor */}
          {activeSection === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localSections.reviews?.enabled !== false}
                    onChange={(e) => updateSection('reviews', { enabled: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-amber-500"
                  />
                  <span className="text-sm text-gray-600">Enable Section</span>
                </label>
              </div>

              <button
                onClick={() => addItem('reviews', 'items', { name: '', country: '', rating: 5, text: '', tour: '' })}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
              >
                <Plus size={18} /> Add Review
              </button>

              <div className="grid md:grid-cols-2 gap-4">
                {(localSections.reviews?.items || []).map((review: any) => (
                  <div key={review.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            onClick={() => updateItem('reviews', 'items', review.id, { rating: star })}
                            className={`text-xl ${star <= review.rating ? 'text-amber-500' : 'text-gray-300'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => removeItem('reviews', 'items', review.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={review.name}
                        onChange={(e) => updateItem('reviews', 'items', review.id, { name: e.target.value })}
                        placeholder="Customer name"
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={review.country}
                        onChange={(e) => updateItem('reviews', 'items', review.id, { country: e.target.value })}
                        placeholder="Country"
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <textarea
                      value={review.text}
                      onChange={(e) => updateItem('reviews', 'items', review.id, { text: e.target.value })}
                      placeholder="Review text..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                    />
                    <input
                      type="text"
                      value={review.tour}
                      onChange={(e) => updateItem('reviews', 'items', review.id, { tour: e.target.value })}
                      placeholder="Tour name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp Editor */}
          {activeSection === 'whatsapp' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">WhatsApp Button</h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localSections.whatsapp?.enabled !== false}
                    onChange={(e) => updateSection('whatsapp', { enabled: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-amber-500"
                  />
                  <span className="text-sm text-gray-600">Enable Button</span>
                </label>
              </div>

              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Phone Number</label>
                  <input
                    type="text"
                    value={localSections.whatsapp?.phoneNumber || ''}
                    onChange={(e) => updateSection('whatsapp', { phoneNumber: e.target.value })}
                    placeholder="+977 9801234567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +977 for Nepal)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Message</label>
                  <textarea
                    value={localSections.whatsapp?.message || ''}
                    onChange={(e) => updateSection('whatsapp', { message: e.target.value })}
                    placeholder="Hi! I'm interested in your motorcycle tours..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                  />
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-2">Preview</h4>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="text-white" size={28} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Chat on WhatsApp</p>
                    <p className="text-sm text-gray-600">{localSections.whatsapp?.phoneNumber || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Newsletter Editor */}
          {activeSection === 'newsletter' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Newsletter Section</h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={localSections.newsletter?.enabled !== false}
                    onChange={(e) => updateSection('newsletter', { enabled: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-amber-500"
                  />
                  <span className="text-sm text-gray-600">Enable Section</span>
                </label>
              </div>

              <div className="max-w-xl space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={localSections.newsletter?.title || ''}
                    onChange={(e) => updateSection('newsletter', { title: e.target.value })}
                    placeholder="Get 10% Off Your First Tour!"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={localSections.newsletter?.subtitle || ''}
                    onChange={(e) => updateSection('newsletter', { subtitle: e.target.value })}
                    placeholder="Subscribe to our newsletter for exclusive deals..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Text</label>
                  <input
                    type="text"
                    value={localSections.newsletter?.discountText || ''}
                    onChange={(e) => updateSection('newsletter', { discountText: e.target.value })}
                    placeholder="10% OFF"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Add more section editors here... */}

          {/* Save Button */}
          <div className="fixed bottom-6 right-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition shadow-lg font-semibold"
            >
              <Save size={20} /> Save All Changes
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      <BulkImageUpload
        isOpen={bulkUploadOpen}
        onClose={() => setBulkUploadOpen(false)}
        onAddImages={handleBulkImages}
        title={bulkUploadTarget === 'photoGallery' ? 'Add Gallery Images' : 'Add Instagram Images'}
      />
    </div>
  );
}

function getDefaultSections() {
  return {
    faq: { enabled: true, title: 'Frequently Asked Questions', items: [] },
    team: { enabled: true, title: 'Meet Our Team', members: [] },
    partners: { enabled: true, title: 'Our Partners', items: [] },
    videoGallery: { enabled: true, title: 'Video Gallery', videos: [] },
    photoGallery: { enabled: true, title: 'Photo Gallery', images: [] },
    instagram: { enabled: true, username: '', images: [] },
    blog: { enabled: true, title: 'From Our Blog', posts: [] },
    awards: { enabled: true, title: 'Awards & Certifications', items: [] },
    reviews: { enabled: true, title: 'Customer Reviews', items: [] },
    newsletter: { enabled: true, title: 'Get 10% Off!', subtitle: 'Subscribe to our newsletter', discountText: '10% OFF' },
    weather: { enabled: true, locations: [] },
    routeMap: { enabled: true, title: 'Our Routes', embedUrl: '' },
    whatsapp: { enabled: true, phoneNumber: '', message: '' },
    countdown: { enabled: true },
  };
}
