

/**
 * Saves data to localStorage with error handling and type safety
 * @param key The key under which to store the data
 * @param data The data to store (will be stringified)
 * @param options Optional configuration
 */
export const saveToLocalStorage = <T>(
  key: string, 
  data: T, 
  options: { debug?: boolean } = { debug: false }
): void => {
  if (typeof window === 'undefined') {
    if (options.debug) console.warn('localStorage is not available (server-side rendering)');
    return;
  }

  try {
    const serializedData = JSON.stringify(data);
    
    if (options.debug) {
      console.log(`Saving to localStorage [${key}]:`, data);
    }
    
    localStorage.setItem(key, serializedData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error saving to localStorage [${key}]:`, errorMessage);
    
    // Handle specific error cases
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('LocalStorage quota exceeded. Clearing old data...');
      // Optionally clear old data or implement LRU cache
      localStorage.clear();
    }
  }
};

/**
 * Retrieves data from localStorage with error handling and type safety
 * @param key The key of the data to retrieve
 * @param options Optional configuration
 * @returns The parsed data or null if not found or on error
 */
export const getFromLocalStorage = <T>(
  key: string, 
  options: { debug?: boolean } = { debug: false }
): T | null => {
  if (typeof window === 'undefined') {
    if (options.debug) console.warn('localStorage is not available (server-side rendering)');
    return null;
  }

  try {
    const serializedData = localStorage.getItem(key);
    
    if (serializedData === null) {
      if (options.debug) console.log(`No data found in localStorage for key: ${key}`);
      return null;
    }
    
    const parsedData = JSON.parse(serializedData) as T;
    
    if (options.debug) {
      console.log(`Retrieved from localStorage [${key}]:`, parsedData);
    }
    
    return parsedData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error getting data from localStorage [${key}]:`, errorMessage);
    
    // If the data is corrupted, remove it to prevent future errors
    if (error instanceof SyntaxError) {
      console.warn(`Removing corrupted data from localStorage: ${key}`);
      localStorage.removeItem(key);
    }
    
    return null;
  }
};

/**
 * Removes data from localStorage with error handling
 * @param key The key of the data to remove
 * @param options Optional configuration
 */
export const removeFromLocalStorage = (
  key: string, 
  options: { debug?: boolean } = { debug: false }
): void => {
  if (typeof window === 'undefined') {
    if (options.debug) console.warn('localStorage is not available (server-side rendering)');
    return;
  }

  try {
    if (options.debug) {
      console.log(`Removing from localStorage: ${key}`);
    }
    
    localStorage.removeItem(key);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error removing data from localStorage [${key}]:`, errorMessage);
  }
};

