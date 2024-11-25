import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";


ChartJS.register(ArcElement, Tooltip, Legend);

const VigenciaChart = ({ orders }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    
    const aggregatedData = aggregateData(orders);

    
    const data = {
      labels: ["Dentro da Vigência", "Fora da Vigência"],
      datasets: [
        {
          data: [aggregatedData.dentro, aggregatedData.fora],
          backgroundColor: ["#4CAF50", "#FF7043"], 
          hoverOffset: 4,
        },
      ],
    };

    setChartData(data);
  }, [orders]);

  
  const aggregateData = (orders) => {
    const aggregatedData = {
      dentro: 0,
      fora: 0,
    };

    orders.forEach((order) => {
      if (order.vigencia_status === "Pedido dentro da vigência") {
        aggregatedData.dentro += order.valor_pago || 0; 
      } else if (order.vigencia_status === "Pedido fora da vigência") {
        aggregatedData.fora += order.valor_pago || 0; 
      }
    });

    return aggregatedData;
  };

  return (
    <div>
      <h3>Status de Vigência (Baseado no Valor Pago)</h3>
      {chartData.labels ? (
        <Pie data={chartData} />
      ) : (
        <p>Carregando gráfico...</p>
      )}
    </div>
  );
};

export default VigenciaChart;
