import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Box, IconButton, Tooltip, Snackbar, Alert, Typography } from '@mui/material';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { createCustomTheme } from './theme/Theme';
import AppRoutes from './routes/AppRoutes';
import ColorPicker from './components/ColorPicker';
import { Palette, Restore } from '@mui/icons-material';
import { useThemeConfig } from './hooks/useThemeConfig';

const AppContent = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Persistir preferencia del modo oscuro en localStorage
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const {
    themeConfig,
    loading,
    error,
    saveThemeConfig,
    resetThemeConfig,
    getColorsForMode,
    hasCustomConfiguration
  } = useThemeConfig();

  const location = useLocation();

  // Persistir modo oscuro
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Crear tema optimizado con useMemo
  const currentTheme = useMemo(() => {
    if (!themeConfig) {
      return createCustomTheme(isDarkMode ? 'dark' : 'light');
    }

    const modeColors = getColorsForMode(isDarkMode ? 'dark' : 'light');
    return createCustomTheme(isDarkMode ? 'dark' : 'light', modeColors);
  }, [themeConfig, isDarkMode, getColorsForMode]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
    showSnackbar(`Modo ${!isDarkMode ? 'oscuro' : 'claro'} activado`, 'info');
  };

  const handleSaveColors = async (colorsConfig) => {
    try {
      const success = await saveThemeConfig(colorsConfig);
      if (success) {
        showSnackbar('Configuración de colores guardada correctamente', 'success');
        setColorPickerOpen(false);
      } else {
        showSnackbar('Error al guardar la configuración', 'error');
      }
    } catch (err) {
      console.error('Error saving colors:', err);
      showSnackbar('Error al guardar la configuración', 'error');
    }
  };

  const handleResetColors = async () => {
    try {
      const success = await resetThemeConfig();
      if (success) {
        showSnackbar('Tema restablecido a valores por defecto', 'success');
        if (colorPickerOpen) {
          setColorPickerOpen(false);
        }
      } else {
        showSnackbar('Error al restablecer el tema', 'error');
      }
    } catch (err) {
      console.error('Error resetting theme:', err);
      showSnackbar('Error al restablecer el tema', 'error');
    }
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: isDarkMode ? '#020b09' : '#fbfbfe',
          color: isDarkMode ? '#e0f8f4' : '#050316'
        }}
      >
        <Typography variant="h6">Cargando configuración del tema...</Typography>
      </Box>
    );
  }

  // Mostrar error crítico si no se puede cargar la configuración
  if (error && !themeConfig) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
          color: '#333',
          textAlign: 'center',
          p: 3
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Error al cargar el tema
        </Typography>
        <Typography variant="body1" gutterBottom>
          {error.message || 'Error desconocido'}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Recargar Aplicación
        </Button>
      </Box>
    );
  }

  const isHomePage = location.pathname === "/";

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />

      {/* Botones flotantes SOLO en Home */}
      {isHomePage && (
        <Box sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          {/* Botón restablecer - solo mostrar si hay configuración personalizada */}
          {hasCustomConfiguration() && (
            <Tooltip title="Restablecer colores por defecto" placement="left">
              <IconButton
                onClick={handleResetColors}
                sx={{
                  backgroundColor: 'secondary.main',
                  color: 'text.primary',
                  width: 56,
                  height: 56,
                  '&:hover': {
                    backgroundColor: 'secondary.dark',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: 3,
                  border: '2px solid',
                  borderColor: 'divider'
                }}
              >
                <Restore />
              </IconButton>
            </Tooltip>
          )}

          {/* Botón personalizar */}
          <Tooltip title="Personalizar colores del tema" placement="left">
            <IconButton
              onClick={() => setColorPickerOpen(true)}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                width: 56,
                height: 56,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease',
                boxShadow: 4,
                border: '2px solid',
                borderColor: 'primary.light'
              }}
            >
              <Palette />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Rutas principales */}
      <AppRoutes isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Selector de colores */}
      <ColorPicker
        open={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
        onSave={handleSaveColors}
        onReset={handleResetColors}
        currentMode={isDarkMode ? 'dark' : 'light'}
        existingColors={themeConfig}
      />

      {/* Notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Mensaje de error no crítico */}
      {error && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert severity="warning" sx={{ width: '100%' }}>
            Advertencia: {error.message}
          </Alert>
        </Snackbar>
      )}
    </ThemeProvider>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;