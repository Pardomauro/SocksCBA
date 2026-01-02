import { useState, useEffect } from 'react';
import { getGastos, addGasto, updateGasto, deleteGasto } from '../services/gastoService';
import { obtenerFechaActualArgentina, formatearFechaArgentina } from '../utils/fechaUtils';
import NavBar from '../components/NavBar';
import ActionButtons from '../components/ActionButtons';

export default function RegistrarGastos() {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(() => obtenerFechaActualArgentina());
  const [gastos, setGastos] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null);
  const [editDescripcion, setEditDescripcion] = useState('');
  const [editMonto, setEditMonto] = useState('');
  const [editFecha, setEditFecha] = useState('');

  useEffect(() => {
    getGastos().then(setGastos);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await addGasto({ descripcion, monto, fecha });
      const lista = await getGastos();
      setGastos(lista);
      setDescripcion(''); setMonto(''); setFecha(obtenerFechaActualArgentina());
      setSuccess('Gasto registrado correctamente');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (gasto) => {
    setEditId(gasto.id);
    setEditDescripcion(gasto.descripcion);
    setEditMonto(gasto.monto);
    // Convertir fecha UTC a formato yyyy-MM-dd para el input
    const fechaUTC = new Date(gasto.fecha);
    const fechaArgentina = new Date(fechaUTC.getTime() - (3 * 60 * 60 * 1000));
    const fechaFormateada = fechaArgentina.toISOString().slice(0, 10);
    setEditFecha(fechaFormateada);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await updateGasto(editId, { descripcion: editDescripcion, monto: editMonto, fecha: editFecha });
      const lista = await getGastos();
      setGastos(lista);
      setEditId(null);
      setSuccess('Gasto actualizado correctamente');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      return;
    }
    setError(''); setSuccess('');
    try {
      await deleteGasto(id);
      const lista = await getGastos();
      setGastos(lista);
      setSuccess('Gasto eliminado correctamente');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 flex flex-col items-center p-4">
      <div className="w-full mb-8">
        <NavBar />
      </div>
      {/* Formulario de registro de gasto */}
      <form className="bg-white rounded-lg shadow p-6 w-full max-w-md mb-8" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Registrar nuevo gasto</h2>
        <input
          type="text"
          placeholder="Motivo del gasto"
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full mb-3"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="Monto"
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full mb-3"
          value={monto}
          onChange={e => setMonto(e.target.value)}
        />
        <input
          type="date"
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-full mb-3"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors w-full"
        >Registrar gasto</button>
      </form>
      {/* Historial de gastos */}
      <div className="w-full max-w-2xl">
        <h3 className="text-lg font-bold mb-2 text-gray-700">Historial de gastos</h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow overflow-hidden min-w-full">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-2 sm:px-4 text-left text-sm">Fecha</th>
                <th className="py-2 px-2 sm:px-4 text-left text-sm">Motivo</th>
                <th className="py-2 px-2 sm:px-4 text-right text-sm">Monto</th>
                <th className="py-2 px-2 sm:px-4 text-center text-sm w-20 sm:w-auto">Acciones</th>
              </tr>
            </thead>
          <tbody>
            {gastos.length === 0 && (
              <tr><td colSpan={4} className="text-center py-4 text-gray-500">No hay gastos registrados</td></tr>
            )}
            {gastos.map(gasto => (
              <tr key={gasto.id} className="border-b">
                {editId === gasto.id ? (
                  <>
                    <td className="py-2 px-2 sm:px-4">
                      <input type="date" value={editFecha} onChange={e => setEditFecha(e.target.value)} className="px-2 py-1 border rounded w-full text-xs sm:text-sm" />
                    </td>
                    <td className="py-2 px-2 sm:px-4">
                      <input type="text" value={editDescripcion} onChange={e => setEditDescripcion(e.target.value)} className="px-2 py-1 border rounded w-full text-xs sm:text-sm" />
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-right">
                      <input type="number" value={editMonto} onChange={e => setEditMonto(e.target.value)} className="px-2 py-1 border rounded w-full text-right text-xs sm:text-sm" />
                    </td>
                    <td className="py-2 px-1 sm:px-4 text-center">
                      <ActionButtons
                        isEditing={true}
                        onSave={handleUpdate}
                        onCancel={() => setEditId(null)}
                        size="sm"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{formatearFechaArgentina(gasto.fecha, { hour: undefined, minute: undefined })}</td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">{gasto.descripcion}</td>
                    <td className="py-2 px-2 sm:px-4 text-right font-semibold text-xs sm:text-sm">${gasto.monto}</td>
                    <td className="py-2 px-1 sm:px-4 text-center">
                      <ActionButtons
                        onEdit={() => handleEdit(gasto)}
                        onDelete={() => handleDelete(gasto.id)}
                        size="sm"
                      />
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
