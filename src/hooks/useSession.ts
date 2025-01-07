import { useEffect } from 'react';
import { useRetroStore } from '@/store';
import { useErrorStore } from '@/lib/ErrorManager';
import { retroApi } from '@/services/api';

export function useSession() {
  const { setSessionParams, reset } = useRetroStore();
  const { addError } = useErrorStore();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const odbcName = searchParams.get('odbcName');
    const jobNum = searchParams.get('jobNum');

    // הדפסת הפרמטרים לבדיקה
    console.log('URL:', window.location.href);
    console.log('Search Params:', { odbcName, jobNum });

    if (!odbcName || !jobNum) {
      console.error('Missing required params');
      addError({
        field: 'session',
        type: 'error',
        message: 'חסרים פרמטרים נדרשים בקריאה מהאקסס'
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
          field: 'session',
          type: 'error',
          message: error instanceof Error ? error.message : 'שגיאה באימות פרמטרים מהאקסס'
        });
        reset();
      }
    };

    validateSession();
  }, [setSessionParams, addError, reset]);
}