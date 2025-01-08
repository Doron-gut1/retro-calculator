import React, { useEffect } from 'react';
import { RetroForm } from './components/RetroForm';
import { useRetroStore } from './store';

const App: React.FC = () => {
  const setSessionParams = useRetroStore(state => state.setSessionParams);
  
  // Single useEffect with dependency check
  useEffect(() => {
    // Check if we already have session params
    const state = useRetroStore.getState();
    if (!state.odbcName || !state.jobNumber) {
      console.log('Setting initial session params...');
      setSessionParams({
        odbcName: 'DefaultODBC',
        jobNumber: 1
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