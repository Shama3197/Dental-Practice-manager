import { create } from 'zustand';

/**
 * Theme Store
 * Manages the Dynamic Environment toggle state
 * Uses localStorage for persistence
 */
const getStoredValue = () => {
  try {
    const stored = localStorage.getItem('oryx-theme-storage');
    return stored ? JSON.parse(stored) : { isDynamicEnvironment: false };
  } catch {
    return { isDynamicEnvironment: false };
  }
};

export const useThemeStore = create((set) => ({
  isDynamicEnvironment: getStoredValue().isDynamicEnvironment,
  toggleDynamicEnvironment: () =>
    set((state) => {
      const newState = { isDynamicEnvironment: !state.isDynamicEnvironment };
      localStorage.setItem('oryx-theme-storage', JSON.stringify(newState));
      return newState;
    }),
  setIsDynamicEnvironment: (value) => {
    const newState = { isDynamicEnvironment: value };
    localStorage.setItem('oryx-theme-storage', JSON.stringify(newState));
    set(newState);
  },
}));
