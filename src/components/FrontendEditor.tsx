import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function FrontendEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'colors' | 'typography'>('quick');
  
  // Safe context access
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
  
  // Safe access to settings
  const colors = siteSettings?.colors || {
    primary: '#f59e0b',
    secondary: '#1f2937',
    accent: '#ea580c',
    background: '#ffffff',
    text: '#1f2937'
  };
  
  const typography = siteSettings?.typography || {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseFontSize: 16,
    lineHeight: 1.6
  };

  const updateColors = (key: string, value: string) => {
    try {
      updateSiteSettings({
        ...siteSettings,
        colors: {
          ...colors,
          [key]: value
        }
      });
    } catch (e) {
      console.error('Error updating colors:', e);
    }
  };

  const updateTypography = (key: string, value: string | number) => {
    try {
      updateSiteSettings({
        ...siteSettings,
        typography: {
          ...typography,
          [key]: value
        }
      });
    } catch (e) {
      console.error('Error updating typography:', e);
    }
  };

  const fonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
    'Poppins', 'Raleway', 'Oswald', 'Playfair Display', 'Merriweather'
  ];

  const colorPresets = [
    { name: 'Orange', primary: '#f59e0b' },
    { name: 'Blue', primary: '#3b82f6' },
    { name: 'Green', primary: '#10b981' },
    { name: 'Red', primary: '#ef4444' },
    { name: 'Purple', primary: '#8b5cf6' },
    { name: 'Teal', primary: '#14b8a6' },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        title="Design Editor"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

      {/* Editor Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
            <h3 className="font-semibold">Design Editor</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${activeTab === 'quick' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500'}`}
            >
              Quick
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${activeTab === 'colors' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500'}`}
            >
              Colors
            </button>
            <button
              onClick={() => setActiveTab('typography')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${activeTab === 'typography' ? 'text-amber-600 border-b-2 border-amber-600' : 'text-gray-500'}`}
            >
              Fonts
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {activeTab === 'quick' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Color Presets</label>
                  <div className="grid grid-cols-6 gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => updateColors('primary', preset.primary)}
                        className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-all hover:scale-110"
                        style={{ backgroundColor: preset.primary }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    Font Size: {typography.baseFontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    value={typography.baseFontSize}
                    onChange={(e) => updateTypography('baseFontSize', parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Heading Font</label>
                  <select
                    value={typography.headingFont}
                    onChange={(e) => updateTypography('headingFont', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <Link
                  to="/admin"
                  className="block w-full text-center px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                >
                  Open Full Admin Panel →
                </Link>
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Primary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={colors.primary}
                      onChange={(e) => updateColors('primary', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={colors.primary}
                      onChange={(e) => updateColors('primary', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Secondary Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={colors.secondary}
                      onChange={(e) => updateColors('secondary', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={colors.secondary}
                      onChange={(e) => updateColors('secondary', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Accent Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={colors.accent}
                      onChange={(e) => updateColors('accent', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={colors.accent}
                      onChange={(e) => updateColors('accent', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2">Quick Presets</label>
                  <div className="grid grid-cols-6 gap-2">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => updateColors('primary', preset.primary)}
                        className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-gray-400"
                        style={{ backgroundColor: preset.primary }}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'typography' && (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Preview</p>
                  <h3 style={{ fontFamily: typography.headingFont }} className="text-lg font-bold">
                    Heading Text
                  </h3>
                  <p style={{ fontFamily: typography.bodyFont, fontSize: `${typography.baseFontSize}px` }}>
                    Body text preview
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Heading Font</label>
                  <select
                    value={typography.headingFont}
                    onChange={(e) => updateTypography('headingFont', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Body Font</label>
                  <select
                    value={typography.bodyFont}
                    onChange={(e) => updateTypography('bodyFont', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Base Font Size: {typography.baseFontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="22"
                    value={typography.baseFontSize}
                    onChange={(e) => updateTypography('baseFontSize', parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Line Height: {typography.lineHeight}
                  </label>
                  <input
                    type="range"
                    min="1.2"
                    max="2"
                    step="0.1"
                    value={typography.lineHeight}
                    onChange={(e) => updateTypography('lineHeight', parseFloat(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FrontendEditor;
