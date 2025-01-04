import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';  
import './index.css';
import App from './App.jsx';
import { Toaster } from './components/ui/sonner';
import { Store } from './redux/store';
 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}> 
      <App />
      <Toaster />
    </Provider>
  </StrictMode>
);