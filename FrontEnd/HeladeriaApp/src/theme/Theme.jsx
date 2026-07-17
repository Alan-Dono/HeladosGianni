import { createTheme } from '@mui/material/styles';

// Definir colores por defecto para cada modo
export const DEFAULT_COLORS = {
    light: {
        primary: '#2f27ce',
        secondary: '#dddbff',
        success: '#4CAF50',
        warning: '#FFA726',
        error: '#F44336',
        info: '#2196F3',
        background: '#fbfbfe',
        paper: '#ffffff',
        componentes: '#443dff',
        textPrimary: '#050316',
        textSecondary: '#050316',
        glow: '#b0adff'
    },
    dark: {
        primary: '#e35305',
        secondary: '#050bba',
        success: '#248636',
        warning: '#FF8C00',
        error: '#B22222',
        info: '#2196F3',
        background: '#020b09',
        paper: '#0a1210',
        componentes: '#4403bf',
        textPrimary: '#e0f8f4',
        textSecondary: '#b8d6d2',
        glow: '#5a4dff',
        grayAccent: '#3a3a3a'
    }
};

// Función para ajustar luminosidad de colores
const adjustColor = (color, amount) => {
    if (!color || !color.startsWith('#')) return color;

    try {
        let r = parseInt(color.slice(1, 3), 16);
        let g = parseInt(color.slice(3, 5), 16);
        let b = parseInt(color.slice(5, 7), 16);

        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));

        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    } catch (error) {
        console.error('Error adjusting color:', error);
        return color;
    }
};

// Crear tema base sin personalización
const createBaseTheme = (mode, colors) => {
    const isDark = mode === 'dark';

    return {
        palette: {
            mode,
            primary: {
                main: colors.primary,
                light: adjustColor(colors.primary, isDark ? 40 : -40),
                dark: adjustColor(colors.primary, isDark ? -40 : 40),
            },
            secondary: {
                main: colors.secondary,
                light: adjustColor(colors.secondary, isDark ? 40 : -40),
                dark: adjustColor(colors.secondary, isDark ? -40 : 40),
            },
            success: { main: colors.success },
            warning: { main: colors.warning },
            error: { main: colors.error },
            info: { main: colors.info },
            background: {
                default: colors.background,
                paper: colors.paper,
                componentes: colors.componentes,
            },
            text: {
                primary: colors.textPrimary,
                secondary: colors.textSecondary,
            },
            custom: {
                glow: colors.glow,
                ...(isDark && colors.grayAccent ? { grayAccent: colors.grayAccent } : {}),
            },
        },
        typography: {
            fontFamily: 'Roboto, Arial, sans-serif',
            h6: { fontWeight: 600 },
            button: { textTransform: 'none' }
        },
        shape: {
            borderRadius: 8
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 600,
                        borderRadius: 8
                    },
                    containedPrimary: isDark ? {
                        '&:hover': {
                            backgroundColor: adjustColor(colors.primary, 40),
                        },
                    } : {},
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 12,
                        boxShadow: isDark
                            ? '0 4px 12px rgba(0,0,0,0.3)'
                            : '0 2px 8px rgba(0,0,0,0.1)'
                    }
                }
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundColor: isDark ? colors.paper : colors.primary
                    }
                }
            }
        },
    };
};

// Función principal para crear tema personalizado
export const createCustomTheme = (mode = 'light', customColors = null) => {
    // Obtener colores base según el modo
    const defaultColors = DEFAULT_COLORS[mode];

    // Combinar colores por defecto con personalizaciones
    const finalColors = customColors ? { ...defaultColors, ...customColors } : defaultColors;

    // Crear el tema base
    const themeConfig = createBaseTheme(mode, finalColors);

    return createTheme(themeConfig);
};

// Función para obtener solo los colores personalizables
export const getCustomizableColors = (mode = 'light') => {
    const colors = DEFAULT_COLORS[mode];

    return {
        primary: colors.primary,
        secondary: colors.secondary,
        background: colors.background,
        paper: colors.paper,
        componentes: colors.componentes,
        textPrimary: colors.textPrimary,
        textSecondary: colors.textSecondary,
        glow: colors.glow,
        ...(mode === 'dark' && colors.grayAccent ? { grayAccent: colors.grayAccent } : {})
    };
};

// Función para validar colores
export const validateColors = (colors) => {
    const hexColorRegex = /^#[0-9A-F]{6}$/i;

    const requiredFields = ['primary', 'secondary', 'background', 'paper', 'textPrimary'];

    for (const field of requiredFields) {
        if (!colors[field] || !hexColorRegex.test(colors[field])) {
            return false;
        }
    }

    return true;
};

// Exportar temas por defecto
export const lightTheme = createCustomTheme('light');
export const darkTheme = createCustomTheme('dark');