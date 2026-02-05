// Firebase stub - works without Firebase SDK
// This allows the app to work in offline-only mode

// Check if Firebase environment variables are configured
const isConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return Boolean(apiKey && apiKey !== '' && apiKey !== 'YOUR_API_KEY');
};

// Initialize Firebase - always returns false for now (offline only mode)
export const initializeFirebase = (): boolean => {
  if (!isConfigured()) {
    console.log('Firebase not configured. Running in offline mode with localStorage.');
    return false;
  }
  // Even if configured, we'll use offline mode for now
  // Full Firebase integration requires dynamic imports
  console.log('Firebase config found but using offline mode for stability.');
  return false;
};

// No-op subscribe function
export const subscribeToData = <T>(
  _path: string,
  callback: (data: T | null) => void
): (() => void) => {
  // Just call with null - we're using localStorage
  setTimeout(() => callback(null), 0);
  return () => {};
};

// No-op save function
export const saveData = async (_path: string, _data: unknown): Promise<void> => {
  // Data is saved to localStorage by the hook
  return Promise.resolve();
};

// No-op get function
export const getData = async <T>(_path: string): Promise<T | null> => {
  return null;
};

export const firebaseInitialized = false;
