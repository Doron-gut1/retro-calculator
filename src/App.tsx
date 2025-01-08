import React, { useEffect } from 'react';
import { RetroForm } from './components/RetroForm';
import { useSessionStore } from './store/session';

const App: React.FC = () => {
  const { urlParamsProcessed, setSession } = useSessionStore();

  useEffect(() => {
    console.log('App useEffect running. urlParamsProcessed:', urlParamsProcessed);
    
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
        setSession({ urlParamsProcessed: true });
      }
    }
  }, []); // רץ רק פעם אחת בטעינה

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <RetroForm />
    </div>
  );
};

export default App;
