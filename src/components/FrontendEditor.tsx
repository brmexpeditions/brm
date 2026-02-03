import { useState } from 'react';
import { Settings, X, Palette, Type, Layout } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function FrontendEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout'>('colors');
  
  // Get context safely
  let context;
  try {
    context = useApp();
  } catch {
    return null;
  }
  
  if (!context) return null;
  
  const { isAuthenticated, siteSettings, updateSiteSettings } = context;
  
  // Only show for authenticated users
  if (!isAuthenticated) return null;

  // Safe defaults
  const colors = siteSettings?.colors || {
    primary: '#f59e0b',
    secondary: '#1f2937',
    accent: '#ea580c',
    background: '#ffffff',
    text: '#111827',
    textLight: '#6b7280'
  };

  const typography = siteSettings?.typography || {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseFontSize: 16,
    lineHeight: 1.6,
    letterSpacing: 0
  };

  const colorPresets = [
    { name: 'Orange', primary: '#f59e0b', accent: '#ea580c' },
    { name: 'Blue', primary: '#3b82f6', accent: '#1d4ed8' },
    { name: 'Green', primary: '#10b981', accent: '#059669' },
    { name: 'Red', primary: '#ef4444', accent: '#dc2626' },
    { name: 'Purple', primary: '#8b5cf6', accent: '#7c3aed' },
    { name: 'Teal', primary: '#14b8a6', accent: '#0d9488' },
  ];

  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Montserrat', 'Poppins', 
    'Playfair Display', 'Oswald', 'Raleway', 'Lato', 'Nunito'
  ];

  const handleColorChange = (key: string, value: string) => {
    try {
      updateSiteSettings({
        colors: { ...colors, [key]: value }
      });
    } catch (e) {
      console.error('Error updating colors:', e);
    }
  };

  const handleTypographyChange = (key: string, value: string | number) => {
    try {
      updateSiteSettings({
        typography: { ...typography, [key]: value }
      });
    } catch (e) {
      console.error('Error updating typography:', e);
    }
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    try {
      updateSiteSettings({
        colors: { ...colors, primary: preset.primary, accent: preset.accent }
      });
    } catch (e) {
      console.error('Error applying preset:', e);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        title="Open Design Editor"
      >
        <Settings size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings size={20} />
          <span className="font-semibold">Design Editor</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-700 rounded"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === 'colors' ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50' : 'text-gray-500'
          }`}
        >
          <Palette size={16} /> Colors
        </button>
        <button
          onClick={() => setActiveTab('typography')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === 'typography' ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50' : 'text-gray-500'
          }`}
        >
          <Type size={16} /> Fonts
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === 'layout' ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50' : 'text-gray-500'
          }`}
        >
          <Layout size={16} /> More
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            {/* Presets */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Quick Presets</label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="w-10 h-10 rounded-lg shadow-sm border-2 border-white hover:scale-110 transition"
                    style={{ backgroundColor: preset.primary }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            {/* Individual Colors */}
            <div className="space-y-3">
              {[
                { key: 'primary', label: 'Primary' },
                { key: 'secondary', label: 'Secondary' },
                { key: 'accent', label: 'Accent' },
                { key: 'background', label: 'Background' },
                { key: 'text', label: 'Text' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">{item.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(colors as unknown as Record<string, string>)[item.key] || '#000000'}
                      onChange={(e) => handleColorChange(item.key, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={(colors as unknown as Record<string, string>)[item.key] || ''}
                      onChange={(e) => handleColorChange(item.key, e.target.value)}
                      className="w-20 text-xs px-2 py-1 border rounded font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Typography Tab */}
        {activeTab === 'typography' && (
          <div className="space-y-4">
            {/* Font Preview */}
            <div 
              className="p-4 bg-gray-50 rounded-lg border"
              style={{ fontFamily: typography.bodyFont }}
            >
              <h4 
                className="text-lg font-bold mb-1"
                style={{ fontFamily: typography.headingFont }}
              >
                Preview Heading
              </h4>
              <p className="text-sm text-gray-600">This is body text preview.</p>
            </div>

            {/* Heading Font */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Heading Font</label>
              <select
                value={typography.headingFont}
                onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
              >
                {fonts.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            {/* Body Font */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">Body Font</label>
              <select
                value={typography.bodyFont}
                onChange={(e) => handleTypographyChange('bodyFont', e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
              >
                {fonts.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            {/* Base Font Size */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">
                Base Font Size: {typography.baseFontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="20"
                value={typography.baseFontSize}
                onChange={(e) => handleTypographyChange('baseFontSize', parseInt(e.target.value))}
                className="w-full mt-1"
              />
            </div>

            {/* Line Height */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase">
                Line Height: {typography.lineHeight}
              </label>
              <input
                type="range"
                min="1.2"
                max="2"
                step="0.1"
                value={typography.lineHeight}
                onChange={(e) => handleTypographyChange('lineHeight', parseFloat(e.target.value))}
                className="w-full mt-1"
              />
            </div>
          </div>
        )}

        {/* Layout Tab */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 mb-4">
                For more options, visit the Admin Panel
              </p>
              <a
                href="/admin"
                className="inline-block px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
              >
                Open Admin Panel
              </a>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Tips:</h4>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Colors apply instantly across the site</li>
                <li>• Fonts load from Google Fonts</li>
                <li>• Changes are saved automatically</li>
                <li>• Use Admin Panel for more options</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
