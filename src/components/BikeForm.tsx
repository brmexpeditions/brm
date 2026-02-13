import React, { useState, useEffect } from 'react';
import { Motorcycle } from '../types';

interface BikeFormProps {
  bike?: Motorcycle | null;
  makes: string[];
  models: Record<string, string[]>;
  onSave: (bike: Motorcycle) => void;
  onCancel: () => void;
  onAddMake: (make: string) => void;
  onAddModel: (make: string, model: string) => void;
}

// Indian Bike Brands and Models
const indianBikeBrands: Record<string, string[]> = {
  'Honda': ['Activa 6G', 'Shine', 'Unicorn', 'SP 125', 'Dio', 'Hornet 2.0', 'CB350', 'Livo', 'Dream'],
  'Hero': ['Splendor Plus', 'HF Deluxe', 'Passion Pro', 'Glamour', 'Xtreme 160R', 'XPulse 200', 'Destini 125', 'Pleasure Plus'],
  'Bajaj': ['Pulsar 150', 'Pulsar NS200', 'Pulsar RS200', 'Platina', 'CT 100', 'Dominar 400', 'Avenger', 'Chetak'],
  'TVS': ['Apache RTR 160', 'Apache RTR 200', 'Jupiter', 'Ntorq 125', 'Raider', 'Sport', 'XL100', 'iQube'],
  'Royal Enfield': ['Classic 350', 'Bullet 350', 'Meteor 350', 'Hunter 350', 'Himalayan', 'Continental GT', 'Interceptor 650'],
  'Yamaha': ['FZ-S', 'MT-15', 'R15 V4', 'Fascino', 'Ray ZR', 'FZ-X', 'Aerox 155'],
  'KTM': ['Duke 125', 'Duke 200', 'Duke 390', 'RC 125', 'RC 200', 'RC 390', 'Adventure 250', 'Adventure 390'],
  'Suzuki': ['Access 125', 'Burgman Street', 'Gixxer', 'Gixxer SF', 'Hayabusa', 'V-Strom'],
  'Jawa': ['Jawa 42', 'Jawa Classic', 'Perak', 'Yezdi Adventure', 'Yezdi Roadster'],
  'Ola Electric': ['S1 Pro', 'S1 Air', 'S1 X'],
};

// Indian Car Brands and Models
const indianCarBrands: Record<string, string[]> = {
  'Maruti Suzuki': ['Alto K10', 'Swift', 'Baleno', 'Dzire', 'Ertiga', 'Brezza', 'Grand Vitara', 'Wagon R', 'Celerio', 'Ignis', 'XL6', 'Ciaz', 'Fronx', 'Jimny', 'Invicto'],
  'Hyundai': ['i10 Nios', 'i20', 'Venue', 'Creta', 'Verna', 'Alcazar', 'Tucson', 'Exter', 'Aura', 'Kona EV', 'Ioniq 5'],
  'Tata': ['Punch', 'Nexon', 'Harrier', 'Safari', 'Altroz', 'Tiago', 'Tigor', 'Nexon EV', 'Tiago EV', 'Curvv'],
  'Mahindra': ['Thar', 'Scorpio N', 'XUV700', 'XUV400', 'Bolero', 'XUV300', 'Marazzo', 'BE 6e'],
  'Kia': ['Seltos', 'Sonet', 'Carens', 'EV6', 'Carnival'],
  'Toyota': ['Innova Crysta', 'Innova Hycross', 'Fortuner', 'Glanza', 'Urban Cruiser Hyryder', 'Camry', 'Vellfire', 'Land Cruiser'],
  'Honda': ['City', 'Amaze', 'Elevate', 'City Hybrid'],
  'MG Motor': ['Hector', 'Astor', 'ZS EV', 'Gloster', 'Comet EV'],
  'Renault': ['Kwid', 'Triber', 'Kiger'],
  'Volkswagen': ['Polo', 'Virtus', 'Taigun', 'Tiguan'],
  'Skoda': ['Slavia', 'Kushaq', 'Superb', 'Kodiaq'],
};

