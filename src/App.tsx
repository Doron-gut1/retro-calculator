import { useEffect } from 'react';
import { RetroForm } from './components';
import { useRetroStore } from './store';

const App = () => {
  const setSessionParams = useRetroStore(state => state.setSessionParams);

  useEffect(() => {
    setSessionParams({
      odbcName: 'BRNGU1ADEV',
      jobNumber: 28677
    });
  }, [setSessionParams]);

  return (
    <main className="min-h-screen bg-gray-50">
      <RetroForm />
    </main>
  );
};

export default App;