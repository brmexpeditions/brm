import { useState } from 'react';
import { CompanySettings } from '../types';

interface SetupWizardProps {
  onComplete: (settings: CompanySettings) => void;
  onSkip: () => void;
}

export function SetupWizard({ onComplete, onSkip }: SetupWizardProps) {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState<CompanySettings>({
    companyName: '',
    tagline: '',
    logo: '',
    email: '',
    phone: '',
    alternatePhone: '',
    website: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
    panNumber: '',
    businessRegNumber: '',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) {
        alert('Logo file size should be less than 500KB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = () => {
    if (!settings.companyName.trim()) {
      alert('Please enter your company name');
      return;
    }
    onComplete(settings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 text-center">
          <div className="text-4xl mb-2">🏍️</div>
          <h1 className="text-2xl font-bold">Motorcycle Fleet Manager</h1>
          <p className="text-blue-100 text-sm mt-1">Setup your fleet management system</p>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Step {step} of 2</span>
            <button 
              onClick={onSkip}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Skip Setup →
            </button>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${step * 50}%` }}
            />
          </div>
        </div>

        {/* Step 1: Company Info */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">📋 Company Information</h2>
            <p className="text-sm text-gray-500">Tell us about your business</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                placeholder="e.g., BRM Expeditions"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                placeholder="e.g., Adventure Awaits"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
              <div className="flex items-center gap-4">
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo" className="w-16 h-16 object-contain rounded-lg border" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="inline-block px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-gray-200"
                  >
                    Upload Logo
                  </label>
                  <p className="text-xs text-gray-400 mt-1">Max 500KB</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="info@company.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Address & Business Details */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">📍 Business Details</h2>
            <p className="text-sm text-gray-500">Optional business information</p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="Street address"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={settings.city}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  placeholder="City"
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  value={settings.state}
                  onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                  placeholder="State"
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PIN</label>
                <input
                  type="text"
                  value={settings.pincode}
                  onChange={(e) => setSettings({ ...settings, pincode: e.target.value })}
                  placeholder="PIN"
                  className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                <input
                  type="text"
                  value={settings.gstNumber}
                  onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                  placeholder="Optional"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                <input
                  type="text"
                  value={settings.panNumber}
                  onChange={(e) => setSettings({ ...settings, panNumber: e.target.value })}
                  placeholder="Optional"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                ✓ Complete Setup
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> You can update all settings later from the Settings tab. Your data is stored locally on this device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
