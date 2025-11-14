import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import store from './redux/store';
import ErrorBoundary from './components/ErrorBoundary';

// Debug log to check if the file is being loaded
console.log('main.tsx is loading...');

// Enhanced theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
      light: '#534bae',
      dark: '#000051',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#bb002f',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '16px',
        },
      },
    },
  },
});

// Debug log to check if React is available
console.log('React version:', React.version);
console.log('ReactDOM version:', ReactDOM.version);

// Check if the root element exists
const rootElement = document.getElementById('root');

if (!rootElement) {
  const errorMessage = 'Failed to find the root element';
  console.error(errorMessage);
  document.body.innerHTML = `
    <div style="color: red; font-family: Arial, sans-serif; padding: 20px;">
      <h1>Application Error</h1>
      <p>${errorMessage}</p>
      <p>Please check the console for more details.</p>
    </div>
  `;
  throw new Error(errorMessage);
}

try {
  console.log('Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  
  console.log('Rendering application...');
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('Application rendered successfully');
} catch (error) {
  console.error('Error rendering application:', error);
  rootElement.innerHTML = `
    <div style="color: red; font-family: Arial, sans-serif; padding: 20px;">
      <h1>Application Error</h1>
      <p>${error instanceof Error ? error.message : 'An unknown error occurred'}</p>
      <p>Please check the console for more details.</p>
    </div>
  `;
}
