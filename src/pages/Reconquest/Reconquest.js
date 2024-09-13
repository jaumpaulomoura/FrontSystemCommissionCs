import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SidebarMenu from '../../components/SidebarMenu';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { useNavigate } from 'react-router-dom';
import { getFilteredReconquestData } from '../../services/apiService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reconquest = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterReconquestid, setFilterReconquestid] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [filterProfileId, setFilterProfileId] = useState('');

  const navigate = useNavigate();
  const formatDate = (dateString) => {
    try {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return 'Data inválida';
    }
  };
  const fetchData = async () => {
    try {

      const result = await getFilteredReconquestData(filterStartDate, filterEndDate);
      const resultWithIds = result.map(reconquest => ({
        id: reconquest.id_cliente,
        ...reconquest,
      }));
      setData(resultWithIds);
      console.log('resultWithIds', resultWithIds)
    } catch (error) {
      setError('Erro ao buscar dados de pedidos.');
      console.error('Erro ao buscar dados de pedidos:', error);
    } finally {
      setLoading(false);
    }
  };
  const applyFilters = () => {
    let filtered = [...data];

    if (statusFilter.includes("Todos") || statusFilter.length === 0) {

      filtered = [...data];
    } else {
      filtered = filtered.filter((reconquest) =>
        statusFilter.includes(reconquest.Status)
      );
    }
    if (filterProfileId) {
      filtered = filtered.filter((item) =>
        item.id_cliente &&
        item.id_cliente.toLowerCase().includes(filterProfileId.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };



  useEffect(() => {
    applyFilters();
  }, [data, filterReconquestid, statusFilter, filterProfileId]);

  const handleSearch = () => {
    setLoading(true);
    fetchData();
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleStatusChange = (event) => {
    const value = event.target.value;

    if (statusFilter.includes("Todos") && value.length > 1) {
      setStatusFilter(value.filter((status) => status !== "Todos"));
    } else if (value.includes("Todos")) {
      setStatusFilter(["Todos"]);
    } else {
      setStatusFilter(value);
    }
  };


  const handleInsert = () => {
    navigate('/reconquest/create');
  };

  const columns = [
    { field: 'nome', headerName: 'Nome', width: 150 },
    { field: 'cupom_vendedora', headerName: 'Cliente', width: 150 },
    { field: 'id_cliente', headerName: 'Cliente', width: 150 },
    {
      field: 'min_data',
      headerName: 'Primeira compra do mês',
      width: 180,
      valueFormatter: (params) => {
        const dateValue = params;
        if (!dateValue) return '';
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
      field: 'last_order',
      headerName: 'Última compra',
      width: 180,
      valueFormatter: (params) => {
        const dateValue = params;
        if (!dateValue) return '';
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
    { field: 'dias', headerName: 'Dias', width: 120 },
    { field: 'Status', headerName: 'Status', width: 120 },

    {
      field: 'min_data_mes_anterior', headerName: 'Última compra do mês anterior', width: 180, valueFormatter: (params) => {
        const dateValue = params;
        if (!dateValue) return '';
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
      field: 'last_order_mes_anterior', headerName: 'Última compra antes do mês anterior', width: 180, valueFormatter: (params) => {
        const dateValue = params;
        if (!dateValue) return '';
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
    { field: 'dias_mes_anterior', headerName: 'Dias até o mês anterior', width: 180 },
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
    doc.text('Relatório de Reconquista', 14, 22);
    // Define as colunas e os dados
    const columns = [
      { header: 'Nome', dataKey: 'nome' },
      { header: 'Cupom', dataKey: 'cupom_vendedora' },
      { header: 'ID Cliente', dataKey: 'id_cliente' },
      { header: 'Primeira Compra do Mês', dataKey: 'min_data' },
      { header: 'Última Compra', dataKey: 'last_order' },
      { header: 'Dias', dataKey: 'dias' },
      { header: 'Status', dataKey: 'Status' },
      { header: 'Última Compra do Mês Anterior', dataKey: 'min_data_mes_anterior' },
      { header: 'Última Compra Antes do Mês Anterior', dataKey: 'last_order_mes_anterior' },
      { header: 'Dias Até o Mês Anterior', dataKey: 'dias_mes_anterior' },
    ];
    const columnStyles = {
      nome: { cellWidth: 40 }
    }
    const rows = data.map(row => ({
      nome: row.nome,
      cupom_vendedora: row.cupom_vendedora,
      id_cliente: row.id_cliente,
      min_data: row.min_data ? formatDate(row.min_data) : '',
      last_order: row.last_order ? formatDate(row.last_order) : '',
      dias: row.dias,
      Status: row.Status,
      min_data_mes_anterior: row.min_data_mes_anterior ? formatDate(row.min_data_mes_anterior) : '',
      last_order_mes_anterior: row.last_order_mes_anterior ? formatDate(row.last_order_mes_anterior) : '',
      dias_mes_anterior: row.dias_mes_anterior,
    }));

    // Adiciona a tabela ao PDF
    autoTable(doc, {
      columns: columns,
      body: rows,
      columnStyles: columnStyles,
      startY: 30,
      headStyles: {
        fillColor: [41, 128, 186],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
        cellPadding: 2,
        valign: 'middle',
        halign: 'center',
      },
    });

    // Salva o PDF
    doc.save('relatorio_reconquista.pdf');
  };





  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarMenu open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Box position="absolute" top={16} right={16}>
          <ThemeToggleButton toggleTheme={toggleTheme} />
        </Box>
        <Typography variant="h4">Reconquista</Typography>

        <Paper sx={{ mt: 2, p: 2 }}>
          <Grid container spacing={2}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Data Inicial"
                  type="date"
                  variant="filled"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{ mt: 1.5,ml:1.5 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Data Final"
                  type="date"
                  variant="filled"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{ mt: 1.5,ml:1.5  }}
                />
              </Grid>
              <Grid item md={2}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Status</InputLabel>
                  <Select
                    multiple
                    value={statusFilter}
                    onChange={handleStatusChange}
                    renderValue={(selected) => selected.join(', ')}
                    sx={{ mt: 1.5, height:'47px',ml:1.5  }}
                  >
                    <MenuItem value="Todos">Todos</MenuItem>
                    <MenuItem value="Reconquista">Reconquista</MenuItem>
                    <MenuItem value="Repagar">Repagar</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Filtrar por Cliente"
                  variant="filled"
                  value={filterProfileId}
                  onChange={(e) => setFilterProfileId(e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ mt: 1.5,ml:1.5  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={1}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1.5,ml:1.5  }}
                  onClick={handleSearch}
                  fullWidth
                >
                  Buscar
                </Button>
              </Grid>
              <Grid item xs={12} sm={12} md={2}>
                <Button
                  onClick={() => generatePDF(filteredData)} // Passe os dados filtrados para a função
                  sx={{
                    mt: 1.5,
                    ml:1.5, 
                    backgroundColor: 'green',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'darkgreen',
                    },
                    height: '36px',
                    width: '70%'
                  }}
                >
                  Exportar PDF
                </Button>
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
                disableSelectionOnClick
                sortModel={[
                  {
                    field: 'min_data',
                    sort: 'asc',
                  },
                ]}
                sx={{
                  '& .MuiDataGrid-cell': {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                }}
              />

            </div>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default Reconquest;
















