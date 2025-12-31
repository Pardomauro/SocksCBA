import { getProductos } from './productoService';
import { getVentasPorFecha, getAllVentas } from './ventaService';
import { getGastosPorFecha } from './gastoService';

export const obtenerEstadisticasHome = async () => {
  try {
    // Obtener fecha actual en zona horaria argentina (UTC-3)
    const ahora = new Date();
    const fechaArgentina = new Date(ahora.getTime() - (ahora.getTimezoneOffset() * 60000));
    const hoyStr = fechaArgentina.toISOString().slice(0, 10);
    
    console.log('Fecha actual argentina:', hoyStr);
    
    // Obtener datos
    const [productos, todasVentas] = await Promise.all([
      getProductos(),
      getAllVentas()
    ]);

    // Filtrar ventas de hoy considerando zona horaria argentina
    const ventasHoy = todasVentas.filter(v => {
      const fechaVentaUTC = new Date(v.fecha);
      // Convertir a hora argentina (UTC-3)
      const fechaVentaArg = new Date(fechaVentaUTC.getTime() - (3 * 60 * 60 * 1000));
      const fechaVentaStr = fechaVentaArg.toISOString().slice(0, 10);
      return fechaVentaStr === hoyStr;
    });

    console.log('Ventas encontradas para hoy (con zona horaria corregida):', ventasHoy);

    // Ventas de hoy
    const ventasHoyCount = ventasHoy.length;
    const ingresosHoy = ventasHoy.reduce((acc, v) => acc + (v.total || 0), 0);

    // Total productos
    const totalProductos = productos.length;

    // Productos por categoría
    const productosPorCategoria = productos.reduce((acc, p) => {
      const cat = p.categoria || 'Sin categoría';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    // Top productos vendidos (últimos 30 días)
    const fecha30Dias = new Date();
    fecha30Dias.setDate(fecha30Dias.getDate() - 30);
    
    const ventasRecientes = todasVentas.filter(v => {
      const fechaVenta = new Date(v.fecha);
      return fechaVenta >= fecha30Dias;
    });

    const productosVendidos = {};
    ventasRecientes.forEach(v => {
      if (v.productos && Array.isArray(v.productos)) {
        v.productos.forEach(p => {
          const nombre = p.nombre;
          if (nombre) {
            productosVendidos[nombre] = (productosVendidos[nombre] || 0) + (p.cantidad || 1);
          }
        });
      }
    });

    // Producto más vendido
    const topProducto = Object.entries(productosVendidos)
      .sort(([,a], [,b]) => b - a)[0];

    // Ventas por día de la semana (últimos 7 días) - con zona horaria argentina
    const ventasPorDia = {};
    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - i);
      const fechaArgentina = new Date(fecha.getTime() - (fecha.getTimezoneOffset() * 60000));
      const fechaStr = fechaArgentina.toISOString().slice(0, 10);
      
      const ventasDia = todasVentas.filter(v => {
        const fechaVentaUTC = new Date(v.fecha);
        const fechaVentaArg = new Date(fechaVentaUTC.getTime() - (3 * 60 * 60 * 1000));
        const fechaVentaStr = fechaVentaArg.toISOString().slice(0, 10);
        return fechaVentaStr === fechaStr;
      });
      
      const diaSemana = diasSemana[fecha.getDay()];
      ventasPorDia[diaSemana] = {
        cantidad: ventasDia.length,
        total: ventasDia.reduce((acc, v) => acc + (v.total || 0), 0)
      };
    }

    return {
      ventasHoy: ventasHoyCount,
      ingresosHoy: ingresosHoy,
      totalProductos: totalProductos,
      productosPorCategoria: productosPorCategoria,
      topProducto: topProducto ? { nombre: topProducto[0], cantidad: topProducto[1] } : null,
      ventasPorDia: ventasPorDia
    };
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    return {
      ventasHoy: 0,
      ingresosHoy: 0,
      totalProductos: 0,
      productosPorCategoria: {},
      topProducto: null,
      ventasPorDia: {}
    };
  }
};