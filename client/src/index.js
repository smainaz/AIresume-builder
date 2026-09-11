import React, { useMemo, useState, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#5323A4',
      dark: '#2E1065',
      light: '#7C4DD9',
      contrastText: '#fff',
    },
    secondary: {
      main: '#F5B841',
      dark: '#D99A1F',
      contrastText: '#1B1330',
    },
    background: {
      default: mode === 'light' ? '#F7F5FB' : '#150C29',
      paper: mode === 'light' ? '#ffffff' : '#1F1338',
    },
    text: {
      primary: mode === 'light' ? '#1B1330' : '#EDE9F7',
      secondary: mode === 'light' ? '#5B5470' : '#B6AED0',
    },
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
    h1: { fontFamily: '"Space Grotesk", Inter, sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Space Grotesk", Inter, sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Space Grotesk", Inter, sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Space Grotesk", Inter, sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Space Grotesk", Inter, sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Space Grotesk", Inter, sans-serif', fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(46, 16, 101, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: 'linear-gradient(135deg, #5323A4 0%, #7C4DD9 100%)',
          boxShadow: '0 4px 14px rgba(83, 35, 164, 0.3)',
        },
      },
    },
  },
});

function Main() {
  const [mode, setMode] = useState('light');
  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
  }), []);
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);

export function useColorMode() {
  return useContext(ColorModeContext);
} 