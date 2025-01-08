import React, { useEffect, useRef } from 'react';
import { RetroForm } from './components/RetroForm';
import { useRetroStore } from './store';

const App: React.FC = () => {
  const setSessionParams = useRetroStore(state => state.setSessionParams);
  const initialized = useRef(false);
  
  useEffect(() => {
    if (initialized.current) return;
    
    const params = new URLSearchParams(window.location.search);
    const odbcName = params.get('odbcName');
    const jobNum = params.get('jobNum');

    if (!odbcName || !jobNum) {
      console.error('Missing required URL parameters');
      return;
    }

    setSessionParams({
      odbcName,
      jobNumber: parseInt(jobNum)
    });
    
    initialized.current = true;
  }, []); // Empty dependency array

  return (
    <div dir="rtl">
      <RetroForm />
    </div>
  );
};

export default App;