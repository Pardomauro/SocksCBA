import { useState, useEffect } from 'react';
import { getProductos } from '../services/productoService';
import { addVenta, updateVenta, deleteVenta, getVentasSemana, getVentasPorFecha } from '../services/ventaService';
import { formatearFechaArgentina } from '../utils/fechaUtils';
import NavBar from '../components/NavBar';
import ActionButtons from '../components/ActionButtons';

export default function RealizarVenta() {
  const [productos, setProductos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]); // [{id, cantidad}]
  const [ventas, setVentas] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editandoVenta, setEditandoVenta] = useState(null);

  useEffect(() => {
    getProductos().then(setProductos);
    getVentasSemana().then(setVentas);
  }, []);

  const handleCheck = (id) => {
    setSeleccionados(sel =>
      sel.some(p => p.id === id)
        ? sel.filter(p => p.id !== id)
        : [...sel, { id, cantidad: 1 }]
    );
  };

  const handleCantidad = (id, cantidad) => {
    setSeleccionados(sel =>
      sel.map(p => p.id === id ? { ...p, cantidad: Number(cantidad) } : p)
    );
  };

  const handleVenta = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (seleccionados.length === 0) {
      setError('Selecciona al menos un producto');
      return;
    }
    
    const productosVendidos = seleccionados.map(sel => {
      const prod = productos.find(p => p.id === sel.id);
      return { ...prod, cantidad: sel.cantidad };
    });
    
    const total = productosVendidos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    const ventaPayload = { total, productos: productosVendidos };
    
    if (editandoVenta) {
      const ventaActualizada = await updateVenta(editandoVenta.id, ventaPayload);
      setVentas(vs => vs.map(v => v.id === editandoVenta.id ? ventaActualizada : v));
      setEditandoVenta(null);
      setSuccess('Venta actualizada correctamente');
    } else {
      const venta = await addVenta(ventaPayload);
      setVentas(vs => [venta, ...vs]);
      setSuccess('Venta registrada correctamente');
    }
    
    setSeleccionados([]);
  };

  const handleFiltrarFecha = async (e) => {
    e.preventDefault();
    if (!fechaFiltro) return;
    const ventasFiltradas = await getVentasPorFecha(fechaFiltro);
    setVentas(ventasFiltradas);
  };

  const handleEditarVenta = (venta) => {
    // Configurar productos seleccionados basados en los productos de la venta
    const productosVenta = venta.productos.map(p => {
      const producto = productos.find(prod => prod.nombre === p.nombre);
      return producto ? { id: producto.id, cantidad: p.cantidad } : null;
    }).filter(p => p !== null);
    
    setSeleccionados(productosVenta);
    setEditandoVenta(venta);
    setSuccess('');
    setError('');
  };

  const handleActualizarVenta = async () => {
    if (seleccionados.length === 0) {
      setError('Selecciona al menos un producto');
      return;
    }
    
    try {
      const productosVendidos = seleccionados.map(sel => {
        const prod = productos.find(p => p.id === sel.id);
        return { ...prod, cantidad: sel.cantidad };
      });
      
      const total = productosVendidos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
      const ventaPayload = { total, productos: productosVendidos };
      
      const ventaActualizada = await updateVenta(editandoVenta.id, ventaPayload);
      
      setVentas(vs => vs.map(v => v.id === editandoVenta.id ? ventaActualizada : v));
      setSeleccionados([]);
      setEditandoVenta(null);
      setSuccess('Venta actualizada correctamente');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminarVenta = async (ventaId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta venta?')) return;
    
    try {
      await deleteVenta(ventaId);
      setVentas(vs => vs.filter(v => v.id !== ventaId));
      setSuccess('Venta eliminada correctamente');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelarEdicion = () => {
    setEditandoVenta(null);
    setSeleccionados([]);
    setError('');
    setSuccess('');
  };

  const isChecked = (id) => seleccionados.some(p => p.id === id);
  const getCantidad = (id) => seleccionados.find(p => p.id === id)?.cantidad || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 flex flex-col items-center p-4">
      <div className="w-full mb-8">
        <NavBar />
      </div>

      {/* Formulario de venta */}
      <form className="bg-white rounded-lg shadow p-6 w-full max-w-2xl mb-8" onSubmit={handleVenta}>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Generar nueva venta</h2>
        <div className="grid grid-cols-1 gap-4 mb-4">
          {(() => {
            // Agrupar productos por categoría
            const productosAgrupados = productos.reduce((acc, prod) => {
              const categoria = prod.categoria || 'General';
              if (!acc[categoria]) acc[categoria] = [];
              acc[categoria].push(prod);
              return acc;
            }, {});

            return Object.keys(productosAgrupados).sort().map(categoria => (
              <div key={categoria} className="border rounded-lg">
                <div className="bg-blue-50 px-4 py-2 rounded-t-lg border-b">
                  <h3 className="font-semibold text-blue-800">📁 {categoria}</h3>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {productosAgrupados[categoria].map(prod => (
                    <div key={prod.id} className="flex items-center gap-2 border-b pb-2">
                      <input
                        type="checkbox"
                        checked={isChecked(prod.id)}
                        onChange={() => handleCheck(prod.id)}
                        className="accent-blue-600"
                      />
                      <span className="font-medium flex-1">{prod.nombre}</span>
                      <span className="text-gray-500">${prod.precio}</span>
                      {isChecked(prod.id) && (
                        <input
                          type="number"
                          min={1}
                          value={getCantidad(prod.id)}
                          onChange={e => handleCantidad(prod.id, e.target.value)}
                          onFocus={e => e.target.select()}
                          className="w-16 px-2 py-1 border rounded ml-2 text-center"
                          placeholder="1"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:px-6 rounded transition-colors w-full sm:w-auto"
          >
            {editandoVenta ? 'Actualizar venta' : 'Registrar venta'}
          </button>
          {editandoVenta && (
            <button
              type="button"
              onClick={handleCancelarEdicion}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 sm:px-6 rounded transition-colors w-full sm:w-auto"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
      {/* Filtro por fecha */}
      <form className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-2xl" onSubmit={handleFiltrarFecha}>
        <input
          type="date"
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
          value={fechaFiltro}
          onChange={e => setFechaFiltro(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded"
        >Filtrar por fecha</button>
      </form>
      {/* Historial de ventas */}
      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-bold mb-2 text-gray-700">Historial de ventas</h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow overflow-hidden min-w-full">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-2 sm:px-4 text-left text-sm">Fecha</th>
                <th className="py-2 px-2 sm:px-4 text-left text-sm">Productos</th>
                <th className="py-2 px-2 sm:px-4 text-right text-sm">Total</th>
                <th className="py-2 px-2 sm:px-4 text-center text-sm w-20 sm:w-auto">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ventas.length === 0 && (
                <tr><td colSpan={4} className="text-center py-4 text-gray-500">No hay ventas registradas</td></tr>
              )}
              {ventas.map(venta => (
                <tr key={venta.id} className="border-b">
                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                    {formatearFechaArgentina(venta.fecha)}
                  </td>
                  <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                    {venta.productos && venta.productos.length > 0 ? (
                      venta.productos.map((p, index) => (
                        <div key={`${venta.id}-${index}`}>{p.nombre} x{p.cantidad}</div>
                      ))
                    ) : (
                      <div className="text-gray-500">Sin detalles</div>
                    )}
                  </td>
                  <td className="py-2 px-2 sm:px-4 text-right font-semibold text-xs sm:text-sm">${venta.total}</td>
                  <td className="py-2 px-1 sm:px-4 text-center">
                    <ActionButtons
                      onEdit={() => handleEditarVenta(venta)}
                      onDelete={() => handleEliminarVenta(venta.id)}
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
