import React, { useEffect } from 'react';
import { RetroForm } from './components/RetroForm';
import { useRetroStore } from './store';

const App: React.FC = () => {
  const setSessionParams = useRetroStore(state => state.setSessionParams);
  const currentOdbc = useRetroStore(state => state.odbcName);
  const currentJobNumber = useRetroStore(state => state.jobNumber);

  // יטפל בפרמטרים מה-URL רק בטעינה הראשונית ורק אם אין כבר ערכים
  useEffect(() => {
    if (!currentOdbc || !currentJobNumber) {
      const urlParams = new URLSearchParams(window.location.search);
      const odbcName = urlParams.get('odbcName');
      const jobNum = urlParams.get('jobNum');
      
      console.log('URL Parameters:', { odbcName, jobNum });
      
      if (odbcName && jobNum) {
        console.log('Setting session params from URL');
        setSessionParams({
          odbcName,
          jobNumber: parseInt(jobNum)
        });
      }
    } else {
      console.log('Session params already exist:', { currentOdbc, currentJobNumber });
    }
  }, []); // ריצה חד פעמית

  return (
    <div dir="rtl">
      <RetroForm />
    </div>
  );
};

export default App;