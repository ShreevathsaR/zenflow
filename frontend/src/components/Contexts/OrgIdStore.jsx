import { create } from 'zustand';

export const useOrgIdStore = create((set) => ({
  selectedOrgId: null, // Initial state
  setSelectedOrgId: (orgId) => set({ selectedOrgId: orgId }) // Update function
}));
