import React from 'react';
import { RetroForm } from './components/RetroForm';
import { useRetroStore } from './store';

const App: React.FC = () => {
  console.log('App component mounted');
  console.log('Current store state:', useRetroStore.getState());

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <RetroForm />
    </div>
  );
};

export default App;