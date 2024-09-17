import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, TextField, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Modal } from '@mui/material';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import { DataGrid } from '@mui/x-data-grid';
import SidebarMenu from '../../components/SidebarMenu';
import { useNavigate } from 'react-router-dom';
import { getFilteredMetaData, deleteMeta, updateMeta } from '../../services/apiService';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import Cookies from 'js-cookie'; 

const Meta = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCupom, setFilterCupom] = useState('');
  const [filterMesAno, setFilterMesAno] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingMeta, setEditingMeta] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [metaInfo, setMetaInfo] = useState({});

  const navigate = useNavigate();
  const user = JSON.parse(Cookies.get('user'));


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getFilteredMetaData();

        setData(result);

        const uniqueData = result.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.cupom === value.cupom && t.mes_ano === value.mes_ano)
        );

        setFilteredData(uniqueData);
      } catch (error) {
        setError('Erro ao buscar dados de meta.');
        console.error('Erro ao buscar dados de meta:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterCupom, filterMesAno, data]);

  const applyFilters = () => {
    let filtered = data;

    if (filterCupom) {
      filtered = filtered.filter((item) =>
        item.cupom && item.cupom.toLowerCase().includes(filterCupom.toLowerCase())
      );
    }

    if (filterMesAno) {
      filtered = filtered.filter((item) =>
        item.mes_ano && item.mes_ano.toLowerCase().includes(filterMesAno.toLowerCase())
      );
    }

    const uniqueFilteredData = filtered.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.cupom === value.cupom && t.mes_ano === value.mes_ano)
    );

    setFilteredData(uniqueFilteredData);
  };


  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInsert = () => {
    navigate('/meta/create');
  };

  const handleEditClick = (item) => {
    setEditingMeta(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingMeta(null);
  };

  const handleSaveClick = async () => {
    if (editingMeta) {
      try {
        const updatedData = {
          meta: editingMeta.meta,
          porcentagem: editingMeta.porcentagem,
          valor: editingMeta.valor,
          mes_ano: editingMeta.mes_ano,
        };

        await updateMeta(editingMeta.cupom, updatedData);
        setSuccessMessage('Meta atualizado com sucesso.');

        const updatedMetaes = data.map((item) =>
          item.cupom === editingMeta.cupom ? { ...item, ...updatedData } : item
        );
        setData(updatedMetaes);
        setFilteredData(updatedMetaes);
      } catch (error) {
        setErrorMessage('Erro ao atualizar meta.');
        console.error('Erro ao atualizar meta:', error);
      } finally {
        handleCloseModal();
      }
    }
  };

  const deleteMetaById = async (item) => {
    try {
      const { cupom, porcentagem, valor, mes_ano } = item;
      await deleteMeta({ cupom, porcentagem, valor, mes_ano });
      setData(data.filter((dataItem) => dataItem.cupom !== item.cupom));
      setFilteredData(filteredData.filter((dataItem) => dataItem.cupom !== item.cupom));
      setSuccessMessage('Meta deletado com sucesso.');
    } catch (error) {
      setErrorMessage('Erro ao excluir meta.');
      console.error('Erro ao excluir meta:', error);
    }
  };

  const handleDelete = (item) => {
    if (window.confirm('Tem certeza de que deseja excluir este meta?')) {
      deleteMetaById(item);
    }
  };

  const columns = [
    {
      field: 'colaborador_nome',
      headerName: 'Nome',
      width: 150,
      sortable: true,

    },
    {
      field: 'cupom',
      headerName: 'Cupom',
      width: 150,
      sortable: true,

    },
    {
      field: 'mes_ano',
      headerName: 'Mes Ano',
      width: 150,
      sortable: true
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 140,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleOpen(params)}
          sx={{
            backgroundColor: 'gray',
            color: 'white',
            borderColor: 'gray',
            '&:hover': {
              backgroundColor: 'darkgray',
            },
            '&:active': {
              backgroundColor: 'firebrick',
            },
            '&:focus': {
              outline: 'none',
              borderColor: 'gray',
            }
          }}
        >
          <ExpandCircleDownOutlinedIcon sx={{ mr: 1 }} />
          Metas
        </Button>
      ),
    },
  ];





  const handleOpen = (params) => {
    const selectedMeta = data.filter(
      (meta) => meta.cupom === params.row.cupom && meta.mes_ano === params.row.mes_ano
    );
    const sortedMetaInfo = [...selectedMeta].sort((a, b) => a.porcentagem - b.porcentagem);
    setMetaInfo(sortedMetaInfo);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);















  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarMenu open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Box position="absolute" top={16} right={16}>
          <ThemeToggleButton toggleTheme={toggleTheme} />
        </Box>
        <Typography variant="h4">Meta</Typography>
        {user && user.funcao !== 'Consultora' && (
          <Button variant="contained" color="primary" sx={{
            mt: 2,
            backgroundColor: '#45a049',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#388e3c',
            }
          }} onClick={handleInsert}>
            Inserir
          </Button>)}
        <Paper sx={{ mt: 2, p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Filtrar por Cupom"
                variant="filled"
                value={filterCupom}
                onChange={(e) => setFilterCupom(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Filtrar por Mês-Ano"
                variant="filled"
                value={filterMesAno}
                onChange={(e) => setFilterMesAno(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
          </Grid>
        </Paper>
        {loading ? (
          <CircularProgress sx={{ mt: 3 }} />
        ) : error ? (
          <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
        ) : (
          <div style={{ height: 600, width: '100%', marginTop: 20 }}>
            <DataGrid rows={filteredData}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              sortModel={[{ field: 'cupom', sort: 'asc' }]} />
          </div>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Editar Meta</DialogTitle>
          <DialogContent>
            {editingMeta && (
              <>
                <TextField
                  margin="dense"
                  label="Cupom"
                  fullWidth
                  variant="outlined"
                  value={editingMeta.cupom}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Mês/Ano"
                  fullWidth
                  variant="outlined"
                  value={editingMeta.mes_ano}
                  disabled
                />
                <TextField
                  margin="dense"
                  label="Nome"
                  fullWidth
                  variant="outlined"
                  value={editingMeta.meta}
                  onChange={(e) => setEditingMeta({ ...editingMeta, meta: e.target.value })}
                />
                <TextField
                  margin="dense"
                  label="Porcentagem"
                  fullWidth
                  variant="outlined"
                  value={editingMeta.porcentagem}
                  onChange={(e) => setEditingMeta({ ...editingMeta, porcentagem: e.target.value })}
                />
                <TextField
                  margin="dense"
                  label="Valor"
                  fullWidth
                  variant="outlined"
                  value={editingMeta.valor}
                  onChange={(e) => setEditingMeta({ ...editingMeta, valor: e.target.value })}
                />

              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} sx={{
              backgroundColor: '#d32f2f',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#d32f2f',
              }
            }}>Cancelar</Button>
            <Button onClick={handleSaveClick} sx={{
              backgroundColor: '#45a049',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#388e3c',
              }
            }}>Salvar</Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            p: 3,
            boxShadow: 24,
            borderRadius: 1
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>Meta Detalhes</Typography>
          {metaInfo.length > 0 ? (
            metaInfo.map((meta, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      label="Meta"
                      value={meta.meta}
                      fullWidth
                      size="small"
                      margin="dense"
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Porcentagem"
                      value={meta.porcentagem}
                      fullWidth
                      size="small"
                      margin="dense"
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Valor"
                      value={meta.valor}
                      fullWidth
                      size="small"
                      margin="dense"
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Box>
            ))
          ) : (
            <Typography>Sem informações de meta disponíveis.</Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
            sx={{
              mt: 2,
              backgroundColor: 'red',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkred',
              },
              '&:active': {
                backgroundColor: 'firebrick',
              }
            }}
          >
            Fechar
          </Button>
        </Box>
      </Modal>

    </Box>
  );
};

export default Meta;
