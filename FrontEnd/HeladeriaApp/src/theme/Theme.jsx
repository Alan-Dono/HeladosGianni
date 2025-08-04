import { createTheme } from '@mui/material/styles';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2f27ce',    // --primary luz
        },
        secondary: {
            main: '#dddbff',    // --secondary luz
            light: '#e5e4ff',   // un tono más claro para glow
        },
        success: {
            main: '#4CAF50',    // lo mismo que antes
        },
        warning: {
            main: '#FFA726',    // sin cambiar
        },
        error: {
            main: '#F44336',    // sin cambiar
        },
        background: {
            default: '#fbfbfe',   // --background luz
            paper: '#ffffff',
            componentes: '#443dff', // --accent luz (para fondos componentes)
        },
        text: {
            primary: '#050316',   // --text luz
            secondary: '#050316',
        },
        custom: {
            glow: '#b0adff',      // brillo más visible (ajustable)
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
        mode: 'dark',
        primary: {
            main: '#90e9e5', // --primario oscuro
        },
        secondary: {
            main: '#1e1d8c', // --secundario oscuro
            light: '#7b79ff', // más claro para efecto de brillo
        },
        success: {
            main: '#248636',
        },
        warning: {
            main: '#FF8C00',
        },
        error: {
            main: '#B22222',
        },
        background: {
            default: '#020808', // --fondo oscuro
            paper: '#0d1117',
            componentes: '#7949da', // --acento oscuro
        },
        text: {
            primary: '#eafafa', // --texto oscuro
            secondary: '#eafafa',
        },
        custom: {
            glow: '#a9a7ff', // brillo en modo oscuro
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

export { lightTheme, darkTheme };
