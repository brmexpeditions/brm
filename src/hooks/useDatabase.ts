import { useState, useEffect, useCallback, useRef } from 'react';
import { initializeFirebase, subscribeToData, saveData } from '../firebase';
import { Motorcycle, ServiceRecord, CompanySettings } from '../types';

export interface FleetData {
  motorcycles: Motorcycle[];
  serviceRecords: ServiceRecord[];
  makes: string[];
  models: Record<string, string[]>;
  companySettings: CompanySettings;
}

const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  companyName: 'BRM Expeditions',
  tagline: 'Adventure Awaits on Two Wheels',
  phone: '',
  alternatePhone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  website: '',
  gstNumber: '',
  panNumber: '',
  businessRegNumber: '',
  logo: '',
  primaryColor: '#1e40af',
  secondaryColor: '#3b82f6'
};

const DEFAULT_DATA: FleetData = {
  motorcycles: [],
  serviceRecords: [],
  makes: ['Honda', 'Hero', 'Bajaj', 'TVS', 'Royal Enfield', 'KTM', 'Yamaha', 'Suzuki'],
  models: {
    'Honda': ['Activa 6G', 'Shine', 'Unicorn', 'SP125', 'Hornet 2.0', 'CB350'],
    'Hero': ['Splendor Plus', 'HF Deluxe', 'Passion Pro', 'Glamour', 'Xtreme 160R'],
    'Bajaj': ['Pulsar 150', 'Pulsar NS200', 'Platina', 'CT100', 'Dominar 400'],
    'TVS': ['Apache RTR 160', 'Jupiter', 'Ntorq 125', 'Raider 125', 'Star City'],
    'Royal Enfield': ['Classic 350', 'Bullet 350', 'Meteor 350', 'Hunter 350', 'Himalayan'],
    'KTM': ['Duke 200', 'Duke 390', 'RC 200', 'Adventure 390'],
    'Yamaha': ['FZ-S', 'MT-15', 'R15 V4', 'Fascino', 'Ray ZR'],
    'Suzuki': ['Access 125', 'Gixxer 150', 'Burgman Street', 'Intruder 150']
  },
  companySettings: DEFAULT_COMPANY_SETTINGS
};

const STORAGE_KEY = 'brm-motorcycle-fleet';
const FIREBASE_PATH = 'brm-expeditions/fleet-data';

// Check if Firebase is properly configured
const isFirebaseConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return !!apiKey && apiKey !== 'YOUR_API_KEY';
};

