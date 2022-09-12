import { VERSION } from '@tripletriad/game';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log(`Using version: ${VERSION} of @tripletriad/game`);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
