import React, { useEffect } from 'react';
import { RetroForm } from './components/RetroForm';
import { useRetroStore } from './store';

const App: React.FC = () => {
  const { urlParamsProcessed, setSessionParams, setUrlParamsProcessed } = useRetroStore();

  useEffect(() => {
    if (!urlParamsProcessed) {
      console.log('Reading URL parameters...');
      const urlParams = new URLSearchParams(window.location.search);
      const odbcName = urlParams.get('odbcName');
      const jobNum = urlParams.get('jobNum');
      
      console.log('Initial params from URL:', { odbcName, jobNum });
      
      if (odbcName && jobNum) {
        setSessionParams({
          odbcName: odbcName,
          jobNumber: parseInt(jobNum, 10)
        });
      }
      
      setUrlParamsProcessed(true);
    }
  }, [urlParamsProcessed, setSessionParams, setUrlParamsProcessed]);

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <RetroForm />
    </div>
  );
};

export default App;