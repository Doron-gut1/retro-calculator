import React, { useEffect } from 'react';
import { RetroForm } from './components/RetroForm';
import { useRetroStore } from './store';

const App: React.FC = () => {
  const setSessionParams = useRetroStore(state => state.setSessionParams);

  useEffect(() => {
    // אתחול פרמטרים ראשוניים
    setSessionParams({
      odbcName: 'DefaultODBC',  // שם ה-ODBC שלך
      jobNumber: 1  // מספר Job התחלתי
    });
  }, [setSessionParams]);

  return (
    <div dir="rtl">
      <RetroForm />
    </div>
  );
};

export default App;