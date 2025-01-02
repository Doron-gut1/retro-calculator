import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RetroForm } from './components/RetroForm';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div dir="rtl">
        <RetroForm />
      </div>
    </ErrorBoundary>
  );
};

export default App;