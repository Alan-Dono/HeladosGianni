import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light', // Modo claro
        primary: {
            main: '#3F72AF', // Azul claro
        },
        secondary: {
            main: '#DBE2EF', // Azul suave
        },
        success: {
            main: '#A8E6CE', // Verde claro
        },
        warning: {
            main: '#FFEB3B', // Amarillo
        },
        error: {
            main: '#FF6F61', // Rojo suave
        },
        background: {
            default: '#F9F7F7', // Color de fondo claro
            paper: '#FFFFFF', // Blanco puro para los componentes
        },
        text: {
            primary: '#262626', // Negro suave para el texto principal
            secondary: '#8e8e8e', // Gris para el texto secundario
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif', // Fuente Roboto
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // No usar mayúsculas
                },
            },
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark', // Modo oscuro
        primary: {
            main: '#4494f8', // Azul oscuro
        },
        secondary: {
            main: '#79b8ff', // Azul claro
        },
        success: {
            main: '#248636', // Verde oscuro
        },
        warning: {
            main: '#FF8C00', // Naranja
        },
        error: {
            main: '#B22222', // Rojo oscuro
        },
        background: {
            default: '#010409', // Fondo oscuro
            paper: '#0d1117', // Fondo de los contenedores
            componentes: '#151b24' // Fondo de los componentes
        },
        text: {
            primary: '#f0f6fc', // Texto claro para alto contraste
            secondary: '#6e757e', // Texto gris suave para menor contraste
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif', // Fuente Roboto
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // No usar mayúsculas
                },
            },
        },
    },
});

export { lightTheme, darkTheme };
