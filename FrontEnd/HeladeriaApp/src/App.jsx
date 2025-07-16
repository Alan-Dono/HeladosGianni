import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { lightTheme, darkTheme } from './theme/Theme';
import AppRoutes from './routes/AppRoutes';

const App = () => {

  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <AppRoutes isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> {/* Pasamos las props */}
      </Router>
    </ThemeProvider>
  );
};

export default App;
