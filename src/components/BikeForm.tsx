import React, { useMemo, useState, useEffect } from 'react';
import { Motorcycle, VehicleCategory } from '../types';
import { VEHICLE_CATALOG } from '../data/vehicleCatalog';

const uniq = (arr: string[]) => Array.from(new Set(arr)).filter(Boolean);
const sortAZ = (arr: string[]) => [...arr].sort((a, b) => a.localeCompare(b));

interface BikeFormProps {
  bike?: Motorcycle | null;
  onSave: (bike: Motorcycle, newMake?: string, newModel?: string) => void;
  onCancel: () => void;
  makes: string[];
  models: Record<string, string[]>;
}

export const BikeForm: React.FC<BikeFormProps> = ({
  bike,
  onSave,
  onCancel,
  // makes/models still accepted for backward compatibility, but Bike/Car options come from the catalog
  makes: _makes,
  models: _models,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showNewMake, setShowNewMake] = useState(false);
  const [showNewModel, setShowNewModel] = useState(false);

  // Category-specific custom makes/models persisted locally
  const CUSTOM_CATALOG_KEY = 'fleet_custom_vehicle_catalog_v1';
  type CustomCatalog = Record<VehicleCategory, { makes: string[]; models: Record<string, string[]> }>;


  const [customCatalog, setCustomCatalog] = useState<CustomCatalog>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_CATALOG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CustomCatalog>;
        return {
          bike: {
            makes: Array.isArray(parsed.bike?.makes) ? parsed.bike!.makes : [],
            models: parsed.bike?.models && typeof parsed.bike.models === 'object' ? parsed.bike.models : {},
          },
          car: {
            makes: Array.isArray(parsed.car?.makes) ? parsed.car!.makes : [],
            models: parsed.car?.models && typeof parsed.car.models === 'object' ? parsed.car.models : {},
          },
        };
      }
    } catch {
      // ignore
    }
    return { bike: { makes: [], models: {} }, car: { makes: [], models: {} } };
  });

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_CATALOG_KEY, JSON.stringify(customCatalog));
    } catch {
      // ignore
    }
  }, [customCatalog]);

  const [formData, setFormData] = useState({
    vehicleCategory: 'bike' as VehicleCategory,

    currentOdometer: '',
    make: '',
    newMake: '',
    model: '',
    newModel: '',

    ownerName: '',
    registrationNumber: '',
    chassisNumber: '',
    engineNumber: '',

    vehicleType: 'commercial' as 'private' | 'commercial',

    registrationValidity: '',
    insuranceValidity: '',
    pollutionValidity: '',
    fitnessValidity: '',
    roadTaxValidity: '',

    serviceIntervalMonths: 5,
    serviceIntervalKms: 5000,
    lastServiceDate: '',
    lastServiceKm: '',
  });

  useEffect(() => {
    if (bike) {
      const kmReadings = Array.isArray(bike.kmReadings) ? bike.kmReadings : [];
      const latestReading = [...kmReadings].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

      setFormData({
        vehicleCategory: bike.vehicleCategory || 'bike',

        currentOdometer: latestReading?.kilometers?.toString() || (bike.currentOdometer?.toString() ?? '0'),
        make: bike.make || '',
        newMake: '',
        model: bike.model || '',
        newModel: '',

        ownerName: bike.ownerName || '',
        registrationNumber: bike.registrationNumber || '',
        chassisNumber: bike.chassisNumber || '',
        engineNumber: bike.engineNumber || '',

        vehicleType: bike.vehicleType || 'commercial',

        registrationValidity: bike.registrationValidity || '',
        insuranceValidity: bike.insuranceValidity || '',
        pollutionValidity: bike.pollutionValidity || '',
        fitnessValidity: bike.fitnessValidity || '',
        roadTaxValidity: bike.roadTaxValidity || '',

        serviceIntervalMonths: bike.serviceIntervalMonths || 5,
        serviceIntervalKms: bike.serviceIntervalKms || 5000,
        lastServiceDate: bike.lastServiceDate || '',
        lastServiceKm: bike.lastServiceKm?.toString() || '',
      });

      setCurrentStep(1);
      setShowNewMake(false);
      setShowNewModel(false);
    }
  }, [bike]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (cat: VehicleCategory) => {
    setFormData(prev => ({
      ...prev,
      vehicleCategory: cat,
      make: '',
      model: '',
      newMake: '',
      newModel: '',
    }));
    setShowNewMake(false);
    setShowNewModel(false);
  };

  const availableMakes = useMemo(() => {
    const cat = formData.vehicleCategory;
    const base = VEHICLE_CATALOG[cat]?.makes || [];
    const custom = customCatalog[cat]?.makes || [];

    // Back-compat: existing saved makes/models are considered "bike" makes
    const legacy = cat === 'bike' ? (_makes || []) : [];

    return sortAZ(uniq([...base, ...custom, ...legacy]));
  }, [customCatalog, formData.vehicleCategory, _makes]);

  const currentMake = (showNewMake ? formData.newMake : formData.make).trim();

  const availableModels = useMemo(() => {
    const cat = formData.vehicleCategory;
    if (!currentMake) return [];

    const base = VEHICLE_CATALOG[cat]?.models?.[currentMake] || [];
    const custom = customCatalog[cat]?.models?.[currentMake] || [];

    // Back-compat: legacy saved models are considered "bike" models
    const legacy = cat === 'bike' ? (_models?.[currentMake] || []) : [];

    return sortAZ(uniq([...base, ...custom, ...legacy]));
  }, [customCatalog, formData.vehicleCategory, currentMake, _models]);

  const persistCustomMake = (cat: VehicleCategory, mk: string) => {
    const makeTrim = mk.trim();
    if (!makeTrim) return;
    setCustomCatalog(prev => {
      const existing = prev[cat]?.makes || [];
      if (existing.includes(makeTrim)) return prev;
      return {
        ...prev,
        [cat]: {
          ...prev[cat],
          makes: sortAZ(uniq([...existing, makeTrim])),
          models: prev[cat]?.models || {},
        },
      };
    });
  };

  const persistCustomModel = (cat: VehicleCategory, mk: string, md: string) => {
    const makeTrim = mk.trim();
    const modelTrim = md.trim();
    if (!makeTrim || !modelTrim) return;

    setCustomCatalog(prev => {
      const current = prev[cat]?.models?.[makeTrim] || [];
      if (current.includes(modelTrim)) return prev;
      return {
        ...prev,
        [cat]: {
          ...prev[cat],
          makes: prev[cat]?.makes || [],
          models: {
            ...(prev[cat]?.models || {}),
            [makeTrim]: sortAZ(uniq([...current, modelTrim])),
          },
        },
      };
    });
  };

  const handleMakeSelect = (value: string) => {
    if (value === '__new__') {
      setShowNewMake(true);
      setFormData(prev => ({ ...prev, make: '', model: '' }));
    } else {
      setShowNewMake(false);
      setFormData(prev => ({ ...prev, make: value, model: '', newMake: '' }));
    }
  };

  const handleModelSelect = (value: string) => {
    if (value === '__new__') {
      setShowNewModel(true);
      setFormData(prev => ({ ...prev, model: '' }));
    } else {
      setShowNewModel(false);
      setFormData(prev => ({ ...prev, model: value, newModel: '' }));
    }
  };

  const makeId = () => {
    // randomUUID not available in some mobile webviews
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = globalThis.crypto;
    if (c?.randomUUID) return c.randomUUID();
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  };

  const handleSubmit = () => {
    const finalMake = showNewMake ? formData.newMake.trim() : formData.make.trim();
    const finalModel = showNewModel ? formData.newModel.trim() : formData.model.trim();

    if (!formData.currentOdometer || !finalMake || !finalModel || !formData.registrationNumber.trim()) {
      alert('Please fill in all required fields: Current Odometer, Make, Model, and Registration Number');
      return;
    }

    const currentKm = parseInt(formData.currentOdometer) || 0;
    const today = new Date().toISOString().split('T')[0];

    const baseReadings = Array.isArray(bike?.kmReadings) ? bike!.kmReadings : [];

    const newBike: Motorcycle = {
      id: bike?.id || makeId(),
      vehicleCategory: formData.vehicleCategory,
      make: finalMake,
      model: finalModel,

      ownerName: formData.ownerName.trim() || undefined,
      registrationNumber: formData.registrationNumber.trim().toUpperCase(),
      chassisNumber: formData.chassisNumber.trim().toUpperCase(),
      engineNumber: formData.engineNumber.trim().toUpperCase() || undefined,

      vehicleType: formData.vehicleType,

      registrationValidity: formData.registrationValidity || undefined,
      insuranceValidity: formData.insuranceValidity,
      pollutionValidity: formData.pollutionValidity,
      fitnessValidity: formData.fitnessValidity,
      roadTaxValidity: formData.roadTaxValidity,

      serviceIntervalMonths: formData.serviceIntervalMonths,
      serviceIntervalKms: formData.serviceIntervalKms,
      lastServiceDate: formData.lastServiceDate,
      lastServiceKm: parseInt(formData.lastServiceKm) || 0,

      kmReadings: baseReadings.length > 0 ? [...baseReadings] : [{ id: makeId(), date: today, kilometers: currentKm }],
      currentOdometer: currentKm,

      createdAt: bike?.createdAt || new Date().toISOString(),
    };

    // Add new km reading if odometer changed
    const latestReading = [...newBike.kmReadings]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (!latestReading || latestReading.kilometers !== currentKm) {
      const existingTodayIndex = newBike.kmReadings.findIndex(r => r.date === today);
      if (existingTodayIndex >= 0) {
        newBike.kmReadings[existingTodayIndex].kilometers = currentKm;
      } else {
        newBike.kmReadings.push({ id: makeId(), date: today, kilometers: currentKm });
      }
    }

    // Persist custom make/model per category so it appears next time
    if (showNewMake) {
      persistCustomMake(formData.vehicleCategory, finalMake);
    }
    if (showNewModel) {
      persistCustomModel(formData.vehicleCategory, finalMake, finalModel);
    }

    onSave(
      newBike,
      showNewMake ? formData.newMake : undefined,
      showNewModel ? formData.newModel : undefined
    );
  };

  const steps = [
    { num: 1, title: 'Select', icon: '✨' },
    { num: 2, title: 'Basic', icon: '🚘' },
    { num: 3, title: 'Documents', icon: '📄' },
    { num: 4, title: 'Service', icon: '🔧' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-2xl max-h-[95vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="text-white p-3 sm:p-4" style={{ background: "linear-gradient(90deg, #0B0B0B 0%, #111827 60%, #0B0B0B 100%)", borderBottom: "1px solid rgba(212,175,55,0.25)" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold tracking-wide">
              {bike ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            <button onClick={onCancel} className="text-white/80 hover:text-white text-xl leading-none">
              ✕
            </button>
          </div>
          
          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-3">
            {steps.map((step, index) => (
              <React.Fragment key={step.num}>
                <button
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs sm:text-sm font-medium transition-all ${
                    currentStep === step.num
                      ? 'bg-white text-gray-900'
                      : 'bg-white/15 text-white hover:bg-white/25'
                  }`}
                >
                  <span>{step.icon}</span>
                  <span className="hidden sm:inline">{step.title}</span>
                </button>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-white/30" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* Step 1: Select (Bike / Car) */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(212,175,55,0.10)",
                  border: "1px solid rgba(212,175,55,0.22)",
                }}
              >
                <p className="text-gray-900 font-semibold">Select Vehicle Category</p>
                <p className="text-sm text-gray-700 mt-1">
                  Choose whether you are adding a <strong>Bike</strong> or a <strong>Car</strong>. The next step will show the full form.
                </p>
              </div>

              {/* Vehicle Category (Bike / Car) */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Vehicle Category <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange('bike')}
                    className={`px-4 py-3 rounded-xl border-2 font-semibold transition-colors ${
                      formData.vehicleCategory === 'bike'
                        ? 'bg-gray-900 border-gray-900 text-amber-200'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-amber-300'
                    }`}
                  >
                    🏍️ Bike
                    <div className={`text-xs mt-1 ${formData.vehicleCategory === 'bike' ? 'text-amber-200/80' : 'text-gray-500'}`}>
                      Two-wheeler
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCategoryChange('car')}
                    className={`px-4 py-3 rounded-xl border-2 font-semibold transition-colors ${
                      formData.vehicleCategory === 'car'
                        ? 'bg-gray-900 border-gray-900 text-amber-200'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-amber-300'
                    }`}
                  >
                    🚗 Car
                    <div className={`text-xs mt-1 ${formData.vehicleCategory === 'car' ? 'text-amber-200/80' : 'text-gray-500'}`}>
                      Four-wheeler
                    </div>
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Note: Private/Commercial selection is available in the <strong>Documents</strong> step.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Basic Info */}
          {currentStep === 2 && (
            <div className="space-y-4">

              {/* Make */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 21h18" />
                        <path d="M5 21V7l8-4 8 4v14" />
                        <path d="M9 21v-8h6v8" />
                      </svg>
                    </span>
                    Make / Brand <span className="text-red-500">*</span>
                  </span>
                </label>
                {!showNewMake ? (
                  <select
                    value={formData.make}
                    onChange={(e) => handleMakeSelect(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                    required
                  >
                    <option value="">-- Select Make --</option>
                    {availableMakes.map((make: string) => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                    <option value="__new__">➕ Add New Make</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.newMake}
                      onChange={(e) => handleChange('newMake', e.target.value)}
                      placeholder="Enter new make (e.g., Honda, Yamaha)"
                      className="w-full px-4 py-3 text-lg border-2 border-blue-400 rounded-xl bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewMake(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      ← Back to list
                    </button>
                  </div>
                )}
              </div>

              {/* Model */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 12H4" />
                        <path d="M16 6l6 6-6 6" />
                      </svg>
                    </span>
                    Model <span className="text-red-500">*</span>
                  </span>
                </label>
                {!showNewModel ? (
                  <select
                    value={formData.model}
                    onChange={(e) => handleModelSelect(e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                    required
                    disabled={!currentMake}
                  >
                    <option value="">-- Select Model --</option>
                    {availableModels.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                    <option value="__new__">➕ Add New Model</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={formData.newModel}
                      onChange={(e) => handleChange('newModel', e.target.value)}
                      placeholder="Enter new model (e.g., Activa 6G, FZ-S)"
                      className="w-full px-4 py-3 text-lg border-2 border-blue-400 rounded-xl bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewModel(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      ← Back to list
                    </button>
                  </div>
                )}
                {!currentMake && (
                  <p className="text-amber-600 text-sm mt-2">Please select a Make first.</p>
                )}
              </div>

              {/* Owner Name */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21a8 8 0 10-16 0" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    Owner Name
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => handleChange('ownerName', e.target.value)}
                  placeholder="e.g., Ramesh Kumar"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                />
              </div>

              {/* Registration Number */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 7h18" />
                        <path d="M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7" />
                        <path d="M7 11h10" />
                      </svg>
                    </span>
                    Registration Number <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.registrationNumber}
                  onChange={(e) => handleChange('registrationNumber', e.target.value.toUpperCase())}
                  placeholder="e.g., MH01AB1234"
                  className="w-full px-4 py-3 text-lg font-mono uppercase border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                  required
                />
              </div>

              {/* Chassis Number */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4a2 2 0 001-1.73z" />
                        <path d="M3.3 7L12 12l8.7-5" />
                      </svg>
                    </span>
                    Chassis Number
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.chassisNumber}
                  onChange={(e) => handleChange('chassisNumber', e.target.value.toUpperCase())}
                  placeholder="e.g., MD2A14AZ8RWD12345"
                  className="w-full px-4 py-3 text-lg font-mono uppercase border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                />
              </div>

              {/* Engine Number */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                    Engine Number
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.engineNumber}
                  onChange={(e) => handleChange('engineNumber', e.target.value.toUpperCase())}
                  placeholder="e.g., ENG123456789"
                  className="w-full px-4 py-3 text-lg font-mono uppercase border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                />
              </div>

              {/* Current Odometer Reading */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 14a2 2 0 100-4 2 2 0 000 4z" />
                        <path d="M19.4 15a8 8 0 10-14.8 0" />
                        <path d="M12 2v4" />
                      </svg>
                    </span>
                    Current Odometer Reading (KM) <span className="text-red-500">*</span>
                  </span>
                </label>
                <input
                  type="number"
                  value={formData.currentOdometer}
                  onChange={(e) => handleChange('currentOdometer', e.target.value)}
                  placeholder="e.g., 15000"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                  required
                  min={0}
                />
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <p className="text-blue-800 font-medium">📄 Enter document validity dates to get renewal reminders</p>
                <p className="text-blue-700 text-sm mt-1">
                  Choose whether the vehicle is <strong>Private</strong> or <strong>Commercial</strong> to see the correct document list.
                </p>
              </div>

              {/* Vehicle Type (Private / Commercial) */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Vehicle Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('vehicleType', 'private')}
                    className={`px-4 py-3 rounded-xl border-2 font-semibold transition-colors ${
                      formData.vehicleType === 'private'
                        ? 'bg-gray-900 border-gray-900 text-amber-200'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-amber-300'
                    }`}
                  >
                    Private
                    <div className={`text-xs mt-1 ${formData.vehicleType === 'private' ? 'text-amber-200/80' : 'text-gray-500'}`}>
                      Registration Validity + Insurance + Pollution
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('vehicleType', 'commercial')}
                    className={`px-4 py-3 rounded-xl border-2 font-semibold transition-colors ${
                      formData.vehicleType === 'commercial'
                        ? 'bg-gray-900 border-gray-900 text-amber-200'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-amber-300'
                    }`}
                  >
                    Commercial
                    <div className={`text-xs mt-1 ${formData.vehicleType === 'commercial' ? 'text-amber-200/80' : 'text-gray-500'}`}>
                      Insurance + Pollution + Fitness + Road Tax
                    </div>
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Private vehicles usually don’t require Fitness/Road Tax tracking. Commercial fleets typically do.
                </p>
              </div>

              {/* Private Documents */}
              {formData.vehicleType === 'private' && (
                <div className="space-y-4">
                  {/* Registration Validity */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🪪 Registration Valid Till
                    </label>
                    <input
                      type="date"
                      value={formData.registrationValidity}
                      onChange={(e) => handleChange('registrationValidity', e.target.value)}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    <p className="text-xs text-gray-500 mt-2">Used mainly for Private vehicles.</p>
                  </div>

                  {/* Insurance */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🛡️ Insurance Valid Till
                    </label>
                    <input
                      type="date"
                      value={formData.insuranceValidity}
                      onChange={(e) => handleChange('insuranceValidity', e.target.value)}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Pollution */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💨 Pollution Certificate Valid Till
                    </label>
                    <input
                      type="date"
                      value={formData.pollutionValidity}
                      onChange={(e) => handleChange('pollutionValidity', e.target.value)}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
              )}

              {/* Commercial Documents */}
              {formData.vehicleType === 'commercial' && (
                <div className="space-y-4">
                  {/* Insurance */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🛡️ Insurance Valid Till
                    </label>
                    <input
                      type="date"
                      value={formData.insuranceValidity}
                      onChange={(e) => handleChange('insuranceValidity', e.target.value)}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Pollution */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      💨 Pollution Certificate Valid Till
                    </label>
                    <input
                      type="date"
                      value={formData.pollutionValidity}
                      onChange={(e) => handleChange('pollutionValidity', e.target.value)}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Fitness */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ✅ Fitness Certificate Valid Till
                    </label>
                    <input
                      type="date"
                      value={formData.fitnessValidity}
                      onChange={(e) => handleChange('fitnessValidity', e.target.value)}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  {/* Road Tax */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🛣️ Road Tax Valid Till
                    </label>
                    <input
                      type="date"
                      value={formData.roadTaxValidity}
                      onChange={(e) => handleChange('roadTaxValidity', e.target.value)}
                      className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Service */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-xl p-4 mb-4">
                <p className="text-amber-800 font-medium">🔧 Set service intervals to get maintenance reminders</p>
              </div>

              {/* Service Interval - Months */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Service Interval (Months)
                </label>
                <select
                  value={formData.serviceIntervalMonths}
                  onChange={(e) => handleChange('serviceIntervalMonths', parseInt(e.target.value))}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value={3}>Every 3 months</option>
                  <option value={4}>Every 4 months</option>
                  <option value={5}>Every 5 months (Recommended)</option>
                  <option value={6}>Every 6 months</option>
                  <option value={9}>Every 9 months</option>
                  <option value={12}>Every 12 months</option>
                </select>
              </div>

              {/* Service Interval - KM */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🛣️ Service Interval (Kilometers)
                </label>
                <select
                  value={formData.serviceIntervalKms}
                  onChange={(e) => handleChange('serviceIntervalKms', parseInt(e.target.value))}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value={3000}>Every 3,000 KM</option>
                  <option value={4000}>Every 4,000 KM</option>
                  <option value={5000}>Every 5,000 KM (Recommended)</option>
                  <option value={6000}>Every 6,000 KM</option>
                  <option value={8000}>Every 8,000 KM</option>
                  <option value={10000}>Every 10,000 KM</option>
                </select>
              </div>

              {/* Last Service Date */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📆 Last Service Date
                </label>
                <input
                  type="date"
                  value={formData.lastServiceDate}
                  onChange={(e) => handleChange('lastServiceDate', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Last Service KM */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔢 Last Service Odometer (KM)
                </label>
                <input
                  type="number"
                  value={formData.lastServiceKm}
                  onChange={(e) => handleChange('lastServiceKm', e.target.value)}
                  placeholder="e.g., 15000"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Summary */}
              {formData.lastServiceDate && formData.currentOdometer && (
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                  <h4 className="font-bold text-green-800 mb-2">📊 Service Summary</h4>
                  <div className="space-y-1 text-sm text-green-700">
                    <p>Current Odometer: <strong>{parseInt(formData.currentOdometer).toLocaleString()} KM</strong></p>
                    <p>Last Service: <strong>{formData.lastServiceDate}</strong> at <strong>{parseInt(formData.lastServiceKm || '0').toLocaleString()} KM</strong></p>
                    <p>KM Since Last Service: <strong>{(parseInt(formData.currentOdometer) - parseInt(formData.lastServiceKm || '0')).toLocaleString()} KM</strong></p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="border-t bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl"
                >
                  ← Previous
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-black text-amber-200 font-semibold rounded-xl"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-gray-900 hover:bg-black text-amber-200 font-semibold rounded-xl"
                >
                  ✓ Save Vehicle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
