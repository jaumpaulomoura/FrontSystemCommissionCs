import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SidebarMenu from '../../components/SidebarMenu';
import { useNavigate, useParams } from 'react-router-dom';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import {getFilteredMetaData, getFilteredOClosingOrderData, getFilteredReconquestGroupData, getPremiacaoReconquistaData, getFilteredClosingsData, getColaboradorData, createClosing } from '../../services/apiService';
import Cookies from 'js-cookie'; 

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
  // const [filteredColaboradores, setFilteredColaboradores] = useState([]);
  const navigate = useNavigate();
  const { mes_ano } = useParams();



  const user = JSON.parse(Cookies.get('user'));
  const userTime = user ? user.time : '';
  const userFuncao = user ? user.funcao : '';

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
        const colaboradores = await getColaboradorData();

        const filteredColaboradores = colaboradores.filter(colaborador => {
          return colaborador.time.trim() === userTime.trim() && 
                 colaborador.funcao !== 'Consultora' && 
                 colaborador.funcao !== 'Admin';
        });
        const [closingOrderData] = await Promise.all([
          getFilteredOClosingOrderData(filterStartDate, filterEndDate),
        ]);
  
        let reconquestData = [];
        let premiacaoData = [];
        let reconquestAnteriorMap = {};
  
        if (userTime === 'Reconquista') {
          [reconquestData, premiacaoData] = await Promise.all([
            getFilteredReconquestGroupData(filterStartDate, filterEndDate),
            getPremiacaoReconquistaData(),
          ]);
  
          const mesAno = getPreviousMonthYearData(filterStartDate);
          reconquestAnteriorMap = await getReconquestAnteriorData(mesAno);
        }
  
        const reconquestMap = mapReconquestData(reconquestData);
  
        const resultWithIds = closingOrderData.map(closing => 
          mapClosingData(closing, reconquestMap, premiacaoData, reconquestAnteriorMap)
        );
  
        setData(resultWithIds);
        setFilteredData(resultWithIds);
        addManagerRows(resultWithIds, filteredColaboradores);
      } catch (error) {
        setError('Erro ao buscar dados: ' + error.message);
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [filterStartDate, filterEndDate]);
  
  const getPreviousMonthYearData = (startDate) => {
    const [currentYear, currentMonth] = startDate.split('-').map(Number);
    const { month, year } = getPreviousMonthYear(currentMonth, currentYear);
    return `${month.toString().padStart(2, '0')}-${year}`;
  };
  
  const mapReconquestData = (reconquestData) => {
    return reconquestData.reduce((acc, item) => {
      acc[item.cupom_vendedora] = item;
      return acc;
    }, {});
  };
  
  const mapClosingData = (closing, reconquestMap, premiacaoData, reconquestAnteriorMap) => {
    let qtd_reconquista = 0;
    let qtd_repagar = 0;
    let premiacao = null;
    let valor_repagar = 0;
    let valorTotalRepagar = 0;
    let Valor_comisao = parseFloat(closing.Valor_comisao) || 0;
    let valorTotal = Valor_comisao + parseFloat(closing.premiacao_meta || 0);
  
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
      id: `${closing.cupom_vendedora} - ${closing.nome}`,
      ano: closing.ano || '',
      mes: closing.mes || '',
      cupom_vendedora: closing.cupom_vendedora || '',
      nome: closing.nome || '',
      funcao:closing.funcao||'',
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
  };
  
  const getReconquestAnteriorData = async (mesAno) => {
    const vlrReconquestAnterior = await getFilteredClosingsData(mesAno);
    return vlrReconquestAnterior.reduce((acc, item) => {
      acc[item.cupom_vendedora] = item;
      return acc;
    }, {});
  };

  const addManagerRows = async (resultWithIds, filteredColaboradores) => {
    console.log('resultWithIds:', resultWithIds);
    console.log('filteredColaboradores:', filteredColaboradores);
    
    const primeiroMes = resultWithIds.length > 0 ? resultWithIds[0].mes : ''; // Apenas o primeiro mês
    const primeiroAno = resultWithIds.length > 0 ? resultWithIds[0].ano : '';
    const mesAnoConcatenado = `${String(primeiroMes).padStart(2, '0')}-${String(primeiroAno).padStart(4, '0')}`;
    
    const total_comissional = resultWithIds.reduce((sum, item) => sum + item.total_comissional, 0);
    const total_valor_frete = resultWithIds.reduce((sum, item) => sum + item.total_valor_frete, 0);
    const total_valor_pago = resultWithIds.reduce((sum, item) => sum + item.total_valor_pago, 0);
  
    console.log('Total Comissional:', total_comissional);
    console.log('Total Valor Frete:', total_valor_frete);
    console.log('Total Valor Pago:', total_valor_pago);
  
    const allMetas = await getFilteredMetaData(); // Chama a API para buscar todas as metas
    console.log('All Metas:', allMetas); // Log para verificar as metas retornadas

    // Mapeamento dos colaboradores para criar as linhas do manager
    const managerRows = await Promise.all(filteredColaboradores.map(async (colaborador) => {
      // Filtrando os dados de metas para o colaborador atual
      const filteredMeta = allMetas.filter(meta => {
        return (
          meta.cupom === colaborador.cupom && 
          meta.mes_ano === mesAnoConcatenado // Usando a concatenação para comparação
        );
      });

      console.log(`Filtered Metas for ${colaborador.cupom}:`, filteredMeta); // Log para verificar as metas filtradas

      // Inicializa as variáveis para armazenar o status da meta e a porcentagem
      let metaAtingida = 'Não tem meta cadastrada'; // Padrão
      let metaValor = 0; // Valor da meta correspondente
      let porcentagem = 0; // Porcentagem padrão

      // Verifica se existem metas para o colaborador
      if (filteredMeta.length > 0) {
        // Itera sobre as metas para determinar a situação
        for (const meta of filteredMeta) {
          console.log(`Comparando total_comissional: ${total_comissional} com meta.valor: ${meta.valor}`); // Log para comparação
          
          // Compara o total_comissional com o valor da meta
          if (meta.valor > 0 && total_comissional >= meta.valor) { // Apenas considere metas com valor > 0
            if (total_comissional >= meta.valor) {
              metaAtingida = meta.meta; // A meta foi atingida
              metaValor = meta.valor; // Armazena o valor da meta
              porcentagem = meta.porcentagem; // Armazena a porcentagem da meta atingida
               // Para na primeira meta atingida
            } 
          } else {
            // Aqui, você pode adicionar lógica adicional se quiser tratar metas com valor 0
            // Por exemplo, se a meta for 0, considere que a meta foi atingida ou ignore-a
            console.log(`Meta com valor 0 encontrada para ${colaborador.cupom}, ignorando para comparação.`);
          }
        }
      }
      const Valor_comisao = total_comissional * porcentagem; // Calcula o valor da comissão
      const valorTotal = Valor_comisao  
      return {
      id: `${colaborador.cupom} - ${colaborador.nome}`,
      ano: primeiroAno,
      mes: primeiroMes,
      cupom_vendedora: colaborador.cupom,
      nome: colaborador.nome,
      funcao: colaborador.funcao,
      total_comissional: total_comissional,
      total_valor_frete: total_valor_frete,
      total_valor_pago: total_valor_pago,
      meta: metaAtingida, // Preencher com a meta atingida
      porcentagem: porcentagem, 
      premiacao_meta: 0,
      Valor_comisao: Valor_comisao,
      qtd_reconquista: 0,
      qtd_repagar: 0,
      valor_premiacao: 0,
      total_valor_premiacao: 0,
      valor_repagar: 0,
      valorTotalRepagar: 0,
       valorTotal: valorTotal, 
    };
  }));
  
    console.log('Manager Rows:', managerRows);
  
    const finalData = [...resultWithIds, ...managerRows];
    console.log('finalData',finalData)
    setData(finalData);
    setFilteredData(finalData);
    console.log('Final Data:', finalData);
  };
  setTimeout(() => {
    console.log('Data após setData:', data);
    console.log('Filtered Data após setFilteredData:', filteredData);
}, 0);
  
  // const applyFilters = useCallback(() => {
  //   let filtered = data;
  //   setFilteredData(filtered);
  // }, [data]);

  // useEffect(() => {
  //   applyFilters();
  // }, [data, applyFilters]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const columns = [
    { field: 'ano', headerName: 'Ano', width: 80 },
    { field: 'mes', headerName: 'Mês', width: 80 },
    { field: 'cupom_vendedora', headerName: 'Cupom Vendedora', width: 150 },
    { field: 'nome', headerName: 'Nome', width: 150 },
    { field: 'funcao', headerName: 'Função', width: 150 },
    {
      field: 'total_valor_frete',
      headerName: 'Total Valor Frete',
      width: 150,
       valueFormatter: (params) => {
        if (!params) {
          return 'R$ 0,00';
        }
       const numberValue = parseFloat(params.toString().replace(',', '.'));
        if (isNaN(numberValue)) {
          return 'R$ 0,00'; 
        }
        const formattedValue = numberValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        return `R$ ${formattedValue}`;
      }
    },
    {
      field: 'total_valor_pago',
      headerName: 'Total Valor Pago',
      width: 150,
       valueFormatter: (params) => {
        // console.log('valor_comissional params:', params); // Linha de depuração para ver o valor real
        
        // Se o valor não estiver definido, retorna '0'
        if (!params) {
          return 'R$ 0,00';
        }
        
        // Substitui a vírgula por ponto e converte para número
        const numberValue = parseFloat(params.toString().replace(',', '.'));
        
        // Verifica se a conversão para número foi bem-sucedida
        if (isNaN(numberValue)) {
          return 'R$ 0,00'; // Retorna um valor padrão se a conversão falhar
        }
        
        // Formata o número como moeda em BRL
        const formattedValue = numberValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        
        // Retorna o valor formatado com 'R$'
        return `R$ ${formattedValue}`;
      }
    },
    {
      field: 'total_comissional',
      headerName: 'Total Comissional',
      width: 150,
       valueFormatter: (params) => {
        // console.log('valor_comissional params:', params); // Linha de depuração para ver o valor real
        
        // Se o valor não estiver definido, retorna '0'
        if (!params) {
          return 'R$ 0,00';
        }
        
        // Substitui a vírgula por ponto e converte para número
        const numberValue = parseFloat(params.toString().replace(',', '.'));
        
        // Verifica se a conversão para número foi bem-sucedida
        if (isNaN(numberValue)) {
          return 'R$ 0,00'; // Retorna um valor padrão se a conversão falhar
        }
        
        // Formata o número como moeda em BRL
        const formattedValue = numberValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        
        // Retorna o valor formatado com 'R$'
        return `R$ ${formattedValue}`;
      }
    },
    { field: 'meta', headerName: 'Meta', width: 80 },
    {
      field: 'porcentagem',
      headerName: 'Porcentagem',
      width: 80,
      valueFormatter: (params) => {
        // Verifica se o valor está definido
        if (params !== undefined && params !== null) {
          // Multiplica por 100 e formata como percentual
          return `${(params * 100).toLocaleString('pt-BR')}%`;
        }
        return ''; // Retorna uma string vazia se o valor não estiver definido
      }
    }
