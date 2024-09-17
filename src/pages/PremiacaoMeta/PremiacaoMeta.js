import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, TextField, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { DataGrid } from '@mui/x-data-grid';
import SidebarMenu from '../../components/SidebarMenu';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { useNavigate } from 'react-router-dom';
import { getFilteredPremiacaoMetaData, deletePremiacaoMeta, updatePremiacaoMeta } from '../../services/apiService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PremiacaoMeta = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDescricao, setFilterDescricao] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [filterValor, setFilterValor] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingPremiacaoMeta, setEditingPremiacaoMeta] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getFilteredPremiacaoMetaData();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        setError('Erro ao buscar dados de premiacaoMeta.');
        console.error('Erro ao buscar dados de premiacaoMeta:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterDescricao, filterTime, filterValor, data]);

  const applyFilters = () => {
    let filtered = data;
    if (filterDescricao) {
      filtered = filtered.filter((premiacaoMeta) =>
        premiacaoMeta.descricao.toLowerCase().includes(filterDescricao.toLowerCase())
      );
    }
    if (filterTime) {
      filtered = filtered.filter((premiacaoMeta) =>
        premiacaoMeta.time.toLowerCase().includes(filterTime.toLowerCase())
      );
    }
    if (filterValor) {
      filtered = filtered.filter((premiacaoMeta) =>
        premiacaoMeta.valor && premiacaoMeta.valor.toString().toLowerCase().includes(filterValor.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInsert = () => {
    navigate('/premiacaoMeta/create');
  };

  const handleEditClick = (premiacaoMeta) => {
    setEditingPremiacaoMeta(premiacaoMeta);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingPremiacaoMeta(null);
  };

  const handleSaveClick = async () => {
    if (editingPremiacaoMeta) {
      try {
        const updatedData = {
          descricao: editingPremiacaoMeta.descricao,
          time: editingPremiacaoMeta.time,
          valor: editingPremiacaoMeta.valor,
        };

        await updatePremiacaoMeta(editingPremiacaoMeta.descricao, updatedData);
        setSuccessMessage('PremiacaoMeta atualizado com sucesso.');

        const updatedPremiacaoMetaes = data.map((item) =>
          item.descricao === editingPremiacaoMeta.descricao ? { ...item, ...updatedData } : item
        );
        setData(updatedPremiacaoMetaes);
        setFilteredData(updatedPremiacaoMetaes);
      } catch (error) {
        setErrorMessage('Erro ao atualizar premiacaoMeta.');
        console.error('Erro ao atualizar premiacaoMeta:', error);
      } finally {
        handleCloseModal();
      }
    }
  };

  const handleDelete = (premiacaoMeta) => {
    if (window.confirm('Tem certeza de que deseja excluir este premiacaoMeta?')) {
      deletePremiacaoMetaById(premiacaoMeta);
    }
  };

  const deletePremiacaoMetaById = async (premiacaoMeta) => {
    try {
      const { descricao, time, valor } = premiacaoMeta;
      await deletePremiacaoMeta({ descricao, time, valor });
      setData(data.filter((item) => item.id !== premiacaoMeta.id));
      setFilteredData(filteredData.filter((item) => item.id !== premiacaoMeta.id));
      setSuccessMessage('PremiacaoMeta deletado com sucesso.');
    } catch (error) {
      setErrorMessage('Erro ao excluir premiacaoMeta.');
      console.error('Erro ao excluir premiacaoMeta:', error);
    }
  };

  const columns = [
    { field: 'descricao', headerName: 'Descricao', width: 150 },
    { field: 'time', headerName: 'Time', width: 150 },
    { field: 'valor', headerName: 'Valor', width: 200,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}` },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params) => (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#388e3c',
              color: '#fff',
              padding: '4px 8px',
              fontSize: '0.875rem',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              '&:hover': {
                backgroundColor: '#45a049',
              }
            }}
            onClick={() => handleEditClick(params.row)}
          >
            <FaPencilAlt style={{ fontSize: '1rem', marginRight: 4 }} />
            Editar
          </Button>
        </div>
      ),
    },
    {
      field: 'delete',
      headerName: '',
      width: 150,
      renderCell: (params) => (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'red',
              color: '#fff',
              padding: '4px 8px',
              fontSize: '0.875rem',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              '&:hover': {
                backgroundColor: '#d32f2f',
              }
            }}
            onClick={() => handleDelete(params.row)}
          >
            <FaTrashAlt style={{ fontSize: '1rem', marginRight: 4 }} />
            Excluir
          </Button>
        </div>
      ),
    },
  ];
  const generatePDF = (data) => {
    const doc = new jsPDF('portrait');
    doc.setFont("Helvetica", "normal");

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const formattedTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    doc.setFontSize(8);
    doc.text(`Data: ${formattedDate}`, doc.internal.pageSize.width - 10, 7, { align: 'right' });
    doc.text(`Hora: ${formattedTime}`, doc.internal.pageSize.width - 10, 10, { align: 'right' });
    doc.setFontSize(12);
    doc.text('Relatório de Premiação Metas', 18, 24);
    // Define as colunas e os dados
    const columns = [
      { header: 'Descrição', dataKey: 'descricao' },
      { header: 'Time', dataKey: 'time' },
      { header: 'Valor', dataKey: 'valor' },
 
    ];
    const columnStyles = {
      nome: { cellWidth: 40 }
    }
    const rows = data.map(row => ({
      descricao: row.descricao,
      time: row.time,
      valor: row.valor,
     
    }));
    const numberFormatter = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Adiciona a tabela ao PDF
    const formattedRows = rows.map((row) => ({
      ...row,
      valor: numberFormatter.format(row.valor), // Format 'valor' field
    }));
    
    autoTable(doc, {
      columns: columns,
      body: formattedRows, // Use formatted rows here
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
    doc.save('relatorio_colaborador.pdf');
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarMenu open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Box position="absolute" top={16} right={16}>
          <ThemeToggleButton toggleTheme={toggleTheme} />
        </Box>
        <Typography variant="h4">Premiação Meta</Typography>
        <Button variant="contained" color="primary" sx={{
          mt: 2,
          backgroundColor: '#45a049',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#388e3c',
          }
        }} onClick={handleInsert}>
          Inserir
        </Button>
        <Paper sx={{ mt: 2, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Filtrar por Descricao"
                variant="filled"
                value={filterDescricao}
                onChange={(e) => setFilterDescricao(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Filtrar por Time"
                variant="filled"
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Filtrar por Valor"
                variant="filled"
                value={filterValor}
                onChange={(e) => setFilterValor(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
        
          </Grid>
        </Paper>
        <Grid item xs={12} sm={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
        {loading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : error ? (
          <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
        ) : (
          <div style={{ height: 400, width: '100%', marginTop: 16 }}>
            <DataGrid rows={filteredData} columns={columns} pageSize={5} />
          </div>
        )}
        {successMessage && <Alert severity="success" sx={{ mt: 3 }}>{successMessage}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ mt: 3 }}>{errorMessage}</Alert>}
      </Box>
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Editar PremiacaoMeta</DialogTitle>
        <DialogContent>
          {editingPremiacaoMeta && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 3 }}>
              <TextField
                label="Descricao"
                variant="outlined"
                value={editingPremiacaoMeta.descricao}
                disabled
                fullWidth
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#000000',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#000000',
                  },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f5f5f5',
                    '& fieldset': {
                      borderColor: '#000000',
                    },
                    '&:hover fieldset': {
                      borderColor: '#000000',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#000000',
                    },
                  },
                }}
              />
              <TextField
                label="Time"
                variant="outlined"
                value={editingPremiacaoMeta.time}
                onChange={(e) => setEditingPremiacaoMeta({ ...editingPremiacaoMeta, time: e.target.value })}
                fullWidth
              />

              <TextField
                label="Valor"
                variant="outlined"
                value={editingPremiacaoMeta.valor}
                onChange={(e) => setEditingPremiacaoMeta({ ...editingPremiacaoMeta, valor: e.target.value })}
                fullWidth
              />
              
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseModal}
            sx={{
              backgroundColor: '#d32f2f',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#d32f2f',
              }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveClick}
            sx={{
              backgroundColor: '#45a049',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#388e3c',
              }
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PremiacaoMeta;
