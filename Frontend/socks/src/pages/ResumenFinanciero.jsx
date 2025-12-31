import { useEffect, useState } from 'react';
import resumenService from '../services/resumenService';
import NavBar from '../components/NavBar';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ResumenFinanciero(){
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const load = async ()=>{
      setLoading(true);
      const r = await resumenService.obtenerResumen();
      setResumen(r);
      setLoading(false);
    };
    load();
  },[]);

  if(loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 flex flex-col items-center p-4">
      <div className="w-full mb-8">
        <NavBar />
      </div>

      <main className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Resumen Financiero</h2>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Ventas hoy</div>
            <div className="text-2xl font-bold text-blue-800">${resumen.totalDia}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Ventas mes</div>
            <div className="text-2xl font-bold text-green-800">${resumen.totalMes}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Gastos mes</div>
            <div className="text-2xl font-bold text-red-800">${resumen.totalGastosMes}</div>
          </div>
        </section>

        {/* Ganancia Neta del Mes - Métrica Principal */}
        <section className="mb-6 flex justify-center">
          <div className={`rounded-2xl shadow-2xl p-6 lg:p-8 text-center transform transition-all hover:scale-105 w-full max-w-md lg:max-w-lg ${
            resumen.gananciaNeta >= 0 
              ? 'bg-green-800 text-white' 
              : 'bg-red-800 text-white'
          }`}>
            <div className="text-lg lg:text-xl font-semibold mb-2 opacity-90">
              💰 Ganancia Neta del Mes
            </div>
            <div className="text-4xl lg:text-5xl font-bold mb-2">
              ${Math.abs(resumen.gananciaNeta)}
            </div>
            <div className="text-base lg:text-lg font-medium opacity-90">
              {resumen.gananciaNeta >= 0 ? '🎉 ¡Ganancia!' : '⚠️ Pérdida'}
            </div>
            <div className="text-xs lg:text-sm opacity-75 mt-2">
              Ventas (${resumen.totalMes}) - Gastos (${resumen.totalGastosMes})
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Ventas por día (últimos 7 días)</h3>
            <div className="h-64">
              <Bar
                data={{
                  labels: resumen.ventasPorDia.map(d => {
                    try {
                      const [month, day] = d.label.split('-');
                      const date = new Date(2025, parseInt(month) - 1, parseInt(day));
                      return date.toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: 'short' 
                      });
                    } catch {
                      return d.label;
                    }
                  }),
                  datasets: [
                    {
                      label: 'Ventas ($)',
                      data: resumen.ventasPorDia.map(d => d.total || 0),
                      backgroundColor: 'rgba(59, 130, 246, 0.8)',
                      borderColor: 'rgba(59, 130, 246, 1)',
                      borderWidth: 1,
                      borderRadius: 4,
                      borderSkipped: false,
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `$${context.parsed.y}`;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function(value) {
                          return '$' + value;
                        }
                      }
                    },
                    x: {
                      grid: {
                        display: false,
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Producto más vendido (mes)</h3>
            {resumen.productoMasVendido ? (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4">
                <div className="text-lg font-bold text-gray-800 mb-1">
                  🏆 {resumen.productoMasVendido.nombre}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Unidades vendidas: <span className="font-semibold text-green-600">{resumen.productoMasVendido.cantidad}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-700 h-2 rounded-full transition-all" 
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            ) : (
              <div className="text-gray-500 bg-gray-50 rounded-lg p-4 mb-4">
                📊 Sin datos de ventas este mes
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">Productos vendidos</div>
                <div className="text-xl font-bold text-blue-800">{resumen.productosVendidos}</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-500">Promedio/día</div>
                <div className="text-xl font-bold text-green-800">${resumen.promedioVentasDiaSemana.toFixed(0)}</div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
