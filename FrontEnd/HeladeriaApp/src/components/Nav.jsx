import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Typography,
  useTheme 
} from '@mui/material';
import { 
  Home, 
  ShoppingCart, 
  Store, 
  People, 
  Today, 
  Menu as MenuIcon, 
  WbSunny, 
  Nightlight,
  Print,
  PrintDisabled
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ModoImpresionService from '../services/ModoImpresionService';

const drawerWidthClosed = 80;
const drawerWidthOpen = 240;

const Nav = ({ isDarkMode, toggleTheme }) => {
  const [open, setOpen] = useState(false);
  const [modoImpresion, setModoImpresion] = useState(0);
  const theme = useTheme();

  // Manejo del menú
  const handleToggleMenu = () => setOpen(prev => !prev);
  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);

  // Obtener modo de impresión al cargar
  useEffect(() => {
    const fetchModoImpresion = async () => {
      try {
        const modo = await ModoImpresionService.obtenerModoImpresion();
        setModoImpresion(modo);
      } catch (error) {
        console.error("Error obteniendo modo impresión:", error);
      }
    };
    fetchModoImpresion();
  }, []);

  // Cambiar modo de impresión (optimizado para respuesta rápida)
  const toggleModoImpresion = async () => {
    const nuevoModo = modoImpresion === 0 ? 1 : 0;
    setModoImpresion(nuevoModo); // Optimistic UI update
    try {
      await ModoImpresionService.cambiarModoImpresion(nuevoModo);
    } catch (error) {
      console.error("Error cambiando modo impresión:", error);
      setModoImpresion(prev => prev === 0 ? 1 : 0); // Revert if fails
    }
  };

  // Estilos
  const menuColor = isDarkMode ? theme.palette.background.componentes : theme.palette.secondary.main;
  const textColor = theme.palette.text.primary;

  return (
    <Drawer
      variant="permanent"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidthOpen : drawerWidthClosed,
          backgroundColor: menuColor,
          transition: 'all 0.3s',
          overflowX: 'hidden',
          opacity: open ? 1 : 0.6,
        },
        zIndex: 1,
        height: '100vh',
      }}
    >
      <List>
        <ListItemButton onClick={handleToggleMenu}>
          <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
            <MenuIcon sx={{ fontSize: 40, color: textColor }} />
          </ListItemIcon>
          {open && <ListItemText primary="MENU" sx={{ ml: 2, fontSize: 20, color: textColor }} />}
        </ListItemButton>

        {[
          { icon: Home, text: "HOME", path: "/" },
          { icon: ShoppingCart, text: "VENTAS", path: "/ventas" },
          { icon: Store, text: "PRODUCTOS", path: "/productos" },
          { icon: People, text: "EMPLEADOS", path: "/empleados" },
          { icon: Today, text: "TURNOS", path: "/turnos" },
        ].map((item) => (
          <ListItemButton key={item.text} component={Link} to={item.path}>
            <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
              <item.icon sx={{ fontSize: 40, color: textColor }} />
            </ListItemIcon>
            {open && <ListItemText primary={item.text} sx={{ ml: 2, fontSize: 20, color: textColor }} />}
          </ListItemButton>
        ))}
      </List>

      {/* Contenedor de interruptores fijos en la parte inferior */}
      <Box sx={{ 
        marginTop: 'auto', 
        paddingBottom: 2, 
        display: 'flex', 
        flexDirection: 'column',
        gap: 2,
        pl: 2
      }}>
        {/* Interruptor de Modo Impresión */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            onClick={toggleModoImpresion}
            sx={{
              bgcolor: isDarkMode ? theme.palette.background.componentes : theme.palette.background.default,
              borderRadius: '15px',
              padding: '2px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '52px',
              height: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease', // Animación más rápida
              position: 'relative',
            }}
          >
            <Print
              sx={{
                fontSize: modoImpresion ? 25 : 20,
                color: modoImpresion ? 'green' : '#888',
                transition: 'all 0.2s ease',
                zIndex: modoImpresion ? 1 : -1,
              }}
            />
            <PrintDisabled
              sx={{
                fontSize: modoImpresion ? 25 : 20,
                color: modoImpresion ? '#888' : 'red',
                transition: 'all 0.2s ease',
                zIndex: modoImpresion ? -1 : 1,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '2px',
                left: modoImpresion ? 'calc(100% - 22px)' : '2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                bgcolor: isDarkMode ? 'white' : '#333',
                transition: 'all 0.2s ease',
              }}
            />
          </Box>
          {/*
          {open && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: textColor, 
                marginLeft: '8px',
                fontSize: '0.75rem'
              }}
            >
              {modoImpresion ? 'Doble impresión' : 'Impresión simple'}
            </Typography>
          )}*/}
        </Box>

        {/* Interruptor de Tema Oscuro/Claro */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            onClick={toggleTheme}
            sx={{
              bgcolor: isDarkMode ? theme.palette.background.componentes : theme.palette.background.default,
              borderRadius: '15px',
              padding: '2px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '52px',
              height: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
          >
            <WbSunny
              sx={{
                fontSize: isDarkMode ? 25 : 20,
                color: isDarkMode ? 'orange' : '#888',
                transition: 'all 0.2s ease',
                zIndex: isDarkMode ? 1 : -1,
              }}
            />
            <Nightlight
              sx={{
                fontSize: isDarkMode ? 25 : 20,
                color: isDarkMode ? 'white' : '#888',
                transition: 'all 0.2s ease',
                zIndex: isDarkMode ? -1 : 1,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '2px',
                left: isDarkMode ? 'calc(100% - 22px)' : '2px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                bgcolor: isDarkMode ? 'white' : '#333',
                transition: 'all 0.2s ease',
              }}
            />
          </Box>
          {/* 
          {open && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: textColor, 
                marginLeft: '8px',
                fontSize: '0.75rem'
              }}
            >
              {isDarkMode ? 'Modo oscuro' : 'Modo claro'}
            </Typography>
          )}*/}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Nav;