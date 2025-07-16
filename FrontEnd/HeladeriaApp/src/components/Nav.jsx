import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, ListItemButton } from '@mui/material';
import { Home, ShoppingCart, Store, People, Today, Menu as MenuIcon, WbSunny, Nightlight } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles'; // Cambiado a '@mui/material/styles'

const drawerWidthClosed = 80;
const drawerWidthOpen = 240;

const Nav = ({ isDarkMode, toggleTheme }) => {


    const [open, setOpen] = useState(false);
    const theme = useTheme(); // Obtener el tema actual

    const handleToggleMenu = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleMouseEnter = () => {
        setOpen(true);
    };

    const handleMouseLeave = () => {
        setOpen(false);
    };

    const backgroundColor = isDarkMode ? theme.palette.background.default : theme.palette.background.default; // Color de fondo general
    const menuColor = isDarkMode ? theme.palette.background.componentes : theme.palette.secondary.main; // Color de fondo del menú
    const textColor = isDarkMode ? theme.palette.text.primary : theme.palette.text.primary; // Color del texto

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
                    transition: 'background-color 0.3s, width 0.3s, opacity 0.3s', // Incluye opacidad en la transición
                    overflowX: 'hidden',
                    opacity: open ? 1 : 0.6, // Ajusta la opacidad
                },
                zIndex: 1, // Asegúrate de que sea más alto que el contenido principal
                height: '100vh',
                backgroundColor: backgroundColor,
            }}
        >
            {/* Contenido del Drawer */}

            <List>
                <ListItemButton onClick={handleToggleMenu}>
                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                        <MenuIcon sx={{ fontSize: 40, color: textColor }} />
                    </ListItemIcon>
                    {open && <ListItemText primary="MENU" sx={{ marginLeft: 2, fontSize: 20, color: textColor }} />}
                </ListItemButton>

                <ListItemButton component={Link} to="/">
                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                        <Home sx={{ fontSize: 40, color: textColor }} />
                    </ListItemIcon>
                    {open && <ListItemText primary="HOME" sx={{ marginLeft: 2, fontSize: 20, color: textColor }} />}
                </ListItemButton>

                <ListItemButton component={Link} to="/ventas">
                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                        <ShoppingCart sx={{ fontSize: 40, color: textColor }} />
                    </ListItemIcon>
                    {open && <ListItemText primary="VENTAS" sx={{ marginLeft: 2, fontSize: 20, color: textColor }} />}
                </ListItemButton>

                <ListItemButton component={Link} to="/productos">
                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                        <Store sx={{ fontSize: 40, color: textColor }} />
                    </ListItemIcon>
                    {open && <ListItemText primary="PRODUCTOS" sx={{ marginLeft: 2, fontSize: 20, color: textColor }} />}
                </ListItemButton>

                <ListItemButton component={Link} to="/empleados">
                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                        <People sx={{ fontSize: 40, color: textColor }} />
                    </ListItemIcon>
                    {open && <ListItemText primary="EMPLEADOS" sx={{ marginLeft: 2, fontSize: 20, color: textColor }} />}
                </ListItemButton>

                <ListItemButton component={Link} to="/turnos">
                    <ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
                        <Today sx={{ fontSize: 40, color: textColor }} />
                    </ListItemIcon>
                    {open && <ListItemText primary="TURNOS" sx={{ marginLeft: 2, fontSize: 20, color: textColor }} />}
                </ListItemButton>
            </List>

            <Box sx={{ marginTop: 'auto', paddingBottom: 2, display: 'flex', pl: 2 }}>
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
                        transition: 'all 0.3s ease',
                        position: 'relative',
                    }}
                >
                    <WbSunny
                        sx={{
                            fontSize: isDarkMode ? 25 : 20,
                            color: isDarkMode ? 'orange' : '#888',
                            transition: 'all 0.3s ease',
                            zIndex: isDarkMode ? 1 : -1,
                        }}
                    />
                    <Nightlight
                        sx={{
                            fontSize: isDarkMode ? 25 : 20,
                            color: isDarkMode ? 'white' : '#888',
                            transition: 'all 0.3s ease',
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
                            transition: 'all 0.3s ease',
                        }}
                    />
                </Box>
            </Box>
        </Drawer>
    );
};

export default Nav;
