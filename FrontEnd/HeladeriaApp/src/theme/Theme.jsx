import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3F72AF',
        },
        secondary: {
            main: '#DBE2EF',
        },
        success: {
            main: '#4CAF50',
        },
        warning: {
            main: '#FFA726',
        },
        error: {
            main: '#F44336',
        },
        background: {
            default: '#F0F2F5', // más suave
            paper: '#FFFFFF',   // fondo blanco para cajas
            componentes: '#F7F9FB' // nuevo: para componentes como botones/paneles
        },
        text: {
            primary: '#212121', // texto más oscuro para mejor contraste
            secondary: '#616161',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
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
