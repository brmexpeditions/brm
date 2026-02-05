import { useEffect, useMemo, useState } from 'react';
import { Motorcycle, VehicleCategory, VehicleType } from '../types';
import { getServiceStatus, getValidityStatus, formatDate, SERVICE_INTERVAL_OPTIONS } from '../utils/helpers';
import { cn } from '../utils/cn';
import { BikeForm } from './BikeForm';

interface DashboardProps {
  motorcycles: Motorcycle[];
  makes: string[];
  models: Record<string, string[]>;
  onUpdateBike: (bike: Motorcycle) => void;
  onAddBike: (bike: Motorcycle) => void;
  onDeleteBike: (bikeId: string) => void;
  onAddMake: (make: string) => void;
  onAddModel: (make: string, model: string) => void;
}

export function Dashboard({ motorcycles, makes, models, onUpdateBike, onAddBike, onDeleteBike, onAddMake, onAddModel }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'ok' | 'attention'>('all');
  const [filterCategory, setFilterCategory] = useState<'all' | VehicleCategory>('all');
  const [filterVehicleType, setFilterVehicleType] = useState<'all' | VehicleType>('all');
  const [alertFilterBike, setAlertFilterBike] = useState<string>('all');
  const [serviceModalBike, setServiceModalBike] = useState<Motorcycle | null>(null);
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [serviceKm, setServiceKm] = useState(0);
  const [serviceIntervalMonths, setServiceIntervalMonths] = useState(5);
  const [serviceIntervalKms, setServiceIntervalKms] = useState(5000);
  const [showBikeForm, setShowBikeForm] = useState(false);
  const [editingBike, setEditingBike] = useState<Motorcycle | null>(null);
  const [selectedBike, setSelectedBike] = useState<Motorcycle | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Allow other tabs (Analytics) to open a vehicle directly inside the Fleet tab
  useEffect(() => {
    const handler = (evt: Event) => {
      const e = evt as CustomEvent<{ vehicleId?: string }>;
      const vehicleId = e.detail?.vehicleId;
      if (!vehicleId) return;

      const bike = (Array.isArray(motorcycles) ? motorcycles : []).find((b) => b.id === vehicleId);
      if (bike) {
        setSelectedBike(bike);
        setShowBikeForm(false);
        setEditingBike(null);
        setShowDeleteConfirm(null);
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
          window.scrollTo(0, 0);
        }
      }
    };

    window.addEventListener("fleet:openVehicle", handler as EventListener);
    return () => window.removeEventListener("fleet:openVehicle", handler as EventListener);
  }, [motorcycles]);

  const handleSaveBike = (bike: Motorcycle, newMake?: string, newModel?: string) => {
    const existingBike = motorcycles.find(m => m.id === bike.id);
    if (existingBike) {
      onUpdateBike(bike);
    } else {
      onAddBike(bike);
    }
    
    if (newMake) {
      onAddMake(newMake);
    }
    
    if (newMake && newModel) {
      onAddModel(newMake, newModel);
    } else if (!newMake && newModel && bike.make) {
      onAddModel(bike.make, newModel);
    }
    
    setShowBikeForm(false);
    setEditingBike(null);
  };

  const handleEditBike = (bike: Motorcycle, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBike(bike);
    setShowBikeForm(true);
  };

  const handleDeleteBike = (bikeId: string) => {
    onDeleteBike(bikeId);
    setShowDeleteConfirm(null);
    setSelectedBike(null);
  };

  const openServiceModal = (bike: Motorcycle, e: React.MouseEvent) => {
    e.stopPropagation();
    const kmReadings = Array.isArray(bike.kmReadings) ? bike.kmReadings : [];
    const currentKm = kmReadings.length > 0 
      ? kmReadings[kmReadings.length - 1].kilometers 
      : (bike.lastServiceKm || 0);
    setServiceModalBike(bike);
    setServiceDate(new Date().toISOString().split('T')[0]);
    setServiceKm(currentKm);
    setServiceIntervalMonths(bike.serviceIntervalMonths || 5);
    setServiceIntervalKms(bike.serviceIntervalKms || 5000);
  };

  const handleSaveService = () => {
    if (!serviceModalBike) return;
    const updatedBike: Motorcycle = {
      ...serviceModalBike,
      lastServiceDate: serviceDate,
      lastServiceKm: serviceKm,
      serviceIntervalMonths: serviceIntervalMonths,
      serviceIntervalKms: serviceIntervalKms,
    };
    onUpdateBike(updatedBike);
    setServiceModalBike(null);
  };

  const filteredMotorcycles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const list = Array.isArray(motorcycles) ? motorcycles : [];

    return list.filter((bike) => {
      const category: VehicleCategory = bike.vehicleCategory || 'bike';
      const vType: VehicleType = bike.vehicleType || 'commercial';

      if (filterCategory !== 'all' && category !== filterCategory) return false;
      if (filterVehicleType !== 'all' && vType !== filterVehicleType) return false;

      if (term) {
        const haystack = [
          bike.make,
          bike.model,
          bike.registrationNumber,
          bike.ownerName || '',
          bike.chassisNumber || '',
          bike.engineNumber || '',
        ]
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(term)) return false;
      }

      if (filterStatus === 'all') return true;

      const serviceStatus = getServiceStatus(bike);

      const docDates = vType === 'private'
        ? [bike.registrationValidity, bike.insuranceValidity, bike.pollutionValidity]
        : [bike.insuranceValidity, bike.pollutionValidity, bike.fitnessValidity, bike.roadTaxValidity];

      const hasDocIssue = docDates.some((d) => getValidityStatus(d).status !== 'ok');
      const hasIssue = serviceStatus.status !== 'ok' || hasDocIssue;

      return filterStatus === 'attention' ? hasIssue : !hasIssue;
    });
  }, [motorcycles, searchTerm, filterStatus, filterCategory, filterVehicleType]);

  const getAlerts = () => {
    const alerts: { bikeId: string; bikeName: string; type: string; status: 'overdue' | 'upcoming'; message: string }[] = [];
    
    motorcycles.forEach(bike => {
      const bikeName = `${bike.make} ${bike.model} (${bike.registrationNumber})`;
      
      const serviceStatus = getServiceStatus(bike);
      if (serviceStatus.status !== 'ok') {
        alerts.push({
          bikeId: bike.id,
          bikeName,
          type: 'Service',
          status: serviceStatus.status,
          message: serviceStatus.message
        });
      }
      
      const validities = [
        { name: 'Insurance', date: bike.insuranceValidity },
        { name: 'Pollution Certificate', date: bike.pollutionValidity },
        { name: 'Fitness Certificate', date: bike.fitnessValidity },
        { name: 'Road Tax', date: bike.roadTaxValidity },
      ];
      
      validities.forEach(v => {
        const validityStatus = getValidityStatus(v.date);
        if (validityStatus.status !== 'ok') {
          alerts.push({
            bikeId: bike.id,
            bikeName,
            type: v.name,
            status: validityStatus.status,
            message: validityStatus.days <= 0 
              ? `Expired ${Math.abs(validityStatus.days)} days ago` 
              : `Expires in ${validityStatus.days} days`
          });
        }
      });
    });
    
    return alerts.sort((a, b) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (a.status !== 'overdue' && b.status === 'overdue') return 1;
      return 0;
    });
  };

  const allAlerts = getAlerts();
  
  const alerts = alertFilterBike === 'all' 
    ? allAlerts 
    : allAlerts.filter(a => a.bikeId === alertFilterBike);
  
  const overdueCount = allAlerts.filter(a => a.status === 'overdue').length;
  const upcomingCount = allAlerts.filter(a => a.status === 'upcoming').length;

  // Selected bike details view
  if (selectedBike) {
    const bike = motorcycles.find(b => b.id === selectedBike.id) || selectedBike;
    const serviceStatus = getServiceStatus(bike);
    const kmReadings = Array.isArray(bike.kmReadings) ? bike.kmReadings : [];
    const currentKm = kmReadings.length > 0 ? kmReadings[kmReadings.length - 1].kilometers : 0;
    
    const validities = [
      { name: 'Insurance', date: bike.insuranceValidity, icon: '🛡️' },
      { name: 'Pollution Certificate', date: bike.pollutionValidity, icon: '💨' },
      { name: 'Fitness Certificate', date: bike.fitnessValidity, icon: '✅' },
      { name: 'Road Tax', date: bike.roadTaxValidity, icon: '🛣️' },
    ];

    return (
      <div className="space-y-6 p-4 md:p-6">
        {/* Back Button & Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedBike(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{bike.make} {bike.model}</h1>
            <p className="text-gray-500">{bike.registrationNumber}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => handleEditBike(bike, e)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(bike.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              🗑️ Delete
            </button>
          </div>
        </div>

        {/* Bike Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500">Make</p>
              <p className="font-semibold text-gray-900">{bike.make}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Model</p>
              <p className="font-semibold text-gray-900">{bike.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Registration</p>
              <p className="font-semibold text-gray-900">{bike.registrationNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Chassis Number</p>
              <p className="font-semibold text-gray-900">{bike.chassisNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Odometer</p>
              <p className="font-semibold text-gray-900 text-lg">{currentKm.toLocaleString()} km</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Service</p>
              <p className="font-semibold text-gray-900">{bike.lastServiceDate ? formatDate(bike.lastServiceDate) : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Service KM</p>
              <p className="font-semibold text-gray-900">{bike.lastServiceKm?.toLocaleString() || 'N/A'} km</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Service Interval</p>
              <p className="font-semibold text-gray-900">{bike.serviceIntervalMonths || 5} months / {(bike.serviceIntervalKms || 5000).toLocaleString()} km</p>
            </div>
          </div>
        </div>

        {/* Service Status Card */}
        <div className={cn(
          "rounded-xl shadow-sm border p-6",
          serviceStatus.status === 'ok' && "bg-green-50 border-green-200",
          serviceStatus.status === 'upcoming' && "bg-amber-50 border-amber-200",
          serviceStatus.status === 'overdue' && "bg-red-50 border-red-200"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-full",
                serviceStatus.status === 'ok' && "bg-green-100",
                serviceStatus.status === 'upcoming' && "bg-amber-100",
                serviceStatus.status === 'overdue' && "bg-red-100"
              )}>
                <span className="text-2xl">🔧</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Service Status</p>
                <p className={cn(
                  "text-sm font-medium",
                  serviceStatus.status === 'ok' && "text-green-700",
                  serviceStatus.status === 'upcoming' && "text-amber-700",
                  serviceStatus.status === 'overdue' && "text-red-700"
                )}>
                  {serviceStatus.message}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => openServiceModal(bike, e)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-white transition-colors",
                serviceStatus.status === 'ok' && "bg-green-600 hover:bg-green-700",
                serviceStatus.status === 'upcoming' && "bg-amber-600 hover:bg-amber-700",
                serviceStatus.status === 'overdue' && "bg-red-600 hover:bg-red-700"
              )}
            >
              Record Service
            </button>
          </div>
        </div>

        {/* Document Validity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {validities.map((v) => {
            const status = getValidityStatus(v.date);
            return (
              <div
                key={v.name}
                className={cn(
                  "rounded-xl shadow-sm border p-4",
                  status.status === 'ok' && "bg-green-50 border-green-200",
                  status.status === 'upcoming' && "bg-amber-50 border-amber-200",
                  status.status === 'overdue' && "bg-red-50 border-red-200"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{v.icon}</span>
                  <p className="font-medium text-gray-900">{v.name}</p>
                </div>
                <p className="text-sm text-gray-600">Valid till: {v.date ? formatDate(v.date) : 'Not set'}</p>
                <p className={cn(
                  "text-sm font-medium mt-1",
                  status.status === 'ok' && "text-green-700",
                  status.status === 'upcoming' && "text-amber-700",
                  status.status === 'overdue' && "text-red-700"
                )}>
                  {status.status === 'ok' 
                    ? `${status.days} days remaining` 
                    : status.days <= 0 
                    ? `Expired ${Math.abs(status.days)} days ago`
                    : `Expires in ${status.days} days`}
                </p>
              </div>
            );
          })}
        </div>

        {/* KM Readings History */}
        {kmReadings.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Odometer History</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
              {[...kmReadings].reverse().map((reading, idx) => (
                <div key={idx} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{reading.kilometers.toLocaleString()} km</p>
                    <p className="text-sm text-gray-500">{formatDate(reading.date)}</p>
                  </div>
                  {idx < kmReadings.length - 1 && (
                    <span className="text-sm text-gray-400">
                      +{(reading.kilometers - kmReadings[kmReadings.length - 2 - idx].kilometers).toLocaleString()} km
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-xl p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Vehicle?</h3>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to delete <strong>{bike.make} {bike.model}</strong>? 
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteBike(showDeleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fleet Dashboard</h1>
          <p className="text-gray-500">Manage your vehicle fleet (bikes & cars)</p>
        </div>
        <button
          onClick={() => {
            setEditingBike(null);
            setShowBikeForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Vehicle
        </button>
      </div>

      {/* Bike Form Modal */}
      {showBikeForm && (
        <BikeForm
          bike={editingBike || undefined}
          makes={makes}
          models={models}
          onSave={handleSaveBike}
          onCancel={() => {
            setShowBikeForm(false);
            setEditingBike(null);
          }}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Total Fleet</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">{motorcycles.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-red-100 rounded-lg">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Overdue</p>
              <p className="text-xl md:text-2xl font-bold text-red-600">{overdueCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-amber-100 rounded-lg">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">Upcoming</p>
              <p className="text-xl md:text-2xl font-bold text-amber-600">{upcomingCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 md:p-3 bg-green-100 rounded-lg">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-500">All Clear</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">{motorcycles.length - new Set(allAlerts.map(a => a.bikeId)).size}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {allAlerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Alerts & Reminders
                <span className="text-sm font-normal text-gray-500">({alerts.length} items)</span>
              </h2>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-500">Filter by vehicle:</label>
                <select
                  value={alertFilterBike}
                  onChange={(e) => setAlertFilterBike(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Vehicles</option>
                  {motorcycles.map(bike => (
                    <option key={bike.id} value={bike.id}>
                      {bike.make} {bike.model} ({bike.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-medium text-green-600">All clear for this vehicle!</p>
                <p className="text-sm">No pending alerts or reminders.</p>
              </div>
            ) : (
              alerts.slice(0, 10).map((alert, idx) => (
                <div 
                  key={idx} 
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedBike(motorcycles.find(b => b.id === alert.bikeId) || null)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={cn(
                        "w-2 h-2 rounded-full flex-shrink-0",
                        alert.status === 'overdue' ? "bg-red-500" : "bg-amber-500"
                      )} />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{alert.bikeName}</p>
                        <p className="text-sm text-gray-500">{alert.type}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-sm font-medium px-3 py-1 rounded-full flex-shrink-0",
                      alert.status === 'overdue' 
                        ? "bg-red-100 text-red-700" 
                        : "bg-amber-100 text-amber-700"
                    )}>
                      {alert.message}
                    </span>
                  </div>
                </div>
              ))
            )}
            {alerts.length > 10 && (
              <div className="px-6 py-3 text-center text-sm text-gray-500 bg-gray-50">
                +{alerts.length - 10} more alerts
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fleet Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Fleet Overview</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                />
              </div>

              {/* Category */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as typeof filterCategory)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Filter by category"
              >
                <option value="all">All Categories</option>
                <option value="bike">Bikes</option>
                <option value="car">Cars</option>
              </select>

              {/* Vehicle Type */}
              <select
                value={filterVehicleType}
                onChange={(e) => setFilterVehicleType(e.target.value as typeof filterVehicleType)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Filter by private/commercial"
              >
                <option value="all">All Types</option>
                <option value="private">Private</option>
                <option value="commercial">Commercial</option>
              </select>

              {/* Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Filter by attention status"
              >
                <option value="all">All</option>
                <option value="attention">Needs Attention</option>
                <option value="ok">All Clear</option>
              </select>
            </div>
          </div>
        </div>
        
        {motorcycles.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles yet</h3>
            <p>Add your first vehicle to get started with fleet management.</p>
          </div>
        ) : filteredMotorcycles.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p>No vehicles match your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Current KM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Insurance</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMotorcycles.map(bike => {
                  const serviceStatus = getServiceStatus(bike);
                  const insuranceStatus = getValidityStatus(bike.insuranceValidity);
                  const kmReadings = Array.isArray(bike.kmReadings) ? bike.kmReadings : [];
                  const currentKm = kmReadings.length > 0 
                    ? kmReadings[kmReadings.length - 1].kilometers 
                    : 0;
                  
                  return (
                    <tr 
                      key={bike.id} 
                      className={cn(
                        "hover:bg-gray-50 cursor-pointer transition-colors",
                        serviceStatus.status === 'overdue' && "bg-red-50",
                        serviceStatus.status === 'upcoming' && "bg-amber-50"
                      )}
                      onClick={() => setSelectedBike(bike)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-3 h-3 rounded-full flex-shrink-0",
                            serviceStatus.status === 'ok' && "bg-green-500",
                            serviceStatus.status === 'upcoming' && "bg-amber-500",
                            serviceStatus.status === 'overdue' && "bg-red-500"
                          )} />
                          <div className="font-medium text-gray-900">{bike.make} {bike.model}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{bike.registrationNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 hidden md:table-cell">{currentKm.toLocaleString()} km</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "text-xs font-medium px-2 py-1 rounded-full",
                          serviceStatus.status === 'ok' && "bg-green-100 text-green-700",
                          serviceStatus.status === 'upcoming' && "bg-amber-100 text-amber-700",
                          serviceStatus.status === 'overdue' && "bg-red-100 text-red-700"
                        )}>
                          {serviceStatus.message}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        <span className={cn(
                          "text-xs font-medium px-2 py-1 rounded-full",
                          insuranceStatus.status === 'ok' && "bg-green-100 text-green-700",
                          insuranceStatus.status === 'upcoming' && "bg-amber-100 text-amber-700",
                          insuranceStatus.status === 'overdue' && "bg-red-100 text-red-700"
                        )}>
                          {formatDate(bike.insuranceValidity)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => openServiceModal(bike, e)}
                            className={cn(
                              "text-xs font-medium px-3 py-1.5 rounded-lg transition-colors",
                              serviceStatus.status === 'overdue' 
                                ? "bg-red-600 text-white hover:bg-red-700" 
                                : serviceStatus.status === 'upcoming'
                                ? "bg-amber-600 text-white hover:bg-amber-700"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            )}
                          >
                            🔧
                          </button>
                          <button
                            onClick={(e) => handleEditBike(bike, e)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(bike.id);
                            }}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-gray-100 text-red-600 hover:bg-red-100 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Service Modal */}
      {serviceModalBike && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Record Service
              </h3>
              <button 
                onClick={() => setServiceModalBike(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-900">{serviceModalBike.make} {serviceModalBike.model}</p>
                <p className="text-sm text-gray-500">{serviceModalBike.registrationNumber}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Date</label>
                <input
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Odometer Reading at Service (km)</label>
                <input
                  type="number"
                  value={serviceKm || ''}
                  onChange={(e) => setServiceKm(parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Interval</label>
                  <select
                    value={serviceIntervalMonths}
                    onChange={(e) => setServiceIntervalMonths(parseInt(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {SERVICE_INTERVAL_OPTIONS.months.map(m => (
                      <option key={m} value={m}>{m} months</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Or Every</label>
                  <select
                    value={serviceIntervalKms}
                    onChange={(e) => setServiceIntervalKms(parseInt(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {SERVICE_INTERVAL_OPTIONS.kms.map(km => (
                      <option key={km} value={km}>{km.toLocaleString()} km</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 bg-blue-50 rounded-lg p-3">
                <p className="font-medium text-blue-800 mb-1">Next Service Due:</p>
                <p className="text-blue-700">
                  In {serviceIntervalMonths} months or after {serviceIntervalKms.toLocaleString()} km (whichever comes first)
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setServiceModalBike(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveService}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark as Serviced
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && !selectedBike && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Vehicle?</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this vehicle? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteBike(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
