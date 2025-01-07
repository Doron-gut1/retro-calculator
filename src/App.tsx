import React, { useEffect } from 'react';
import { ErrorBoundary } from './components/UX';
import { RetroForm } from './components/RetroForm';
import { useRetroStore } from './store';
import { useErrorStore } from './lib/ErrorManager';

const App: React.FC = () => {
  const { setSessionParams } = useRetroStore();
  const { addError } = useErrorStore();

  // Parse URL parameters on app load
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    console.log('URL Params:', Object.fromEntries(searchParams));
    
    const odbcName = searchParams.get('odbcName');
    const jobNum = searchParams.get('jobNum');

    if (!odbcName || !jobNum) {
      console.error('Missing params:', { odbcName, jobNum });
      return;
    }

    try {
      const jobNumber = parseInt(jobNum, 10);
      if (isNaN(jobNumber)) {
        throw new Error('Invalid job number');
      }

      console.log('Setting session:', { odbcName, jobNumber });
      setSessionParams({ odbcName, jobNumber });
    } catch (error) {
      console.error('Error parsing params:', error);
      addError({
        field: 'session',
        type: 'error',
        message: 'שגיאה בפרמטרים מהאקסס'
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <div dir="rtl">
        <RetroForm />
      </div>
    </ErrorBoundary>
  );
};

export default App;