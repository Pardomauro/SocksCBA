/**
 * Componente de botones de acción reutilizable para editar/eliminar elementos
 * @param {Object} props
 * @param {boolean} props.isEditing - Si el elemento está en modo edición
 * @param {Function} props.onEdit - Función para manejar la edición
 * @param {Function} props.onDelete - Función para manejar la eliminación
 * @param {Function} props.onSave - Función para guardar cambios (modo edición)
 * @param {Function} props.onCancel - Función para cancelar edición (modo edición)
 * @param {boolean} props.loading - Estado de carga para deshabilitar botones
 * @param {string} props.size - Tamaño de los botones ('sm', 'md', 'lg')
 */
export default function ActionButtons({ 
  isEditing = false, 
  onEdit, 
  onDelete, 
  onSave, 
  onCancel, 
  loading = false,
  size = 'sm'
}) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs sm:text-sm',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const buttonSize = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 justify-center">
      {isEditing ? (
        // Botones para modo edición
        <>
          <button
            onClick={onSave}
            disabled={loading}
            className={`bg-green-500 hover:bg-green-600 text-white rounded disabled:opacity-60 w-full sm:w-auto transition-colors ${buttonSize}`}
          >
            Guardar
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className={`bg-gray-400 hover:bg-gray-500 text-white rounded disabled:opacity-60 w-full sm:w-auto transition-colors ${buttonSize}`}
          >
            Cancelar
          </button>
        </>
      ) : (
        // Botones para modo normal
        <>
          <button
            onClick={onEdit}
            disabled={loading}
            className={`bg-yellow-500 hover:bg-yellow-600 text-white rounded disabled:opacity-60 w-full sm:w-auto transition-colors ${buttonSize}`}
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className={`bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-60 w-full sm:w-auto transition-colors ${buttonSize}`}
          >
            Eliminar
          </button>
        </>
      )}
    </div>
  );
}