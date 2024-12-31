import React from 'react';
import { RetroCalculator } from './components';

function App() {
  const handleCalculationComplete = (results: any) => {
    console.log('Calculation completed:', results);
  };

  return (
    <RetroCalculator onCalculationComplete={handleCalculationComplete} />
  );
}

export default App;