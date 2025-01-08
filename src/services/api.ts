import type { Property } from '../types';

const API_BASE_URL = 'http://localhost:5001/api';

export const retroApi = {
  async searchProperty(propertyCode: string, odbcName: string): Promise<Property[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Property/search?propertyCode=${propertyCode}&odbcName=${odbcName}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Property search failed:', error);
      throw error;
    }
  }
};