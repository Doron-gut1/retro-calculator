import type {
  RetroCalculationRequest,
  RetroCalculationResponse,
  OpenFromAccessResponse,
  ApiError
} from '../types/api';

// שימוש בפורט הנכון
const API_BASE_URL = 'http://localhost:5001/api';

export const retroApi = {
  async validateAccessParams(
    odbcName: string,
    jobNum: number
  ): Promise<OpenFromAccessResponse> {
    try {
      console.log('Making API request to:', `${API_BASE_URL}/Retro/open-from-access`);
      console.log('Request params:', { odbcName, jobNum });
      
      const response = await fetch(
        `${API_BASE_URL}/Retro/open-from-access?odbcName=${odbcName}&jobNum=${jobNum}`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },

  async calculateRetro(
    request: RetroCalculationRequest,
    odbcName: string
  ): Promise<RetroCalculationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/Retro/calculate?odbcName=${odbcName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
};