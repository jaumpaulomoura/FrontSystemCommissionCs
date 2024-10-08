import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, TextField, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { DataGrid } from '@mui/x-data-grid';
import SidebarMenu from '../../components/SidebarMenu';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { useNavigate } from 'react-router-dom';
import { getColaboradorData, deleteColaborador, updateColaborador } from '../../services/apiService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '../../components/ToastProvider';


const Colaborador = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCupom, setFilterCupom] = useState('');
  const [filterNome, setFilterNome] = useState('');
  const [filterFuncao, setFilterFuncao] = useState('');
  const [filterEmail, setFilterEmail] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingColaborador, setEditingColaborador] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { showToast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getColaboradorData();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        showToast('Erro ao buscar dados de colaborador.','error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterCupom, filterNome, filterFuncao, filterTime, filterEmail, data]);

  const applyFilters = () => {
    let filtered = [...data];
    if (filterCupom) {
      filtered = filtered.filter((colaborador) =>
        colaborador.cupom.toLowerCase().includes(filterCupom.toLowerCase())
      );
    }
    if (filterNome) {
      filtered = filtered.filter((colaborador) =>
        colaborador.nome.toLowerCase().includes(filterNome.toLowerCase())
      );
    }
    if (filterEmail) {
      filtered = filtered.filter((colaborador) =>
        colaborador.email.toLowerCase().includes(filterEmail.toLowerCase())
      );
    }
    if (filterFuncao) {
      filtered = filtered.filter((colaborador) =>
        colaborador.funcao.toLowerCase().includes(filterFuncao.toLowerCase())
      );
    }
    if (filterTime) {
      filtered = filtered.filter((colaborador) =>
        colaborador.time.toLowerCase().includes(filterTime.toLowerCase())
      );
    }
    filtered.sort((a, b) => a.nome.localeCompare(b.nome));

    setFilteredData(filtered);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInsert = () => {
    navigate('/colaborador/create');
  };

  const handleEditClick = (colaborador) => {
    setEditingColaborador(colaborador);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingColaborador(null);
  };

  const handleSaveClick = async () => {
    if (editingColaborador) {
      try {
        const updatedData = {
          nome: editingColaborador.nome,
          sobrenome: editingColaborador.sobrenome,
          funcao: editingColaborador.funcao,
          time: editingColaborador.time,
          email: editingColaborador.email,
          password: editingColaborador.password,
        };

        await updateColaborador(editingColaborador.cupom, updatedData);
        setSuccessMessage('Colaborador atualizado com sucesso.');

        const updatedColaboradores = data.map((item) =>
          item.cupom === editingColaborador.cupom ? { ...item, ...updatedData } : item
        );
        setData(updatedColaboradores);
        setFilteredData(updatedColaboradores);
      } catch (error) {
        showToast('Erro ao atualizar colaborador.','error');
      } finally {
        handleCloseModal();
      }
    }
  };

  const handleDelete = (colaborador) => {
    if (window.confirm('Tem certeza de que deseja excluir este colaborador?')) {
      deleteColaboradorById(colaborador);
    }
  };

  const deleteColaboradorById = async (colaborador) => {
    try {
      const { cupom, nome, funcao, time } = colaborador;
      await deleteColaborador({ cupom, nome, funcao, time });
      setData(data.filter((item) => item.id !== colaborador.id));
      setFilteredData(filteredData.filter((item) => item.id !== colaborador.id));
      showToast('Colaborador deletado com sucesso.','success');
    } catch (error) {
      showToast('Erro ao excluir colaborador.','error');
    }
  };

  const columns = [
    { field: 'cupom', headerName: 'Cupom', width: 150 },
    { field: 'nome', headerName: 'Nome', width: 150 },
    { field: 'sobrenome', headerName: 'Sobrenome', width: 150 },

    { field: 'funcao', headerName: 'Função', width: 200 },
    { field: 'time', headerName: 'Time', width: 150 },
    { field: 'email', headerName: 'Email', width: 150 },
    {
      field: 'actions',
      headerName: '',
      width: 150,
      renderCell: (params) => (<div style={{
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
        </Button> </div>
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
    const doc = new jsPDF('landscape');
    doc.setFont("Helvetica", "normal");

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const formattedTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    doc.setFontSize(8);
    doc.text(`Data: ${formattedDate}`, doc.internal.pageSize.width - 10, 7, { align: 'right' });
    doc.text(`Hora: ${formattedTime}`, doc.internal.pageSize.width - 10, 10, { align: 'right' });
    doc.setFontSize(12);
    doc.text('Relatório de Colaboradores', 18, 24);
    // Define as colunas e os dados
    const columns = [
      { header: 'Cupom', dataKey: 'cupom' },
      { header: 'Nome', dataKey: 'nome' },
      { header: 'Sobrenome', dataKey: 'sobrenome' },
      { header: 'Função', dataKey: 'funcao' },
      { header: 'Time', dataKey: 'time' },
      { header: 'Email', dataKey: 'email' }
    ];
    const columnStyles = {
      nome: { cellWidth: 40 }
    }
    const rows = data.map(row => ({
      cupom: row.cupom ? row.cupom : '',
      nome: row.nome,
      sobrenome: row.sobrenome,
      funcao: row.funcao,
      time: row.time,
      email: row.email,

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
    doc.save('relatorio_colaborador.pdf');
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarMenu open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Box position="absolute" top={16} right={16}>
          <ThemeToggleButton toggleTheme={toggleTheme} />
        </Box>
        <Typography variant="h4">Colaborador</Typography>
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
                label="Filtrar por Cupom"
                variant="filled"
                value={filterCupom}
                onChange={(e) => setFilterCupom(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Filtrar por Nome"
                variant="filled"
                value={filterNome}
                onChange={(e) => setFilterNome(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Filtrar por Função"
                variant="filled"
                value={filterFuncao}
                onChange={(e) => setFilterFuncao(e.target.value)}
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
                label="Filtrar por Email"
                variant="filled"
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
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
        <DialogTitle>Editar Colaborador</DialogTitle>
        <DialogContent>
          {editingColaborador && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 3 }}>
              <TextField
                label="Cupom"
                variant="outlined"
                value={editingColaborador.cupom}
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
                label="Nome"
                variant="outlined"
                value={editingColaborador.nome}
                onChange={(e) => setEditingColaborador({ ...editingColaborador, nome: e.target.value })}
                fullWidth
              />
              <TextField
                label="SobreNome"
                variant="outlined"
                value={editingColaborador.sobrenome}
                onChange={(e) => setEditingColaborador({ ...editingColaborador, sobrenome: e.target.value })}
                fullWidth
              />
              <TextField
                label="Função"
                variant="outlined"
                value={editingColaborador.funcao}
                onChange={(e) => setEditingColaborador({ ...editingColaborador, funcao: e.target.value })}
                fullWidth
              />
              <TextField
                label="Time"
                variant="outlined"
                value={editingColaborador.time}
                onChange={(e) => setEditingColaborador({ ...editingColaborador, time: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email"
                variant="outlined"
                value={editingColaborador.email}
                onChange={(e) => setEditingColaborador({ ...editingColaborador, email: e.target.value })}
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

export default Colaborador;
