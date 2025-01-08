import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('Starting application initialization from main.tsx...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Root element not found');
}

console.log('Creating React root...');
const root = ReactDOM.createRoot(rootElement);

// Removing StrictMode temporarily for debugging
root.render(
    <App />
);

console.log('App rendered successfully from main.tsx');