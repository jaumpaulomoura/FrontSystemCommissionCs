import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Paper, Typography, Grid } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const SalesChart = ({ dailyData, rankingData, isConsultant }) => {
  const dailyChartData = {
    labels: dailyData.map(d => d.date),
    datasets: [
      {
        label: 'Vendas Diárias',
        data: dailyData.map(d => d.total),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  const sortedRankingData = [...rankingData].sort((a, b) => b.valor_bruto - a.valor_bruto);

  const rankingChartData = {
    labels: sortedRankingData.map(d => d.nome),
    datasets: [
      {
        label: 'Ranking por Cupom',
        data: sortedRankingData.map(d => d.valor_bruto),
        backgroundColor: 'rgba(153,102,255,0.2)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1,
      },
    ],
  };
  const timeSalesData = dailyData.reduce((acc, curr) => {
    const { date, total } = curr;
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += total;
    return acc;
  }, {});

  const timeSalesChartData = {
    labels: Object.keys(timeSalesData),
    datasets: [
      {
        label: 'Vendas Diárias do Time',
        data: Object.values(timeSalesData),
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfico de Vendas',
      },
      datalabels: {
        color: 'white',
        anchor: 'end',
        align: 'top',
        rotation: 90,
        formatter: (value) => `${value.toFixed(2)}`, 
        offset: 5, 
      },
    },
  };

  return (
    <Grid container spacing={3}>
      {isConsultant ? (
        <Grid item xs={10} sm={6} md={6}>
          <Paper sx={{ p: 2, mx: 'auto', width: '100%' }}> 
            <Typography variant="h6">Gráfico de Vendas Diárias</Typography>
            <div style={{ height: '100%', width: '100%' }}>
              <Line data={dailyChartData} options={options} />
            </div>
          </Paper>
        </Grid>
      ) : (
        <>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, height: 430 }}>
              <Typography variant="h6">Vendas Diárias do Time</Typography>
              <div style={{ height: '100%', width: '100%' }}>
                <Line data={timeSalesChartData} options={options} />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper sx={{ p: 2, height: 430 }}>
              <Typography variant="h6">Ranking por Cupom do Time</Typography>
              <div style={{ height: '100%', width: '100%' }}>
                <Bar data={rankingChartData} options={options} />
              </div>
            </Paper>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default SalesChart;