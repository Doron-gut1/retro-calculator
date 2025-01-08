import React, { useEffect } from 'react';
import { RetroForm } from './components/RetroForm';
import { useRetroStore } from './store';

const App: React.FC = () => {
  console.log('App component rendering...');
  
  const setSessionParams = useRetroStore(state => state.setSessionParams);

  useEffect(() => {
    console.log('App useEffect running - setting session params...');
    setSessionParams({
      odbcName: 'DefaultODBC',
      jobNumber: 1
    });
    console.log('Session params set successfully');
  }, [setSessionParams]);

  console.log('Rendering RetroForm...');
  return (
    <div dir="rtl">
      <RetroForm />
    </div>
  );
};

export default App;