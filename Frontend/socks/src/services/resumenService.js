import { getVentasSemana, getVentasMes, getVentasPorFecha, getAllVentas } from './ventaService';
import { getGastos, getGastosPorFecha } from './gastoService';
import { getProductos } from './productoService';

const sumarVentas = (ventas) => ventas.reduce((acc, v) => acc + (v.total || 0), 0);

export const obtenerResumen = async () => {
  const ventasSemana = await getVentasSemana();
  const ventasMes = await getVentasMes();
  
  // Obtener fecha actual en zona horaria argentina
  const ahora = new Date();
  const fechaArgentina = new Date(ahora.getTime() - (ahora.getTimezoneOffset() * 60000));
  const hoyStr = fechaArgentina.toISOString().slice(0, 10);
  const ventasDia = await getVentasPorFecha(hoyStr);
  
  const gastos = await getGastos();
  const productos = await getProductos();
  const todas = await getAllVentas();

  // Totales
  const totalSemana = sumarVentas(ventasSemana);
  const totalMes = sumarVentas(ventasMes);
  const totalDia = sumarVentas(ventasDia);
  const totalGastosMes = gastos.filter(g => {
    const fechaGastoUTC = new Date(g.fecha);
    // Convertir a hora argentina si el gasto también está en UTC
    const fechaGastoArg = new Date(fechaGastoUTC.getTime() - (3 * 60 * 60 * 1000));
    const hoy = new Date();
    return fechaGastoArg.getMonth() === hoy.getMonth() && fechaGastoArg.getFullYear() === hoy.getFullYear();
  }).reduce((acc,g)=> acc + g.monto, 0);

  // Productos vendidos cuenta y producto más vendido (en el mes)
  const productoCount = {};
  const productoNames = {};
  
  ventasMes.forEach(v => {
    if (v.productos && Array.isArray(v.productos)) {
      v.productos.forEach(p => {
        const nombre = p.nombre;
        if (nombre) {
          productoCount[nombre] = (productoCount[nombre] || 0) + (p.cantidad || 1);
          productoNames[nombre] = p.nombre;
        }
      });
    }
  });
  
  let productoMasVendido = null;
  let maxCant = 0;
  for (const nombre in productoCount) {
    if (productoCount[nombre] > maxCant) {
      maxCant = productoCount[nombre];
      productoMasVendido = {
        nombre: nombre,
        cantidad: maxCant
      };
    }
  }

  // Promedios
  const promedioVentasDiaSemana = totalSemana / 7;

  // Datos para gráfico de barras (ventas por día últimos 7 días)
  const hoy = new Date();
  const dias = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() - i);
    const key = d.toISOString().slice(0,10);
    const ventasDelDia = todas.filter(v => v.fecha.startsWith(key));
    dias.push({ label: key.slice(5), total: sumarVentas(ventasDelDia) });
  }

  return {
    totalMes,
    totalDia,
    totalGastosMes,
    gananciaNeta: totalMes - totalGastosMes,
    productosVendidos: Object.values(productoCount).reduce((a,b)=>a+b,0) || 0,
    productoMasVendido: productoMasVendido,
    promedioVentasDiaSemana,
    ventasPorDia: dias
  };
};

export default { obtenerResumen };
