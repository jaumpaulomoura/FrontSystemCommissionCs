import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, TextField, FormControl, Button, InputLabel, Select, MenuItem, Paper, Modal, Table, TableBody, IconButton, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SidebarMenu from '../components/SidebarMenu';
import ThemeToggleButton from '../components/ThemeToggleButton';
import SalesChart from '../components/Dashboard/SalesChart';
import VigenciaChart from '../components/Dashboard/VigenciaChart';
import DataGridCat from '../components/Dashboard/DataGridCat';
import { getFilteredPedidosDiaData, getFilteredPedidosmensalData, getFilteredMetaData, getFilteredPedidosItemDataGroup, getFilteredOrderItensVigenciaData } from '../services/apiService';
import Cookies from 'js-cookie';
import LoupeIcon from '@mui/icons-material/Loupe';

const Home = ({ onLogout, toggleTheme }) => {

    const [dailyData, setDailyData] = useState([]);
    const [rankingData, setRankingData] = useState([]);
    const [userRole, setUserRole] = useState('');
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [selectedMonthYear, setSelectedMonthYear] = useState(`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`);
    const [selectedCupom, setSelectedCupom] = useState('');
    const [filteredRankingData, setFilteredRankingData] = useState([]);
    const [filteredMetasComProgresso, setFilteredMetasComProgresso] = useState([]);
    const [filteredPedidosItem, setFilteredPedidosItem] = useState([]);
    const [filteredPedidosItemVigente, setFilteredPedidosItemVigente] = useState([]);
    const [pedidosItem, setPedidosItem] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [pedidosItemVigente, setPedidosItemVigente] = useState([]);
    const [totalDailySales, setTotalDailySales] = useState(0);
    const [totalMonthlySales, setTotalMonthlySales] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [metaData, setMetaData] = useState([]);
    const [modalData, setModalData] = useState([]);
    const [summedData, setSummedData] = useState([]);
    const [aggregatedData, setAggregatedData] = useState([]);

    const user = JSON.parse(Cookies.get('user'));
    const cupomVendedora = user ? user.cupom : '';
    const funcao = user ? user.funcao : '';
    useEffect(() => {
        setUserRole(funcao);
        if (funcao === 'Consultora') {
            setSelectedCupom(cupomVendedora);
        }
    }, [funcao, cupomVendedora]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {


            const year = selectedMonthYear.split('-')[0];
            const month = selectedMonthYear.split('-')[1];
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0);

            const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
            const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
            const dailySalesData = await getFilteredPedidosDiaData(year, month, selectedDay, funcao === 'Consultora' ? cupomVendedora : '');
            const monthlySalesData = await getFilteredPedidosmensalData(year, month, funcao === 'Consultora' ? cupomVendedora : '');
            const metaData = await getFilteredMetaData();
            console.log("Start Date:", formattedStartDate);
            console.log("End Date:", formattedEndDate);




            const dailyChartData = dailySalesData
                .filter(item => funcao === 'Consultora' ? item.cupom_vendedora === cupomVendedora : selectedCupom === '' || item.cupom_vendedora === selectedCupom)
                .map(item => ({
                    date: item.day_month_year.split('-')[2],
                    cupomVendedora: item.cupom_vendedora,
                    nome: item.nome,
                    total: Number(parseFloat(item.valor_bruto).toFixed(2))
                }));

            setDailyData(dailyChartData);


            const rankingData = monthlySalesData.reduce((acc, item) => {
                const cupom = item.cupom_vendedora;
                if (!acc[cupom]) {
                    acc[cupom] = { nome: item.nome, total: 0 };
                }
                acc[cupom].total += parseFloat(item.valor_bruto);
                return acc;
            }, {});

            const rankingChartData = Object.keys(rankingData).map(cupom => ({
                cupom_vendedora: cupom,
                nome: rankingData[cupom].nome,
                valor_bruto: Number(rankingData[cupom].total.toFixed(2))
            }));

            setRankingData(rankingChartData);




            const fetchedMetaData = await getFilteredMetaData();
            setMetaData(fetchedMetaData);




        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedDay, selectedMonthYear]);

    useEffect(() => {
        const newFilteredRankingData = selectedCupom
            ? rankingData.filter(item => item.cupom_vendedora === selectedCupom)
            : rankingData;

        setFilteredRankingData(newFilteredRankingData);
    }, [rankingData, selectedCupom]);

    useEffect(() => {
        const newFilteredData = selectedCupom
            ? dailyData.filter(item => item.cupomVendedora === selectedCupom)
            : dailyData;

        setFilteredData(newFilteredData);
    }, [dailyData, selectedCupom]);



    useEffect(() => {
        const formattedMonthYear = selectedMonthYear.split('-').reverse().join('-');

        const filteredMeta = selectedCupom
            ? metaData.filter(meta => meta.cupom === selectedCupom && meta.mes_ano === formattedMonthYear)
            : metaData.filter(meta => meta.mes_ano === formattedMonthYear);
        console.log(filteredMeta)
        console.log(rankingData)
        const salesByCupom = rankingData.reduce((acc, sale) => {
            acc[sale.cupom_vendedora] = (acc[sale.cupom_vendedora] || 0) + sale.valor_bruto;
            return acc;
        }, {});
        console.log(salesByCupom)

        const metasComProgresso = Object.keys(salesByCupom).map(cupom => {
            const totalVendas = salesByCupom[cupom] || 0;
            const metasParaCupom = filteredMeta.filter(meta => meta.cupom === cupom);

            metasParaCupom.sort((a, b) => a.valor - b.valor);

            let metaAtual = "Não atingiu a meta";
            let valorProximaMeta = 0;
            let proximaMeta = "";
            let faltaParaMeta = 0;

            for (let i = 0; i < metasParaCupom.length; i++) {
                const meta = metasParaCupom[i];

                if (totalVendas >= meta.valor) {
                    if (i === metasParaCupom.length - 1) {
                        metaAtual = meta.meta;
                        break;
                    }
                    continue;
                } else {
                    if (i > 0) {
                        metaAtual = metasParaCupom[i - 1].meta;
                        valorProximaMeta = meta.valor;
                        proximaMeta = meta.meta;
                        faltaParaMeta = meta.valor - totalVendas;
                    } else {
                        metaAtual = "Não atingiu a meta";
                    }
                    break;
                }
            }

            return {
                nome: rankingData.find(sale => sale.cupom_vendedora === cupom)?.nome || 'Desconhecido',
                cupom,
                metaAtual,
                valorProximaMeta,
                totalVendas,
                faltaParaMeta,
                proximaMeta
            };
        });

        const order = ["Não atingiu a meta", "Meta", "Super meta", "Meta Desafio"];
        const orderMap = Object.fromEntries(order.map((item, index) => [item, index]));





        metasComProgresso.sort((a, b) => {
            const aOrder = orderMap[a.metaAtual] !== undefined ? orderMap[a.metaAtual] : Infinity;
            const bOrder = orderMap[b.metaAtual] !== undefined ? orderMap[b.metaAtual] : Infinity;

            return aOrder - bOrder;
        });



        const metasFiltradasComProgresso = selectedCupom
            ? metasComProgresso.filter(meta => meta.cupom === selectedCupom)
            : metasComProgresso;
        console.log(metasFiltradasComProgresso)
        setFilteredMetasComProgresso(metasFiltradasComProgresso);
    }, [rankingData, metaData, selectedCupom, selectedMonthYear]);
    console.log("Cupom selecionado:", selectedCupom);








    useEffect(() => {

        const fetchDataItens = async () => {
            const [years, months] = selectedMonthYear.split('-');
            const startDate = new Date(years, months - 1, 1);
            const endDate = new Date(years, months, 0);

            const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
            const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

            try {
                const pedidosItem = await getFilteredPedidosItemDataGroup(
                    formattedStartDate,
                    formattedEndDate,
                    funcao === 'Consultora' ? selectedCupom : ''
                );
                console.log("Pedidos Item:", pedidosItem);
                setPedidosItem(pedidosItem);
                setFilteredPedidosItem(pedidosItem);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        if (selectedMonthYear) {
            fetchDataItens();
        }
    }, [selectedMonthYear]);



    useEffect(() => {

        const fetchDataItensVigente = async () => {
            const [years, months] = selectedMonthYear.split('-');
            const startDate = new Date(years, months - 1, 1);
            const endDate = new Date(years, months, 0);

            const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
            const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;

            try {
                const pedidosItemVigente = await getFilteredOrderItensVigenciaData(
                    formattedStartDate,
                    formattedEndDate,
                    funcao === 'Consultora' ? selectedCupom : ''
                );
                console.log("Pedidos Item:", pedidosItemVigente);
                setPedidosItemVigente(pedidosItemVigente);
                setFilteredPedidosItemVigente(pedidosItemVigente);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            }
        };

        if (selectedMonthYear) {
            fetchDataItensVigente();
        }
    }, [selectedMonthYear]);






    useEffect(() => {
        const filterData = () => {
            console.log("Valor de funcao:", funcao);
            console.log("Valor de selectedCupom:", selectedCupom);

            if ((funcao === 'Consultora' || funcao === 'Lider') && selectedCupom) {

                const filteredData = pedidosItem.filter(item => item.cupom_vendedora === selectedCupom);
                console.log("Pedidos filtrados:", filteredData);
                setFilteredPedidosItem(filteredData);
            } else {
                console.log("Caindo no else, retornando todos os dados");
                setFilteredPedidosItem(pedidosItem);
            }
        };

        filterData();
    }, [selectedCupom, pedidosItem]);



    useEffect(() => {
        const processSummedData = () => {
            if (filteredPedidosItemVigente.length === 0) return;
            console.log("Pedidos filtrados antes da soma:", filteredPedidosItemVigente);
            const aggregated = filteredPedidosItemVigente.reduce((acc, item) => {
                const cupom = item.cupom_vendedora || "Indefinido";
                const vigenciaStatus = item.vigencia_status ?? "Desconhecido";
                const key = `${item.cupom_vendedora}-${item.vigencia_status || "Desconhecido"}`;


                if (!acc[key]) {
                    acc[key] = {
                        cupom_vendedora: item.cupom_vendedora,
                        vigencia_status: item.vigencia_status || "Desconhecido",
                        total_itens: 0,
                        valorDesc: 0,
                        valorPago: 0,
                        valor_bruto: 0,
                        valor_desconto: 0,
                        valor_frete: 0,
                        valor_pago: 0
                    };
                }

                acc[key].total_itens += item.total_itens || 0;
                acc[key].valorDesc += item.valorDesc || 0;
                acc[key].valorPago += item.valorPago || 0;
                acc[key].valor_bruto += item.valor_bruto || 0;
                acc[key].valor_desconto += item.valor_desconto || 0;
                acc[key].valor_frete += item.valor_frete || 0;
                acc[key].valor_pago += item.valor_pago || 0;


                return acc;
            }, {});

            const resultArray = Object.values(aggregated);
            setAggregatedData(resultArray);
            console.log("Dados agregados:", resultArray);
        };

        processSummedData();
    }, [filteredPedidosItemVigente]);


    useEffect(() => {
        const processSummedData = () => {
            if (filteredPedidosItem.length === 0) return;
            console.log("Pedidos filtrados antes da soma:", filteredPedidosItem);
            const aggregatedData = filteredPedidosItem.reduce((acc, item) => {
                const { marca, catGestor_desc, classGestor_desc, quantidade, valorPago, valorDesconto } = item;


                const valorPagoFloat = (typeof valorPago === 'string' ? parseFloat(valorPago.replace(',', '.')) : 0);
                const descontoFloat = (typeof valorDesconto === 'string' ? parseFloat(valorDesconto.replace(',', '.')) : 0);
                const valorPagobruto = (typeof valorPago === 'string' ? parseFloat(valorPago.replace(',', '.')) : 0) + (typeof valorDesconto === 'string' ? parseFloat(valorDesconto.replace(',', '.')) : 0)

                const key = `${marca}-${catGestor_desc}-${classGestor_desc}`;

                if (!acc[key]) {
                    acc[key] = {
                        id: key,
                        marca,
                        catGestor_desc,
                        classGestor_desc,
                        quantidadeTotal: 0,
                        valorTotalPago: 0,
                        valorTotalBruto: 0,
                        valorDesconto: 0,
                        quantidadeDescontos: 0,
                    };
                }

                acc[key].quantidadeTotal += quantidade;
                acc[key].valorTotalPago += valorPagoFloat;
                acc[key].valorTotalBruto += valorPagobruto;
                acc[key].valorDesconto += descontoFloat;
                acc[key].quantidadeDescontos += quantidade > 0 ? 1 : 0;

                return acc;
            }, {});


            const summedDataWithAverage = Object.values(aggregatedData).map(item => {
                const mediaDesconto = item.quantidadeDescontos > 0 ? (item.valorDesconto / item.valorTotalBruto) : 0;
                return {
                    ...item,
                    mediaDesconto,
                };
            });
            console.log("Dados somados antes de atualizar o estado:", summedDataWithAverage);
            setSummedData(summedDataWithAverage);
        };

        processSummedData();
    }, [filteredPedidosItem]);






    const calculateTotals = () => {

        const dailyTotal = filteredData
            .filter(item => item.date === selectedDay.toString())
            .reduce((acc, item) => acc + item.total, 0);


        const monthlyTotal = filteredRankingData.reduce((acc, item) => acc + item.valor_bruto, 0);

        setTotalDailySales(dailyTotal);
        setTotalMonthlySales(monthlyTotal);
    };


    useEffect(() => {
        calculateTotals();
    }, [filteredData, filteredRankingData]);

    const handleDayChange = (event) => {
        const value = Math.min(Math.max(event.target.value, 1), 31);
        setSelectedDay(value);
    };

    const handleMonthYearChange = (event) => {
        setSelectedMonthYear(event.target.value);
    };

    const handleCupomChange = (event) => {
        setSelectedCupom(event.target.value);
    };
    const handleOpenModal = async () => {
        try {

            const dayString = selectedDay.toString().padStart(2, '0');


            const filteredDetails = filteredData.filter(sale => sale.date === dayString);



            setModalData(filteredDetails);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Erro ao carregar detalhes:", error);
        }
    };



    const handleCloseModal = () => setIsModalOpen(false);


    const columns = [
        { field: 'nome', headerName: 'Nome', width: 150, },

        {
            field: 'metaAtual',
            headerName: 'Meta Atual',
            width: 150,














        }

        ,
        {
            field: 'totalVendas', headerName: 'Total Vendas', width: 110, valueFormatter: (params) => {

                const numberValue = Number(params || 0);


                const formattedValue = numberValue.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                return `R$ ${formattedValue}`;
            }
        },
        {
            field: 'faltaParaMeta', headerName: 'Falta para a Proxima Meta', width: 110,
            renderHeader: () => (
                <div style={{ textAlign: 'center', whiteSpace: 'normal' }}>
                    <span>Falta para a</span><br />
                    <span>Proxima Meta</span>
                </div>
            ),
            valueFormatter: (params) => {

                const numberValue = Number(params || 0);


                const formattedValue = numberValue.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                return `R$ ${formattedValue}`;
            }
        },
        {
            field: 'proximaMeta', headerName: 'Próxima Meta', width: 100,
            renderHeader: () => (
                <div style={{ textAlign: 'center', whiteSpace: 'normal' }}>
                    <span>Proxima</span><br />
                    <span>Meta</span>
                </div>
            ),
        },
        {
            field: 'valorProximaMeta', headerName: 'Valor da Próxima Meta', width: 110,
            renderHeader: () => (
                <div style={{ textAlign: 'center', whiteSpace: 'normal' }}>
                    <span>Valor da</span><br />
                    <span>Proxima Meta</span>
                </div>
            ),
            valueFormatter: (params) => {

                const numberValue = Number(params || 0);


                const formattedValue = numberValue.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                return `R$ ${formattedValue}`;
            }
        },

    ];

    const rows = filteredMetasComProgresso.length === 0
        ? []
        : filteredMetasComProgresso.map((item, index) => ({
            id: index,
            nome: item.nome,

            metaAtual: item.metaAtual,
            totalVendas: item.totalVendas,
            proximaMeta: item.proximaMeta,
            valorProximaMeta: item.valorProximaMeta,
            faltaParaMeta: item.faltaParaMeta,
        }));





    return (
        <Box sx={{ display: 'flex' }}>
            <SidebarMenu open={true} onClose={() => { }} />
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <Box position="absolute" top={16} right={16}>
                    <ThemeToggleButton toggleTheme={toggleTheme} />
                </Box>
                <Typography variant="h4">Bem-vindo ao Sistema de Controle de Comissões de Vendas</Typography>

                <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                    <TextField
                        label="Dia"
                        type="number"
                        value={selectedDay}
                        onChange={handleDayChange}
                        inputProps={{ min: 1, max: 31 }}
                        sx={{ width: '100px' }}
                    />
                    <TextField
                        label="Mês/Ano"
                        type="month"
                        value={selectedMonthYear}
                        onChange={handleMonthYearChange}
                        sx={{ width: '200px' }}
                    />
                    {userRole !== 'Consultora' && (
                        <FormControl fullWidth sx={{ mb: 2, width: '200px' }}>
                            <InputLabel id="select-cupom-label">Selecionar Cupom</InputLabel>
                            <Select
                                labelId="select-cupom-label"
                                value={selectedCupom}
                                onChange={handleCupomChange}
                            >
                                <MenuItem value="">
                                    <em>Todos</em>
                                </MenuItem>
                                {rankingData.map(item => (
                                    <MenuItem key={item.cupom_vendedora} value={item.cupom_vendedora}>
                                        {item.cupom_vendedora} - {item.nome}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography variant="h6" color="error">{error}</Typography>
                ) : (





                    <Grid container spacing={2} sx={{ display: 'flex', direction: 'row', flexWrap: 'wrap', mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography variant="h6">Vendas Diarias</Typography>
                                    <Typography variant="h4">
                                        {totalDailySales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Typography>
                                </div>
                                <IconButton onClick={() => handleOpenModal(selectedDay)} color="#424242" aria-label="Ver Detalhes">
                                    <LoupeIcon />
                                </IconButton>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6">Vendas Mensais</Typography>
                                <Typography variant="h4">
                                    {totalMonthlySales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </Typography>
                            </Paper>
                        </Grid>

                        {userRole === 'Consultora' ? (
                            <>
                                {/* Coluna para o gráfico */}
                                <Grid item xs={12} sm={6}>

                                    <SalesChart
                                        dailyData={filteredData}
                                        isConsultant={true}
                                        selectedCupom={selectedCupom}
                                        style={{ height: '100%', width: '100%' }}
                                    />
                                </Grid>

                                {/* Coluna para a tabela */}
                                <Grid item xs={12} sm={6}>
                                    <Paper sx={{ p: 2, height: 430 }}> {/* Definindo uma altura fixa */}
                                        <DataGridCat summedData={summedData} />
                                    </Paper>
                                </Grid>
                            </>
                        ) : (

                            <>
                                <Grid item xs={12} >
                                    <SalesChart
                                        dailyData={filteredData}
                                        rankingData={filteredRankingData}
                                        isConsultant={false}
                                        selectedCupom={selectedCupom}
                                    />
                                </Grid>
                            </>
                        )}

                    </Grid>
                )}









                <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>

                    <Grid item xs={12} sm={6}> {funcao !== 'Consultora' && (
                        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            {filteredMetasComProgresso.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    Nenhum dado disponível.
                                </div>
                            ) : (
                                <Paper
                                    sx={{
                                        width: '100%',
                                        marginTop: '10px',


                                        padding: '16px',
                                    }}
                                >
                                    <DataGrid
                                        rows={rows}
                                        columns={columns}


                                        disableSelectionOnClick
                                        initialState={{
                                            pagination: {
                                                paginationModel: {
                                                    pageSize: 16,
                                                },
                                            },
                                        }}
                                        autoHeight
                                        pageSizeOptions={[16]}
                                        disableColumnMenu
                                        rowHeight={30}
                                    />
                                </Paper>
                            )}
                        </Paper>
                    )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {funcao !== 'Consultora' && (
                            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Paper
                                    sx={{
                                        width: '100%',
                                        marginTop: '10px',
                                        padding: '16px',
                                    }}
                                >
                                    {/* <SalesChartItens summedData={summedData} /> */}
                                    <DataGridCat summedData={summedData} />
                                </Paper>
                            </Paper>
                        )}

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {funcao !== 'Consultora' && (
                            <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Paper
                                    sx={{
                                        width: '100%',
                                        marginTop: '10px',
                                        padding: '16px',
                                    }}
                                >
                                    {/* <SalesChartItens summedData={summedData} /> */}
                                    <VigenciaChart orders={aggregatedData} />

                                </Paper>
                            </Paper>
                        )}

                    </Grid>
                </Grid>
            </Box>
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box s sx={{
                    width: 600,
                    maxHeight: '80vh',
                    bgcolor: 'background.paper',
                    p: 4,
                    m: 'auto',
                    mt: 8,
                    overflowY: 'auto',
                    borderRadius: 2,
                }}>
                    <Typography variant="h6">Detalhes das Vendas do Dia</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Vendedor</TableCell>
                                    <TableCell>Valor da Venda</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {modalData.map((sale, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{sale.cupomVendedora} - {sale.nome}</TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            }).format(sale.total)}
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Button onClick={handleCloseModal} variant="contained" sx={{ mt: 2 }}>Fechar</Button>
                </Box>
            </Modal>
        </Box>

    );
};

export default Home;
