import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, TextField, Grid, Dialog, DialogActions, DialogContent, DialogTitle, Modal } from '@mui/material';
import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import { DataGrid } from '@mui/x-data-grid';
import SidebarMenu from '../../components/SidebarMenu';
import { useNavigate } from 'react-router-dom';
import { getFilteredMetaData, deleteMeta, updateMeta } from '../../services/apiService';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Meta = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filtereds, setFiltereds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCupom, setFilterCupom] = useState('');
  const [filterNome, setFilterNome] = useState('');
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
  }, [filterCupom, filterMesAno, filterNome, data]);

  const applyFilters = () => {
    let filtered = data;
    if (filterNome) {
      filtered = filtered.filter((item) =>
        item.colaborador_nome && item.colaborador_nome.toLowerCase().includes(filterNome.toLowerCase())
      );
    }
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
    setFiltereds(filtered)
  };
  const dadosGroup = [];

  filtereds.reduce((acc, item) => {
    let existente = dadosGroup.find(entry =>
      entry.cupom === item.cupom && entry.colaborador_nome === item.colaborador_nome && entry.mes_ano === item.mes_ano
    );

    if (!existente) {
      existente = {
        colaborador_nome: item.colaborador_nome,
        cupom: item.cupom,
        mes_ano: item.mes_ano,
        metas: []
      };
      dadosGroup.push(existente);
    }

    existente.metas.push({
      meta: item.meta,
      valor: item.valor,
      porcentagem: item.porcentagem
    });

    return acc;
  }, []);

  console.log(dadosGroup);

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
    doc.text('Relatório de Metas', 18, 24);

    const groupedData = data.reduce((acc, item) => {
      const key = `${item.cupom}-${item.mes_ano}`;
      if (!acc[key]) {
        acc[key] = {
          colaborador_nome: item.colaborador_nome,
          cupom: item.cupom,
          mes_ano: item.mes_ano,
          metas: []
        };
      }
      acc[key].metas.push({
        meta: item.meta,
        porcentagem: item.porcentagem,
        valor: item.valor
      });
      return acc;
    }, {});

    const tableData = [];
    Object.values(groupedData).forEach((group) => {
      tableData.push([group.colaborador_nome, group.cupom, group.mes_ano, '', '', '']);
      const sortedMetas = group.metas.sort((a, b) => a.valor - b.valor);

      sortedMetas.forEach((meta) => {
        tableData.push(['', '', '', meta.meta, meta.porcentagem, meta.valor]);
      });
    });

    const columns = [
      { header: 'Nome', dataKey: 'colaborador_nome' },
      { header: 'Cupom', dataKey: 'cupom' },
      { header: 'Mes ano', dataKey: 'mes_ano' },
      { header: 'Meta', dataKey: 'meta' },
      { header: 'Porcentagem', dataKey: 'porcentagem' },
      { header: 'Valor', dataKey: 'valor' }
    ];

    autoTable(doc, {
      head: [columns.map(col => col.header)],
      body: tableData,
      startY: 30,
      columnStyles: {
        0: { cellWidth: 30, marginleft: 0 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 50 },
        4: { cellWidth: 30 },
        5: { cellWidth: 20 }
      },
      didDrawCell: (data) => {
        if (data.row.index >= 0 && (data.row.raw[3] === '' || data.row.raw[4] === '' || data.row.raw[5] === '')) {
          doc.setFillColor(220, 220, 220);
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');

          doc.setTextColor(0, 0, 0);
          const text = (data.cell.text || '').toString().trim();

          let marginLeft = 10;

          if (data.column.index === 0) {
            marginLeft = 2;
          } else if (data.column.index === 1) {
            marginLeft = 2;
          }
          else if (data.column.index === 2) {
            marginLeft = 2;
          }
          const x = data.cell.x + marginLeft;
          const y = data.cell.y + (data.cell.height / 2) + 1.5;

          doc.text(text, x, y);
        }
      },


      headStyles: {
        fillColor: [41, 128, 186],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 10,
        cellPadding: 2,
        valign: 'middle',
        textColor: [0, 0, 0],
      },
      margin: { top: 30 },
    });

    doc.save('relatorio_meta.pdf');
  };







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
        <Grid item xs={12} sm={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => generatePDF(filtereds)}
            sx={{
              mt: 1.5,
              backgroundColor: '#45a049',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkgreen',
              },
              height: '36px',
              width: '10%',
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
                  value={editingMeta.porcentagem ? editingMeta.porcentagem * 100 : ''}
                  onChange={(e) => setEditingMeta({ ...editingMeta, porcentagem: e.target.value / 100 })}
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
                    value={
                      meta.porcentagem
                        ? `${(meta.porcentagem * 100).toLocaleString('pt-BR')}%`
                        : ''
                    }
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
                    value={
                      meta.valor
                        ? `R$ ${(meta.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : ''
                    }
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
