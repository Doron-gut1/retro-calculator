import React, { useEffect } from 'react';
import { RetroForm } from './components/RetroForm';
import { useSessionStore } from './store/session';

const App: React.FC = () => {
  const { urlParamsProcessed, setSession } = useSessionStore();

  useEffect(() => {
    console.log('App useEffect running. urlParamsProcessed:', urlParamsProcessed);
    
    // רק אם עוד לא עיבדנו פרמטרים מהURL
    if (!urlParamsProcessed) {
      const urlParams = new URLSearchParams(window.location.search);
      const odbcName = urlParams.get('odbcName');
      const jobNum = urlParams.get('jobNum');
      
      console.log('Initial params from URL:', { odbcName, jobNum });
      console.log('Current store state:', useSessionStore.getState());
      
      if (odbcName && jobNum) {
        console.log('Setting new session params...');
        setSession({
          currentOdbc: odbcName,
          currentJobNumber: parseInt(jobNum, 10),
          urlParamsProcessed: true
        });
        console.log('Session params set. New state:', useSessionStore.getState());
      } else {
        console.log('No URL params found, marking as processed');
        setSession({ urlParamsProcessed: true });
      }
    } else {
      console.log('URL params already processed. Current state:', useSessionStore.getState());
    }
  }, []); // רק בטעינה

  return (
    <div dir="rtl">
      <RetroForm />
    </div>
  );
};

export default App;