import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './Context/AuthContext';
import Login from './Pages/Login';
import Registro from './pages/Registro';
import Home from './Pages/Home';
import PrivateRoute from './Components/PrivateRoute';
import CargarProductos from './Pages/CargarProductos';
import RealizarVenta from './Pages/RealizarVenta';
import RegistrarGastos from './Pages/RegistrarGastos';
import ResumenFinanciero from './Pages/ResumenFinanciero';

export default function AppRouter() {
  const { user } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/cargar-productos" element={<CargarProductos />} />
        <Route path="/realizar-venta" element={<RealizarVenta />} />
        <Route path="/registrar-gastos" element={<RegistrarGastos />} />
        <Route path="/resumen-financiero" element={<ResumenFinanciero />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
