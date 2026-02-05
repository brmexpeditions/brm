import { useState } from 'react';
import { Motorcycle, ServiceRecord } from '../types';
import { formatDate, generateId } from '../utils/helpers';

interface ServiceHistoryProps {
  motorcycles: Motorcycle[];
  serviceRecords: ServiceRecord[];
  onAddServiceRecord: (record: ServiceRecord) => void;
  onUpdateServiceRecord: (record: ServiceRecord) => void;
  onDeleteServiceRecord: (id: string) => void;
  onUpdateBike: (bike: Motorcycle) => void;
}

export function ServiceHistory({
  motorcycles,
  serviceRecords = [],
  onAddServiceRecord,
  onUpdateServiceRecord,
  onDeleteServiceRecord,
  onUpdateBike,
}: ServiceHistoryProps) {
  // Ensure serviceRecords is always an array
  const safeServiceRecords = Array.isArray(serviceRecords) ? serviceRecords : [];
  
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null);
  const [filterBikeId, setFilterBikeId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<Omit<ServiceRecord, 'id'>>({
    motorcycleId: '',
    date: new Date().toISOString().split('T')[0],
    kilometers: 0,
    workDone: '',
    amount: 0,
    mechanic: '',
    garage: '',
    notes: '',
    partsReplaced: '',
  });

  const resetForm = () => {
    setFormData({
      motorcycleId: motorcycles[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      kilometers: 0,
      workDone: '',
      amount: 0,
      mechanic: '',
      garage: '',
      notes: '',
      partsReplaced: '',
    });
    setEditingRecord(null);
    setShowForm(false);
  };

  const openNewForm = () => {
    const selectedBike = motorcycles[0];
    const currentKm = selectedBike && selectedBike.kmReadings && selectedBike.kmReadings.length > 0 
      ? selectedBike.kmReadings[selectedBike.kmReadings.length - 1].kilometers 
      : 0;
    
    setFormData({
      motorcycleId: selectedBike?.id || '',
      date: new Date().toISOString().split('T')[0],
      kilometers: currentKm,
      workDone: '',
      amount: 0,
      mechanic: '',
      garage: '',
      notes: '',
      partsReplaced: '',
    });
    setEditingRecord(null);
    setShowForm(true);
  };

  const openEditForm = (record: ServiceRecord) => {
    setFormData({
      motorcycleId: record.motorcycleId,
      date: record.date,
      kilometers: record.kilometers,
      workDone: record.workDone,
      amount: record.amount,
      mechanic: record.mechanic || '',
      garage: record.garage || '',
      notes: record.notes || '',
      partsReplaced: record.partsReplaced || '',
    });
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleBikeSelect = (bikeId: string) => {
    const selectedBike = motorcycles.find(b => b.id === bikeId);
    const currentKm = selectedBike && selectedBike.kmReadings && selectedBike.kmReadings.length > 0 
      ? selectedBike.kmReadings[selectedBike.kmReadings.length - 1].kilometers 
      : 0;
    setFormData({
      ...formData,
      motorcycleId: bikeId,
      kilometers: currentKm,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a copy of the form data to avoid closure issues
    const serviceData = { ...formData };
    const currentBikeId = serviceData.motorcycleId;
    
    console.log('Submitting service record:', serviceData);
    
    if (editingRecord) {
      const updatedRecord: ServiceRecord = {
        ...editingRecord,
        ...serviceData,
      };
      console.log('Updating record:', updatedRecord);
      onUpdateServiceRecord(updatedRecord);
    } else {
      const newRecord: ServiceRecord = {
        id: generateId(),
        motorcycleId: serviceData.motorcycleId,
        date: serviceData.date,
        kilometers: serviceData.kilometers,
        workDone: serviceData.workDone,
        amount: serviceData.amount,
        mechanic: serviceData.mechanic,
        garage: serviceData.garage,
        notes: serviceData.notes,
        partsReplaced: serviceData.partsReplaced,
      };
      
      console.log('Adding new record:', newRecord);
      onAddServiceRecord(newRecord);
      
      // Update bike's last service date and km with a longer delay to ensure service record is saved first
      setTimeout(() => {
        const bike = motorcycles.find(b => b.id === currentBikeId);
        if (bike) {
          console.log('Updating bike last service:', bike.id);
          onUpdateBike({
            ...bike,
            lastServiceDate: serviceData.date,
            lastServiceKm: serviceData.kilometers,
          });
        }
      }, 500); // Increased delay to 500ms
    }
    
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service record?')) {
      onDeleteServiceRecord(id);
    }
  };

  const getBikeShortName = (motorcycleId: string) => {
    const bike = motorcycles.find(b => b.id === motorcycleId);
    return bike ? `${bike.make} ${bike.model}` : 'Unknown';
  };

  const filteredRecords = safeServiceRecords
    .filter(record => {
      if (filterBikeId !== 'all' && record.motorcycleId !== filterBikeId) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const bike = motorcycles.find(b => b.id === record.motorcycleId);
        return (
          record.workDone.toLowerCase().includes(searchLower) ||
          record.garage?.toLowerCase().includes(searchLower) ||
          record.mechanic?.toLowerCase().includes(searchLower) ||
          record.partsReplaced?.toLowerCase().includes(searchLower) ||
          bike?.registrationNumber.toLowerCase().includes(searchLower) ||
          bike?.make.toLowerCase().includes(searchLower) ||
          bike?.model.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate totals
  const totalAmount = filteredRecords.reduce((sum, r) => sum + r.amount, 0);
  const totalServices = filteredRecords.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Records</h1>
          <p className="text-gray-500">Track all service history and expenses</p>
        </div>
        <button
          onClick={openNewForm}
          disabled={motorcycles.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Service Record
        </button>
      </div>

      {motorcycles.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No motorcycles in fleet</h3>
          <p className="text-gray-500">Add motorcycles first to start tracking service records.</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Services</p>
                  <p className="text-2xl font-bold text-gray-900">{totalServices}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Per Service</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{totalServices > 0 ? Math.round(totalAmount / totalServices).toLocaleString() : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add/Edit Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-xl max-w-2xl w-full shadow-xl my-8">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingRecord ? 'Edit Service Record' : 'Add New Service Record'}
                  </h3>
                  <button 
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  {/* Motorcycle Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Motorcycle *</label>
                    <select
                      value={formData.motorcycleId}
                      onChange={(e) => handleBikeSelect(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select a motorcycle</option>
                      {motorcycles.map(bike => (
                        <option key={bike.id} value={bike.id}>
                          {bike.make} {bike.model} ({bike.registrationNumber})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date and KM */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service Date *</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Odometer Reading (km) *</label>
                      <input
                        type="number"
                        value={formData.kilometers || ''}
                        onChange={(e) => setFormData({ ...formData, kilometers: parseInt(e.target.value) || 0 })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  {/* Work Done */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Done / Service Type *</label>
                    <textarea
                      value={formData.workDone}
                      onChange={(e) => setFormData({ ...formData, workDone: e.target.value })}
                      placeholder="e.g., Oil change, chain cleaning, brake pad replacement..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Parts Replaced */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Parts Replaced</label>
                    <input
                      type="text"
                      value={formData.partsReplaced || ''}
                      onChange={(e) => setFormData({ ...formData, partsReplaced: e.target.value })}
                      placeholder="e.g., Engine oil, oil filter, brake pads..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (₹) *</label>
                    <input
                      type="number"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                      placeholder="Enter total cost"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      required
                    />
                  </div>

                  {/* Garage and Mechanic */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Garage / Workshop</label>
                      <input
                        type="text"
                        value={formData.garage || ''}
                        onChange={(e) => setFormData({ ...formData, garage: e.target.value })}
                        placeholder="e.g., Honda Service Center"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mechanic Name</label>
                      <input
                        type="text"
                        value={formData.mechanic || ''}
                        onChange={(e) => setFormData({ ...formData, mechanic: e.target.value })}
                        placeholder="e.g., Ramesh"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any other details..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {editingRecord ? 'Update Record' : 'Save Record'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by work done, garage, parts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <select
                  value={filterBikeId}
                  onChange={(e) => setFilterBikeId(e.target.value)}
                  className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Motorcycles</option>
                  {motorcycles.map(bike => (
                    <option key={bike.id} value={bike.id}>
                      {bike.make} {bike.model} ({bike.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Service Records Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredRecords.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No service records</h3>
                <p>Add your first service record to start tracking maintenance.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorcycle</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">KM</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Done</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Garage</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRecords.map(record => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(record.date)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{getBikeShortName(record.motorcycleId)}</div>
                          <div className="text-xs text-gray-500">
                            {motorcycles.find(b => b.id === record.motorcycleId)?.registrationNumber}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                          {record.kilometers.toLocaleString()} km
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{record.workDone}</div>
                          {record.partsReplaced && (
                            <div className="text-xs text-gray-500 truncate">Parts: {record.partsReplaced}</div>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          {record.garage || '-'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          ₹{record.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditForm(record)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(record.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        Total ({filteredRecords.length} records):
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                        ₹{totalAmount.toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
