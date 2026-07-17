import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Grid,
  Tabs,
  Tab,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Palette,
  Restore,
  Preview,
  Save,
  Close
} from '@mui/icons-material';
import { getCustomizableColors, validateColors, DEFAULT_COLORS } from '../theme/Theme';

const ColorInput = ({ label, value, onChange, helperText }) => {
  const [localValue, setLocalValue] = useState(value || '#000000');
  const [error, setError] = useState(false);

  useEffect(() => {
    setLocalValue(value || '#000000');
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Validar formato hex
    const isValid = /^#[0-9A-F]{6}$/i.test(newValue);
    setError(!isValid);

    if (isValid) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          value={localValue}
          onChange={handleChange}
          error={error}
          size="small"
          placeholder="#000000"
          inputProps={{
            pattern: "#[0-9A-F]{6}",
            style: { fontFamily: 'monospace' }
          }}
          sx={{ flex: 1 }}
        />
        <Box
          sx={{
            width: 40,
            height: 40,
            backgroundColor: error ? '#f44336' : localValue,
            border: '2px solid',
            borderColor: 'divider',
            borderRadius: 1,
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.1)'
            }
          }}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'color';
            input.value = localValue;
            input.onchange = (e) => {
              setLocalValue(e.target.value);
              onChange(e.target.value);
              setError(false);
            };
            input.click();
          }}
        />
      </Box>
      {helperText && (
        <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
          {helperText}
        </Typography>
      )}
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          Formato inválido. Use formato #RRGGBB
        </Typography>
      )}
    </Box>
  );
};

const ColorPreview = ({ colors, mode }) => {
  return (
    <Paper
      sx={{
        p: 2,
        backgroundColor: colors.background,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: colors.textPrimary,
          mb: 2
        }}
      >
        Vista Previa - Modo {mode === 'light' ? 'Claro' : 'Oscuro'}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size="small"
          sx={{ backgroundColor: colors.primary }}
        >
          Primario
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{ borderColor: colors.secondary, color: colors.secondary }}
        >
          Secundario
        </Button>
        <Paper
          sx={{
            p: 1,
            backgroundColor: colors.componentes,
            minWidth: 60
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: colors.textPrimary }}
          >
            Componente
          </Typography>
        </Paper>
      </Box>

      <Paper
        sx={{
          p: 1.5,
          backgroundColor: colors.paper,
          mb: 1
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: colors.textPrimary }}
        >
          Texto primario
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: colors.textSecondary }}
        >
          Texto secundario
        </Typography>
      </Paper>
    </Paper>
  );
};

const ColorPicker = ({
  open,
  onClose,
  onSave,
  onReset,
  currentMode = 'light',
  existingColors = null
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [lightColors, setLightColors] = useState(() =>
    getCustomizableColors('light')
  );
  const [darkColors, setDarkColors] = useState(() =>
    getCustomizableColors('dark')
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Inicializar con colores existentes si los hay
  useEffect(() => {
    if (existingColors) {
      if (existingColors.light) {
        setLightColors(prev => ({ ...prev, ...existingColors.light }));
      }
      if (existingColors.dark) {
        setDarkColors(prev => ({ ...prev, ...existingColors.dark }));
      }
    }
  }, [existingColors, open]);

  // Definir las configuraciones de campos por modo
  const colorFields = {
    light: [
      { key: 'primary', label: 'Color Primario', helper: 'Color principal de la aplicación' },
      { key: 'secondary', label: 'Color Secundario', helper: 'Color para elementos secundarios' },
      { key: 'background', label: 'Fondo Principal', helper: 'Color de fondo general' },
      { key: 'paper', label: 'Fondo de Tarjetas', helper: 'Color de fondo para tarjetas y diálogos' },
      { key: 'componentes', label: 'Fondo Componentes', helper: 'Color para fondos de componentes especiales' },
      { key: 'textPrimary', label: 'Texto Primario', helper: 'Color del texto principal' },
      { key: 'textSecondary', label: 'Texto Secundario', helper: 'Color del texto secundario' },
      { key: 'glow', label: 'Color de Brillo', helper: 'Color para efectos de brillo y resaltado' }
    ],
    dark: [
      { key: 'primary', label: 'Color Primario', helper: 'Color principal (naranja)' },
      { key: 'secondary', label: 'Color Secundario', helper: 'Color secundario (azul)' },
      { key: 'background', label: 'Fondo Principal', helper: 'Fondo oscuro principal' },
      { key: 'paper', label: 'Fondo de Tarjetas', helper: 'Fondo para elementos elevados' },
      { key: 'componentes', label: 'Fondo Componentes', helper: 'Color morado para componentes' },
      { key: 'textPrimary', label: 'Texto Primario', helper: 'Texto claro principal' },
      { key: 'textSecondary', label: 'Texto Secundario', helper: 'Texto claro secundario' },
      { key: 'glow', label: 'Color de Brillo', helper: 'Brillo morado/azul' },
      { key: 'grayAccent', label: 'Acento Gris', helper: 'Gris para acentos adicionales' }
    ]
  };

  const currentColors = activeTab === 0 ? lightColors : darkColors;
  const setCurrentColors = activeTab === 0 ? setLightColors : setDarkColors;
  const currentModeStr = activeTab === 0 ? 'light' : 'dark';

  const handleColorChange = (field, color) => {
    setCurrentColors(prev => ({
      ...prev,
      [field]: color
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    const colorsToSave = {
      light: lightColors,
      dark: darkColors
    };

    // Validar ambos temas
    if (validateColors(lightColors) && validateColors(darkColors)) {
      onSave(colorsToSave);
      setHasChanges(false);
    }
  };

  const handleReset = () => {
    setLightColors(getCustomizableColors('light'));
    setDarkColors(getCustomizableColors('dark'));
    setHasChanges(true);
  };

  const handleResetCurrent = () => {
    const defaultColors = getCustomizableColors(currentModeStr);
    setCurrentColors(defaultColors);
    setHasChanges(true);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh', maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Palette color="primary" />
          <Typography variant="h6">Personalizar Colores del Tema</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          sx={{ mb: 3 }}
        >
          <Tab label="Modo Claro" />
          <Tab label="Modo Oscuro" />
        </Tabs>

        <Grid container spacing={3}>
          {/* Panel de configuración */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, height: 'fit-content' }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6">
                  Configurar Colores - Modo {currentModeStr === 'light' ? 'Claro' : 'Oscuro'}
                </Typography>
                <Tooltip title={`Restablecer modo ${currentModeStr}`}>
                  <IconButton onClick={handleResetCurrent} size="small">
                    <Restore />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ maxHeight: '400px', overflow: 'auto', pr: 1 }}>
                {colorFields[currentModeStr].map(field => (
                  <ColorInput
                    key={field.key}
                    label={field.label}
                    value={currentColors[field.key]}
                    onChange={(color) => handleColorChange(field.key, color)}
                    helperText={field.helper}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Panel de vista previa */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: 'sticky', top: 0 }}>
              <ColorPreview
                colors={currentColors}
                mode={currentModeStr}
              />

              {hasChanges && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Tienes cambios sin guardar
                </Alert>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleReset}
          startIcon={<Restore />}
          color="warning"
        >
          Restablecer Todo
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button onClick={onClose}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<Save />}
          disabled={!hasChanges}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColorPicker;