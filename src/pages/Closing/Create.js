import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SidebarMenu from '../../components/SidebarMenu';
import { useNavigate, useParams } from 'react-router-dom';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { getFilteredOClosingOrderData, getFilteredReconquestGroupData, getPremiacaoReconquistaData, getFilteredClosingsData, getColaboradorData, createClosing } from '../../services/apiService';

const CreateClosing = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [reconquestData, setReconquestData] = useState({});
  const [premiacaoData, setPremiacaoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { mes_ano } = useParams();



  const user = JSON.parse(localStorage.getItem('user'));
  const userTime = user ? user.time : '';

  const getStartDate = () => {
    if (mes_ano) {
      const [ month, year] = mes_ano.split('-');
      return new Date(`${year}-${month}-01`).toISOString().split('T')[0];
    }
    return '';
  };

  const getEndDate = () => {
    if (mes_ano) {
      const [month, year] = mes_ano.split('-');
      const lastDay = new Date(year, month, 0).getDate();
      return new Date(year, month - 1, lastDay).toISOString().split('T')[0];
    }
    return '';
  };
  const filterStartDate = getStartDate();
  const filterEndDate = getEndDate();

  const getPreviousMonthYear = (currentMonth, currentYear) => {
    if (currentMonth < 1 || currentMonth > 12 || currentYear < 0) {
      throw new Error('Invalid month or year provided');
    }
  
    let month = currentMonth - 1;
    let year = currentYear;
  
    if (month < 1) {
      month = 12;
      year -= 1;
    }
  
    return { month, year };
  };
  



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [result, colaboradores] = await Promise.all([
          getFilteredOClosingOrderData(filterStartDate, filterEndDate),
          getColaboradorData(),
        ]);

        const colaboradoresMap = colaboradores.reduce((acc, colaborador) => {
          acc[colaborador.cupom] = colaborador.nome;
          return acc;
        }, {});

        let reconquestData = [];
        let premiacaoData = [];
        let reconquestAnteriorMap = {};

        if (userTime === 'Reconquista') {
          [reconquestData, premiacaoData] = await Promise.all([
            getFilteredReconquestGroupData(filterStartDate, filterEndDate),
            getPremiacaoReconquistaData(),
          ]);

          const [currentYear, currentMonth] = filterStartDate.split('-').map(Number);
          const { month, year } = getPreviousMonthYear(currentMonth, currentYear);
          const mesAno = `${month.toString().padStart(2, '0')}-${year}`;
          const vlrReconquestAnterior = await getFilteredClosingsData(mesAno);

          reconquestAnteriorMap = vlrReconquestAnterior.reduce((acc, item) => {
            acc[item.cupom_vendedora] = item;
            return acc;
          }, {});
        }

        const reconquestMap = reconquestData.reduce((acc, item) => {
          acc[item.cupom_vendedora] = item;
          return acc;
        }, {});

        const resultWithIds = result.map(closing => {
          const nomeColaborador = colaboradoresMap[closing.cupom_vendedora] || 'N/A';

          let qtd_reconquista = 0;
          let qtd_repagar = 0;
          let premiacao = null;
          let valor_repagar = 0;
          let valorTotalRepagar = 0;
          let Valor_comisao = parseFloat(closing.Valor_comisao) || 0;
          let valorTotal = parseFloat(closing.Valor_comisao || 0) + parseFloat(closing.premiacao_meta || 0);

          if (userTime === 'Reconquista') {
            const reconquest = reconquestMap[closing.cupom_vendedora] || {};
            qtd_reconquista = reconquest.Reconquista || 0;
            qtd_repagar = reconquest.Repagar || 0;
            premiacao = premiacaoData.find(p => qtd_reconquista >= p.minimo && qtd_reconquista <= p.maximo);
            const reconquestAnterior = reconquestAnteriorMap[closing.cupom_vendedora] || {};
            valor_repagar = parseFloat(reconquestAnterior.vlr_reconquista) || 0;
            valorTotalRepagar = qtd_repagar * valor_repagar;

            valorTotal += (premiacao ? premiacao.valor * qtd_reconquista : 0) + valorTotalRepagar;
          }

          return {
            id: `${closing.cupom_vendedora}`,
            ano: closing.ano || '',
            mes: closing.mes || '',
            cupom_vendedora: closing.cupom_vendedora || '',
            nome: nomeColaborador,
            total_comissional: parseFloat(closing.total_comissional) || 0,
            total_valor_frete: parseFloat(closing.total_valor_frete) || 0,
            total_valor_pago: parseFloat(closing.total_valor_pago) || 0,
            meta: closing.meta || '',
            porcentagem: parseFloat(closing.porcentagem) || 0,
            premiacao_meta: parseFloat(closing.premiacao_meta) || 0,
            Valor_comisao: Valor_comisao,
            qtd_reconquista: qtd_reconquista,
            qtd_repagar: qtd_repagar,
            valor_premiacao: premiacao ? premiacao.valor : 0,
            total_valor_premiacao: premiacao ? premiacao.valor * qtd_reconquista : 0,
            valor_repagar: valor_repagar,
            valorTotalRepagar: valorTotalRepagar,
            valorTotal: valorTotal,
          };
        });

        setData(resultWithIds);
        setFilteredData(resultWithIds);
      } catch (error) {
        setError('Erro ao buscar dados.');
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filterStartDate, filterEndDate]);


  const applyFilters = useCallback(() => {
    let filtered = data;
    setFilteredData(filtered);
  }, [data]);

  useEffect(() => {
    applyFilters();
  }, [data, applyFilters]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const columns = [
    { field: 'ano', headerName: 'Ano', width: 80 },
    { field: 'mes', headerName: 'Mês', width: 80 },
    { field: 'cupom_vendedora', headerName: 'Cupom Vendedora', width: 150 },
    { field: 'nome', headerName: 'Nome', width: 150 },
    {
      field: 'total_valor_frete',
      headerName: 'Total Valor Frete',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
    {
      field: 'total_valor_pago',
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
    { field: 'meta', headerName: 'Meta', width: 80 },
    { field: 'porcentagem', headerName: 'Porcentagem', width: 80 },
    {
      field: 'Valor_comisao',
      headerName: 'Valor Comissão',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
    { field: 'premiacao_meta', headerName: 'Premiacao Meta', width: 80 },
    { field: 'qtd_reconquista', headerName: 'Reconquista', width: 150 },
    {
      field: 'valor_premiacao',
      headerName: 'Valor Premiação Reconquista',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
    {
      field: 'total_valor_premiacao',
      headerName: 'Total Valor Premiação Reconquista',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
    { field: 'qtd_repagar', headerName: 'Repagar', width: 150 },
    {
      field: 'valor_repagar',
      headerName: 'Valor Premiação Repagar',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
    {
      field: 'valorTotalRepagar',
      headerName: 'Total Valor Premiação Repagar',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
    {
      field: 'valorTotal',
      headerName: 'Valor Total',
      width: 150,
      valueFormatter: (params) => `R$ ${Number(params || 0).toFixed(2)}`
    },
  ];


  const handleInsert = async (e) => {
    e.preventDefault();


    const now = new Date().toISOString();
    const formatMesAno = (mes, ano) => {
      const formattedMes = mes.toString().padStart(2, '0'); // Garante que o mês tenha dois dígitos
      return `${formattedMes}-${ano}`;
    };
    const formData = filteredData.map((item) => ({
      mes: item.mes || '',
      ano: item.ano || '',
      mes_ano: formatMesAno(item.mes, item.ano),
      cupom_vendedora: item.cupom_vendedora || '',
      total_pago: item.total_valor_pago || 0,
      total_frete: item.total_valor_frete || 0,
      total_comissional: item.total_comissional || 0,
      meta_atingida: item.meta || '',
      porcentagem_meta: item.porcentagem || 0,
      valor_comissao: item.Valor_comisao || 0,
      premiacao_meta: item.premiacao_meta || 0,
      qtd_reconquista: item.qtd_reconquista || 0,
      vlr_reconquista: item.valor_premiacao || 0,
      vlr_total_reco: item.total_valor_premiacao || 0,
      qtd_repagar: item.qtd_repagar || 0,
      vlr_recon_mes_ant: item.valor_repagar || 0,
      vlr_total_recon_mes_ant: item.valorTotalRepagar|| 0,
      premiacao_reconquista: item.valorTotalRepagar || 0,
      total_receber: item.valorTotal || 0
    }));

    try {
      const response = await createClosing(formData);
      setSuccessMessage('Fechamento criado com sucesso!');
      navigate('/closing');
    } catch (error) {
      console.error('Erro ao criar fechamento:', error);
      setError('Erro ao criar fechamento. Verifique o console para mais detalhes.');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarMenu open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Box position="absolute" top={16} right={16}>
          <ThemeToggleButton toggleTheme={toggleTheme} />
        </Box>
        <Typography variant="h4">Fechamento</Typography>
        <Button variant="contained" color="primary" sx={{
          mt: 2,
          backgroundColor: '#45a049',
          color: '#fff',
          '&:hover': { backgroundColor: '#388e3c' }
        }} onClick={handleInsert}>
          Inserir
        </Button>

        {loading ? (
          <CircularProgress sx={{ mt: 2 }} />
        ) : (
          <div style={{ height: 600, width: '100%', marginTop: 16 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {filteredData.length === 0 && !loading && !error && (
              <Typography variant="h6" sx={{ mt: 2 }}>
                Nenhum dado disponível
              </Typography>
            )}
            <DataGrid
              rows={filteredData}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]} getRowId={(row) => row.id}
            />
          </div>
        )}
      </Box>
    </Box>
  );
};

export default CreateClosing;
