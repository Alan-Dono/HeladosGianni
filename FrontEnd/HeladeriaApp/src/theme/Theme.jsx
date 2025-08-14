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
            main: '#e35305',    // --primary (naranja intenso)
            light: '#ff6d2a',   // naranja más claro
            dark: '#b94200',    // naranja más oscuro
        },
        secondary: {
            main: '#050bba',    // --secondary (azul oscuro)
            light: '#2a2aff',   // azul más brillante para efectos
        },
        success: {
            main: '#248636',    // verde oscuro (mantenido para contraste)
        },
        warning: {
            main: '#FF8C00',   // naranja (similar al primary pero para advertencias)
        },
        error: {
            main: '#B22222',    // rojo oscuro (para errores)
        },
        background: {
            default: '#020b09', // --background (verde/negro muy oscuro)
            paper: '#0a1210',   // un tono ligeramente más claro para "paper"
            componentes: '#4403bf', // --accent (morado/azul intenso)
        },
        text: {
            primary: '#e0f8f4',  // --text (verde/cyan muy claro)
            secondary: '#b8d6d2', // un poco más oscuro para texto secundario
        },
        custom: {
            glow: '#5a4dff',     // brillo morado/azul
            grayAccent: '#3a3a3a' // gris para acentos
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
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#ff6d2a', // naranja claro al hover
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0a1210', // igual que paper
                },
            },
        },
    },
});

export { lightTheme, darkTheme };
