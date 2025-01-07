import { useEffect } from 'react';
import { useRetroStore } from '../store';
import { useErrorSystem } from '../lib/ErrorSystem';
import { retroApi } from '../services/api';

export function useSession() {
  const { setSessionParams, reset } = useRetroStore();
  const { addError } = useErrorSystem();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const odbcName = params.get('odbcName');
    const jobNum = params.get('jobNum');

    // הדפסת לוג לבדיקה
    console.log('Current params:', { odbcName, jobNum });

    if (!odbcName || !jobNum) {
      console.error('Missing required params');
      addError({
        type: 'error',
        message: 'חסרים פרמטרים נדרשים בקריאה מהאקסס',
        field: 'session'
      });
      return;
    }

    const validateSession = async () => {
      try {
        console.log('Validating session with:', { odbcName, jobNum });
        const response = await retroApi.validateAccessParams(
          odbcName,
          parseInt(jobNum, 10)
        );
        console.log('Validation response:', response);

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