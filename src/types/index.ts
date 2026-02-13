export interface KmReading {
  id: string;
  date: string;
  kilometers: number;
}

export interface ServiceRecord {
  id: string;
  motorcycleId: string;
  date: string;
  kilometers: number;
  workDone: string;
  amount: number;
  mechanic?: string;
  garage?: string;
  notes?: string;
  partsReplaced?: string;
}

// Vehicle category: Bike or Car
export type VehicleCategory = 'Bike' | 'Car';

// Usage type: Private or Commercial
export type VehicleUsageType = 'Private' | 'Commercial';

export interface Motorcycle {
  id: string;
  make: string;
  model: string;

  // Vehicle category (Bike or Car)
  vehicleType?: VehicleCategory;
  
  // Usage type (Private or Commercial)
  vehicleUsage?: VehicleUsageType;

  // Ownership / Identification
  ownerName?: string;
  registrationNumber: string;
  chassisNumber: string;
  engineNumber?: string;

  // Document validity
  registrationValidity?: string; // for private vehicles
  insuranceValidity: string;
  pollutionValidity: string;
  fitnessValidity?: string; // for commercial vehicles
  roadTaxValidity?: string; // for commercial vehicles
  permitValidity?: string; // for commercial vehicles

  // Service
  serviceIntervalMonths: number;
  serviceIntervalKms: number;
  lastServiceDate: string;
  lastServiceKm: number;

  // Odometer readings
  kmReadings: KmReading[];
  currentOdometer?: number;

  createdAt: string;
}

export interface CompanySettings {
  companyName: string;
  logo: string; // base64 encoded
  tagline: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  website: string;
  gstNumber: string;
  panNumber: string;
  businessRegNumber: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface FleetData {
  motorcycles: Motorcycle[];
  makes: string[];
  models: Record<string, string[]>; // make -> models mapping
  serviceRecords: ServiceRecord[];
  companySettings: CompanySettings;
}

export type ServiceStatus = 'ok' | 'upcoming' | 'overdue';
