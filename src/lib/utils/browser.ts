/**
 * Safely check if we're in a browser environment
 */
export const isBrowser = typeof window !== 'undefined';

/**
 * Safely access localStorage
 * @returns localStorage if available, or a mock implementation if not
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (isBrowser) {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (isBrowser) {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (isBrowser) {
      localStorage.removeItem(key);
    }
  }
};
