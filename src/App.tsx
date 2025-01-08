import React, { useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RetroForm } from './components/RetroForm';
import { useSessionStore } from './store/session';

const App: React.FC = () => {
  const { urlParamsProcessed, setSession } = useSessionStore();

  useEffect(() => {
    // רק אם עוד לא עיבדנו פרמטרים מהURL
    if (!urlParamsProcessed) {
      const urlParams = new URLSearchParams(window.location.search);
      const odbcName = urlParams.get('odbcName');
      const jobNum = urlParams.get('jobNum');
      
      console.log('Initial params from URL:', { odbcName, jobNum });
      
      if (odbcName && jobNum) {
        setSession({
          currentOdbc: odbcName,
          currentJobNumber: parseInt(jobNum, 10),
          urlParamsProcessed: true
        });
      } else {
        // סימון שבדקנו URL גם אם לא היו פרמטרים
        setSession({ urlParamsProcessed: true });
      }
    }
  }, []); // רק בטעינה

  return (
    <ErrorBoundary>
      <div dir="rtl">
        <RetroForm />
      </div>
    </ErrorBoundary>
  );
};

export default App;
