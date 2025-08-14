import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(
        `Erreur lors de la lecture de la clé localStorage "${key}":`,
        error,
      );
    }
  }, [key, initialValue]);

  const setValue = (value: T | ((value_: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(
        `Erreur lors de la définition de la clé localStorage "${key}":`,
        error,
      );
    }
  };

  return [storedValue, setValue, isHydrated] as const;
}
