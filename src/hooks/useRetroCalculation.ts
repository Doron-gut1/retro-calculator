import { useRetroStore } from '../store/retroStore';
import { accessService } from '../services/access-service';
import { handleError } from '../services/error-handler';

export const useRetroCalculation = () => {
  const {
    property,
    dateRange,
    selectedChargeTypes,
    setCalculationResults,
    setError
  } = useRetroStore();

  const handleCalculate = async () => {
    if (!property || !dateRange.start || !dateRange.end || selectedChargeTypes.length === 0) {
      setError('נא למלא את כל השדות הנדרשים');
      return;
    }

    try {
      const results = await accessService.calculateRetro({
        hs: property.hs,
        mspkod: property.mspkod,
        dtStart: dateRange.start,
        dtEnd: dateRange.end,
        sugts: selectedChargeTypes,
      });

      setCalculationResults(results);
      setError(null);
    } catch (err) {
      const errorMessage = handleError(err);
      setError(errorMessage);
      await accessService.addDbError({
        user: 'SYSTEM',
        errnum: '0',
        errdesc: errorMessage,
        modulname: 'RetroCalculator',
        errline: 0,
        jobnum: Date.now()
      });
    }
  };

  const handlePropertySearch = async (propertyId: string) => {
    try {
      const propertyData = await accessService.searchProperty(propertyId);
      useRetroStore.getState().setProperty(propertyData);
      setError(null);
    } catch (err) {
      setError(handleError(err));
    }
  };

  return {
    handleCalculate,
    handlePropertySearch
  };
};