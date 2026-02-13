import React, { useState } from 'react';
import { Motorcycle, ServiceRecord, CompanySettings } from '../types';

interface AnalyticsProps {
  motorcycles: Motorcycle[];
  serviceRecords: ServiceRecord[];
  companySettings: CompanySettings;
}

const Analytics: React.FC<AnalyticsProps> = ({ motorcycles, serviceRecords, companySettings }) => {
  const [showServiceDetails, setShowServiceDetails] = useState<'upcoming' | 'overdue' | null>(null);
  const [showDocDetails, setShowDocDetails] = useState<string | null>(null);
  // Fleet Statistics
  const totalBikes = motorcycles.length;
  const uniqueMakes = [...new Set(motorcycles.map(m => m.make))];
  const uniqueModels = [...new Set(motorcycles.map(m => `${m.make} ${m.model}`))];
  
  // Make distribution
  const makeDistribution = motorcycles.reduce((acc, m) => {
    acc[m.make] = (acc[m.make] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Model distribution
  const modelDistribution = motorcycles.reduce((acc, m) => {
    const key = `${m.make} ${m.model}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort by count
  const sortedMakes = Object.entries(makeDistribution).sort((a, b) => b[1] - a[1]);
  const sortedModels = Object.entries(modelDistribution).sort((a, b) => b[1] - a[1]);
  
  // Service Analysis
  const safeServiceRecords = Array.isArray(serviceRecords) ? serviceRecords : [];
  const totalServiceCost = safeServiceRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
  const avgServiceCost = safeServiceRecords.length > 0 ? totalServiceCost / safeServiceRecords.length : 0;
  
  // Service cost per bike
  const serviceCostPerBike = motorcycles.map(m => {
    const bikeServices = safeServiceRecords.filter(s => s.motorcycleId === m.id);
    const totalCost = bikeServices.reduce((sum, s) => sum + (s.amount || 0), 0);
    return {
      bike: `${m.make} ${m.model}`,
      registration: m.registrationNumber,
      serviceCount: bikeServices.length,
      totalCost,
      avgCost: bikeServices.length > 0 ? totalCost / bikeServices.length : 0
    };
  }).sort((a, b) => b.totalCost - a.totalCost);
  
  // Monthly service trend
  const monthlyServices = safeServiceRecords.reduce((acc, s) => {
    const month = s.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) acc[month] = { count: 0, cost: 0 };
    acc[month].count++;
    acc[month].cost += s.amount || 0;
    return acc;
  }, {} as Record<string, { count: number; cost: number }>);
  
  const sortedMonths = Object.entries(monthlyServices)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12); // Last 12 months
  
  // Document Status Analysis
  const today = new Date();
  
  const documentStats = {
    insurance: { expired: 0, expiring: 0, valid: 0 },
    pollution: { expired: 0, expiring: 0, valid: 0 },
    fitness: { expired: 0, expiring: 0, valid: 0 },
    roadTax: { expired: 0, expiring: 0, valid: 0 },
    permit: { expired: 0, expiring: 0, valid: 0 }
  };
  
  // Detailed document issues for each type
  const documentIssues: Record<string, Array<{
    vehicle: Motorcycle;
    status: 'expired' | 'expiring';
    daysLeft: number;
    validTill: string;
  }>> = {
    insurance: [],
    pollution: [],
    fitness: [],
    roadTax: [],
    permit: []
  };
  
  const getDocStatusDetailed = (dateStr?: string) => {
    if (!dateStr) return { status: 'unknown', daysLeft: 0 };
    const date = new Date(dateStr);
    const daysLeft = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return { status: 'expired', daysLeft };
    if (daysLeft <= 30) return { status: 'expiring', daysLeft };
    return { status: 'valid', daysLeft };
  };
  
  motorcycles.forEach(m => {
    const insDetails = getDocStatusDetailed(m.insuranceValidity);
    const polDetails = getDocStatusDetailed(m.pollutionValidity);
    const fitDetails = getDocStatusDetailed(m.fitnessValidity);
    const taxDetails = getDocStatusDetailed(m.roadTaxValidity);
    
    if (insDetails.status !== 'unknown') {
      documentStats.insurance[insDetails.status as keyof typeof documentStats.insurance]++;
      if (insDetails.status === 'expired' || insDetails.status === 'expiring') {
        documentIssues.insurance.push({
          vehicle: m,
          status: insDetails.status,
          daysLeft: insDetails.daysLeft,
          validTill: m.insuranceValidity || ''
        });
      }
    }
    
    if (polDetails.status !== 'unknown') {
      documentStats.pollution[polDetails.status as keyof typeof documentStats.pollution]++;
      if (polDetails.status === 'expired' || polDetails.status === 'expiring') {
        documentIssues.pollution.push({
          vehicle: m,
          status: polDetails.status,
          daysLeft: polDetails.daysLeft,
          validTill: m.pollutionValidity || ''
        });
      }
    }
    
    if (fitDetails.status !== 'unknown') {
      documentStats.fitness[fitDetails.status as keyof typeof documentStats.fitness]++;
      if (fitDetails.status === 'expired' || fitDetails.status === 'expiring') {
        documentIssues.fitness.push({
          vehicle: m,
          status: fitDetails.status,
          daysLeft: fitDetails.daysLeft,
          validTill: m.fitnessValidity || ''
        });
      }
    }
    
    if (taxDetails.status !== 'unknown') {
      documentStats.roadTax[taxDetails.status as keyof typeof documentStats.roadTax]++;
      if (taxDetails.status === 'expired' || taxDetails.status === 'expiring') {
        documentIssues.roadTax.push({
          vehicle: m,
          status: taxDetails.status,
          daysLeft: taxDetails.daysLeft,
          validTill: m.roadTaxValidity || ''
        });
      }
    }
    
    const permitDetails = getDocStatusDetailed(m.permitValidity);
    if (permitDetails.status !== 'unknown') {
      documentStats.permit[permitDetails.status as keyof typeof documentStats.permit]++;
      if (permitDetails.status === 'expired' || permitDetails.status === 'expiring') {
        documentIssues.permit.push({
          vehicle: m,
          status: permitDetails.status,
          daysLeft: permitDetails.daysLeft,
          validTill: m.permitValidity || ''
        });
      }
    }
  });
  
  // Sort document issues by urgency
  Object.keys(documentIssues).forEach(key => {
    documentIssues[key].sort((a, b) => a.daysLeft - b.daysLeft);
  });
  
  // Service Status Analysis with detailed info
  const getServiceStatusDetailed = (m: Motorcycle) => {
    const lastServiceDate = new Date(m.lastServiceDate || new Date());
    const monthsSince = (today.getTime() - lastServiceDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const kmReadings = Array.isArray(m.kmReadings) ? m.kmReadings : [];
    const currentKm = kmReadings.length > 0 
      ? Math.max(...kmReadings.map(r => r.kilometers))
      : (m.lastServiceKm || 0);
    const kmSince = currentKm - m.lastServiceKm;
    
    const monthsLeft = m.serviceIntervalMonths - monthsSince;
    const kmsLeft = m.serviceIntervalKms - kmSince;
    const daysLeft = Math.round(monthsLeft * 30);
    
    let status: 'ok' | 'upcoming' | 'overdue' = 'ok';
    if (monthsLeft <= 0 || kmsLeft <= 0) status = 'overdue';
    else if (monthsLeft <= 0.5 || kmsLeft <= 500) status = 'upcoming';
    
    return {
      status,
      daysLeft: Math.round(daysLeft),
      kmsLeft: Math.round(kmsLeft),
      currentKm,
      lastServiceDate: m.lastServiceDate
    };
  };
  
  const serviceStatusCount = { ok: 0, upcoming: 0, overdue: 0 };
  const vehiclesNeedingService: Array<{
    vehicle: Motorcycle;
    status: 'upcoming' | 'overdue';
    daysLeft: number;
    kmsLeft: number;
  }> = [];
  
  motorcycles.forEach(m => {
    const details = getServiceStatusDetailed(m);
    serviceStatusCount[details.status]++;
    if (details.status === 'upcoming' || details.status === 'overdue') {
      vehiclesNeedingService.push({
        vehicle: m,
        status: details.status,
        daysLeft: details.daysLeft,
        kmsLeft: details.kmsLeft
      });
    }
  });
  
  // Sort by urgency (overdue first, then by days left)
  vehiclesNeedingService.sort((a, b) => {
    if (a.status === 'overdue' && b.status !== 'overdue') return -1;
    if (a.status !== 'overdue' && b.status === 'overdue') return 1;
    return a.daysLeft - b.daysLeft;
  });
  
  // Total KM analysis
  const totalFleetKm = motorcycles.reduce((sum, m) => {
    const kmReadings = Array.isArray(m.kmReadings) ? m.kmReadings : [];
    const maxKm = kmReadings.length > 0 
      ? Math.max(...kmReadings.map(r => r.kilometers))
      : (m.lastServiceKm || 0);
    return sum + maxKm;
  }, 0);
  
  const avgKmPerBike = totalBikes > 0 ? totalFleetKm / totalBikes : 0;
  
  // Top 5 highest KM bikes
  const highestKmBikes = motorcycles.map(m => {
    const kmReadings = Array.isArray(m.kmReadings) ? m.kmReadings : [];
    const maxKm = kmReadings.length > 0 
      ? Math.max(...kmReadings.map(r => r.kilometers))
      : (m.lastServiceKm || 0);
    return { ...m, currentKm: maxKm };
  }).sort((a, b) => b.currentKm - a.currentKm).slice(0, 5);
  
  // Most serviced bikes
  const mostServiced = motorcycles.map(m => {
    const count = safeServiceRecords.filter(s => s.motorcycleId === m.id).length;
    return { bike: `${m.make} ${m.model}`, registration: m.registrationNumber, count };
  }).sort((a, b) => b.count - a.count).slice(0, 5);
  
  // Garage/Workshop analysis
  const garageStats = safeServiceRecords.reduce((acc, s) => {
    const garage = s.garage || 'Unknown';
    if (!acc[garage]) acc[garage] = { count: 0, cost: 0 };
    acc[garage].count++;
    acc[garage].cost += s.amount || 0;
    return acc;
  }, {} as Record<string, { count: number; cost: number }>);
  
  const sortedGarages = Object.entries(garageStats).sort((a, b) => b[1].count - a[1].count);
  
  // Fleet Health Score (0-100)
  const healthScore = totalBikes > 0 ? Math.round(
    ((serviceStatusCount.ok * 100 + serviceStatusCount.upcoming * 50 + serviceStatusCount.overdue * 0) / totalBikes) * 0.4 +
    (((documentStats.insurance.valid + documentStats.pollution.valid + documentStats.fitness.valid + documentStats.roadTax.valid) / 
      (totalBikes * 4)) * 100) * 0.6
  ) : 0;
  
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(num));
  };

  if (totalBikes === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Data Yet</h2>
          <p className="text-gray-500">Add some motorcycles to see analytics and insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Company Header */}
      {companySettings.companyName && (
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
          {companySettings.logo && (
            <img src={companySettings.logo} alt="Logo" className="h-16 w-16 object-contain rounded-lg" />
          )}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: companySettings.primaryColor || '#1e40af' }}>
              {companySettings.companyName}
            </h1>
            {companySettings.tagline && (
              <p className="text-gray-500">{companySettings.tagline}</p>
            )}
          </div>
          <div className="ml-auto text-right text-sm text-gray-500">
            <p>📧 {companySettings.email || '-'}</p>
            <p>📞 {companySettings.phone || '-'}</p>
          </div>
        </div>
      )}

      {/* Fleet Health Score */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Fleet Health Score</h2>
            <p className="text-gray-500 text-sm">Based on service status and document validity</p>
          </div>
          <div className={`text-5xl font-bold rounded-full w-24 h-24 flex items-center justify-center ${getHealthColor(healthScore)}`}>
            {healthScore}
          </div>
        </div>
        <div className="mt-4 bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${
              healthScore >= 80 ? 'bg-green-500' : healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${healthScore}%` }}
          />
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{totalBikes}</div>
          <div className="text-blue-100 text-sm">Total Bikes</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{uniqueMakes.length}</div>
          <div className="text-purple-100 text-sm">Brands</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{uniqueModels.length}</div>
          <div className="text-indigo-100 text-sm">Models</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="text-3xl font-bold">{safeServiceRecords.length}</div>
          <div className="text-green-100 text-sm">Total Services</div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">{formatNumber(totalFleetKm)}</div>
          <div className="text-amber-100 text-sm">Total Fleet KM</div>
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl p-4 text-white">
          <div className="text-2xl font-bold">{formatCurrency(totalServiceCost)}</div>
          <div className="text-rose-100 text-sm">Total Spent</div>
        </div>
      </div>

      {/* Service Status & Document Status */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Service Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔧 Service Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                Service OK
              </span>
              <span className="font-bold text-green-600">{serviceStatusCount.ok} vehicles</span>
            </div>
            <div 
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                showServiceDetails === 'upcoming' ? 'bg-amber-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setShowServiceDetails(showServiceDetails === 'upcoming' ? null : 'upcoming')}
            >
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                Service Upcoming
                {serviceStatusCount.upcoming > 0 && <span className="text-xs text-gray-500">▼ Click to view</span>}
              </span>
              <span className="font-bold text-amber-600">{serviceStatusCount.upcoming} vehicles</span>
            </div>
            <div 
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                showServiceDetails === 'overdue' ? 'bg-red-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => setShowServiceDetails(showServiceDetails === 'overdue' ? null : 'overdue')}
            >
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                Service Overdue
                {serviceStatusCount.overdue > 0 && <span className="text-xs text-gray-500">▼ Click to view</span>}
              </span>
              <span className="font-bold text-red-600">{serviceStatusCount.overdue} vehicles</span>
            </div>
          </div>
          
          {/* Expandable Service Details */}
          {showServiceDetails && vehiclesNeedingService.filter(v => v.status === showServiceDetails).length > 0 && (
            <div className={`mt-4 p-4 rounded-lg ${showServiceDetails === 'overdue' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
              <h4 className={`font-bold mb-3 ${showServiceDetails === 'overdue' ? 'text-red-700' : 'text-amber-700'}`}>
                {showServiceDetails === 'overdue' ? '🚨 Vehicles Overdue for Service' : '⚠️ Vehicles with Upcoming Service'}
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {vehiclesNeedingService
                  .filter(v => v.status === showServiceDetails)
                  .map(item => (
                    <div key={item.vehicle.id} className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">
                          {item.vehicle.vehicleType === 'Car' ? '🚗' : '🏍️'} {item.vehicle.make} {item.vehicle.model}
                        </div>
                        <div className="text-sm text-gray-500">{item.vehicle.registrationNumber}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${item.daysLeft < 0 ? 'text-red-600' : 'text-amber-600'}`}>
                          {item.daysLeft < 0 ? `${Math.abs(item.daysLeft)} days overdue` : `${item.daysLeft} days left`}
                        </div>
                        <div className={`text-sm ${item.kmsLeft < 0 ? 'text-red-500' : 'text-amber-500'}`}>
                          {item.kmsLeft < 0 ? `${formatNumber(Math.abs(item.kmsLeft))} km overdue` : `${formatNumber(item.kmsLeft)} km left`}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* Visual bar */}
          <div className="mt-4 flex rounded-full overflow-hidden h-6">
            {serviceStatusCount.ok > 0 && (
              <div className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${(serviceStatusCount.ok / totalBikes) * 100}%` }}>
                {serviceStatusCount.ok}
              </div>
            )}
            {serviceStatusCount.upcoming > 0 && (
              <div className="bg-amber-500 flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${(serviceStatusCount.upcoming / totalBikes) * 100}%` }}>
                {serviceStatusCount.upcoming}
              </div>
            )}
            {serviceStatusCount.overdue > 0 && (
              <div className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${(serviceStatusCount.overdue / totalBikes) * 100}%` }}>
                {serviceStatusCount.overdue}
              </div>
            )}
          </div>
        </div>

        {/* Document Status */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📄 Document Status</h3>
          <div className="space-y-3">
            {Object.entries(documentStats).map(([doc, stats]) => {
              const docLabel = doc === 'roadTax' ? 'Road Tax' : doc.charAt(0).toUpperCase() + doc.slice(1);
              const issues = documentIssues[doc] || [];
              const hasIssues = issues.length > 0;
              
              return (
                <div key={doc} className="space-y-1">
                  <div 
                    className={`flex justify-between text-sm p-2 rounded-lg cursor-pointer transition-colors ${
                      showDocDetails === doc ? 'bg-gray-100' : hasIssues ? 'hover:bg-gray-50' : ''
                    }`}
                    onClick={() => hasIssues && setShowDocDetails(showDocDetails === doc ? null : doc)}
                  >
                    <span className="capitalize font-medium flex items-center gap-2">
                      {docLabel}
                      {hasIssues && <span className="text-xs text-gray-400">▼ Click to view</span>}
                    </span>
                    <span className="text-gray-500">
                      <span className="text-green-600">{stats.valid}✓</span> / 
                      <span className="text-amber-600">{stats.expiring}⚠</span> / 
                      <span className="text-red-600">{stats.expired}✗</span>
                    </span>
                  </div>
                  <div className="flex rounded-full overflow-hidden h-2 bg-gray-200">
                    {stats.valid > 0 && (
                      <div className="bg-green-500" style={{ width: `${(stats.valid / totalBikes) * 100}%` }} />
                    )}
                    {stats.expiring > 0 && (
                      <div className="bg-amber-500" style={{ width: `${(stats.expiring / totalBikes) * 100}%` }} />
                    )}
                    {stats.expired > 0 && (
                      <div className="bg-red-500" style={{ width: `${(stats.expired / totalBikes) * 100}%` }} />
                    )}
                  </div>
                  
                  {/* Expandable Document Details */}
                  {showDocDetails === doc && issues.length > 0 && (
                    <div className="mt-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
                      <h4 className="font-bold text-gray-700 mb-2 text-sm">
                        🚨 {docLabel} Issues ({issues.length} vehicles)
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {issues.map(item => (
                          <div key={item.vehicle.id} className={`p-2 rounded-lg text-sm flex items-center justify-between ${
                            item.status === 'expired' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
                          }`}>
                            <div>
                              <div className="font-medium text-gray-800">
                                {item.vehicle.vehicleType === 'Car' ? '🚗' : '🏍️'} {item.vehicle.make} {item.vehicle.model}
                              </div>
                              <div className="text-xs text-gray-500">{item.vehicle.registrationNumber}</div>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold ${item.status === 'expired' ? 'text-red-600' : 'text-amber-600'}`}>
                                {item.status === 'expired' 
                                  ? `Expired ${Math.abs(item.daysLeft)} days ago`
                                  : `${item.daysLeft} days left`
                                }
                              </div>
                              <div className="text-xs text-gray-500">
                                Valid till: {new Date(item.validTill).toLocaleDateString('en-IN')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Brand & Model Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Brand Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏭 Brand Distribution</h3>
          <div className="space-y-3">
            {sortedMakes.map(([make, count], idx) => (
              <div key={make} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    {idx === 0 && <span className="text-amber-500">👑</span>}
                    {make}
                  </span>
                  <span className="text-gray-600">{count} bikes ({Math.round((count / totalBikes) * 100)}%)</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(count / totalBikes) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏍️ Model Distribution</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {sortedModels.map(([model, count], idx) => (
              <div key={model} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium flex items-center gap-2">
                    {idx === 0 && <span className="text-amber-500">⭐</span>}
                    {model}
                  </span>
                  <span className="text-gray-600">{count} units</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full"
                    style={{ width: `${(count / totalBikes) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Cost Analysis */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">💰 Service Cost Analysis</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalServiceCost)}</div>
            <div className="text-green-700 text-sm">Total Spent</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(avgServiceCost)}</div>
            <div className="text-blue-700 text-sm">Avg per Service</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalBikes > 0 ? totalServiceCost / totalBikes : 0)}</div>
            <div className="text-purple-700 text-sm">Avg per Bike</div>
          </div>
        </div>
        
        {/* Cost per bike table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-2">Bike</th>
                <th className="text-left p-2">Registration</th>
                <th className="text-center p-2">Services</th>
                <th className="text-right p-2">Total Cost</th>
                <th className="text-right p-2">Avg Cost</th>
              </tr>
            </thead>
            <tbody>
              {serviceCostPerBike.slice(0, 10).map((item, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{item.bike}</td>
                  <td className="p-2 text-gray-600">{item.registration}</td>
                  <td className="p-2 text-center">{item.serviceCount}</td>
                  <td className="p-2 text-right font-medium">{formatCurrency(item.totalCost)}</td>
                  <td className="p-2 text-right text-gray-600">{formatCurrency(item.avgCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Trend & Top Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Monthly Service Trend</h3>
          {sortedMonths.length > 0 ? (
            <div className="space-y-2">
              {sortedMonths.map(([month, data]) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="w-20 text-sm text-gray-600">{month}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden relative">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full flex items-center justify-end px-2"
                      style={{ width: `${Math.min((data.cost / Math.max(...sortedMonths.map(m => m[1].cost))) * 100, 100)}%` }}
                    >
                      <span className="text-white text-xs font-medium">{formatCurrency(data.cost)}</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{data.count}x</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No service data yet</p>
          )}
        </div>

        {/* Highest KM Bikes */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🏁 Highest Odometer Readings</h3>
          <div className="space-y-3">
            {highestKmBikes.map((bike, idx) => (
              <div key={bike.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-amber-700' : 'bg-gray-300'
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="font-medium">{bike.make} {bike.model}</div>
                  <div className="text-sm text-gray-500">{bike.registrationNumber}</div>
                </div>
                <span className="font-bold text-blue-600">{formatNumber(bike.currentKm)} km</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Garage Stats & Most Serviced */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Garage Stats */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔧 Workshop Analysis</h3>
          {sortedGarages.length > 0 ? (
            <div className="space-y-3">
              {sortedGarages.slice(0, 5).map(([garage, data], idx) => (
                <div key={garage} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <span className="flex items-center gap-2">
                    {idx === 0 && <span className="text-amber-500">🏆</span>}
                    <span className="font-medium">{garage}</span>
                  </span>
                  <span className="text-sm text-gray-600">
                    {data.count} services • {formatCurrency(data.cost)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No garage data yet</p>
          )}
        </div>

        {/* Most Serviced */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🔄 Most Serviced Bikes</h3>
          {mostServiced.filter(m => m.count > 0).length > 0 ? (
            <div className="space-y-3">
              {mostServiced.filter(m => m.count > 0).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div>
                    <div className="font-medium">{item.bike}</div>
                    <div className="text-sm text-gray-500">{item.registration}</div>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">{item.count} services</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No service data yet</p>
          )}
        </div>
      </div>

      {/* Complete Fleet List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Complete Fleet Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">Make</th>
                <th className="text-left p-3">Model</th>
                <th className="text-left p-3">Registration</th>
                <th className="text-left p-3">Chassis</th>
                <th className="text-right p-3">Current KM</th>
                <th className="text-center p-3">Services</th>
                <th className="text-right p-3">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {motorcycles.map((m, idx) => {
                const bikeServices = safeServiceRecords.filter(s => s.motorcycleId === m.id);
                const totalSpent = bikeServices.reduce((sum, s) => sum + (s.amount || 0), 0);
                const kmReadings = Array.isArray(m.kmReadings) ? m.kmReadings : [];
                const currentKm = kmReadings.length > 0 
                  ? Math.max(...kmReadings.map(r => r.kilometers))
                  : (m.lastServiceKm || 0);
                return (
                  <tr key={m.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-500">{idx + 1}</td>
                    <td className="p-3 font-medium">{m.make}</td>
                    <td className="p-3">{m.model}</td>
                    <td className="p-3 font-mono">{m.registrationNumber}</td>
                    <td className="p-3 font-mono text-gray-500 text-xs">{m.chassisNumber}</td>
                    <td className="p-3 text-right">{formatNumber(currentKm)} km</td>
                    <td className="p-3 text-center">{bikeServices.length}</td>
                    <td className="p-3 text-right font-medium">{formatCurrency(totalSpent)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td colSpan={5} className="p-3">TOTAL</td>
                <td className="p-3 text-right">{formatNumber(totalFleetKm)} km</td>
                <td className="p-3 text-center">{safeServiceRecords.length}</td>
                <td className="p-3 text-right">{formatCurrency(totalServiceCost)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Average Stats */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-md p-6 text-white">
        <h3 className="text-lg font-bold mb-4">📊 Fleet Averages</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{formatNumber(avgKmPerBike)}</div>
            <div className="text-gray-400 text-sm">Avg KM per Bike</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">{formatCurrency(avgServiceCost)}</div>
            <div className="text-gray-400 text-sm">Avg Service Cost</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">
              {totalBikes > 0 ? (safeServiceRecords.length / totalBikes).toFixed(1) : 0}
            </div>
            <div className="text-gray-400 text-sm">Avg Services/Bike</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">{formatCurrency(totalBikes > 0 ? totalServiceCost / totalBikes : 0)}</div>
            <div className="text-gray-400 text-sm">Avg Spent/Bike</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
