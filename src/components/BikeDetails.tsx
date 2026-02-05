import { useState } from 'react';
import { Motorcycle } from '../types';
import { getServiceStatus, getValidityStatus } from '../utils/helpers';

interface BikeDetailsProps {
  bike: Motorcycle;
  onUpdate: (bike: Motorcycle) => void;
  onDelete: () => void;
  onBack: () => void;
}

export function BikeDetails({ bike, onUpdate, onDelete, onBack }: BikeDetailsProps) {
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showKmForm, setShowKmForm] = useState(false);
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [serviceKm, setServiceKm] = useState('');
  const [newKmReading, setNewKmReading] = useState('');
  const [newKmDate, setNewKmDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const serviceStatus = getServiceStatus(bike);
  const kmReadings = Array.isArray(bike.kmReadings) ? bike.kmReadings : [];
  const currentKm = kmReadings.length > 0 
    ? Math.max(...kmReadings.map(r => r.kilometers)) 
    : bike.currentOdometer || 0;

  const handleRecordService = () => {
    const km = parseInt(serviceKm) || currentKm;
    const updatedBike: Motorcycle = {
      ...bike,
      lastServiceDate: serviceDate,
      lastServiceKm: km,
      kmReadings: [
        ...kmReadings,
        { date: serviceDate, kilometers: km, id: Date.now().toString() }
      ]
    };
    onUpdate(updatedBike);
    setShowServiceForm(false);
    setServiceKm('');
  };

  const handleAddKmReading = () => {
    const km = parseInt(newKmReading);
    if (!km || km <= 0) return;

    const updatedBike: Motorcycle = {
      ...bike,
      currentOdometer: km,
      kmReadings: [
        ...kmReadings,
        { date: newKmDate, kilometers: km, id: Date.now().toString() }
      ]
    };
    onUpdate(updatedBike);
    setShowKmForm(false);
    setNewKmReading('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-300';
      case 'upcoming': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getValidityColor = (validTill?: string) => {
    const status = getValidityStatus(validTill);
    switch (status.status) {
      case 'overdue': return 'bg-red-100 text-red-800 border-red-300';
      case 'upcoming': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const formatDays = (days: number) => {
    if (!isFinite(days)) return 'N/A';
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          <span>←</span>
          <span>Back to Fleet</span>
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Bike Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {bike.make} {bike.model}
            </h1>
            <p className="text-gray-500 text-lg">{bike.registrationNumber}</p>
            {bike.chassisNumber && (
              <p className="text-gray-400 text-sm">Chassis: {bike.chassisNumber}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Odometer</p>
            <p className="text-3xl font-bold text-blue-600">{currentKm.toLocaleString()} km</p>
          </div>
        </div>
      </div>

      {/* Service Status Card */}
      <div className={`rounded-xl shadow-lg p-6 border-2 ${getStatusColor(serviceStatus.status)}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🔧 Service Status
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            serviceStatus.status === 'overdue' ? 'bg-red-500 text-white' :
            serviceStatus.status === 'upcoming' ? 'bg-amber-500 text-white' :
            'bg-green-500 text-white'
          }`}>
            {serviceStatus.status.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm opacity-75">Last Service</p>
            <p className="font-semibold">
              {bike.lastServiceDate ? new Date(bike.lastServiceDate).toLocaleDateString() : 'Never'}
            </p>
          </div>
          <div>
            <p className="text-sm opacity-75">Last Service KM</p>
            <p className="font-semibold">{bike.lastServiceKm?.toLocaleString() || 0} km</p>
          </div>
          <div>
            <p className="text-sm opacity-75">Service Interval</p>
            <p className="font-semibold">{bike.serviceIntervalMonths} months / {bike.serviceIntervalKms?.toLocaleString()} km</p>
          </div>
          <div>
            <p className="text-sm opacity-75">KM Since Service</p>
            <p className="font-semibold">{(currentKm - (bike.lastServiceKm || 0)).toLocaleString()} km</p>
          </div>
        </div>

        {!showServiceForm ? (
          <button
            onClick={() => setShowServiceForm(true)}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              serviceStatus.status === 'overdue' 
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : serviceStatus.status === 'upcoming'
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            🔧 Record Service
          </button>
        ) : (
          <div className="bg-white rounded-lg p-4 mt-4">
            <h3 className="font-semibold mb-3">Record Service</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Date</label>
                <input
                  type="date"
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Odometer (KM)</label>
                <input
                  type="number"
                  value={serviceKm}
                  onChange={(e) => setServiceKm(e.target.value)}
                  placeholder={currentKm.toString()}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRecordService}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Service
              </button>
              <button
                onClick={() => setShowServiceForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Document Validity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'Insurance', value: bike.insuranceValidity, icon: '🛡️' },
          { label: 'Pollution Certificate', value: bike.pollutionValidity, icon: '💨' },
          { label: 'Fitness Certificate', value: bike.fitnessValidity, icon: '✅' },
          { label: 'Road Tax', value: bike.roadTaxValidity, icon: '🛣️' }
        ].map((doc) => {
          const validity = getValidityStatus(doc.value);
          return (
            <div key={doc.label} className={`rounded-xl shadow-lg p-4 border-2 ${getValidityColor(doc.value)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium flex items-center gap-2">
                    <span>{doc.icon}</span>
                    {doc.label}
                  </p>
                  <p className="text-sm mt-1">
                    {doc.value ? new Date(doc.value).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatDays(validity.days)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Odometer History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            📊 Odometer History
          </h2>
          <button
            onClick={() => setShowKmForm(!showKmForm)}
            className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-medium"
          >
            ➕ Add Reading
          </button>
        </div>

        {showKmForm && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newKmDate}
                  onChange={(e) => setNewKmDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Odometer (KM)</label>
                <input
                  type="number"
                  value={newKmReading}
                  onChange={(e) => setNewKmReading(e.target.value)}
                  placeholder="Enter KM reading"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddKmReading}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Reading
              </button>
              <button
                onClick={() => setShowKmForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {kmReadings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Date</th>
                  <th className="text-right py-2 px-3">Odometer</th>
                  <th className="text-right py-2 px-3">Distance</th>
                </tr>
              </thead>
              <tbody>
                {[...kmReadings]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((reading, index, arr) => {
                    const prevReading = arr[index + 1];
                    const distance = prevReading ? reading.kilometers - prevReading.kilometers : 0;
                    return (
                      <tr key={reading.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3">{new Date(reading.date).toLocaleDateString()}</td>
                        <td className="py-2 px-3 text-right font-medium">{reading.kilometers.toLocaleString()} km</td>
                        <td className="py-2 px-3 text-right text-gray-500">
                          {distance > 0 ? `+${distance.toLocaleString()} km` : '-'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No odometer readings recorded yet</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🗑️ Delete Motorcycle?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{bike.make} {bike.model}</strong> ({bike.registrationNumber})?
              This will also delete all service records for this motorcycle.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BikeDetails;
