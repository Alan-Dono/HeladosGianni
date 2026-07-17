import {
  obtenerConfiguracionTema,
  guardarConfiguracionTema,
  restablecerTemaPorDefecto,
} from "../api/apiTheme";
import {DEFAULT_COLORS} from "../theme/Theme";

// Transformar formato interno para la API (fuera del objeto)
const transformForApi = (colorsConfig) => {
  return {
    colors: JSON.stringify({
      light: {
        Primary: colorsConfig.light.primary,
        Secondary: colorsConfig.light.secondary,
        Background: colorsConfig.light.background,
        Paper: colorsConfig.light.paper,
        Componentes: colorsConfig.light.componentes,
        TextPrimary: colorsConfig.light.textPrimary,
        TextSecondary: colorsConfig.light.textSecondary,
        Glow: colorsConfig.light.glow,
      },
      dark: {
        Primary: colorsConfig.dark.primary,
        Secondary: colorsConfig.dark.secondary,
        Background: colorsConfig.dark.background,
        Paper: colorsConfig.dark.paper,
        Componentes: colorsConfig.dark.componentes,
        TextPrimary: colorsConfig.dark.textPrimary,
        TextSecondary: colorsConfig.dark.textSecondary,
        Glow: colorsConfig.dark.glow,
        GrayAccent: colorsConfig.dark.grayAccent,
      },
    }),
  };
};

// Transformar respuesta de API a formato interno (fuera del objeto)
const transformApiResponse = (apiColors) => {
  try {
    const colors =
      typeof apiColors === "string" ? JSON.parse(apiColors) : apiColors;

    return {
      light: {
        primary: colors.light?.primary || DEFAULT_COLORS.light.primary,
        secondary: colors.light?.secondary || DEFAULT_COLORS.light.secondary,
        background: colors.light?.background || DEFAULT_COLORS.light.background,
        paper: colors.light?.paper || DEFAULT_COLORS.light.paper,
        componentes:
          colors.light?.componentes || DEFAULT_COLORS.light.componentes,
        textPrimary:
          colors.light?.textPrimary || DEFAULT_COLORS.light.textPrimary,
        textSecondary:
          colors.light?.textSecondary || DEFAULT_COLORS.light.textSecondary,
        glow: colors.light?.glow || DEFAULT_COLORS.light.glow,
      },
      dark: {
        primary: colors.dark?.primary || DEFAULT_COLORS.dark.primary,
        secondary: colors.dark?.secondary || DEFAULT_COLORS.dark.secondary,
        background: colors.dark?.background || DEFAULT_COLORS.dark.background,
        paper: colors.dark?.paper || DEFAULT_COLORS.dark.paper,
        componentes:
          colors.dark?.componentes || DEFAULT_COLORS.dark.componentes,
        textPrimary:
          colors.dark?.textPrimary || DEFAULT_COLORS.dark.textPrimary,
        textSecondary:
          colors.dark?.textSecondary || DEFAULT_COLORS.dark.textSecondary,
        glow: colors.dark?.glow || DEFAULT_COLORS.dark.glow,
        grayAccent: colors.dark?.grayAccent || DEFAULT_COLORS.dark.grayAccent,
      },
    };
  } catch (error) {
    console.error("Error transforming API response:", error);
    return getDefaultThemeConfig();
  }
};

// Obtener configuración por defecto (fuera del objeto)
const getDefaultThemeConfig = () => {
  return {
    light: {...DEFAULT_COLORS.light},
    dark: {...DEFAULT_COLORS.dark},
  };
};

export const themeService = {
  // Obtener configuración del tema
  getTheme: async () => {
    try {
      const response = await obtenerConfiguracionTema();

      if (response && response.colors) {
        return transformApiResponse(response.colors); // Usar función directamente
      }

      return null;
    } catch (error) {
      console.error("Error getting theme:", error);
      return getDefaultThemeConfig(); // Usar función directamente
    }
  },

  // Guardar configuración del tema
  saveTheme: async (colorsConfig) => {
    try {
      if (!colorsConfig.light || !colorsConfig.dark) {
        throw new Error(
          "Se requiere configuración para ambos modos (light y dark)"
        );
      }
      console.log("colores ", colorsConfig);

      const apiPayload = transformForApi(colorsConfig); // Usar función directamente

      const response = await guardarConfiguracionTema(apiPayload);
      console.log("Tema guardado exitosamente:", response);
      return response;
    } catch (error) {
      console.error("Error saving theme:", error);
      throw error;
    }
  },

  // Restablecer tema por defecto
  resetTheme: async () => {
    try {
      const response = await restablecerTemaPorDefecto();
      console.log("Tema restablecido exitosamente");
      return response;
    } catch (error) {
      console.error("Error resetting theme:", error);
      throw error;
    }
  },

  // Referencias a las funciones para uso externo si es necesario
  transformApiResponse,
  transformForApi,
  getDefaultThemeConfig,

  // Validar configuración de colores
  validateThemeConfig: (config) => {
    if (!config || !config.light || !config.dark) {
      return false;
    }

    const requiredFields = [
      "primary",
      "secondary",
      "background",
      "paper",
      "textPrimary",
    ];
    const hexRegex = /^#[0-9A-F]{6}$/i;

    for (const mode of ["light", "dark"]) {
      for (const field of requiredFields) {
        if (!config[mode][field] || !hexRegex.test(config[mode][field])) {
          return false;
        }
      }
    }

    return true;
  },

  // Combinar configuración personalizada con defaults
  mergeWithDefaults: (customConfig) => {
    if (!customConfig) {
      return getDefaultThemeConfig(); // Usar función directamente
    }

    return {
      light: {
        ...DEFAULT_COLORS.light,
        ...customConfig.light,
      },
      dark: {
        ...DEFAULT_COLORS.dark,
        ...customConfig.dark,
      },
    };
  },
};
