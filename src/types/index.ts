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

export type VehicleType = 'private' | 'commercial';
export type VehicleCategory = 'bike' | 'car';

export interface Motorcycle {
  id: string;
  make: string;
  model: string;

  // Ownership / Identification
  ownerName?: string;
  registrationNumber: string;
  chassisNumber: string;
  engineNumber?: string;

  // Vehicle classification
  vehicleCategory?: VehicleCategory; // bike | car
  vehicleType?: VehicleType; // private | commercial (commercial is typical for rental)

  // Document validity
  registrationValidity?: string; // typically for private vehicles
  insuranceValidity: string;
  pollutionValidity: string;
  fitnessValidity?: string;
  roadTaxValidity?: string;

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