export const useDatabase = () => {
  const [data, setData] = useState<FleetData>(DEFAULT_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use ref to always have latest data for saving
  const dataRef = useRef<FleetData>(data);
  const isOnlineRef = useRef<boolean>(isOnline);
  
  // Keep refs in sync with state
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    isOnlineRef.current = isOnline;
  }, [isOnline]);

  // Load data from localStorage
  const loadFromLocalStorage = useCallback((): FleetData => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_DATA,
          ...parsed,
          serviceRecords: Array.isArray(parsed.serviceRecords) ? parsed.serviceRecords : [],
          motorcycles: Array.isArray(parsed.motorcycles) ? parsed.motorcycles : [],
          companySettings: { ...DEFAULT_COMPANY_SETTINGS, ...parsed.companySettings }
        };
      }
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
    return DEFAULT_DATA;
  }, []);

  // Save data to localStorage - direct function (no useCallback to avoid stale closures)
  const saveToLocalStorage = (newData: FleetData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      console.log('Data saved to localStorage:', newData.serviceRecords.length, 'service records');
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  };

  // Initialize database
  useEffect(() => {
    const initDb = async () => {
      setIsLoading(true);
      
      // First load from localStorage
      const localData = loadFromLocalStorage();
      setData(localData);
      dataRef.current = localData;

      // Try to initialize Firebase
      if (isFirebaseConfigured()) {
        const firebaseInitialized = initializeFirebase();
        
        if (firebaseInitialized) {
          setIsOnline(true);
          isOnlineRef.current = true;
          
          // Subscribe to real-time updates
          const unsubscribe = subscribeToData<FleetData>(FIREBASE_PATH, (firebaseData) => {
            if (firebaseData) {
              const mergedData: FleetData = {
                ...DEFAULT_DATA,
                ...firebaseData,
                serviceRecords: Array.isArray(firebaseData.serviceRecords) ? firebaseData.serviceRecords : [],
                motorcycles: Array.isArray(firebaseData.motorcycles) ? firebaseData.motorcycles : [],
                companySettings: { ...DEFAULT_COMPANY_SETTINGS, ...firebaseData.companySettings }
              };
              setData(mergedData);
              dataRef.current = mergedData;
              saveToLocalStorage(mergedData);
              setLastSynced(new Date());
            } else {
              // No data in Firebase, push local data
              if (localData.motorcycles.length > 0 || localData.serviceRecords.length > 0) {
                saveData(FIREBASE_PATH, localData);
              }
            }
            setIsLoading(false);
          });

          return () => unsubscribe();
        } else {
          setIsOnline(false);
          isOnlineRef.current = false;
          setError('Firebase configuration error. Using offline mode.');
        }
      } else {
        setIsOnline(false);
        isOnlineRef.current = false;
        console.log('Firebase not configured. Using localStorage only.');
      }
      
      setIsLoading(false);
    };

    initDb();
  }, [loadFromLocalStorage]);

  // Core save function using functional updates to avoid stale closures
  const saveFleetData = useCallback((updater: (prevData: FleetData) => FleetData) => {
    setData(prevData => {
      const newData = updater(prevData);
      
      // Save to localStorage immediately
      saveToLocalStorage(newData);
      
      // Sync to Firebase if online
      if (isOnlineRef.current) {
        setIsSyncing(true);
        saveData(FIREBASE_PATH, newData)
          .then(() => {
            setLastSynced(new Date());
            setError(null);
            setIsSyncing(false);
          })
          .catch((e) => {
            console.error('Error syncing to Firebase:', e);
            setError('Failed to sync to cloud. Changes saved locally.');
            setIsSyncing(false);
          });
      }
      
      return newData;
    });
  }, []);

  // Add motorcycle
  const addMotorcycle = useCallback((motorcycle: Motorcycle) => {
    console.log('Adding motorcycle:', motorcycle);
    saveFleetData(prevData => ({
      ...prevData,
      motorcycles: [...prevData.motorcycles, motorcycle]
    }));
  }, [saveFleetData]);

  // Update motorcycle
  const editMotorcycle = useCallback((motorcycle: Motorcycle) => {
    console.log('Editing motorcycle:', motorcycle);
    saveFleetData(prevData => ({
      ...prevData,
      motorcycles: prevData.motorcycles.map(m => 
        m.id === motorcycle.id ? motorcycle : m
      )
    }));
  }, [saveFleetData]);

  // Delete motorcycle
  const deleteMotorcycle = useCallback((id: string) => {
    console.log('Deleting motorcycle:', id);
    saveFleetData(prevData => ({
      ...prevData,
      motorcycles: prevData.motorcycles.filter(m => m.id !== id),
      serviceRecords: prevData.serviceRecords.filter(s => s.motorcycleId !== id)
    }));
  }, [saveFleetData]);

  // Add service record
  const addServiceRecord = useCallback((record: ServiceRecord) => {
    console.log('Adding service record:', record);
    saveFleetData(prevData => {
      const newRecords = [...prevData.serviceRecords, record];
      console.log('New service records count:', newRecords.length);
      return {
        ...prevData,
        serviceRecords: newRecords
      };
    });
  }, [saveFleetData]);

  // Update service record
  const editServiceRecord = useCallback((record: ServiceRecord) => {
    console.log('Editing service record:', record);
    saveFleetData(prevData => ({
      ...prevData,
      serviceRecords: prevData.serviceRecords.map(r => 
        r.id === record.id ? record : r
      )
    }));
  }, [saveFleetData]);

  // Delete service record
  const deleteServiceRecord = useCallback((id: string) => {
    console.log('Deleting service record:', id);
    saveFleetData(prevData => ({
      ...prevData,
      serviceRecords: prevData.serviceRecords.filter(r => r.id !== id)
    }));
  }, [saveFleetData]);

  // Add make
  const addMake = useCallback((make: string) => {
    saveFleetData(prevData => {
      if (prevData.makes.includes(make)) return prevData;
      return {
        ...prevData,
        makes: [...prevData.makes, make],
        models: { ...prevData.models, [make]: [] }
      };
    });
  }, [saveFleetData]);

  // Add model to make
  const addModel = useCallback((make: string, model: string) => {
    saveFleetData(prevData => {
      const currentModels = prevData.models[make] || [];
      if (currentModels.includes(model)) return prevData;
      return {
        ...prevData,
        models: {
          ...prevData.models,
          [make]: [...currentModels, model]
        }
      };
    });
  }, [saveFleetData]);

  // Update makes
  const updateMakes = useCallback((makes: string[]) => {
    saveFleetData(prevData => ({
      ...prevData,
      makes
    }));
  }, [saveFleetData]);

  // Update models
  const updateModels = useCallback((models: Record<string, string[]>) => {
    saveFleetData(prevData => ({
      ...prevData,
      models
    }));
  }, [saveFleetData]);

  // Update company settings
  const updateCompanySettings = useCallback((companySettings: CompanySettings) => {
    console.log('Updating company settings:', companySettings);
    saveFleetData(prevData => ({
      ...prevData,
      companySettings
    }));
  }, [saveFleetData]);

  // Force sync to cloud
  const forceSync = useCallback(async () => {
    if (isOnlineRef.current) {
      setIsSyncing(true);
      try {
        await saveData(FIREBASE_PATH, dataRef.current);
        setLastSynced(new Date());
        setError(null);
      } catch (e) {
        setError('Sync failed. Please try again.');
      }
      setIsSyncing(false);
    }
  }, []);

  // Restore data from backup
  const restoreData = useCallback((backupData: {
    motorcycles: Motorcycle[];
    serviceRecords: ServiceRecord[];
    companySettings: CompanySettings;
    savedMakes: string[];
    savedModels: Record<string, string[]>;
  }) => {
    console.log('Restoring data from backup:', backupData);
    saveFleetData(() => ({
      motorcycles: backupData.motorcycles || [],
      serviceRecords: backupData.serviceRecords || [],
      makes: backupData.savedMakes || DEFAULT_DATA.makes,
      models: backupData.savedModels || DEFAULT_DATA.models,
      companySettings: { ...DEFAULT_COMPANY_SETTINGS, ...backupData.companySettings }
    }));
  }, [saveFleetData]);

  return {
    // Data
    motorcycles: data.motorcycles,
    serviceRecords: data.serviceRecords,
    makes: data.makes,
    models: data.models,
    companySettings: data.companySettings,
    
    // Status
    isLoading,
    isOnline,
    isSyncing,
    lastSynced,
    error,
    
    // Motorcycle operations
    addMotorcycle,
    editMotorcycle,
    deleteMotorcycle,
    
    // Service record operations
    addServiceRecord,
    editServiceRecord,
    deleteServiceRecord,
    
    // Make/Model operations
    addMake,
    addModel,
    updateMakes,
    updateModels,
    
    // Company settings
    updateCompanySettings,
    
    // Sync
    forceSync,
    
    // Backup/Restore
    restoreData
  };
};
