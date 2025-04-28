/**
 * Helper utilities to debug localStorage issues
 */

/**
 * Enhanced version of localStorage.setItem with logging
 */
export const setStorageItem = (key: string, value: string): void => {
    try {
      console.log(`Setting localStorage item: ${key}`);
      localStorage.setItem(key, value);
      
      // Verify it was actually set
      const storedValue = localStorage.getItem(key);
      if (storedValue === value) {
        console.log(`Successfully stored ${key} in localStorage`);
      } else {
        console.warn(`Failed to store ${key} correctly in localStorage`);
      }
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error);
    }
  };
  
  /**
   * Enhanced version of localStorage.getItem with logging
   */
  export const getStorageItem = (key: string): string | null => {
    try {
      const value = localStorage.getItem(key);
      console.log(`Retrieved localStorage item: ${key}, exists: ${Boolean(value)}`);
      return value;
    } catch (error) {
      console.error(`Error getting localStorage item ${key}:`, error);
      return null;
    }
  };
  
  /**
   * Enhanced version of localStorage.removeItem with logging
   */
  export const removeStorageItem = (key: string): void => {
    try {
      console.log(`Removing localStorage item: ${key}`);
      localStorage.removeItem(key);
      
      // Verify it was removed
      const stillExists = localStorage.getItem(key);
      if (stillExists === null) {
        console.log(`Successfully removed ${key} from localStorage`);
      } else {
        console.warn(`Failed to remove ${key} from localStorage`);
      }
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error);
    }
  };
  
  /**
   * Debug function to check storage state
   */
  export const debugStorageState = (): void => {
    try {
      const token = localStorage.getItem('token');
      console.log('Current localStorage state:');
      console.log('- Token exists:', Boolean(token));
      if (token) {
        // Log first and last few characters of token for debugging
        const firstChars = token.substring(0, 10);
        const lastChars = token.substring(token.length - 10);
        console.log(`- Token format: ${firstChars}...${lastChars}`);
      }
    } catch (error) {
      console.error('Error debugging localStorage state:', error);
    }
  };