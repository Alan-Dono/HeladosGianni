import { BrowserRouter, Route, Routes } from 'react-router-dom';
import VentasPage from '../pages/VentasPage';
import { ProductosPage } from '../pages/ProductosPage';
import { ProveedoresPage } from '../pages/ProveedoresPage';
import { EmpleadosPage } from '../pages/EmpleadosPage';
import { TurnosPage } from '../pages/TurnosPage';
import { AppLayaout } from '../../layout/AppLayaout';
import { Link } from '@mui/material';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<AppLayaout />} >
        <Route index element={<VentasPage />} />
        <Route path='/ventas' element={<VentasPage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/proveedores" element={<ProveedoresPage />} />
        <Route path="/empleados" element={<EmpleadosPage />} />
        <Route path="/turnos" element={<TurnosPage />} />
      </Route>

      <Route path='*' element={
        <>
          <p>
            <h1>Error 404</h1>
            <Link to='/'>Volver al inicio</Link>
          </p>
        </>
      } />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
