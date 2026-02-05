import { useState, useEffect } from 'react';

export function useLocalStorage<T extends object>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        // Deep merge with initial value to ensure all fields exist
        // This handles cases where stored data might be missing new fields
        const merged = { ...initialValue };
        for (const key of Object.keys(initialValue)) {
          const k = key as keyof T;
          if (parsed[k] !== undefined) {
            merged[k] = parsed[k];
          }
        }
        return merged;
      }
      return initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
