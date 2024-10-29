import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

// Registre os elementos necessários do Chart.js
Chart.register(ArcElement, Tooltip, Legend);
const SalesChartItens = ({ summedData }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (summedData) {
            // Extraindo rótulos e valores para o gráfico
            const labels = Object.keys(summedData);
            const data = labels.map(label => parseFloat(summedData[label].valorTotal).toFixed(2)); // Formata o valor com duas casas decimais

            // Configurando os dados do gráfico
            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Vendas por Categoria',
                        data,
                        backgroundColor: [
                            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                        ],
                    },
                ],
            });
        }
    }, [summedData]);

    if (!chartData) return null; // Se ainda não houver dados, retorne null

    return (
        <div>
            <h2>Gráfico de Vendas por Categoria</h2>
            <Pie data={chartData} />
        </div>
    );
};
export default SalesChartItens;
