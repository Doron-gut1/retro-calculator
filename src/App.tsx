import React, { useEffect } from 'react';
import { RetroForm } from './components/RetroForm';
import { useRetroStore } from './store';

const App: React.FC = () => {
  const { isInitialized, setInitialized } = useRetroStore();

  useEffect(() => {
    console.log('App component mounted, checking initialization state:', isInitialized);
    
    if (!isInitialized) {
      console.log('Setting initialization flag to true');
      setInitialized(true);
      console.log('Current store state after initialization:', useRetroStore.getState());
    }
  }, []); // רץ רק פעם אחת בטעינה

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <RetroForm />
    </div>
  );
};

export default App;