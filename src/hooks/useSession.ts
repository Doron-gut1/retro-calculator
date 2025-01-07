import { useErrorSystem } from '../lib/ErrorSystem';
import { retroApi } from '../services/api';
import { useRetroStore } from '../store';
import { useEffect } from 'react';

export function useSession() {
  const { setSessionParams, reset } = useRetroStore();
  const { addError } = useErrorSystem();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const odbcName = params.get('odbcName');
    const jobNum = params.get('jobNum');

    console.log('Current params:', { odbcName, jobNum });

    if (!odbcName || !jobNum) {
      addError({
        field: 'session',
        type: 'error',
        message: 'חסרים פרמטרים נדרשים בקריאה מהאקסס'
      });
      return;
    }

    const validateSession = async () => {
      try {
        console.log('Calling API with:', odbcName, jobNum);
        
        const response = await retroApi.validateAccessParams(odbcName, parseInt(jobNum, 10));
        
        if (response.success) {
          setSessionParams({
            odbcName: response.odbcName,
            jobNumber: response.jobNum
          });
        } else {
          throw new Error('אימות הפרמטרים נכשל');
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        addError({
          type: 'error',
          message: error instanceof Error ? error.message : 'שגיאה באימות פרמטרים מהאקסס',
          field: 'session'
        });
        reset();
      }
    };

    validateSession();
  }, [setSessionParams, addError, reset]);
}