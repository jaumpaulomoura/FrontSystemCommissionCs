import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, TextField, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SidebarMenu from '../../components/SidebarMenu';
import { useNavigate } from 'react-router-dom';
import { getFilteredOrderData } from '../../services/apiService';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const user = JSON.parse(Cookies.get('user'));
  const userFuncao = user ? user.funcao : '';
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getFilteredOrderData(filterStartDate, filterEndDate);
      console.log('filterStartDate', filterStartDate)
      console.log('filterEndDate', filterEndDate)
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
  }, [data, filterOrderid, filterIdProfile, filterCupom]);


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
      headerName: 'Data',
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
      headerName: 'Hora',
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
    { field: 'id_cliente', headerName: 'Cliente', width: 150 }
  ];








  const generatePDF = (data) => {
    const doc = new jsPDF('landscape');
    doc.setFont("Helvetica", "normal");

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const formattedTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    doc.setFontSize(8);
    doc.text(`Data: ${formattedDate}`, doc.internal.pageSize.width - 10, 7, { align: 'right' });
    doc.text(`Hora: ${formattedTime}`, doc.internal.pageSize.width - 10, 10, { align: 'right' });
    doc.setFontSize(14);
    doc.text('Relatório de Pedidos', 18, 24);



    const blockData = [
      ['Total de Pedidos', totalPedidos],
      ['Total de Itens', totalItens],
      ['Valor Pago Total', valorPagoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })],
      ['Valor Frete Total', valorFreteTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })],
      ['Valor Comissional', valorTotalComissional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })]
    ];

    // Estiliza os blocos no PDF
    let startY = 35; // Ajuste conforme necessário
    const blockWidth = 50;
    const blockHeight = 20;
    const blockRight = 5;
    const initialX = 14;

    blockData.forEach((block, index) => {
      const [label, value] = block;
      const posX = initialX + (index * (blockWidth + blockRight)); // Espaçamento entre os blocos

      // Verifica se a posição X está dentro da largura da página
      if (posX + blockWidth > doc.internal.pageSize.width - blockRight) {
        doc.addPage();
        startY = 20; // Reset startY para a nova página
      }

      doc.setFillColor(230, 230, 230); // Cor de fundo
      doc.rect(posX, startY, blockWidth, blockHeight, 'F'); // Desenha o bloco com fundo

      doc.setTextColor(0);
      doc.setFontSize(10);
      doc.text(label, posX + 5, startY + 10); // Label do bloco

      doc.setFontSize(12);
      doc.setTextColor(0, 102, 204); // Cor do valor
      doc.text(value.toString(), posX + 5, startY + 15); // Valor do bloco
    });
    // Define as colunas e os dados
    let tableStartY = startY + blockHeight + 10;
    const columns = [
      { header: 'Pedido', dataKey: 'pedido' },
      {
        header: 'Data',
        dataKey: 'data_submissao',
        valueFormatter: (params) => {
          const dateValue = params.data_submissao;
          if (!dateValue) return 'Data não disponível';

          try {
            const dateObj = new Date(dateValue);
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();

            return `${day}/${month}/${year}`;
          } catch (e) {
            console.error('Erro ao formatar data:', e);
            return 'Data inválida';
          }
        }
      },
      {
        header: 'Hora',
        dataKey: 'hora_submissao',
        valueFormatter: (params) => {
          const timeValue = params.hora_submissao;

          if (!timeValue) return 'Hora não disponível';

          try {
            // Verifica se é um número simples (ex: 4000) e trata como inválido
            if (!isNaN(timeValue) && typeof timeValue === 'number') {
              return 'Hora inválida';
            }

            // Remove frações de segundos (caso venha no formato 16:12:12.38)
            const cleanedTimeValue = timeValue.split('.')[0];

            // Verifica se o valor está no formato de hora (HH:MM:SS)
            if (/^\d{2}:\d{2}(:\d{2})?$/.test(cleanedTimeValue)) {
              return cleanedTimeValue; // Retorna a hora formatada
            }

            // Caso contrário, tenta criar um objeto de data a partir do valor ISO
            const dateObj = new Date(timeValue);

            // Verifica se a data é válida
            if (isNaN(dateObj.getTime())) {
              throw new Error('Data inválida');
            }

            // Extrai horas, minutos e segundos
            const hours = String(dateObj.getUTCHours()).padStart(2, '0');
            const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0');
            const seconds = String(dateObj.getUTCSeconds()).padStart(2, '0');

            return `${hours}:${minutes}:${seconds}`;
          } catch (e) {
            console.error('Erro ao formatar hora:', e);
            return 'Hora inválida';
          }
        },
        sortComparator: (v1, v2) => v1.localeCompare(v2)
      }


      ,
      { header: 'Status', dataKey: 'status' },
      { header: 'Total Itens', dataKey: 'total_itens' },
      { header: 'Envio', dataKey: 'envio' },
      { header: 'ID Loja', dataKey: 'idloja' },
      { header: 'Site', dataKey: 'site' },
      { header: 'Valor Bruto', dataKey: 'valor_bruto' },
      { header: 'Valor Desconto', dataKey: 'valor_desconto' },
      { header: 'Valor Frete', dataKey: 'valor_frete' },
      { header: 'Valor Pago', dataKey: 'valor_pago' },
      // { header: 'Cupom', dataKey: 'cupom' },
      { header: 'Cupom Vendedora', dataKey: 'cupom_vendedora' },
      { header: 'Método de Pagamento', dataKey: 'metodo_pagamento' },
      { header: 'Parcelas', dataKey: 'parcelas' },
      { header: 'Cliente', dataKey: 'id_cliente' },
    ];


    const columnStyles = {
      nome: { cellWidth: 40 }
    }
    const rows = data.map(row => ({
      pedido: row.pedido,
      data_submissao: columns.find(col => col.dataKey === 'data_submissao').valueFormatter({ data_submissao: row.data_submissao }),
      hora_submissao: columns.find(col => col.dataKey === 'hora_submissao').valueFormatter({ hora_submissao: row.hora_submissao }),
      status: row.status,
      total_itens: row.total_itens,
      envio: row.envio,
      idloja: row.idloja,
      site: row.site,
      valor_bruto: row.valor_bruto,
      valor_desconto: row.valor_desconto,
      valor_frete: row.valor_frete,
      valor_pago: row.valor_pago,
      // cupom: row.cupom,
      cupom_vendedora: row.cupom_vendedora,
      metodo_pagamento: row.metodo_pagamento,
      parcelas: row.parcelas,
      id_cliente: row.id_cliente,

    }));

    // Adiciona a tabela ao PDF
    autoTable(doc, {
      columns: columns,
      body: rows,
      columnStyles: columnStyles,
      startY: tableStartY,
      headStyles: {
        fillColor: [41, 128, 186],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 8,
        cellPadding: 1,
        valign: 'middle',
        halign: 'center',
      },
    });

    // Salva o PDF
    doc.save('relatorio_pedidos.pdf');
  };




















  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%'

      }}
    >
      <SidebarMenu open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          maxWidth: '1500px', // Ajuste conforme necessário
          mx: 'auto', // Centraliza horizontalmente
          overflow: 'auto' // Adiciona rolagem se necessário
        }}
      >

        <Box position="absolute" top={16} right={16}>
          <ThemeToggleButton toggleTheme={toggleTheme} />
        </Box>
        <Typography variant="h4">Pedidos</Typography>


        <Box sx={{ width: '100%', maxWidth: '100%' }}>
          <Paper
            sx={{
              mt: 2,
              p: 2,
              maxWidth: '1500px', // Evita que o Paper ultrapasse o contêiner principal
              overflow: 'auto', // Permite rolar se o conteúdo exceder o tamanho
            }}
          >
            <Grid container spacing={2} direction="row" alignItems="flex-start">
              <Grid item xs={12} sm={4} md={2}>
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
              <Grid item xs={12} sm={4} md={2}>
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
              <Grid item xs={12} sm={4} md={2}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1.5, mb: 1, width: '100%' }}
                  onClick={handleSearch}
                >
                  Buscar
                </Button>
              </Grid>
            </Grid>

            <Grid container spacing={2} direction="row" alignItems="flex-start" sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4} md={2}>
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
              <Grid item xs={12} sm={4} md={2}>
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

              {userFuncao !== 'Consultora' && (
                <Grid item xs={12} sm={4} md={2}>
                  <TextField
                    label="Filtrar por Cupom Vendedora"
                    variant="filled"
                    value={filterCupom}
                    onChange={(e) => setFilterCupom(e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ minWidth: 120 }}
                  />
                </Grid>
              )}
            </Grid>

            {/* Boxes de Resumo */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4} md={2}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Total de Pedidos</Typography>
                  <Typography variant="h5">{totalPedidos}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Total de Itens</Typography>
                  <Typography variant="h5">{totalItens}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Valor Pago Total</Typography>
                  <Typography variant="h5">
                    {Number(valorPagoTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Valor Frete Total</Typography>
                  <Typography variant="h5">
                    {Number(valorFreteTotal).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4} md={2}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Valor Comissional</Typography>
                  <Typography variant="h5">
                    {valorTotalComissional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => generatePDF(filteredData)} // Passe os dados filtrados para a função
              sx={{
                mt: 1.5,
                backgroundColor: '#45a049',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'darkgreen',
                },
                height: '36px',
                width: '10%', // Diminuir a largura do botão
              }}
            >
              Exportar PDF
            </Button>
          </Grid>
        </Box>
        <Grid container sx={{ mt: 2 }}>
          {loading ? (
            <CircularProgress sx={{ mt: 2 }} />
          ) : (
            <Grid item xs={12} sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
              {error && <Alert severity="error">{error}</Alert>}
              {successMessage && <Alert severity="success">{successMessage}</Alert>}
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              <Paper
                sx={{
                  flexGrow: 1,
                  minHeight: '400px', // Define a altura mínima para o Paper
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 2
                }}
              >
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                    <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                      <DataGrid
                        rows={filteredData}
                        columns={columns}
                        initialState={{
                          pagination: {
                            paginationModel: {
                              pageSize: 9,
                            },
                          },
                        }}
                        autoHeight
                        pageSizeOptions={[9]}
                        disableColumnMenu
                        sortModel={[
                          { field: 'data_submissao', sort: 'asc' },
                          { field: 'hora_submissao', sort: 'asc' },
                        ]}
                      />
                    </div>
                  </div>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>





      </Box>
    </Box>
  );
};

export default Order;
