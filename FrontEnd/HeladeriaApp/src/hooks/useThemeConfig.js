import {useState, useEffect, useCallback} from "react";
import {themeService} from "../services/ThemeService";

export const useThemeConfig = () => {
  const [themeConfig, setThemeConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar configuración inicial
  const loadThemeConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const config = await themeService.getTheme();

      if (config) {
        // Validar la configuración recibida
        if (themeService.validateThemeConfig(config)) {
          setThemeConfig(config);
        } else {
          console.warn("Configuración de tema inválida, usando defaults");
          setThemeConfig(themeService.getDefaultThemeConfig());
        }
      } else {
        // No hay configuración guardada, usar defaults
        setThemeConfig(themeService.getDefaultThemeConfig());
      }
    } catch (err) {
      console.error("Error loading theme config:", err);
      setError(err);
      // En caso de error, usar configuración por defecto
      setThemeConfig(themeService.getDefaultThemeConfig());
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto inicial
  useEffect(() => {
    loadThemeConfig();
  }, [loadThemeConfig]);

  // Guardar configuración
  const saveThemeConfig = useCallback(async (newConfig) => {
    try {
      setError(null);

      // Validar configuración antes de guardar
      if (!themeService.validateThemeConfig(newConfig)) {
        throw new Error("Configuración de tema inválida");
      }

      await themeService.saveTheme(newConfig);
      setThemeConfig(newConfig);

      console.log("Configuración guardada exitosamente");
      return true;
    } catch (err) {
      console.error("Error saving theme config:", err);
      setError(err);
      return false;
    }
  }, []);

  // Restablecer configuración
  const resetThemeConfig = useCallback(async () => {
    try {
      setError(null);

      await themeService.resetTheme();
      const defaultConfig = themeService.getDefaultThemeConfig();
      setThemeConfig(defaultConfig);

      console.log("Tema restablecido a valores por defecto");
      return true;
    } catch (err) {
      console.error("Error resetting theme config:", err);
      setError(err);
      return false;
    }
  }, []);

  // Actualizar solo un modo (light o dark)
  const updateModeColors = useCallback(
    async (mode, colors) => {
      try {
        if (!themeConfig) {
          throw new Error("No hay configuración de tema cargada");
        }

        const newConfig = {
          ...themeConfig,
          [mode]: {...themeConfig[mode], ...colors},
        };

        return await saveThemeConfig(newConfig);
      } catch (err) {
        console.error(`Error updating ${mode} colors:`, err);
        setError(err);
        return false;
      }
    },
    [themeConfig, saveThemeConfig]
  );

  // Obtener colores para un modo específico
  const getColorsForMode = useCallback(
    (mode) => {
      if (!themeConfig || !themeConfig[mode]) {
        const defaultConfig = themeService.getDefaultThemeConfig();
        return defaultConfig[mode];
      }
      return themeConfig[mode];
    },
    [themeConfig]
  );

  // Verificar si hay configuración personalizada
  const hasCustomConfiguration = useCallback(() => {
    if (!themeConfig) return false;

    const defaultConfig = themeService.getDefaultThemeConfig();

    // Comparar con configuración por defecto
    for (const mode of ["light", "dark"]) {
      const current = themeConfig[mode];
      const defaults = defaultConfig[mode];

      for (const key in defaults) {
        if (current[key] !== defaults[key]) {
          return true;
        }
      }
    }

    return false;
  }, [themeConfig]);

  // Recargar configuración (útil para refrescar desde el servidor)
  const reloadThemeConfig = useCallback(() => {
    return loadThemeConfig();
  }, [loadThemeConfig]);

  return {
    // Estados
    themeConfig,
    loading,
    error,

    // Métodos principales
    saveThemeConfig,
    resetThemeConfig,
    reloadThemeConfig,

    // Métodos auxiliares
    updateModeColors,
    getColorsForMode,
    hasCustomConfiguration,

    // Compatibilidad con versión anterior
    customColors: themeConfig,
  };
};
