import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ width: "100%" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge='start'
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Menu
          </Typography>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button color="inherit" startIcon={<HomeIcon />} size='large'>
              Ventas
            </Button>
          </Link>
          <Link to="/productos" style={{ textDecoration: 'none' }}>
            <Button color="inherit" startIcon={<ListAltIcon />} size='large'>
              Productos
            </Button>
          </Link>
          <Link to="/proveedores" style={{ textDecoration: 'none' }}>
            <Button color="inherit" startIcon={<CategoryIcon />} size='large'>
              Proveedores
            </Button>
          </Link>
          <Link to="/empleados" style={{ textDecoration: 'none' }}>
            <Button color="inherit" startIcon={<PeopleIcon />} size='large'>
              Empleados
            </Button>
          </Link>
          <Link to="/turnos" style={{ textDecoration: 'none' }}>
            <Button color="inherit" startIcon={<CalendarMonthIcon />} size='large'>
              Turnos
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
