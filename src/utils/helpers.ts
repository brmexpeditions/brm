import { Motorcycle, ServiceStatus } from '../types';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'N/A';
  }
}

export function getDaysUntil(dateString?: string): number {
  if (!dateString) return Infinity;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);
    if (isNaN(targetDate.getTime())) return Infinity;
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return Infinity;
  }
}

export function getServiceStatus(bike: Motorcycle): { status: ServiceStatus; message: string; daysOrKm: number } {
  // Ensure kmReadings is an array
  const kmReadings = Array.isArray(bike.kmReadings) ? bike.kmReadings : [];
  
  const currentKm = kmReadings.length > 0 
    ? kmReadings[kmReadings.length - 1].kilometers 
    : (bike.lastServiceKm || 0);
  
  const lastServiceKm = bike.lastServiceKm || 0;
  const kmSinceService = currentKm - lastServiceKm;
  const serviceIntervalKms = bike.serviceIntervalKms || 5000;
  const serviceIntervalMonths = bike.serviceIntervalMonths || 5;
  const kmUntilService = serviceIntervalKms - kmSinceService;
  
  // Handle last service date
  let daysUntilService = Infinity;
  if (bike.lastServiceDate) {
    try {
      const lastServiceDate = new Date(bike.lastServiceDate);
      if (!isNaN(lastServiceDate.getTime())) {
        const nextServiceDate = new Date(lastServiceDate);
        nextServiceDate.setMonth(nextServiceDate.getMonth() + serviceIntervalMonths);
        daysUntilService = getDaysUntil(nextServiceDate.toISOString().split('T')[0]);
      }
    } catch {
      daysUntilService = Infinity;
    }
  }
  
  // If no service date set, only use KM based status
  if (daysUntilService === Infinity && !bike.lastServiceDate) {
    if (kmUntilService <= 0) {
      return {
        status: 'overdue',
        message: `Overdue by ${Math.abs(kmUntilService).toLocaleString()} km`,
        daysOrKm: kmUntilService
      };
    }
    if (kmUntilService <= 500) {
      return {
        status: 'upcoming',
        message: `Due in ${kmUntilService.toLocaleString()} km`,
        daysOrKm: kmUntilService
      };
    }
    return {
      status: 'ok',
      message: `${kmUntilService.toLocaleString()} km remaining`,
      daysOrKm: kmUntilService
    };
  }
  
  // Check which comes first - km or date
  const isKmCritical = kmUntilService <= daysUntilService * 50; // Assuming ~50km per day avg
  
  if (kmUntilService <= 0 || daysUntilService <= 0) {
    return {
      status: 'overdue',
      message: kmUntilService <= 0 
        ? `Overdue by ${Math.abs(kmUntilService).toLocaleString()} km` 
        : `Overdue by ${Math.abs(daysUntilService)} days`,
      daysOrKm: isKmCritical ? kmUntilService : daysUntilService
    };
  }
  
  if (kmUntilService <= 500 || daysUntilService <= 15) {
    return {
      status: 'upcoming',
      message: isKmCritical 
        ? `Due in ${kmUntilService.toLocaleString()} km` 
        : `Due in ${daysUntilService} days`,
      daysOrKm: isKmCritical ? kmUntilService : daysUntilService
    };
  }
  
  return {
    status: 'ok',
    message: isKmCritical 
      ? `${kmUntilService.toLocaleString()} km remaining` 
      : `${daysUntilService} days remaining`,
    daysOrKm: isKmCritical ? kmUntilService : daysUntilService
  };
}

export function getValidityStatus(dateString?: string): { status: ServiceStatus; days: number } {
  if (!dateString) return { status: 'ok', days: Infinity };
  const days = getDaysUntil(dateString);
  if (days === Infinity) return { status: 'ok', days: Infinity };
  if (days <= 0) return { status: 'overdue', days };
  if (days <= 30) return { status: 'upcoming', days };
  return { status: 'ok', days };
}

export const SERVICE_INTERVAL_OPTIONS = {
  months: [3, 4, 5, 6, 9, 12],
  kms: [3000, 4000, 5000, 6000, 8000, 10000]
};