const generateId = () => {
  return 'v_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export function BikeForm({ bike, makes, models, onSave, onCancel, onAddMake, onAddModel }: BikeFormProps) {
  const [step, setStep] = useState(bike ? 2 : 1);
  const [vehicleType, setVehicleType] = useState<'Bike' | 'Car'>(bike?.vehicleType || 'Bike');
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    ownerName: '',
    registrationNumber: '',
    chassisNumber: '',
    engineNumber: '',
    currentOdometer: '',
    vehicleUsage: 'Private' as 'Private' | 'Commercial',
    insuranceValidity: '',
    pollutionValidity: '',
    fitnessValidity: '',
    roadTaxValidity: '',
    registrationValidity: '',
    permitValidity: '',
    serviceIntervalMonths: '5',
    serviceIntervalKms: '5000',
    lastServiceDate: '',
    lastServiceKm: '',
  });
  const [isAddingMake, setIsAddingMake] = useState(false);
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');

  useEffect(() => {
    if (bike) {
      setVehicleType(bike.vehicleType || 'Bike');
      setFormData({
        make: bike.make || '',
        model: bike.model || '',
        ownerName: bike.ownerName || '',
        registrationNumber: bike.registrationNumber || '',
        chassisNumber: bike.chassisNumber || '',
        engineNumber: bike.engineNumber || '',
        currentOdometer: bike.currentOdometer?.toString() || '',
        vehicleUsage: bike.vehicleUsage || 'Private',
        insuranceValidity: bike.insuranceValidity || '',
        pollutionValidity: bike.pollutionValidity || '',
        fitnessValidity: bike.fitnessValidity || '',
        roadTaxValidity: bike.roadTaxValidity || '',
        registrationValidity: bike.registrationValidity || '',
        permitValidity: bike.permitValidity || '',
        serviceIntervalMonths: bike.serviceIntervalMonths?.toString() || '5',
        serviceIntervalKms: bike.serviceIntervalKms?.toString() || '5000',
        lastServiceDate: bike.lastServiceDate || '',
        lastServiceKm: bike.lastServiceKm?.toString() || '',
      });
    }
  }, [bike]);

  const handleVehicleTypeSelect = (type: 'Bike' | 'Car') => {
    setVehicleType(type);
    setFormData(prev => ({ ...prev, make: '', model: '' }));
    setStep(2);
  };

  const getBrandsForVehicle = () => {
    const predefined = vehicleType === 'Bike' ? Object.keys(indianBikeBrands) : Object.keys(indianCarBrands);
    const userMakes = makes.filter(m => !predefined.includes(m));
    return [...predefined, ...userMakes];
  };

  const getModelsForMake = () => {
    const predefinedBrands = vehicleType === 'Bike' ? indianBikeBrands : indianCarBrands;
    const predefinedModels = predefinedBrands[formData.make] || [];
    const userModels = models[formData.make] || [];
    return [...new Set([...predefinedModels, ...userModels])];
  };

  const handleAddNewMake = () => {
    if (newMake.trim()) {
      onAddMake(newMake.trim());
      setFormData(prev => ({ ...prev, make: newMake.trim(), model: '' }));
      setNewMake('');
      setIsAddingMake(false);
    }
  };

  const handleAddNewModel = () => {
    if (newModel.trim() && formData.make) {
      onAddModel(formData.make, newModel.trim());
      setFormData(prev => ({ ...prev, model: newModel.trim() }));
      setNewModel('');
      setIsAddingModel(false);
    }
  };

  const handleSubmit = () => {
    const newBike: Motorcycle = {
      id: bike?.id || generateId(),
      
      vehicleType: vehicleType,
      make: formData.make,
      model: formData.model,
      ownerName: formData.ownerName,
      registrationNumber: formData.registrationNumber,
      chassisNumber: formData.chassisNumber,
      engineNumber: formData.engineNumber,
      currentOdometer: parseInt(formData.currentOdometer) || 0,
      
      vehicleUsage: formData.vehicleUsage,
      insuranceValidity: formData.insuranceValidity,
      pollutionValidity: formData.pollutionValidity,
      fitnessValidity: formData.vehicleUsage === 'Commercial' ? formData.fitnessValidity : undefined,
      roadTaxValidity: formData.vehicleUsage === 'Commercial' ? formData.roadTaxValidity : undefined,
      permitValidity: formData.vehicleUsage === 'Commercial' ? formData.permitValidity : undefined,
      registrationValidity: formData.vehicleUsage === 'Private' ? formData.registrationValidity : undefined,
      
      serviceIntervalMonths: parseInt(formData.serviceIntervalMonths) || 5,
      serviceIntervalKms: parseInt(formData.serviceIntervalKms) || 5000,
      lastServiceDate: formData.lastServiceDate,
      lastServiceKm: parseInt(formData.lastServiceKm) || 0,
      
      kmReadings: bike?.kmReadings || [{
        id: generateId(),
        date: new Date().toISOString().split('T')[0],
        kilometers: parseInt(formData.currentOdometer) || 0
      }],
      
      createdAt: bike?.createdAt || new Date().toISOString(),
    };
    
    onSave(newBike);
  };

  const canProceed = () => {
    if (step === 2) return formData.make && formData.model && formData.registrationNumber;
    if (step === 3) return formData.insuranceValidity && formData.pollutionValidity;
    return true;
  };

  const steps = [
    { num: 1, label: 'Type', icon: '🚗' },
    { num: 2, label: 'Details', icon: '📋' },
    { num: 3, label: 'Documents', icon: '📄' },
    { num: 4, label: 'Service', icon: '🔧' }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl w-full max-w-lg max-h-[95vh] overflow-hidden shadow-2xl border border-amber-500/20">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              {vehicleType === 'Bike' ? '🏍️' : '🚗'}
            </div>
            <div>
              <h2 className="text-gray-900 font-bold text-base">
                {bike ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <p className="text-gray-800 text-xs">Step {step} of 4</p>
            </div>
          </div>
          <button onClick={onCancel} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-gray-900 transition-colors">
            ✕
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <button
                  onClick={() => s.num < step && setStep(s.num)}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    step === s.num 
                      ? 'text-amber-400 scale-105' 
                      : step > s.num 
                        ? 'text-green-400 cursor-pointer hover:text-green-300' 
                        : 'text-gray-500'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                    step === s.num 
                      ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-gray-900 shadow-lg shadow-amber-500/30' 
                      : step > s.num 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                        : 'bg-gray-700 text-gray-400'
                  }`}>
                    {step > s.num ? '✓' : s.icon}
                  </div>
                  <span className="text-[10px] font-medium">{s.label}</span>
                </button>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 rounded ${step > s.num ? 'bg-green-500' : 'bg-gray-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4 overflow-y-auto max-h-[55vh]">
          
          {/* Step 1: Vehicle Type */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-white text-lg font-semibold">Select Vehicle Type</h3>
                <p className="text-gray-400 text-xs mt-1">Choose the type of vehicle you want to add</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Bike Card */}
                <button
                  onClick={() => handleVehicleTypeSelect('Bike')}
                  className={`group relative p-4 rounded-xl border-2 transition-all duration-300 ${
                    vehicleType === 'Bike'
                      ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 to-orange-600/20 shadow-lg shadow-amber-500/20'
                      : 'border-gray-600 bg-gray-800/50 hover:border-amber-500/50 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-4xl mb-2 transition-transform group-hover:scale-110 ${vehicleType === 'Bike' ? 'animate-bounce' : ''}`}>
                      🏍️
                    </div>
                    <h4 className="text-white font-bold text-sm">Bike</h4>
                    <p className="text-gray-400 text-[10px] mt-0.5">Two-wheelers</p>
                  </div>
                  {vehicleType === 'Bike' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-gray-900 text-xs">✓</span>
                    </div>
                  )}
                </button>

                {/* Car Card */}
                <button
                  onClick={() => handleVehicleTypeSelect('Car')}
                  className={`group relative p-4 rounded-xl border-2 transition-all duration-300 ${
                    vehicleType === 'Car'
                      ? 'border-amber-500 bg-gradient-to-br from-amber-500/20 to-orange-600/20 shadow-lg shadow-amber-500/20'
                      : 'border-gray-600 bg-gray-800/50 hover:border-amber-500/50 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-4xl mb-2 transition-transform group-hover:scale-110 ${vehicleType === 'Car' ? 'animate-bounce' : ''}`}>
                      🚗
                    </div>
                    <h4 className="text-white font-bold text-sm">Car</h4>
                    <p className="text-gray-400 text-[10px] mt-0.5">Four-wheelers</p>
                  </div>
                  {vehicleType === 'Car' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-gray-900 text-xs">✓</span>
                    </div>
                  )}
                </button>
              </div>

              <p className="text-center text-gray-500 text-xs mt-4">
                👆 Tap to select and continue
              </p>
            </div>
          )}

          {/* Step 2: Basic Details */}
          {step === 2 && (
            <div className="space-y-3">
              {/* Vehicle Type Badge */}
              <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{vehicleType === 'Bike' ? '🏍️' : '🚗'}</span>
                  <span className="text-white font-medium text-sm">{vehicleType}</span>
                </div>
                <button onClick={() => setStep(1)} className="text-amber-400 text-xs hover:text-amber-300">
                  Change
                </button>
              </div>

              {/* Make Selection */}
              <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50">
                <label className="block text-amber-400 text-xs font-medium mb-1.5">
                  Brand / Make <span className="text-red-400">*</span>
                </label>
                {isAddingMake ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMake}
                      onChange={(e) => setNewMake(e.target.value)}
                      placeholder="Enter brand name"
                      className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none"
                      autoFocus
                    />
                    <button onClick={handleAddNewMake} className="px-3 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm font-medium hover:bg-amber-400">Add</button>
                    <button onClick={() => setIsAddingMake(false)} className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-500">✕</button>
                  </div>
                ) : (
                  <select
                    value={formData.make}
                    onChange={(e) => {
                      if (e.target.value === '__add_new__') {
                        setIsAddingMake(true);
                      } else {
                        setFormData(prev => ({ ...prev, make: e.target.value, model: '' }));
                      }
                    }}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">Select Brand</option>
                    {getBrandsForVehicle().map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                    <option value="__add_new__">➕ Add New Brand</option>
                  </select>
                )}
              </div>

              {/* Model Selection */}
              <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50">
                <label className="block text-amber-400 text-xs font-medium mb-1.5">
                  Model <span className="text-red-400">*</span>
                </label>
                {isAddingModel ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newModel}
                      onChange={(e) => setNewModel(e.target.value)}
                      placeholder="Enter model name"
                      className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none"
                      autoFocus
                    />
                    <button onClick={handleAddNewModel} className="px-3 py-2 bg-amber-500 text-gray-900 rounded-lg text-sm font-medium hover:bg-amber-400">Add</button>
                    <button onClick={() => setIsAddingModel(false)} className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-500">✕</button>
                  </div>
                ) : (
                  <select
                    value={formData.model}
                    onChange={(e) => {
                      if (e.target.value === '__add_new__') {
                        setIsAddingModel(true);
                      } else {
                        setFormData(prev => ({ ...prev, model: e.target.value }));
                      }
                    }}
                    disabled={!formData.make}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none disabled:opacity-50"
                  >
                    <option value="">Select Model</option>
                    {getModelsForMake().map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                    <option value="__add_new__">➕ Add New Model</option>
                  </select>
                )}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50">
                  <label className="block text-amber-400 text-xs font-medium mb-1.5">Owner Name</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                    placeholder="Enter name"
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50">
                  <label className="block text-amber-400 text-xs font-medium mb-1.5">
                    Registration <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value.toUpperCase() }))}
                    placeholder="MH01AB1234"
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50">
                  <label className="block text-amber-400 text-xs font-medium mb-1.5">Chassis Number</label>
                  <input
                    type="text"
                    value={formData.chassisNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, chassisNumber: e.target.value.toUpperCase() }))}
                    placeholder="Enter chassis"
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none uppercase"
                  />
                </div>
                <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50">
                  <label className="block text-amber-400 text-xs font-medium mb-1.5">Engine Number</label>
                  <input
                    type="text"
                    value={formData.engineNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, engineNumber: e.target.value.toUpperCase() }))}
                    placeholder="Enter engine"
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none uppercase"
                  />
                </div>
              </div>

              {/* Odometer - Full Width */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-3 border border-amber-500/30">
                <label className="block text-amber-400 text-xs font-medium mb-1.5">
                  📊 Current Odometer (KM)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={formData.currentOdometer}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentOdometer: e.target.value }))}
                    placeholder="0"
                    className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-amber-400 font-medium text-sm">KM</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <div className="space-y-3">
              {/* Usage Type Toggle */}
              <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                <label className="block text-amber-400 text-xs font-medium mb-2">Vehicle Usage Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, vehicleUsage: 'Private' }))}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                      formData.vehicleUsage === 'Private'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    🏠 Private
                  </button>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, vehicleUsage: 'Commercial' }))}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                      formData.vehicleUsage === 'Commercial'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    🏢 Commercial
                  </button>
                </div>
              </div>

              {/* Document Fields Based on Usage Type */}
              <div className="space-y-3">
                {formData.vehicleUsage === 'Private' && (
                  <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50">
                    <label className="block text-amber-400 text-xs font-medium mb-1.5">📋 Registration</label>
                    <input
                      type="date"
                      value={formData.registrationValidity}
                      onChange={(e) => setFormData(prev => ({ ...prev, registrationValidity: e.target.value }))}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                )}

                <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50">
                  <label className="block text-amber-400 text-xs font-medium mb-1.5">
                    🛡️ Insurance <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.insuranceValidity}
                    onChange={(e) => setFormData(prev => ({ ...prev, insuranceValidity: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50">
                  <label className="block text-amber-400 text-xs font-medium mb-1.5">
                    💨 Pollution <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.pollutionValidity}
                    onChange={(e) => setFormData(prev => ({ ...prev, pollutionValidity: e.target.value }))}
                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {formData.vehicleUsage === 'Commercial' && (
                  <>
                    <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50">
                      <label className="block text-amber-400 text-xs font-medium mb-1.5">🔧 Fitness</label>
                      <input
                        type="date"
                        value={formData.fitnessValidity}
                        onChange={(e) => setFormData(prev => ({ ...prev, fitnessValidity: e.target.value }))}
                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50">
                      <label className="block text-amber-400 text-xs font-medium mb-1.5">🛣️ Road Tax</label>
                      <input
                        type="date"
                        value={formData.roadTaxValidity}
                        onChange={(e) => setFormData(prev => ({ ...prev, roadTaxValidity: e.target.value }))}
                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50">
                      <label className="block text-amber-400 text-xs font-medium mb-1.5">📜 Permit</label>
                      <input
                        type="date"
                        value={formData.permitValidity}
                        onChange={(e) => setFormData(prev => ({ ...prev, permitValidity: e.target.value }))}
                        className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Service */}
          {step === 4 && (
            <div className="space-y-3">
              {/* Service Interval */}
              <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                <label className="block text-amber-400 text-xs font-medium mb-2">⏱️ Service Interval</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-gray-400 text-[10px]">Every</span>
                    <select
                      value={formData.serviceIntervalMonths}
                      onChange={(e) => setFormData(prev => ({ ...prev, serviceIntervalMonths: e.target.value }))}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none mt-1"
                    >
                      <option value="3">3 Months</option>
                      <option value="4">4 Months</option>
                      <option value="5">5 Months</option>
                      <option value="6">6 Months</option>
                      <option value="9">9 Months</option>
                      <option value="12">12 Months</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">Or Every</span>
                    <select
                      value={formData.serviceIntervalKms}
                      onChange={(e) => setFormData(prev => ({ ...prev, serviceIntervalKms: e.target.value }))}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none mt-1"
                    >
                      <option value="3000">3,000 KM</option>
                      <option value="4000">4,000 KM</option>
                      <option value="5000">5,000 KM</option>
                      <option value="6000">6,000 KM</option>
                      <option value="8000">8,000 KM</option>
                      <option value="10000">10,000 KM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Last Service */}
              <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-700/50">
                <label className="block text-amber-400 text-xs font-medium mb-2">📅 Last Service</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-gray-400 text-[10px]">Date</span>
                    <input
                      type="date"
                      value={formData.lastServiceDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastServiceDate: e.target.value }))}
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none mt-1"
                    />
                  </div>
                  <div>
                    <span className="text-gray-400 text-[10px]">Odometer (KM)</span>
                    <input
                      type="number"
                      value={formData.lastServiceKm}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastServiceKm: e.target.value }))}
                      placeholder="0"
                      className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:border-amber-500 focus:outline-none mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Summary Card */}
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-xl p-3 border border-amber-500/30">
                <h4 className="text-amber-400 text-xs font-medium mb-2">📋 Vehicle Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white">{vehicleType === 'Bike' ? '🏍️' : '🚗'} {vehicleType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Usage:</span>
                    <span className="text-white">{formData.vehicleUsage === 'Private' ? '🏠' : '🏢'} {formData.vehicleUsage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Make:</span>
                    <span className="text-white">{formData.make || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Model:</span>
                    <span className="text-white">{formData.model || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Reg:</span>
                    <span className="text-white font-mono">{formData.registrationNumber || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Odometer:</span>
                    <span className="text-white">{formData.currentOdometer || '0'} km</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-700 flex items-center justify-between gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                ← Back
              </button>
            )}
            
            {step < 4 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-gray-900 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-green-500/20"
              >
                ✓ Save Vehicle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BikeForm;