,    
    {
      field: 'Valor_comisao',
      headerName: 'Valor Comissão',
      width: 150,
       valueFormatter: (params) => {
        // console.log('valor_comissional params:', params); // Linha de depuração para ver o valor real
        
        // Se o valor não estiver definido, retorna '0'
        if (!params) {
          return 'R$ 0,00';
        }
        
        // Substitui a vírgula por ponto e converte para número
        const numberValue = parseFloat(params.toString().replace(',', '.'));
        
        // Verifica se a conversão para número foi bem-sucedida
        if (isNaN(numberValue)) {
          return 'R$ 0,00'; // Retorna um valor padrão se a conversão falhar
        }
        
        // Formata o número como moeda em BRL
        const formattedValue = numberValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        
        // Retorna o valor formatado com 'R$'
        return `R$ ${formattedValue}`;
      }
    },
    { field: 'premiacao_meta', headerName: 'Premiacao Meta', width: 80 },
    { field: 'qtd_reconquista', headerName: 'Reconquista', width: 150 },
    {
      field: 'valor_premiacao',
      headerName: 'Valor Premiação Reconquista',
      width: 150,
       valueFormatter: (params) => {
        // console.log('valor_comissional params:', params); // Linha de depuração para ver o valor real
        
        // Se o valor não estiver definido, retorna '0'
        if (!params) {
          return 'R$ 0,00';
        }
        
        // Substitui a vírgula por ponto e converte para número
        const numberValue = parseFloat(params.toString().replace(',', '.'));
        
        // Verifica se a conversão para número foi bem-sucedida
        if (isNaN(numberValue)) {
          return 'R$ 0,00'; // Retorna um valor padrão se a conversão falhar
        }
        
        // Formata o número como moeda em BRL
        const formattedValue = numberValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        
        // Retorna o valor formatado com 'R$'
        return `R$ ${formattedValue}`;
      }
    },
    {
      field: 'total_valor_premiacao',
      headerName: 'Total Valor Premiação Reconquista',
      width: 150,
      valueFormatter: (params) => {
        // console.log('valor_comissional params:', params); // Linha de depuração para ver o valor real
        
        // Se o valor não estiver definido, retorna '0'
        if (!params) {
          return 'R$ 0,00';
        }
        
        // Substitui a vírgula por ponto e converte para número
        const numberValue = parseFloat(params.toString().replace(',', '.'));
        
        // Verifica se a conversão para número foi bem-sucedida
        if (isNaN(numberValue)) {
          return 'R$ 0,00'; // Retorna um valor padrão se a conversão falhar
        }
        
        // Formata o número como moeda em BRL
        const formattedValue = numberValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        
        // Retorna o valor formatado com 'R$'
        return `R$ ${formattedValue}`;
      }
    },
    { field: 'qtd_repagar', headerName: 'Repagar', width: 150 },
    {
      field: 'valor_repagar',
      headerName: 'Valor Premiação Repagar',
      width: 150,
      valueFormatter: (params) => {
        // console.log('valor_comissional params:', params); // Linha de depuração para ver o valor real
        
        // Se o valor não estiver definido, retorna '0'
        if (!params) {
          return 'R$ 0,00';
        }
        
        // Substitui a vírgula por ponto e converte para número
        const numberValue = parseFloat(params.toString().replace(',', '.'));
        
        // Verifica se a conversão para número foi bem-sucedida
        if (isNaN(numberValue)) {
          return 'R$ 0,00'; // Retorna um valor padrão se a conversão falhar
        }
        
        // Formata o número como moeda em BRL
        const formattedValue = numberValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        
        // Retorna o valor formatado com 'R$'
        return `R$ ${formattedValue}`;
      }
    },
    {
      field: 'valorTotalRepagar',
      headerName: 'Total Valor Premiação Repagar',
      width: 150,
      valueFormatter: (params) => {
        // console.log('valor_comissional params:', params); // Linha de depuração para ver o valor real
        
        // Se o valor não estiver definido, retorna '0'
        if (!params) {
          return 'R$ 0,00';
        }
        
        // Substitui a vírgula por ponto e converte para número
        const numberValue = parseFloat(params.toString().replace(',', '.'));
        
        // Verifica se a conversão para número foi bem-sucedida
        if (isNaN(numberValue)) {
          return 'R$ 0,00'; // Retorna um valor padrão se a conversão falhar
        }
        
        // Formata o número como moeda em BRL
        const formattedValue = numberValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        
        // Retorna o valor formatado com 'R$'
        return `R$ ${formattedValue}`;
      }
    },
    {
      field: 'valorTotal',
      headerName: 'Valor Total',
      width: 150,
      valueFormatter: (params) => {
        // console.log('valor_comissional params:', params); // Linha de depuração para ver o valor real
        
        // Se o valor não estiver definido, retorna '0'
        if (!params) {
          return 'R$ 0,00';
        }
        
        // Substitui a vírgula por ponto e converte para número
        const numberValue = parseFloat(params.toString().replace(',', '.'));
        
        // Verifica se a conversão para número foi bem-sucedida
        if (isNaN(numberValue)) {
          return 'R$ 0,00'; // Retorna um valor padrão se a conversão falhar
        }
        
        // Formata o número como moeda em BRL
        const formattedValue = numberValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        
        // Retorna o valor formatado com 'R$'
        return `R$ ${formattedValue}`;
      }
    },
  ];


console.log(filteredData)
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
      funcao: item.funcao || '',
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

















