import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { PosCartProvider } from './context/PosCartContext';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <PosCartProvider>
            <App />
          </PosCartProvider>
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
