import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, TextField, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SidebarMenu from '../../components/SidebarMenu';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { useNavigate } from 'react-router-dom';
import { getFilteredReconquestData } from '../../services/apiService';

const Reconquest = ({toggleTheme}) => {
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

  const fetchData = async () => {
    try {

      const result = await getFilteredReconquestData(filterStartDate, filterEndDate);
      console.log('Dados retornados pela API:', result);
      const resultWithIds = result.map(reconquest => ({
        id: reconquest.id_cliente,
        ...reconquest,
      }));
      setData(resultWithIds);
    } catch (error) {
      setError('Erro ao buscar dados de pedidos.');
      console.error('Erro ao buscar dados de pedidos:', error);
    } finally {
      setLoading(false);
    }
  };
  const applyFilters = () => {
    console.log('Dados originais:', data);
    let filtered = [...data];

    // Filtragem por Status
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
    

    console.log('Dados após aplicação dos filtros:', filtered);
    setFilteredData(filtered);
  };


  // useEffect(() => {
  //   fetchData();
  // }, [filterStartDate, filterEndDate]);

  useEffect(() => {
    applyFilters();
  }, [data, filterReconquestid, filterStartDate, filterEndDate, statusFilter,filterProfileId]);

  const handleSearch = () => {
    setLoading(true);
    fetchData();
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  // Função para manipular as mudanças de Status
  const handleStatusChange = (event) => {
    const value = event.target.value;

    // Se "Todos" está selecionado e o usuário seleciona algo diferente, desmarcamos "Todos"
    if (statusFilter.includes("Todos") && value.length > 1) {
      setStatusFilter(value.filter((status) => status !== "Todos"));
    } else if (value.includes("Todos")) {
      // Se "Todos" for selecionado, desmarca todos os outros e mantém apenas "Todos"
      setStatusFilter(["Todos"]);
    } else {
      // Atualiza o estado normalmente sem "Todos"
      setStatusFilter(value);
    }
  };


  const handleInsert = () => {
    navigate('/reconquest/create');
  };

  const columns = [
    { field: 'cupom_vendedora', headerName: 'Cliente', width: 150 },
    { field: 'id_cliente', headerName: 'Cliente', width: 150 },
    {
      field: 'min_data',
      headerName: 'Primeira compra do mês',
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
      field: 'last_order',
      headerName: 'Última compra',
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
                />
              </Grid>
              <Grid item  md={2}>
                <FormControl fullWidth variant="filled">
                  <InputLabel>Status</InputLabel>
                  <Select
                    multiple
                    value={statusFilter}
                    onChange={handleStatusChange}
                    renderValue={(selected) => selected.join(', ')}
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
              />
            </Grid>
           
              <Grid item xs={12} sm={12} md={1}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 1.5 }}
                  onClick={handleSearch}
                  fullWidth
                >
                  Buscar
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
              {console.log('Dados filtrados no DataGrid:', filteredData)}
              <DataGrid
                rows={filteredData}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                sortModel={[
                  {
                    field: 'min_data',
                    sort: 'asc', // ou 'desc' para ordem decrescente
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
