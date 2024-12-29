import { useCallback } from 'react';
import { useRetroStore } from '../../store';
import { CalculationParams, CalculationResult } from '../../types';
import { calculateRetro } from './retro.service';

export const useRetroCalculation = () => {
  const { 
    setCalculating, 
    setCalculationResults, 
    setError 
  } = useRetroStore();

  const calculate = useCallback(async (params: CalculationParams) => {
    try {
      setCalculating(true);
      setError(null);

      const results = await calculateRetro(params);
      setCalculationResults(results);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'חישוב נכשל');
    } finally {
      setCalculating(false);
    }
  }, [setCalculating, setCalculationResults, setError]);

  return { calculate };
};
