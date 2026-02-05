import React, { useState, useRef } from 'react';
import { CompanySettings as CompanySettingsType } from '../types';

interface CompanySettingsProps {
  settings: CompanySettingsType;
  onUpdate: (settings: CompanySettingsType) => void;
}

const CompanySettings: React.FC<CompanySettingsProps> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState<CompanySettingsType>(settings);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) {
        alert('Logo file size should be less than 500KB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
        setSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logo: '' }));
    setSaved(false);
  };

  const handleSave = () => {
    onUpdate(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const predefinedColors = [
    '#1e40af', '#1d4ed8', '#2563eb', // Blues
    '#059669', '#10b981', '#34d399', // Greens
    '#dc2626', '#ef4444', '#f87171', // Reds
    '#d97706', '#f59e0b', '#fbbf24', // Ambers
    '#7c3aed', '#8b5cf6', '#a78bfa', // Purples
    '#0891b2', '#06b6d4', '#22d3ee', // Cyans
    '#be185d', '#ec4899', '#f472b6', // Pinks
    '#1f2937', '#374151', '#4b5563', // Grays
  ];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          🏢 Company Settings
        </h2>

        {/* Live Preview */}
        <div className="mb-8 p-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-500 mb-4">LIVE PREVIEW</h3>
          <div className="flex items-center gap-4">
            {formData.logo ? (
              <img src={formData.logo} alt="Company Logo" className="w-20 h-20 object-contain rounded-lg border bg-white p-1" />
            ) : (
              <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 bg-white">
                LOGO
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold" style={{ color: formData.primaryColor || '#1e40af' }}>
                {formData.companyName || 'Your Company Name'}
              </h1>
              <p className="text-gray-500">{formData.tagline || 'Your tagline here'}</p>
              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                <span>📧 {formData.email || 'email@example.com'}</span>
                <span>📞 {formData.phone || '+91 XXXXX XXXXX'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
          <div className="flex items-center gap-4">
            {formData.logo ? (
              <div className="relative">
                <img src={formData.logo} alt="Logo" className="w-24 h-24 object-contain rounded-lg border p-1" />
                <button
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <span className="text-3xl text-gray-400">📷</span>
                <span className="text-xs text-gray-500 mt-1">Upload Logo</span>
              </div>
            )}
            <div className="text-sm text-gray-500">
              <p>Click to upload your company logo</p>
              <p>Recommended: 200x200px, Max 500KB</p>
              <p>Formats: PNG, JPG, SVG</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Company Info */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Your Company Name"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline / Slogan</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Your company tagline"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Contact Info */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-8 border-t pt-6">📞 Contact Information</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@company.com"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.yourcompany.com"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
            <input
              type="tel"
              name="alternatePhone"
              value={formData.alternatePhone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Address */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-8 border-t pt-6">📍 Address</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street Address, Building, etc."
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="XXXXXX"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Business Registration */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-8 border-t pt-6">📋 Business Registration</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="22AAAAA0000A1Z5"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              placeholder="AAAAA0000A"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Reg. Number</label>
            <input
              type="text"
              name="businessRegNumber"
              value={formData.businessRegNumber}
              onChange={handleChange}
              placeholder="Registration Number"
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Theme Colors */}
        <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-8 border-t pt-6">🎨 Brand Colors</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="primaryColor"
                value={formData.primaryColor || '#1e40af'}
                onChange={handleChange}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
              />
              <input
                type="text"
                value={formData.primaryColor || '#1e40af'}
                onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                className="border rounded-lg px-3 py-2 w-28 font-mono text-sm"
              />
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {predefinedColors.slice(0, 12).map(color => (
                <button
                  key={color}
                  onClick={() => setFormData(prev => ({ ...prev, primaryColor: color }))}
                  className="w-6 h-6 rounded-full border-2 border-white shadow hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="secondaryColor"
                value={formData.secondaryColor || '#059669'}
                onChange={handleChange}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-300"
              />
              <input
                type="text"
                value={formData.secondaryColor || '#059669'}
                onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                className="border rounded-lg px-3 py-2 w-28 font-mono text-sm"
              />
            </div>
            <div className="flex gap-1 mt-2 flex-wrap">
              {predefinedColors.slice(12).map(color => (
                <button
                  key={color}
                  onClick={() => setFormData(prev => ({ ...prev, secondaryColor: color }))}
                  className="w-6 h-6 rounded-full border-2 border-white shadow hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          {saved && (
            <span className="flex items-center text-green-600 gap-2">
              ✓ Settings saved successfully!
            </span>
          )}
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            💾 Save Settings
          </button>
        </div>
      </div>

    </div>
  );
};

export default CompanySettings;
