// PrintReport.js
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const PrintReport = ({ data }) => {
  const columns = [
    { field: 'cupom_vendedora', headerName: 'Cliente', width: 150 },
    { field: 'id_cliente', headerName: 'Cliente', width: 150 },
    {
      field: 'min_data',
      headerName: 'Primeira compra do mês',
      width: 180,
      valueFormatter: ({ value }) => {
        if (!value) return 'Data não disponível';
        try {
          const [year, month, day] = value.split('-');
          return `${day}/${month}/${year}`;
        } catch {
          return 'Data inválida';
        }
      },
    },
    {
      field: 'last_order',
      headerName: 'Última compra',
      width: 180,
      valueFormatter: ({ value }) => {
        if (!value) return 'Data não disponível';
        try {
          const [year, month, day] = value.split('-');
          return `${day}/${month}/${year}`;
        } catch {
          return 'Data inválida';
        }
      },
    },
    { field: 'dias', headerName: 'Dias', width: 120 },
    { field: 'Status', headerName: 'Status', width: 120 },
    {
      field: 'min_data_mes_anterior',
      headerName: 'Última compra do mês anterior',
      width: 180,
      valueFormatter: ({ value }) => {
        if (!value) return '';
        try {
          const [year, month, day] = value.split('-');
          return `${day}/${month}/${year}`;
        } catch {
          return 'Data inválida';
        }
      },
    },
    {
      field: 'last_order_mes_anterior',
      headerName: 'Última compra antes do mês anterior',
      width: 180,
      valueFormatter: ({ value }) => {
        if (!value) return '';
        try {
          const [year, month, day] = value.split('-');
          return `${day}/${month}/${year}`;
        } catch {
          return 'Data inválida';
        }
      },
    },
    { field: 'dias_mes_anterior', headerName: 'Dias até o mês anterior', width: 180 },
  ];

  return (
    <div>
      <h2>Relatório de Reconquista</h2>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default PrintReport;
