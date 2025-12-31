import { Link } from 'react-router-dom';
import logo from '../assets/logoSocks.jpg';

export default function NavBar() {
  const toggleMobileMenu = () => {
    const nav = document.getElementById('nav-links');
    nav.classList.toggle('hidden');
  };

  return (
    <nav className="bg-white shadow flex flex-wrap items-center px-4 py-3 justify-between gap-2 md:gap-0">
      <div className="flex items-center gap-2 flex-shrink-0">
        <img src={logo} alt="Logo Socks" className="w-10 h-10 object-contain" />
        <span className="font-bold text-xl text-black hover:text-blue-800">SocksCBA</span>
      </div>
      <button className="md:hidden ml-auto" onClick={toggleMobileMenu}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div id="nav-links" className="w-full md:w-auto flex-col md:flex-row flex md:flex gap-4 md:gap-4 items-center md:items-center hidden md:flex">
        <Link to="/home" className="hover:text-blue-600 font-medium">Dashboard</Link>
        <Link to="/realizar-venta" className="hover:text-blue-600 font-medium">Realizar Venta</Link>
        <Link to="/cargar-productos" className="hover:text-blue-600 font-medium">Cargar Productos</Link>
        <Link to="/registrar-gastos" className="hover:text-blue-600 font-medium">Registrar Gastos</Link>
        <Link to="/resumen-financiero" className="hover:text-blue-600 font-medium">Resumen Financiero</Link>
      </div>
      <div className="flex-shrink-0">
        <Link to="/login" className="text-sm text-gray-500 hover:text-red-500">Salir</Link>
      </div>
    </nav>
  );
}