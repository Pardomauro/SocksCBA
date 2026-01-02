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
    sm: 'px-1 py-0.5 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const buttonSize = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-1 justify-center items-center">
      {isEditing ? (
        // Botones para modo edición
        <>
          <button
            onClick={onSave}
            disabled={loading}
            className={`bg-green-500 hover:bg-green-600 text-white rounded disabled:opacity-60 w-full sm:w-auto transition-colors ${buttonSize} min-w-0`}
          >
            ✓
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className={`bg-gray-400 hover:bg-gray-500 text-white rounded disabled:opacity-60 w-full sm:w-auto transition-colors ${buttonSize} min-w-0`}
          >
            ✕
          </button>
        </>
      ) : (
        // Botones para modo normal
        <>
          <button
            onClick={onEdit}
            disabled={loading}
            className={`bg-yellow-500 hover:bg-yellow-600 text-white rounded disabled:opacity-60 w-full sm:w-auto transition-colors ${buttonSize} min-w-0`}
            title="Editar"
          >
            <span className="sm:hidden">✏️</span>
            <span className="hidden sm:inline">Editar</span>
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className={`bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-60 w-full sm:w-auto transition-colors ${buttonSize} min-w-0`}
            title="Eliminar"
          >
            <span className="sm:hidden">🗑️</span>
            <span className="hidden sm:inline">Eliminar</span>
          </button>
        </>
      )}
    </div>
  );
}