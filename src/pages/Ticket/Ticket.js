import React,
 { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Alert, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { DataGrid } from '@mui/x-data-grid';
import NotesIcon from '@mui/icons-material/Notes';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import SidebarMenu from '../../components/SidebarMenu';
import { useNavigate } from 'react-router-dom';
import { getFilteredTicketData, updateTicket, updateTicketCupom,updateTicketStatus } from '../../services/apiService';
import { debounce } from 'lodash';
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '../../components/ToastProvider';

const Ticket = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterId, setFilterId] = useState('');
  const [filterOrderid, setFilterOrderid] = useState('');
  const [filterReason, setFilterReason] = useState('');
  const [filterOctadeskid, setFilterOctadeskid] = useState('');
  const [filterDateCreated, setFilterDateCreated] = useState('');
  const [filterCupom, setFilterCupom] = useState('');
  const [filterNome, setFilterNome] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const { showToast } = useToast();
  const navigate = useNavigate();


  const user = JSON.parse(Cookies.get('user'));
  const userFuncao = user ? user.funcao : '';


  const handleOpenModal = (notes) => {
    setNotes(notes);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getFilteredTicketData();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        showToast('Erro ao buscar dados de ticket.', 'error'); 

      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const applyFilters = useCallback(
    debounce(() => {
      let filtered = data;



      if (statusFilter.includes("Todos") || statusFilter.length === 0) {
        filtered = [...data];
      } else {
        filtered = filtered.filter((ticket) => {
          const ticketStatus = ticket.status;
          const statusMatch = statusFilter.includes(ticketStatus);
          return statusMatch;
        });
      }
      if (filterId) {
        filtered = filtered.filter(ticket =>
          String(ticket.id).toLowerCase().includes(filterId.toLowerCase())
        );
      }

      if (filterOrderid) {
        filtered = filtered.filter(ticket =>
          String(ticket.orderId).toLowerCase().includes(filterOrderid.toLowerCase())
        );
      }

      if (filterReason) {
        filtered = filtered.filter(ticket =>
          String(ticket.reason).toLowerCase().includes(filterReason.toLowerCase())
        );
      }

      if (filterOctadeskid) {
        filtered = filtered.filter(ticket =>
          String(ticket.octadeskId).toLowerCase().includes(filterOctadeskid.toLowerCase())
        );
      }
      if (filterDateCreated) {
        filtered = filtered.filter(ticket =>
          String(ticket.dateCreated).toLowerCase().includes(filterDateCreated.toLowerCase())
        );
      }
      if (filterNome) {
        filtered = filtered.filter((item) =>
          item.nome &&
          item.nome.toLowerCase().includes(filterNome.toLowerCase())
        );
      }
      if (filterCupom) {
        filtered = filtered.filter((item) =>
          item.cupomvendedora &&
          item.cupomvendedora.toLowerCase().includes(filterCupom.toLowerCase())
        );
      }
      setFilteredData(filtered);
    }, 300),
    [filterId, filterOrderid, filterReason, filterOctadeskid, statusFilter, filterNome, filterCupom, filterDateCreated, data]
  );

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInsert = () => {
    navigate('/ticket/create');
  };

  const handleTicketAction = async (id, status) => {
    try {
      await updateTicket(id, {
        status,
        dateupdated: new Date()
      });

      const updatedTicket = data.find(ticket => ticket.id === id);

      if (updatedTicket) {
        if (status === 'Autorizado') {
          
          if (updatedTicket.reason === 'Status para Aprovado') {
            await updateTicketStatus(updatedTicket.orderId, 'APPROVED');
          } else if (updatedTicket.reason === 'Status para Cancelado') {
            await updateTicketStatus(updatedTicket.orderId, 'REMOVED');
          } else if (updatedTicket.reason !== 'Status para Aprovado' && updatedTicket.reason !== 'Status para Cancelado') {
            await updateTicketCupom(updatedTicket.orderId, updatedTicket.cupomvendedora);
          }
        }
      
        
        setData(prevData =>
          prevData.map(ticket =>
            ticket.id === id ? { ...ticket, status } : ticket
          )
        );
      
        
        showToast(`Ticket ${status === 'Autorizado' ? 'autorizado' : 'não autorizado'} com sucesso!`, 'success');
      }
      
    } catch (error) {
      showToast(`Erro ao ${status === 'Autorizado' ? 'autorizar' : 'não autorizar'} o ticket.`, 'error');
    }
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

  const columns = [
    { field: 'id', headerName: 'Ticket', width: 80 },
    { field: 'orderId', headerName: 'Pedido', width: 100 },
    { field: 'octadeskId', headerName: 'Ticket do Octadesk', width: 170 },
    { field: 'reason', headerName: 'Motivo', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'nome', headerName: 'Nome', width: 150 },
    { field: 'cupomvendedora', headerName: 'Cupom Vendedora', width: 150 },
    {
      field: 'dateCreated', headerName: 'Data de Criação', width: 150,
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
      field: 'notes',
      headerName: 'Observação',

      width: 90,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#9e9e9e',
              color: '#fff',
              padding: '2px 4px',
              fontSize: '0.75rem',
              height: '24px',
              minWidth: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              '&:hover': { backgroundColor: '#757575' }
            }}
            onClick={() => handleOpenModal(params.row.notes)}
          >
            <NotesIcon />
          </Button>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 150,
      renderCell: (params) => {
        const user = JSON.parse(Cookies.get('user'));

        if (params.row.status === 'Aberto' && user && user.funcao !== 'Consultora') {
          return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
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
                  '&:hover': { backgroundColor: '#45a049' }
                }}
                onClick={() => handleTicketAction(params.row.id, 'Autorizado')}
              >
                <FaPencilAlt style={{ fontSize: '1rem', marginRight: 4 }} />
                Autorizar
              </Button>
            </div>
          );
        } else {
          return null;
        }
      },
    },
    {
      field: 'notautorizes',
      headerName: '',
      width: 160,
      renderCell: (params) => {
        const user = JSON.parse(Cookies.get('user'));


        if (params.row.status === 'Aberto' && user && user.funcao !== 'Consultora') {
          return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
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
                  '&:hover': { backgroundColor: '#d32f2f' }
                }}
                onClick={() => handleTicketAction(params.row.id, 'Não Autorizado')}
              >
                <FaTrashAlt style={{ fontSize: '1rem', marginRight: 4 }} />
                Não Autorizar
              </Button>
            </div>
          );
        } else {
          return null;
        }
      },
    }
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
    
    const columns = [
      { header: 'Ticket', dataKey: 'id' },
      { header: 'Pedido', dataKey: 'orderId' },
      { header: 'Ticket Octadesk', dataKey: 'octadeskId' },
      { header: 'Motivo', dataKey: 'reason' },
      { header: 'Status', dataKey: 'status' },
      { header: 'Cupom', dataKey: 'cupomvendedora' },
      { header: 'Data de Criação', dataKey: 'dateCreated' }
    ];





    const columnStyles = {
      nome: { cellWidth: 40 }
    }
    const rows = data.map(row => ({
      id: row.id ? row.id : '',
      orderId: row.orderId,
      octadeskId: row.octadeskId,
      reason: row.reason,
      status: row.status,
      cupomvendedora: row.cupomvendedora,
      dateCreated: row.dateCreated,
    }));

    
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

    
    doc.save('relatorio_ticket.pdf');
  };
  
  
  

  
  
  

  
  
  
  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarMenu open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          maxWidth: '100%', 
          mx: 'auto', 
          overflow: 'auto' 
        }}
      >

        <Box position="absolute" top={16} right={16}>
          <ThemeToggleButton toggleTheme={toggleTheme} />
        </Box>
        <Typography variant="h4">Ticket</Typography>
        <Button variant="contained" color="primary" sx={{
          mt: 2,
          backgroundColor: '#45a049',
          color: '#fff',
          '&:hover': { backgroundColor: '#388e3c' }
        }} onClick={handleInsert}>
          Inserir
        </Button>
        <Paper
          sx={{
            mt: 2,
            p: 2,
            maxWidth: '100%', 
            overflow: 'auto', 
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={1.8}>
              <TextField
                label="Filtrar por Ticket"
                variant="filled"
                value={filterId}
                onChange={(e) => setFilterId(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1.8}>
              <TextField
                label="Filtrar por Pedido"
                variant="filled"
                value={filterOrderid}
                onChange={(e) => setFilterOrderid(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1.8}>
              <TextField
                label="Filtrar por Octadesk"
                variant="filled"
                value={filterOctadeskid}
                onChange={(e) => setFilterOctadeskid(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1.8}>
              <TextField
                label="Filtrar por Motivo"
                variant="filled"
                value={filterReason}
                onChange={(e) => setFilterReason(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1.5}>
              <TextField
                label="Data de Criação"
                type="date"
                variant="filled"
                value={filterDateCreated}
                onChange={(e) => setFilterDateCreated(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {userFuncao !== 'Consultora' && (
              <Grid item xs={12} sm={2} md={1.9}>
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
            {userFuncao !== 'Consultora' && (
              <Grid item xs={12} sm={2} md={1.9}>
                <TextField
                  label="Filtrar por Nome"
                  variant="filled"
                  value={filterNome}
                  onChange={(e) => setFilterNome(e.target.value)}
                  fullWidth
                  size="small"
                />
              </Grid>
            )}


            <Grid item xs={9} sm={4} md={1.4}>
              <FormControl fullWidth variant="filled">
                <InputLabel>Status</InputLabel>
                <Select
                  multiple
                  value={statusFilter}
                  onChange={handleStatusChange}
                  renderValue={(selected) => selected.join(', ')}
                >
                  <MenuItem value="Todos">Todos</MenuItem>
                  <MenuItem value="Autorizado">Autorizado</MenuItem>
                  <MenuItem value="Não Autorizado">Não Autorizado</MenuItem>
                  <MenuItem value="Aberto">Aberto</MenuItem>
                </Select>
              </FormControl>
            </Grid>


          </Grid>
        </Paper>
        <Grid item xs={12} sm={12} md={7} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => generatePDF(filteredData)} 
            sx={{
              mt: 1.5,
              backgroundColor: '#45a049',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkgreen',
              },
              height: '36px',
              width: '11%', 
            }}
          >
            Exportar PDF
          </Button>
        </Grid>
        {loading ? (
          <CircularProgress sx={{ mt: 2 }} />
        ) : (
          <div style={{ height: 400, width: '100%', marginTop: 16 }}>
      
            <DataGrid
              rows={filteredData}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 7,
                  },
                },
              }}
              autoHeight
              pageSizeOptions={[7]}
              disableColumnMenu
            />
          </div>
        )}
      </Box>
      <Dialog open={open} onClose={handleCloseModal}>
        <DialogTitle>Observação</DialogTitle>
        <DialogContent>
          <Typography>{notes}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'red',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#d32f2f',
              },
            }}
            onClick={handleCloseModal}
          >
            Fechar
          </Button>

        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ticket;


