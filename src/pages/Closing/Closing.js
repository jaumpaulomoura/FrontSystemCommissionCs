import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, CircularProgress, Alert, TextField, Grid, IconButton, Modal, Button
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CheckIcon from '@mui/icons-material/Check';
import PrintIcon from '@mui/icons-material/Print';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import InputOutlinedIcon from '@mui/icons-material/InputOutlined';
import SidebarMenu from '../../components/SidebarMenu';
import { getFilteredClosingGroupData, getFilteredClosingData } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Cookies from 'js-cookie'; 

const Closing = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterMesAno, setFilterMesAno] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [loadingModalData, setLoadingModalData] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getFilteredClosingGroupData();
        const resultWithIds = result.map(closing => ({
          id: closing.mes_ano,
          ...closing,
        }));

        const uniqueResult = Array.from(new Map(resultWithIds.map(item => [item.id, item])).values());

        setData(uniqueResult);
        setFilteredData(uniqueResult);

        addNextMonthYear(uniqueResult);
      } catch (error) {
        setError('Erro ao buscar dados de closing.');
        console.error('Erro ao buscar dados de closing:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterMesAno, data]);

  const applyFilters = () => {
    let filtered = data;
    if (filterMesAno) {
      filtered = filtered.filter((item) =>
        item.mes_ano.toLowerCase().includes(filterMesAno.toLowerCase()) && item.mes_ano
      );
    }
    setFilteredData(filtered);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOpenModal = async (mes_ano) => {
    setLoadingModalData(true);
    setModalOpen(true);
    try {
      const result = await getFilteredClosingData(mes_ano, mes_ano);

      const resultsWithIds = result.map(closing => ({
        id: `${closing.mes_ano}-${closing.cupom_vendedora}`,
        ...closing,
      }));

      setModalData(resultsWithIds);
    } catch (error) {
      console.error('Erro ao obter dados para o modal:', error);
      setModalData([]);
    } finally {
      setLoadingModalData(false);
    }
  };


  const handleCloseModal = () => {
    setModalOpen(false);
    setModalData([]);
  };

  const columns = [
    {
      field: 'action',
      headerName: '',
      width: 150,
      renderCell: (params) => {
        const hasDate = !!params.row.dt_insert;
        const handleClick = () => {
          if (!hasDate) {
            navigate(`/closing/create/${params.row.mes_ano}`);
          }
        };

        return (
          <>
            <IconButton onClick={handleClick} disabled={hasDate}>
              {hasDate ? (
                <CheckIcon sx={{ color: 'green', fontSize: 24 }} />
              ) : (
                <InputOutlinedIcon sx={{ color: 'gray', fontSize: 24 }} />
              )}
            </IconButton>
            <IconButton onClick={() => handleOpenModal(params.row.mes_ano)}>
              <PrintIcon sx={{ color: 'gray', fontSize: 24 }} />
            </IconButton>
          </>
        );
      },
    },
    { field: 'mes_ano', headerName: 'Mês/Ano', width: 150 },
    {
      field: 'dt_insert',
      headerName: 'Data Fechamento',
      width: 150,
      renderCell: (params) => {
        const dateValue = params.value;
        const hasDate = !!dateValue;
        const formattedDate = hasDate ? new Date(dateValue).toLocaleDateString() : ' ';

        return (
          <Typography
            sx={{
              textAlign: 'center',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {formattedDate}
          </Typography>
        );
      },
    },
  ];

  const modalColumns = [
    { field: 'ano', headerName: 'Ano', width: 80 },
    { field: 'mes', headerName: 'Mês', width: 80 },
    { field: 'cupom_vendedora', headerName: 'Cupom Vendedora', width: 150 },
    { field: 'nome', headerName: 'Nome', width: 150 },
    {
      field: 'total_frete',
      headerName: 'Total Valor Frete',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
    {
      field: 'total_pago',
      headerName: 'Total Valor Pago',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
    {
      field: 'total_comissional',
      headerName: 'Total Comissional',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
    { field: 'meta_atingida', headerName: 'Meta', width: 80 },
    { field: 'porcentagem_meta', headerName: 'Porcentagem', width: 80 },
    {
      field: 'Valor_comisao',
      headerName: ' ValorComissão',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
    { field: 'premiacao_meta', headerName: 'Premiacao Meta', width: 80 },
    { field: 'qtd_reconquista', headerName: 'Reconquista', width: 150 },
    {
      field: 'vlr_reconquista',
      headerName: 'Valor Premiação Reconquista',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
    {
      field: 'vlr_total_reco',
      headerName: 'Total Valor Premiação Reconquista',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
    { field: 'qtd_repagar', headerName: 'Repagar', width: 150 },
    {
      field: 'vlr_recon_mes_ant',
      headerName: 'Valor Premiação Repagar',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
    {
      field: 'vlr_total_recon_mes_ant',
      headerName: 'Total Valor Premiação Repagar',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
    {
      field: 'total_receber',
      headerName: 'Valor Total',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
  ];

  const sortModel = [
    {
      field: 'mes_ano',
      sort: 'desc',
    },
  ];

  const addNextMonthYear = (data) => {
    if (data.length === 0) return;

    const uniqueData = Array.from(new Map(data.map(item => [item.mes_ano, item])).values());

    const mostRecentItem = uniqueData.reduce((mostRecent, current) => {
      const [mostRecentYear, mostRecentMonth] = mostRecent.mes_ano.split('-').map(Number);
      const [currentYear, currentMonth] = current.mes_ano.split('-').map(Number);

      if (currentYear > mostRecentYear || (currentYear === mostRecentYear && currentMonth > mostRecentMonth)) {
        return current;
      }
      return mostRecent;
    });

    if (mostRecentItem && mostRecentItem.mes_ano) {
      const [month, year] = mostRecentItem.mes_ano.split('-');
      let nextMonth = parseInt(month, 10) + 1;
      let nextYear = parseInt(year, 10);

      if (nextMonth > 12) {
        nextMonth = 1;
        nextYear += 1;
      }

      const nextMonthStr = String(nextMonth).padStart(2, '0');
      const nextMonthYear = `${nextMonthStr}-${nextYear}`;

      const newItem = {
        id: nextMonthYear,
        mes_ano: nextMonthYear,
        ano: nextYear.toString(),
        mes: nextMonthStr,
        dt_insert: '',
      };

      setData(prevData => {
        const newData = [...prevData, newItem];

        newData.sort((a, b) => {
          const [aYear, aMonth] = a.mes_ano.split('-').map(Number);
          const [bYear, bMonth] = b.mes_ano.split('-').map(Number);
          if (aYear !== bYear) return bYear - aYear;
          return bMonth - aMonth;
        });

        return newData;
      });
      applyFilters();
    }
  };
  const generatePDF = () => {
    const doc = new jsPDF('landscape');
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const mesAno = modalData.length > 0
      ? `${monthNames[parseInt(modalData[0].mes, 10) - 1]} ${modalData[0].ano}`
      : 'N/A';

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    const formattedTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text(`Relatório de Comissão - ${mesAno}`, 14, 10);

    const user = JSON.parse(Cookies.get('user'));
    if (user) {
      doc.setFontSize(8);
      doc.setFont("Helvetica", "normal");
      doc.text(`Data: ${formattedDate}`, doc.internal.pageSize.width - 10, 7, { align: 'right' });
      doc.text(`Hora: ${formattedTime}`, doc.internal.pageSize.width - 10, 10, { align: 'right' });

      doc.setFontSize(14);
      doc.setFont("Helvetica", "bold");
      doc.text(`Time: ${user.time || 'Desconhecido'}`, 14, 20);
    }

    const sortedModalData = [...modalData].sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));
    const totalValue = sortedModalData.reduce((sum, row) => sum + parseFloat(row.total_receber || '0'), 0);
    const numberFormatter = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    autoTable(doc, {
      startY: 25,
      head: [
        ['Nome', 'Total Comissional', 'Meta', 'Porcentagem', 'Valor Comissão', 'Premiação Meta']
          .concat(user?.time === "Reconquista" ? ['Premiação Reconquista'] : [])
          .concat(['Valor Total']),
      ],
      body: sortedModalData.map((row) => {
        // Cálculo da Premiação Reconquista (caso aplicável)
        const premiacaoReconquista = parseFloat(row.vlr_total_recon_mes_ant || '0') +
          parseFloat(row.vlr_total_reco || '0');
       

        // Cálculo do Valor Total incluindo ou não a Premiação Reconquista
        const valorTotal = parseFloat(row.total_comissional || '0') +
          parseFloat(row.valor_comissao || '0') +
          parseFloat(row.premiacao_meta || '0') +
          (user?.time === "Reconquista" ? premiacaoReconquista : 0);

        return [
          row.nome || '',
          numberFormatter.format(parseFloat(row.total_comissional || '0')),
          row.meta_atingida || '',
          `${numberFormatter.format(parseFloat(row.porcentagem_meta || '0') * 100)}%`,
          numberFormatter.format(parseFloat(row.valor_comissao || '0')),
          numberFormatter.format(parseFloat(row.premiacao_meta || '0')),
          ...(user?.time === "Reconquista"
            ? [numberFormatter.format(premiacaoReconquista)]
            : []),
          numberFormatter.format(row.total_receber),  
        ];
      }),
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
      didDrawPage: (data) => {
        const totalPages = doc.internal.getNumberOfPages();
        if (data.pageNumber === totalPages) {
          const text = `Total Comissional: ${numberFormatter.format(totalValue)}`;
          const textWidth = doc.getTextWidth(text);
          const x = doc.internal.pageSize.width - textWidth - 14;
          doc.setFontSize(12);
          doc.setFont("Helvetica", "bold");
          doc.text(text, x, doc.internal.pageSize.height - 10);
        }
      },
    });

    doc.save(`relatorio-Comissão-${mesAno}.pdf`);
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarMenu open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Box position="absolute" top={16} right={16}>
          <ThemeToggleButton toggleTheme={toggleTheme} />
        </Box>
        <Typography variant="h4">Fechamento</Typography>

        <Paper sx={{ mt: 2, p: 2 }}>
          <Grid container spacing={2}>
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
            <DataGrid
              rows={filteredData}
              columns={columns}
              pageSize={10}
              sortModel={sortModel}
            />
          </div>
        )}

        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              width: '90%',
              height: '80%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
            }}
          >
            {loadingModalData ? (
              <CircularProgress />
            ) : modalData.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ height: '10%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Detalhes do Fechamento
                  </Typography>

                  <Button
                    onClick={generatePDF}
                    sx={{
                      mb: 5,
                      backgroundColor: '#45a049',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'darkgreen',
                      },
                      height: '50%',
                      width: '15%'
                    }}
                  >
                    Exportar PDF
                  </Button>
                </div>
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    height: '50%',
                  }}
                >
                  <DataGrid
                    rows={modalData}
                    columns={modalColumns}
                    pageSize={5}
                    disableSelectionOnClick
                    sx={{
                      '& .MuiDataGrid-cell': {
                        textAlign: 'center',
                      },
                      '& .MuiDataGrid-root': {
                        border: 'none',
                      },
                      height: '100%',
                    }}
                  />
                </div>
                <Button
                  onClick={handleCloseModal}
                  sx={{
                    mt: 2,
                    backgroundColor: 'red',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'darkred',
                    },
                    '&:active': {
                      backgroundColor: 'firebrick',
                    },
                    height: '5%',
                    width: '5%',
                    alignSelf: 'flex-end',
                    marginTop: 'auto',
                  }}
                >
                  Fechar
                </Button>
              </div>
            ) : (
              <Typography>Erro ao carregar dados.</Typography>
            )}
          </Box>
        </Modal>

      </Box>
    </Box>
  );
};

export default Closing;
























