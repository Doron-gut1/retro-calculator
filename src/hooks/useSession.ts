import { useEffect } from 'react';
import { useRetroStore } from '@/store';
import { useErrorStore } from '@/lib/ErrorManager';
import { retroApi } from '@/services/api';

export function useSession() {
  const { setSessionParams, reset } = useRetroStore();
  const { addError } = useErrorStore();

  useEffect(() => {
    // ניסיון לקרוא פרמטרים מה-URL
    const params = new URLSearchParams(window.location.search);
    const odbcName = params.get('odbcName');
    const jobNum = params.get('jobNum');

    // אם אין פרמטרים - זה לא נפתח מהאקסס
    if (!odbcName || !jobNum) {
      addError({
        field: 'session',
        type: 'error',
        message: 'הדף חייב להיפתח מתוך האקסס'
      });
      return;
    }

    // בדיקת תקינות הפרמטרים מול השרת
    const validateSession = async () => {
      try {
        const response = await retroApi.validateAccessParams(odbcName, parseInt(jobNum));
        setSessionParams({
          odbcName: response.odbcName,
          jobNumber: response.jobNum
        });
      } catch (error) {
        if (error instanceof Error) {
          addError({
            field: 'session',
            type: 'error',
            message: error.message
          });
        }
        reset();
      }
    };

    validateSession();

    // ניקוי בסגירה
    return () => reset();
  }, []);
}
