const { ipcRenderer } = window.require('electron');

export const searchProperty = async (propertyId: string) => {
  try {
    return await ipcRenderer.invoke('search-property', propertyId);
  } catch (error) {
    console.error('Error searching property:', error);
    throw error;
  }
};

export const calculateRetro = async (params: {
  hs: string;
  mspkod: number;
  sugtsList: string;
  isYearlyCharge: boolean;
  userName: string;
}) => {
  try {
    return await ipcRenderer.invoke('calculate-retro', params);
  } catch (error) {
    console.error('Error calculating retro:', error);
    throw error;
  }
};
