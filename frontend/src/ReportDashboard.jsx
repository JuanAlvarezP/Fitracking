import React, { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ReportDashboard = () => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [data, setData] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReport = async () => {
        if (!fechaInicio || !fechaFin) {
            alert('Por favor selecciona las fechas de inicio y fin.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('accessToken');
            const response = await axios.get('http://127.0.0.1:8000/api/reporte-progreso/', {
                params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
                headers: { Authorization: `Bearer ${token}` },
            });

            const reportData = response.data;
            setData(reportData);

            if (reportData.length > 0) {
                const labels = reportData.map((item) => item.ejercicio__nombre_ejercicio || 'Desconocido');
                const repeticiones = reportData.map((item) => item.total_repeticiones || 0);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Progreso por ejercicio (Repeticiones)',
                            data: repeticiones,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        },
                    ],
                });
            } else {
                setChartData(null);
            }
        } catch (error) {
            console.error('Error fetching report:', error);
            setError('Ocurrió un error al generar el reporte. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Reporte de Progresos</h2>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                <div>
                    <label>Fecha Inicio:</label>
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        style={{ marginLeft: '10px' }}
                    />
                </div>
                <div>
                    <label>Fecha Fin:</label>
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                        style={{ marginLeft: '10px' }}
                    />
                </div>
                <button onClick={fetchReport} disabled={loading}>
                    {loading ? 'Cargando...' : 'Generar Reporte'}
                </button>
            </div>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {chartData ? (
                <div style={{ height: '300px', marginBottom: '20px' }}>
                    <Bar
                        data={chartData}
                        options={{
                            plugins: {
                                legend: { display: true, position: 'top' },
                            },
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    ticks: { font: { size: 10 } },
                                },
                                y: {
                                    ticks: { font: { size: 10 } },
                                },
                            },
                        }}
                    />
                </div>
            ) : (
                !loading && <p style={{ textAlign: 'center' }}>No hay datos disponibles para este rango de fechas.</p>
            )}
            {data.length > 0 && (
                <div style={{ overflowX: 'auto', maxHeight: '300px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Ejercicio</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Repeticiones</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Tiempo (minutos)</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Peso Usado (kg)</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Usuarios</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.ejercicio__nombre_ejercicio}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.total_repeticiones}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.total_tiempo}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.total_peso}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.usuarios}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReportDashboard;
