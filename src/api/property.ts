import axios from 'axios';
import { TariffDto } from '../store';

const BASE_URL = 'https://localhost:5001/api';

export const propertyApi = {
  getTariffs: async (odbcName: string): Promise<TariffDto[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/property/tariffs`, {
        params: { odbcName }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching tariffs:', error);
      throw error;
    }
  },

  // פונקציות נוספות לעתיד...
};
