import React, { useEffect } from 'react';
import { RetroForm } from './components/RetroForm';
import { useRetroStore } from './store';

const App: React.FC = () => {
  const setSessionParams = useRetroStore(state => state.setSessionParams);
  
  useEffect(() => {
    const state = useRetroStore.getState();
    console.log('Current session state:', state);
    
    // התחברות לפרמטרים מהאקסס תתבצע כאן
    // הפרמטרים יגיעו דרך חלון הדפדפן או כפרמטרים ב-URL
    const urlParams = new URLSearchParams(window.location.search);
    const odbcName = urlParams.get('odbcName');
    const jobNumber = urlParams.get('jobNumber');

    if (odbcName && jobNumber && (!state.odbcName || !state.jobNumber)) {
      console.log('Setting session params from URL:', { odbcName, jobNumber });
      setSessionParams({
        odbcName,
        jobNumber: parseInt(jobNumber)
      });
    }
  }, []); // Empty dependency array

  return (
    <div dir="rtl">
      <RetroForm />
    </div>
  );
};

export default App;