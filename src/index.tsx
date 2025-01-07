import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RetroCalculator } from './components/RetroCalculator.DEL';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RetroCalculator />
  </React.StrictMode>
);