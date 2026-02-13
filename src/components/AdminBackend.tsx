import React, { useState } from 'react';

interface SiteSettings {
  // Branding
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  
  // Typography
  headingFont: string;
  bodyFont: string;
  fontSize: 'small' | 'medium' | 'large';
  
  // Images
  heroImage: string;
  aboutImage: string;
  featureImages: string[];
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  
  // Analytics
  googleAnalyticsId: string;
  googleSearchConsole: string;
  facebookPixel: string;
  
  // Social
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  
  // Contact
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  
  // Pricing
  starterPrice: number;
  starterVehicles: number;
  proPrice: number;
  proVehicles: number;
  enterprisePrice: number;
  
  // Sections
  showPricing: boolean;
  showReviews: boolean;
  showFaq: boolean;
  showContact: boolean;
  showBrands: boolean;
  
  // Custom Code
  customCss: string;
  headerScripts: string;
  footerScripts: string;
}

interface AdminBackendProps {
  settings: SiteSettings;
  onSave: (settings: SiteSettings) => void;
  onClose: () => void;
}

const defaultSettings: SiteSettings = {
  siteName: 'Fleet Guard',
  tagline: 'Protect Your Fleet',
  logo: '',
  favicon: '',
  primaryColor: '#F59E0B',
  secondaryColor: '#1F2937',
  accentColor: '#10B981',
  backgroundColor: '#111827',
  textColor: '#FFFFFF',
  headingFont: 'Inter',
  bodyFont: 'Inter',
  fontSize: 'medium',
  heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920',
  aboutImage: '',
  featureImages: [],
  metaTitle: 'Fleet Guard - Vehicle Fleet Management',
  metaDescription: 'Manage your vehicle fleet efficiently with Fleet Guard',
  metaKeywords: 'fleet management, vehicle tracking, service reminders',
  ogImage: '',
  googleAnalyticsId: '',
  googleSearchConsole: '',
  facebookPixel: '',
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
  youtube: '',
  email: 'support@fleetguard.in',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  address: 'Mumbai, India',
  starterPrice: 0,
  starterVehicles: 5,
  proPrice: 2000,
  proVehicles: 30,
  enterprisePrice: 3500,
  showPricing: true,
  showReviews: true,
  showFaq: true,
  showContact: true,
  showBrands: true,
  customCss: '',
  headerScripts: '',
  footerScripts: '',
};

const fontOptions = [
  'Inter', 'Poppins', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
  'Source Sans Pro', 'Raleway', 'Nunito', 'Ubuntu', 'Playfair Display'
];

const colorPresets = [
  { name: 'Golden Black', primary: '#F59E0B', secondary: '#1F2937', accent: '#10B981', bg: '#111827' },
  { name: 'Ocean Blue', primary: '#3B82F6', secondary: '#1E3A5F', accent: '#06B6D4', bg: '#0F172A' },
  { name: 'Forest Green', primary: '#22C55E', secondary: '#14532D', accent: '#84CC16', bg: '#052E16' },
  { name: 'Royal Purple', primary: '#A855F7', secondary: '#3B0764', accent: '#EC4899', bg: '#1E1B4B' },
  { name: 'Sunset Orange', primary: '#F97316', secondary: '#7C2D12', accent: '#FBBF24', bg: '#1C1917' },
  { name: 'Crimson Red', primary: '#EF4444', secondary: '#7F1D1D', accent: '#F59E0B', bg: '#1F2937' },
];

