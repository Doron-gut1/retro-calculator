import { useEffect } from 'react';
import { RetroForm } from './components';
import { useRetroStore } from './store';

const App = () => {
  const setSessionParams = useRetroStore(state => state.setSessionParams);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const odbcName = urlParams.get('odbcName');
    const jobNumber = Number(urlParams.get('jobNum'));

    if (odbcName && jobNumber) {
      setSessionParams({
        odbcName,
        jobNumber
      });
    }
  }, [setSessionParams]);

  return (
    <main className="min-h-screen bg-gray-50">
      <RetroForm />
    </main>
  );
};

export default App;