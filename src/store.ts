import { create } from 'zustand';
import { Property, RetroState } from './types';

type SessionParams = {
  odbcName: string | null;
  jobNumber: number | null;
};

type Actions = {
  setSessionParams: (params: SessionParams) => void;
  searchProperty: (propertyCode: string) => Promise<void>;
  setSelectedChargeTypes: (types: number[]) => void;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  calculateRetro: () => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  reset: () => void;
  addSize: () => void;
  deleteSize: (index: number) => void;
}

// ... (rest of the imports and types remain the same)

export const useRetroStore = create<RetroState & Actions>((set, get) => ({
  ...initialState,

  // ... (previous actions remain the same)

  addSize: () => {
    const { property } = get();
    if (!property) return;

    // Find the first empty size slot
    const sizeProps = ['godel', 'gdl2', 'gdl3', 'gdl4', 'gdl5', 'gdl6', 'gdl7', 'gdl8'];
    const emptyIndex = sizeProps.findIndex(prop => !property[prop as keyof Property]);
    
    if (emptyIndex === -1) {
      set({ error: 'לא ניתן להוסיף יותר גדלים' });
      return;
    }

    // Create a new property object with the new empty size
    const newProperty = { ...property };
    const prop = sizeProps[emptyIndex] as keyof Property;
    newProperty[prop] = 0;
    // Also set corresponding tariff to 0
    const tariffProp = `mas${emptyIndex === 0 ? '' : emptyIndex + 1}` as keyof Property;
    newProperty[tariffProp] = 0;
    
    set({ property: newProperty });
  },

  deleteSize: (index: number) => {
    const { property } = get();
    if (!property) return;

    // Create a new property object without the deleted size
    const newProperty = { ...property };
    const sizeProp = index === 1 ? 'godel' : `gdl${index}` as keyof Property;
    const tariffProp = index === 1 ? 'mas' : `mas${index}` as keyof Property;
    const nameProps = index === 1 ? 'masName' : `mas${index}Name` as keyof Property;

    // Set the values to undefined to remove them
    newProperty[sizeProp] = undefined;
    newProperty[tariffProp] = undefined;
    newProperty[nameProps] = undefined;

    set({ property: newProperty });
  }
}));
