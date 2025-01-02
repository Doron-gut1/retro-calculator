import React from 'react';
import RetroCalculator from './components/RetroCalculator/RetroCalculator';

function App() {
  console.log('Rendering App component');
  return (
    <div dir="rtl">
      <RetroCalculator />
    </div>
  );
}

export default App;