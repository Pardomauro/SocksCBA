import { useState, useEffect } from 'react';
import { getProductos, addProducto, updateProducto, deleteProducto } from '../services/productoService';
import NavBar from '../components/NavBar';
import ActionButtons from '../components/ActionButtons';

export default function CargarProductos() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editPrecio, setEditPrecio] = useState('');
  const [editCategoria, setEditCategoria] = useState('');

  const categoriasPredefinidas = [
    'Canilleras',
    'Medias Antideslizantes Niño',
    'Medias Antideslizantes Adulto',
    'Pantorrilleras',
    'Pelotas',
    'General'
  ];

  useEffect(() => {
    getProductos().then(setProductos);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Solo enviar categoria si tiene un valor seleccionado
      const producto = { 
        nombre, 
        precio, 
        categoria: categoria || undefined 
      };
      await addProducto(producto);
      const lista = await getProductos();
      setProductos(lista);
      setNombre(''); setPrecio(''); setCategoria('');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleEdit = (prod) => {
    setEditId(prod.id);
    setEditNombre(prod.nombre);
    setEditPrecio(prod.precio);
    setEditCategoria(prod.categoria || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Solo enviar categoria si tiene un valor seleccionado
      const producto = { 
        nombre: editNombre, 
        precio: editPrecio, 
        categoria: editCategoria || undefined 
      };
      await updateProducto(editId, producto);
      const lista = await getProductos();
      setProductos(lista);
      setEditId(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }
    
    setError('');
    
    try {
      await deleteProducto(id);
      const lista = await getProductos();
      setProductos(lista);
      // Mostrar mensaje de éxito de forma temporal
      alert('Producto eliminado correctamente');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 flex flex-col items-center p-4">
      <div className="w-full mb-8">
        <NavBar />
      </div>
      {/* Contenido principal */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Cargar Productos</h2>
      <form className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-2xl" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Nombre del producto"
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />
        <select
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-40"
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
        >
          <option value="">Categoría</option>
          {categoriasPredefinidas.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Precio"
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
          value={precio}
          onChange={e => setPrecio(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors disabled:opacity-60"
          disabled={loading}
        >Agregar</button>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="w-full max-w-4xl">
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow overflow-hidden min-w-full">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-2 sm:px-4 text-left text-sm">Nombre</th>
                <th className="py-2 px-2 sm:px-4 text-left text-sm">Categoría</th>
                <th className="py-2 px-2 sm:px-4 text-left text-sm">Precio</th>
                <th className="py-2 px-2 sm:px-4 text-center text-sm w-20 sm:w-auto">Acciones</th>
              </tr>
            </thead>
          <tbody>
            {productos.map(prod => (
              <tr key={prod.id} className="border-b">
                <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                  {editId === prod.id ? (
                    <input
                      type="text"
                      value={editNombre}
                      onChange={e => setEditNombre(e.target.value)}
                      className="px-2 py-1 border rounded w-full text-xs sm:text-sm"
                    />
                  ) : (
                    prod.nombre
                  )}
                </td>
                <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                  {editId === prod.id ? (
                    <select
                      value={editCategoria}
                      onChange={e => setEditCategoria(e.target.value)}
                      className="px-2 py-1 border rounded w-full text-xs sm:text-sm"
                    >
                      <option value="">Seleccionar</option>
                      {categoriasPredefinidas.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {prod.categoria || 'General'}
                    </span>
                  )}
                </td>
                <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                  {editId === prod.id ? (
                    <input
                      type="number"
                      value={editPrecio}
                      onChange={e => setEditPrecio(e.target.value)}
                      className="px-2 py-1 border rounded w-full text-xs sm:text-sm"
                    />
                  ) : (
                    `$${prod.precio}`
                  )}
                </td>
                <td className="py-2 px-1 sm:px-4 text-center">
                  <ActionButtons
                    isEditing={editId === prod.id}
                    onEdit={() => handleEdit(prod)}
                    onDelete={() => handleDelete(prod.id)}
                    onSave={handleUpdate}
                    onCancel={() => setEditId(null)}
                    loading={loading}
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
