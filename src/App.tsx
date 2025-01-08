import React from 'react';
import { RetroForm } from './components/RetroForm';

const App: React.FC = () => {
  console.log('App rendering, URL params:', window.location.search);
  const urlParams = new URLSearchParams(window.location.search);
  console.log('ODBC from URL:', urlParams.get('odbcName'));
  console.log('JobNum from URL:', urlParams.get('jobNum'));

  return (
    <div dir="rtl">
      <RetroForm />
    </div>
  );
};

export default App;