export function AdminBackend({ settings: initialSettings, onSave, onClose }: AdminBackendProps) {
  const [settings, setSettings] = useState<SiteSettings>({ ...defaultSettings, ...initialSettings });
  const [activeTab, setActiveTab] = useState('branding');
  const [saved, setSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const tabs = [
    { id: 'branding', label: '🎨 Branding', icon: '🎨' },
    { id: 'colors', label: '🎯 Colors & Theme', icon: '🎯' },
    { id: 'typography', label: '🔤 Typography', icon: '🔤' },
    { id: 'images', label: '🖼️ Images', icon: '🖼️' },
    { id: 'seo', label: '🔍 SEO', icon: '🔍' },
    { id: 'analytics', label: '📊 Analytics', icon: '📊' },
    { id: 'social', label: '📱 Social Media', icon: '📱' },
    { id: 'contact', label: '📞 Contact', icon: '📞' },
    { id: 'pricing', label: '💰 Pricing', icon: '💰' },
    { id: 'sections', label: '📋 Sections', icon: '📋' },
    { id: 'code', label: '💻 Custom Code', icon: '💻' },
  ];

  const handleSave = () => {
    onSave(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Reset all settings to default?')) {
      setSettings(defaultSettings);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-settings.json';
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          setSettings({ ...defaultSettings, ...imported });
        } catch (err) {
          alert('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setSettings({
      ...settings,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
      backgroundColor: preset.bg,
    });
  };

  const updateSetting = (key: keyof SiteSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">⚙️</span>
            </div>
            <div>
              <h2 className="text-white font-bold">Admin Backend</h2>
              <p className="text-gray-500 text-xs">Site Management</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-400 border-l-2 border-amber-500'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label.replace(tab.icon + ' ', '')}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-800 space-y-2">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
          >
            📥 Export Settings
          </button>
          <label className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors cursor-pointer">
            📤 Import Settings
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm transition-colors"
          >
            🔄 Reset to Default
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-white font-semibold">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            {saved && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                ✓ Saved
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                previewMode ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              👁️ Preview
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold rounded-lg transition-all"
            >
              💾 Save Changes
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Site Identity</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => updateSetting('siteName', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      placeholder="Fleet Guard"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => updateSetting('tagline', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      placeholder="Protect Your Fleet"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Logo URL</label>
                    <input
                      type="text"
                      value={settings.logo}
                      onChange={(e) => updateSetting('logo', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      placeholder="https://example.com/logo.png"
                    />
                    {settings.logo && (
                      <div className="mt-2 p-4 bg-gray-800 rounded-lg inline-block">
                        <img src={settings.logo} alt="Logo preview" className="h-12 object-contain" />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Favicon URL</label>
                    <input
                      type="text"
                      value={settings.favicon}
                      onChange={(e) => updateSetting('favicon', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Color Presets</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyColorPreset(preset)}
                      className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-amber-500 transition-all text-left"
                    >
                      <div className="flex gap-1 mb-2">
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.primary }}></div>
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.secondary }}></div>
                        <div className="w-6 h-6 rounded" style={{ backgroundColor: preset.accent }}></div>
                        <div className="w-6 h-6 rounded border border-gray-600" style={{ backgroundColor: preset.bg }}></div>
                      </div>
                      <p className="text-white text-sm font-medium">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Custom Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'primaryColor', label: 'Primary Color' },
                    { key: 'secondaryColor', label: 'Secondary Color' },
                    { key: 'accentColor', label: 'Accent Color' },
                    { key: 'backgroundColor', label: 'Background Color' },
                    { key: 'textColor', label: 'Text Color' },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-gray-400 text-sm mb-2">{label}</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={settings[key as keyof SiteSettings] as string}
                          onChange={(e) => updateSetting(key as keyof SiteSettings, e.target.value)}
                          className="w-12 h-12 rounded-lg cursor-pointer bg-gray-800 border border-gray-700"
                        />
                        <input
                          type="text"
                          value={settings[key as keyof SiteSettings] as string}
                          onChange={(e) => updateSetting(key as keyof SiteSettings, e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none uppercase"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Live Preview */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Live Preview</h3>
                <div 
                  className="p-6 rounded-xl"
                  style={{ backgroundColor: settings.backgroundColor }}
                >
                  <h4 
                    className="text-2xl font-bold mb-2"
                    style={{ color: settings.primaryColor }}
                  >
                    {settings.siteName}
                  </h4>
                  <p style={{ color: settings.textColor }}>{settings.tagline}</p>
                  <div className="flex gap-2 mt-4">
                    <button
                      className="px-4 py-2 rounded-lg font-medium"
                      style={{ backgroundColor: settings.primaryColor, color: settings.backgroundColor }}
                    >
                      Primary Button
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg font-medium"
                      style={{ backgroundColor: settings.secondaryColor, color: settings.textColor }}
                    >
                      Secondary
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg font-medium"
                      style={{ backgroundColor: settings.accentColor, color: settings.backgroundColor }}
                    >
                      Accent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Fonts</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Heading Font</label>
                    <select
                      value={settings.headingFont}
                      onChange={(e) => updateSetting('headingFont', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    >
                      {fontOptions.map((font) => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Body Font</label>
                    <select
                      value={settings.bodyFont}
                      onChange={(e) => updateSetting('bodyFont', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    >
                      {fontOptions.map((font) => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Base Font Size</label>
                    <select
                      value={settings.fontSize}
                      onChange={(e) => updateSetting('fontSize', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="small">Small (14px)</option>
                      <option value="medium">Medium (16px)</option>
                      <option value="large">Large (18px)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Typography Preview */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Preview</h3>
                <div className="space-y-4" style={{ fontFamily: settings.bodyFont }}>
                  <h1 className="text-3xl font-bold text-white" style={{ fontFamily: settings.headingFont }}>
                    Heading 1 - {settings.headingFont}
                  </h1>
                  <h2 className="text-2xl font-semibold text-white" style={{ fontFamily: settings.headingFont }}>
                    Heading 2 - Subheading
                  </h2>
                  <p className="text-gray-300">
                    Body text using {settings.bodyFont}. This is how your regular text will appear throughout the website. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Hero Image</h3>
                <input
                  type="text"
                  value={settings.heroImage}
                  onChange={(e) => updateSetting('heroImage', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none mb-4"
                  placeholder="https://example.com/hero.jpg"
                />
                {settings.heroImage && (
                  <div className="rounded-xl overflow-hidden">
                    <img 
                      src={settings.heroImage} 
                      alt="Hero preview" 
                      className="w-full h-48 object-cover"
                      onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Image+Not+Found'}
                    />
                  </div>
                )}
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Suggested Free Image Sources</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Unsplash', url: 'https://unsplash.com', desc: 'High-quality free photos' },
                    { name: 'Pexels', url: 'https://pexels.com', desc: 'Free stock photos & videos' },
                    { name: 'Pixabay', url: 'https://pixabay.com', desc: 'Free images & royalty-free' },
                    { name: 'Freepik', url: 'https://freepik.com', desc: 'Free vectors & photos' },
                  ].map((source) => (
                    <a
                      key={source.name}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-amber-500 transition-colors"
                    >
                      <p className="text-white font-medium">{source.name}</p>
                      <p className="text-gray-500 text-sm">{source.desc}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Meta Tags</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Meta Title</label>
                    <input
                      type="text"
                      value={settings.metaTitle}
                      onChange={(e) => updateSetting('metaTitle', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      placeholder="Fleet Guard - Vehicle Fleet Management"
                    />
                    <p className="text-gray-500 text-xs mt-1">{settings.metaTitle.length}/60 characters</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Meta Description</label>
                    <textarea
                      value={settings.metaDescription}
                      onChange={(e) => updateSetting('metaDescription', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="Manage your vehicle fleet efficiently..."
                    />
                    <p className="text-gray-500 text-xs mt-1">{settings.metaDescription.length}/160 characters</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={settings.metaKeywords}
                      onChange={(e) => updateSetting('metaKeywords', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      placeholder="fleet management, vehicle tracking, service reminders"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">OG Image URL (for social sharing)</label>
                    <input
                      type="text"
                      value={settings.ogImage}
                      onChange={(e) => updateSetting('ogImage', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      placeholder="https://example.com/og-image.jpg"
                    />
                  </div>
                </div>
              </div>
              
              {/* Google Search Console */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Google Search Console</h3>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Verification Code</label>
                  <input
                    type="text"
                    value={settings.googleSearchConsole}
                    onChange={(e) => updateSetting('googleSearchConsole', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    placeholder="google-site-verification=xxxxxxxxxx"
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    Get this from: <a href="https://search.google.com/search-console" target="_blank" className="text-amber-400">Google Search Console</a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Google Analytics</h3>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Measurement ID</label>
                  <input
                    type="text"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    placeholder="G-XXXXXXXXXX"
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    Get this from: <a href="https://analytics.google.com" target="_blank" className="text-amber-400">Google Analytics</a> → Admin → Data Streams
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Facebook Pixel</h3>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Pixel ID</label>
                  <input
                    type="text"
                    value={settings.facebookPixel}
                    onChange={(e) => updateSetting('facebookPixel', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    placeholder="1234567890"
                  />
                  <p className="text-gray-500 text-xs mt-2">
                    Get this from: <a href="https://business.facebook.com/events_manager" target="_blank" className="text-amber-400">Facebook Events Manager</a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Social Media Links</h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'facebook', label: 'Facebook', icon: '📘', placeholder: 'https://facebook.com/yourpage' },
                    { key: 'twitter', label: 'Twitter/X', icon: '🐦', placeholder: 'https://twitter.com/yourhandle' },
                    { key: 'instagram', label: 'Instagram', icon: '📷', placeholder: 'https://instagram.com/yourprofile' },
                    { key: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'https://linkedin.com/company/yourcompany' },
                    { key: 'youtube', label: 'YouTube', icon: '📺', placeholder: 'https://youtube.com/@yourchannel' },
                  ].map(({ key, label, icon, placeholder }) => (
                    <div key={key}>
                      <label className="block text-gray-400 text-sm mb-2">{icon} {label}</label>
                      <input
                        type="text"
                        value={settings[key as keyof SiteSettings] as string}
                        onChange={(e) => updateSetting(key as keyof SiteSettings, e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Contact Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">📧 Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSetting('email', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      placeholder="support@example.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">📞 Phone</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => updateSetting('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">💬 WhatsApp</label>
                    <input
                      type="text"
                      value={settings.whatsapp}
                      onChange={(e) => updateSetting('whatsapp', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">📍 Address</label>
                    <textarea
                      value={settings.address}
                      onChange={(e) => updateSetting('address', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none resize-none"
                      rows={3}
                      placeholder="123 Street Name, City, State, Country"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Starter Plan (Free)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Price (₹/year)</label>
                    <input
                      type="number"
                      value={settings.starterPrice}
                      onChange={(e) => updateSetting('starterPrice', parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Max Vehicles</label>
                    <input
                      type="number"
                      value={settings.starterVehicles}
                      onChange={(e) => updateSetting('starterVehicles', parseInt(e.target.value) || 5)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Professional Plan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Price (₹/year)</label>
                    <input
                      type="number"
                      value={settings.proPrice}
                      onChange={(e) => updateSetting('proPrice', parseInt(e.target.value) || 2000)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Max Vehicles</label>
                    <input
                      type="number"
                      value={settings.proVehicles}
                      onChange={(e) => updateSetting('proVehicles', parseInt(e.target.value) || 30)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Enterprise Plan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Price (₹/year)</label>
                    <input
                      type="number"
                      value={settings.enterprisePrice}
                      onChange={(e) => updateSetting('enterprisePrice', parseInt(e.target.value) || 3500)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Max Vehicles</label>
                    <p className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-amber-400">
                      Unlimited
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sections Tab */}
          {activeTab === 'sections' && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Toggle Sections</h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'showPricing', label: 'Pricing Section' },
                    { key: 'showReviews', label: 'Customer Reviews' },
                    { key: 'showFaq', label: 'FAQ Section' },
                    { key: 'showContact', label: 'Contact Form' },
                    { key: 'showBrands', label: 'Brands Strip' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <span className="text-white">{label}</span>
                      <button
                        onClick={() => updateSetting(key as keyof SiteSettings, !settings[key as keyof SiteSettings])}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          settings[key as keyof SiteSettings] ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          settings[key as keyof SiteSettings] ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Custom Code Tab */}
          {activeTab === 'code' && (
            <div className="max-w-3xl space-y-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Custom CSS</h3>
                <textarea
                  value={settings.customCss}
                  onChange={(e) => updateSetting('customCss', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-green-400 font-mono text-sm focus:border-amber-500 focus:outline-none resize-none"
                  rows={8}
                  placeholder="/* Custom CSS */
.my-class {
  color: #F59E0B;
}"
                />
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Header Scripts (before &lt;/head&gt;)</h3>
                <textarea
                  value={settings.headerScripts}
                  onChange={(e) => updateSetting('headerScripts', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-green-400 font-mono text-sm focus:border-amber-500 focus:outline-none resize-none"
                  rows={6}
                  placeholder="<!-- Google Tag Manager, etc. -->"
                />
              </div>
              
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-amber-400 font-semibold mb-4">Footer Scripts (before &lt;/body&gt;)</h3>
                <textarea
                  value={settings.footerScripts}
                  onChange={(e) => updateSetting('footerScripts', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-950 border border-gray-700 rounded-lg text-green-400 font-mono text-sm focus:border-amber-500 focus:outline-none resize-none"
                  rows={6}
                  placeholder="<!-- Chat widgets, analytics, etc. -->"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminBackend;
