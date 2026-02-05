import { Motorcycle } from '../types';
import { getServiceStatus, getValidityStatus, formatDate } from '../utils/helpers';
import { cn } from '../utils/cn';

interface BikeListProps {
  motorcycles: Motorcycle[];
  onSelectBike: (id: string) => void;
}

export function BikeList({ motorcycles, onSelectBike }: BikeListProps) {
  if (motorcycles.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No motorcycles yet</h3>
        <p className="text-gray-500">Add your first motorcycle to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {motorcycles.map(bike => {
        const serviceStatus = getServiceStatus(bike);
        const insuranceStatus = getValidityStatus(bike.insuranceValidity);
        const currentKm = bike.kmReadings.length > 0 
          ? bike.kmReadings[bike.kmReadings.length - 1].kilometers 
          : 0;

        const hasIssues = serviceStatus.status !== 'ok' || insuranceStatus.status !== 'ok';

        return (
          <div
            key={bike.id}
            onClick={() => onSelectBike(bike.id)}
            className={cn(
              "bg-white rounded-xl shadow-sm border overflow-hidden cursor-pointer transition-all hover:shadow-md",
              hasIssues ? "border-red-200" : "border-gray-100"
            )}
          >
            <div className={cn(
              "px-4 py-3",
              hasIssues 
                ? "bg-gradient-to-r from-red-500 to-red-600" 
                : "bg-gradient-to-r from-blue-500 to-blue-600"
            )}>
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="font-semibold">{bike.make} {bike.model}</h3>
                  <p className="text-sm opacity-90">{bike.registrationNumber}</p>
                </div>
                {hasIssues && (
                  <div className="p-1 bg-white/20 rounded-full">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Current KM</span>
                <span className="font-medium text-gray-900">{currentKm.toLocaleString()} km</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Service</span>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  serviceStatus.status === 'ok' && "bg-green-100 text-green-700",
                  serviceStatus.status === 'upcoming' && "bg-amber-100 text-amber-700",
                  serviceStatus.status === 'overdue' && "bg-red-100 text-red-700"
                )}>
                  {serviceStatus.message}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Insurance</span>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  insuranceStatus.status === 'ok' && "bg-green-100 text-green-700",
                  insuranceStatus.status === 'upcoming' && "bg-amber-100 text-amber-700",
                  insuranceStatus.status === 'overdue' && "bg-red-100 text-red-700"
                )}>
                  {formatDate(bike.insuranceValidity)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
