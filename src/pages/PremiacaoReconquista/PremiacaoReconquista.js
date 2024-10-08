import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, TextField, Grid, Dialog, MenuItem, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { DataGrid } from '@mui/x-data-grid';
import SidebarMenu from '../../components/SidebarMenu';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { useNavigate } from 'react-router-dom';
import { getFilteredPremiacaoReconquistaData, deletePremiacaoReconquista, updatePremiacaoReconquista } from '../../services/apiService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '../../components/ToastProvider';

const PremiacaoReconquista = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDescricao, setFilterDescricao] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [filterValor, setFilterValor] = useState('');
  const { showToast } = useToast();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingPremiacaoReconquista, setEditingPremiacaoReconquista] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getFilteredPremiacaoReconquistaData();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        showToast('Erro ao buscar dados de Premiação Reconquista.', 'error');
        console.error('Erro ao buscar dados de Premiação Reconquista:', error);
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
    let filtered = [...data];
    if (filterDescricao) {
      filtered = filtered.filter((premiacaoReconquista) =>
        premiacaoReconquista.descricao.toLowerCase().includes(filterDescricao.toLowerCase())
      );
    }
    if (filterTime) {
      filtered = filtered.filter((premiacaoReconquista) =>
        premiacaoReconquista.time.toLowerCase().includes(filterTime.toLowerCase())
      );
    }
    if (filterValor) {
      filtered = filtered.filter((premiacaoReconquista) =>
        premiacaoReconquista.valor && premiacaoReconquista.valor.toString().toLowerCase().includes(filterValor.toLowerCase())
      );
    }
    filtered.sort((a, b) => a.minimo - b.minimo);

    setFilteredData(filtered);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInsert = () => {
    navigate('/premiacaoReconquista/create');
  };

  const handleEditClick = (premiacaoReconquista) => {
    setEditingPremiacaoReconquista(premiacaoReconquista);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingPremiacaoReconquista(null);
  };
  const handleSaveClick = () => {
    setOpenConfirmDialog(true); // Abrir modal de confirmação
  };
  const handleConfirmSave = async () => {
    if (editingPremiacaoReconquista) {
      // Validation logic
      if (!editingPremiacaoReconquista.descricao ||
        !editingPremiacaoReconquista.time ||
        editingPremiacaoReconquista.valor < 0 ||
        editingPremiacaoReconquista.minimo < 0 ||
        editingPremiacaoReconquista.maximo < 0) {
        showToast('Por favor, preencha todos os campos corretamente.', 'error');

        return; // Exit the function if validation fails
      }

      try {
        const updatedData = {
          descricao: editingPremiacaoReconquista.descricao,
          time: editingPremiacaoReconquista.time,
          valor: editingPremiacaoReconquista.valor,
          minimo: editingPremiacaoReconquista.minimo,
          maximo: editingPremiacaoReconquista.maximo,
        };

        await updatePremiacaoReconquista(editingPremiacaoReconquista.descricao, updatedData);
        showToast('PremiacaoReconquista atualizado com sucesso.', 'success');



        const updatedPremiacaoReconquistaes = data.map((item) =>
          item.descricao === editingPremiacaoReconquista.descricao ? { ...item, ...updatedData } : item
        );
        setData(updatedPremiacaoReconquistaes);
        setFilteredData(updatedPremiacaoReconquistaes);
      } catch (error) {
        showToast('Erro ao atualizar premiacao reconquista.', 'error');

        console.error('Erro ao atualizar Premiação Reconquista:', error);
      } finally {
        setOpenConfirmDialog(false);
        handleCloseModal();
      }
    }
  };
  const handleCancelConfirm = () => {
    setOpenConfirmDialog(false); // Fecha o modal de confirmação
  };


  const handleDelete = async () => {
    if (!itemToDelete) {
      console.log("Nenhum item para deletar."); // Log se não houver item para deletar
      return;
    }

    console.log("Item a ser deletado:", itemToDelete); // Log do item a ser deletado

    try {
      const { descricao, time, valor } = itemToDelete;
      await deletePremiacaoReconquista({ descricao, time, valor });

      const updatedData = data.filter((item) => item.id !== itemToDelete.id);
      setData(updatedData);
      setFilteredData(updatedData);

      showToast('Premiação Reconquista deletado com sucesso.', 'success');
    } catch (error) {
      showToast('Erro ao excluir Premiação Reconquista.', 'error');
      console.error('Erro ao excluir Premiação Reconquista:', error);
    } finally {
      closeDeleteDialog();
    }
  };

  const columns = [
    { field: 'descricao', headerName: 'Descricao', width: 180 },
    { field: 'time', headerName: 'Time', width: 150 },
    { field: 'minimo', headerName: 'Minimo', width: 150 },
    { field: 'maximo', headerName: 'Maximo', width: 150 },
    {
      field: 'valor',
      headerName: 'Valor',
      width: 200,
      valueFormatter: (params) => {
        // Convert the value to a number
        const numberValue = Number(params || 0);
    
        // Format with thousands separators and two decimal places
        const formattedValue = numberValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
    
        return `R$ ${formattedValue}`;
      }
    },
    
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
            // onClick={() => handleDelete(params.row)}
            onClick={() => openDeleteDialog(params.row)}
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
    doc.text('Relatório de Premiação Reconquista', 18, 24);
    // Define as colunas e os dados
    const columns = [
      { header: 'Descrição', dataKey: 'descricao' },
      { header: 'Time', dataKey: 'time' },
      { header: 'Minimo', dataKey: 'minimo' },
      { header: 'Maximo', dataKey: 'maximo' },
      { header: 'Valor', dataKey: 'valor' },

    ];


    const columnStyles = {
      nome: { cellWidth: 40 }
    }
    const rows = data.map(row => ({
      descricao: row.descricao,
      time: row.time,
      minimo: row.minimo,
      maximo: row.maximo,
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
    doc.save('relatorio_premiacao_reconquista.pdf');
  };

  const openDeleteDialog = (premiacaoReconquista) => {
    setItemToDelete(premiacaoReconquista); // Armazena o item selecionado
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null); // Reseta o item selecionado ao fechar o diálogo
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarMenu open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Box position="absolute" top={16} right={16}>
          <ThemeToggleButton toggleTheme={toggleTheme} />
        </Box>
        <Typography variant="h4">Premiação Reconquista</Typography>
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
              width: '10%', // Diminuir a largura do botãoF
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
            <DataGrid
              rows={filteredData}
              columns={columns}
              pageSize={5}
              components={{
                NoRowsOverlay: () => <div style={{ textAlign: 'center' }}>Sem dados</div>,
              }}
            />

          </div>
        )}
        {successMessage && <Alert severity="success" sx={{ mt: 3 }}>{successMessage}</Alert>}
        {errorMessage && <Alert severity="error" sx={{ mt: 3 }}>{errorMessage}</Alert>}
      </Box>
 


      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Editar Premiação Reconquista</DialogTitle>
        <DialogContent>
          {editingPremiacaoReconquista && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 3 }}>
              <TextField
                label="Descricao"
                variant="outlined"
                value={editingPremiacaoReconquista.descricao}
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
                  width: '400px',
                  height: '56px',
                  borderRadius: '8px',
                }}
              />
              <TextField
                label="Time"
                variant="outlined"
                value={editingPremiacaoReconquista.time}
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
                  width: '400px',
                  height: '56px',
                  borderRadius: '8px',
                }}
              />





              <TextField
                label="Minimo"
                name="minimo"
                value={editingPremiacaoReconquista.minimo}
                onChange={(e) => setEditingPremiacaoReconquista({ ...editingPremiacaoReconquista, minimo: e.target.value })}
                fullWidth
                margin="normal"
                variant="filled"
                type="number" // Adicionando o tipo number
                inputProps={{
                  min: 0, // Opcional: define o valor mínimo como 0
                  step: 1, // Apenas números inteiros
                }}
                sx={{
                  width: '400px',
                  height: '56px',
                  borderRadius: '8px',
                }}
              />

              <TextField
                label="Maximo"
                name="maximo"
                value={editingPremiacaoReconquista.maximo}
                onChange={(e) => setEditingPremiacaoReconquista({ ...editingPremiacaoReconquista, maximo: e.target.value })}
                fullWidth
                margin="normal"
                variant="filled"
                type="number" // Adicionando o tipo number
                inputProps={{
                  min: 0, // Opcional: define o valor mínimo como 0
                  step: 1, // Apenas números inteiros
                }}
                sx={{
                  width: '400px',
                  height: '56px',
                  borderRadius: '8px',
                }}
              />

              <TextField
                label="Valor"
                name="valor"
                value={editingPremiacaoReconquista.valor}
                onChange={(e) => {
                  const value = e.target.value;
                  // Utiliza expressão regular para permitir apenas números e até duas casas decimais
                  if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
                    setEditingPremiacaoReconquista({ ...editingPremiacaoReconquista, valor: value }); // Atualiza com o valor válido
                  }
                }}
                margin="normal"
                variant="filled"
                type="number" // Permite a entrada de números
                inputProps={{
                  step: "0.01", // Permite valores decimais
                }}
                sx={{
                  width: '400px',
                  height: '56px',
                  borderRadius: '8px',
                }}
              />
            </Box>

          )}
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
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
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Confirmar Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja deletar "{itemToDelete?.descricao}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              onClick={closeDeleteDialog}
              sx={{
                backgroundColor: 'red',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#d32f2f', // Um tom mais escuro de vermelho
                }
              }}
            >
              Cancelar
            </Button>
          </Box>
          <Box>
            <Button
              onClick={handleDelete}
              sx={{
                backgroundColor: '#45a049',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#388e3c', // Um tom mais escuro de verde
                }
              }}
            >
              Confirmar
            </Button>
          </Box>
        </DialogActions>

      </Dialog>



      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelConfirm}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirmação</DialogTitle>
        <DialogContent>
          <p>Tem certeza de que deseja salvar as alterações?</p>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button
            onClick={handleCancelConfirm}
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
            onClick={handleConfirmSave} // Realiza a ação de salvar
            sx={{
              backgroundColor: '#45a049',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#388e3c',
              }
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PremiacaoReconquista;
