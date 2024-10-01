import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Ventas from '../pages/Ventas';
import Productos from '../pages/Productos';
import Empleados from '../pages/Empleados';
import { Turnos } from '../pages/Turnos';
import Layout from '../layout/Layout';

const AppRoutes = ({ isDarkMode, toggleTheme }) => {
    return (
        <Routes>
            <Route path="/" element={<Layout isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}>
                <Route index element={<Home />} />
                <Route path="ventas" element={<Ventas />} />
                <Route path="productos" element={<Productos />} />
                <Route path="empleados" element={<Empleados />} />
                <Route path="turnos" element={<Turnos />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
