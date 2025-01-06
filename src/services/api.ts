import type {
  RetroCalculationRequest,
  RetroCalculationResponse,
  OpenFromAccessResponse,
  ApiError
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(message: string, public details?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const retroApi = {
  /**
   * בדיקת הפרמטרים מהאקסס
   */
  async validateAccessParams(odbcName: string, jobNum: number): Promise<OpenFromAccessResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Retro/open-from-access?odbcName=${odbcName}&jobNum=${jobNum}`
      );

      if (!response.ok) {
        const error = await response.json() as ApiError;
        throw new ApiError(error.error, error.details);
      }

      return await response.json() as OpenFromAccessResponse;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('שגיאה באימות פרמטרים מהאקסס');
    }
  },

  /**
   * חישוב רטרו
   */
  async calculateRetro(
    request: RetroCalculationRequest,
    odbcName: string
  ): Promise<RetroCalculationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/Retro/calculate?odbcName=${odbcName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json() as ApiError;
        throw new ApiError(error.error, error.details);
      }

      return await response.json() as RetroCalculationResponse;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('שגיאה בחישוב רטרו');
    }
  },
};
