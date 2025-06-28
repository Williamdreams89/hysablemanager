import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import MyContext from './utils/contexts/ReactContext';
import "./components/gradeBook/styles.css"
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
// PrimeReact theme (choose one)
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // or any other theme

// PrimeReact core styles
import 'primereact/resources/primereact.min.css';

// PrimeIcons for icons
import 'primeicons/primeicons.css';

// PrimeFlex for utility classes (optional, but helps)
import 'primeflex/primeflex.css';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file



        


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <MantineProvider>
        <PrimeReactProvider>
          <MyContext>
            <Router>
              <App />
            </Router>
          </MyContext>
        </PrimeReactProvider>
      </MantineProvider>
  </React.StrictMode>
);