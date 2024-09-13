import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, TextField, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SidebarMenu from '../../components/SidebarMenu';
import { useNavigate } from 'react-router-dom';
import { getFilteredOrderData } from '../../services/apiService';
import ThemeToggleButton from '../../components/ThemeToggleButton';

const Order = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterOrderid, setFilterOrderid] = useState('');
  const [filterIdProfile, setFilterIdProfile] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterCupom, setFilterCupom] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userFuncao = user ? user.funcao : '';
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getFilteredOrderData(filterStartDate, filterEndDate);
      console.log('filterStartDate',filterStartDate)
      console.log('filterEndDate',filterEndDate)
      const resultWithIds = result.map(order => ({
        id: order.pedido,
        ...order,
      }));
      setData(resultWithIds);
      console.log('Dados recebidos:', resultWithIds);
    } catch (error) {
      setError('Erro ao buscar dados de pedidos.');
      console.error('Erro ao buscar dados de pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

// Função para aplicar filtros aos dados
const applyFilters = () => {
  let filtered = data;

  // Aplicar filtro de Order ID
  if (filterOrderid) {
    filtered = filtered.filter(order =>
      String(order.pedido).toLowerCase().includes(filterOrderid.toLowerCase())
    );
  }

  // Aplicar filtro de Profile ID
  if (filterIdProfile) {
    filtered = filtered.filter(order =>
      String(order.id_cliente).toLowerCase().includes(filterIdProfile.toLowerCase())
    );
  }

  // Aplicar filtro de data
  // if (filterStartDate && filterEndDate) {
  //   filtered = filtered.filter(order =>
  //     new Date(order.data_submissao) >= new Date(filterStartDate) &&
  //     new Date(order.data_submissao) <= new Date(filterEndDate)
  //   );
  // }

  // Aplicar filtro de cupom
  if (filterCupom) {
    filtered = filtered.filter(order =>
      order.cupom_vendedora &&
      order.cupom_vendedora.toLowerCase().includes(filterCupom.toLowerCase())
    );
  }

  setFilteredData(filtered);
  console.log('filteredData após filtros:', filtered);
};

useEffect(() => {
  applyFilters();
}, [data, filterOrderid, filterIdProfile,  filterCupom]);


  const handleSearch = () => {
    fetchData();
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInsert = () => {
    navigate('/order/create');
  };


  const totalPedidos = filteredData.length;

  const totalItens = filteredData.reduce((acc, order) => {
    const totalItensValue = Number(order.total_itens);
    return acc + (isNaN(totalItensValue) ? 0 : totalItensValue);
  }, 0);

  const valorBrutoTotal = filteredData.reduce((acc, order) => {
    const valorBrutoValue = parseFloat(order.valor_bruto.replace(',', '.')) || 0;
    return acc + valorBrutoValue;
  }, 0).toFixed(2);
  const valorDescontoTotal = filteredData.reduce((acc, order) => {
    const valorDescontoValue = parseFloat(order.valor_desconto.replace(',', '.')) || 0;
    return acc + valorDescontoValue;
  }, 0).toFixed(2);
  const valorFreteTotal = filteredData.reduce((acc, order) => {
    const valorFreteValue = parseFloat(order.valor_frete.replace(',', '.')) || 0;
    return acc + valorFreteValue;
  }, 0).toFixed(2);
  const valorPagoTotal = filteredData.reduce((acc, order) => {
    const valorPagoValue = parseFloat(order.valor_pago.replace(',', '.')) || 0;
    return acc + valorPagoValue;
  }, 0).toFixed(2);
  const valorTotalComissional = valorPagoTotal - valorFreteTotal






  const columns = [
    { field: 'pedido', headerName: 'Pedido', width: 150 },
    {
      field: 'data_submissao',
      headerName: 'Data de Submissão',
      width: 180,
      valueFormatter: (params) => {
        const dateValue = params;

        if (!dateValue) return 'Data não disponível';

        try {
          const [year, month, day] = dateValue.split('-');
          const formattedDate = `${day}/${month}/${year}`;
          return formattedDate;
        } catch (e) {
          console.error('Erro ao formatar data:', e);
          return 'Data inválida';
        }
      },
    },
    {
      field: 'hora_submissao',
      headerName: 'Hora de Submissão',
      width: 180,
      valueFormatter: (params) => {
        if (params) {
          const timeValue = params;
          if (typeof timeValue === 'string') {
            const [hours, minutes, seconds] = timeValue.split(':');
            const secondsValue = parseFloat(seconds.split('.')[0]);
            const formattedSeconds = secondsValue.toFixed(0).padStart(2, '0');
            return `${hours}:${minutes}:${formattedSeconds}`;
          }
        }
        return 'Hora não disponível';
      },
      sortComparator: (v1, v2) => v1.localeCompare(v2),
    },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'total_itens', headerName: 'Total Itens', width: 120 },
    { field: 'envio', headerName: 'Envio', width: 120 },
    { field: 'idloja', headerName: 'ID Loja', width: 120 },
    { field: 'site', headerName: 'Site', width: 180 },
    { field: 'valor_bruto', headerName: 'Valor Bruto', width: 150 },
    { field: 'valor_desconto', headerName: 'Valor Desconto', width: 150 },
    { field: 'valor_frete', headerName: 'Valor Frete', width: 150 },
    { field: 'valor_pago', headerName: 'Valor Pago', width: 150 },
    { field: 'cupom', headerName: 'Cupom', width: 150 },
    { field: 'cupom_vendedora', headerName: 'Cupom Vendedora', width: 180 },
    { field: 'metodo_pagamento', headerName: 'Método de Pagamento', width: 180 },
    { field: 'parcelas', headerName: 'Parcelas', width: 120 },
    { field: 'id_cliente', headerName: 'ID Cliente', width: 150 }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarMenu open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Box position="absolute" top={16} right={16}>
          <ThemeToggleButton toggleTheme={toggleTheme} />
        </Box>
        <Typography variant="h4">Pedidos</Typography>



        <Paper sx={{ mt: 2, p: 2 }}>
          <Grid container spacing={2}>
            <Grid container spacing={1} direction="row" alignItems="flex-start">
              <Grid item xs={12} sm={2} md={1}>
                <TextField
                  label="Filtrar por Pedido"
                  variant="filled"
                  value={filterOrderid}
                  onChange={(e) => setFilterOrderid(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ minWidth: 120 }}
                />
              </Grid>
              <Grid item xs={12} sm={2} md={1}>
                <TextField
                  label="Filtrar por Cliente"
                  variant="filled"
                  value={filterIdProfile}
                  onChange={(e) => setFilterIdProfile(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ minWidth: 120 }}
                />
              </Grid>
              <Grid item xs={12} sm={2} md={1}>
                <TextField
                  label="Data Inicial"
                  type="date"
                  variant="filled"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 120 }}
                />
              </Grid>
              <Grid item xs={12} sm={2} md={1}>
                <TextField
                  label="Data Final"
                  type="date"
                  variant="filled"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 120 }}
                />
              </Grid>
              {userFuncao !== 'Consultora' && (
                <Grid item xs={12} sm={2} md={1.2}>
                  <TextField
                    label="Filtrar por Cupom Vendedora"
                    variant="filled"
                    value={filterCupom}
                    onChange={(e) => setFilterCupom(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={2} md={1}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleSearch}
                >
                  Buscar
                </Button>
              </Grid>
            </Grid>
            {/* Boxes de Resumo */}
            <Grid container spacing={1} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={1}>
                <Paper sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h6">Total de Pedidos</Typography>
                  <Typography variant="h5">{totalPedidos}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Paper sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h6">Total de Itens</Typography>
                  <Typography variant="h5">{totalItens}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Paper sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h6">Valor Pago Total</Typography>
                  <Typography variant="h5">
                    {Number(valorPagoTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Paper sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h6">Valor Frete Total</Typography>
                  <Typography variant="h5">
                    {Number(valorFreteTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={1}>
                <Paper sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h6">Valor Comissional</Typography>
                  <Typography variant="h5">
                    {valorTotalComissional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

          </Grid>
        </Paper>

        {loading ? (
          <CircularProgress sx={{ mt: 2 }} />
        ) : (
          <div style={{ height: 600, width: '100%', overflowX: 'auto' }}>
            {error && <Alert severity="error">{error}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            <div style={{ width: 'max-content' }}>
              <DataGrid
                rows={filteredData}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableColumnMenu
                sortModel={[
                  { field: 'data_submissao', sort: 'asc' },
                  { field: 'hora_submissao', sort: 'asc' },
                ]}
              />
            </div>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default Order;
