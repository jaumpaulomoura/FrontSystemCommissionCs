import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import SidebarMenu from '../components/SidebarMenu';
import ThemeToggleButton from '../components/ThemeToggleButton';
import SalesChart from '../components/SalesChart';
import ProgressBar from '../components/ProgressBar';
import { getFilteredPedidosDiaData, getFilteredPedidosmensalData, getFilteredMetaData } from '../services/apiService';

const Home = ({ onLogout, toggleTheme }) => {
    const [dailySales, setDailySales] = useState(0);
    const [monthlySales, setMonthlySales] = useState(0);
    const [goals, setGoals] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    const [rankingData, setRankingData] = useState([]);
    const [userRole, setUserRole] = useState('');

    const now = new Date();
    const day = now.getDate();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const today = now.toISOString().split('T')[0];
    const formattedMonthYear = `${month < 10 ? '0' : ''}${month}-${year}`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const cupomVendedora = user ? user.cupom : '';
                const funcao = user ? user.funcao : '';
                setUserRole(funcao);

                let dailySalesData, monthlySalesData, metaData, rankingData;

                dailySalesData = await getFilteredPedidosDiaData(year, month, day, funcao === 'consultora' ? cupomVendedora : '');
                monthlySalesData = await getFilteredPedidosmensalData(year, month, funcao === 'consultora' ? cupomVendedora : '');
                metaData = await getFilteredMetaData();

                const todaySalesData = dailySalesData.filter(item => item.day_month_year === today);
                const totalDailySales = todaySalesData.reduce((total, item) => total + (parseFloat(item.valor_bruto) || 0), 0);
                setDailySales(Number(totalDailySales.toFixed(2)));

                const totalMonthlySales = monthlySalesData.reduce((total, item) => total + (parseFloat(item.valor_bruto) || 0), 0);
                setMonthlySales(Number(totalMonthlySales.toFixed(2)));

                const filteredMeta = metaData.filter(meta => meta['mes_ano'] === formattedMonthYear);
                setGoals(filteredMeta);

                const dailyChartData = dailySalesData.map(item => ({
                    date: item.day_month_year.split('-')[2],
                    total: Number(parseFloat(item.valor_bruto).toFixed(2))
                }));
                setDailyData(dailyChartData);

                if (funcao !== 'consultora') {
                    rankingData = monthlySalesData.reduce((acc, item) => {
                        const cupom = item.cupom_vendedora;
                        if (!acc[cupom]) acc[cupom] = 0;
                        acc[cupom] += parseFloat(item.valor_bruto);
                        return acc;
                    }, {});
                    const rankingChartData = Object.keys(rankingData).map(cupom => ({
                        cupom_vendedora: cupom,
                        valor_bruto: Number(rankingData[cupom].toFixed(2))
                    }));
                    setRankingData(rankingChartData);
                }

            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        };

        fetchData();
    }, [year, month, day]);

    return (
        <Box sx={{ display: 'flex' }}>
            <SidebarMenu open={true} onClose={() => { }} />

            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <Box position="absolute" top={16} right={16}>
                    <ThemeToggleButton toggleTheme={toggleTheme} />
                </Box>
                <Typography variant="h4">Bem-vindo ao Sistema de Controle de Comissões de Vendas</Typography>


                <Grid container spacing={2} sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                    {userRole === 'consultora' ? (
                        <>

                            <Grid item xs={12} sm={6} md={2.4}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6">Vendas Diárias</Typography>
                                    <Typography variant="h4">
                                        {dailySales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2.4}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6">Vendas Mensais</Typography>
                                    <Typography variant="h4">
                                        {monthlySales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={12} md={7.2}>
                                <Paper sx={{ p: 2 }}>
                                    <ProgressBar
                                        current={monthlySales}
                                        goals={goals}
                                    />
                                </Paper>
                            </Grid>
                        </>
                    ) : (
                        <>
                            <Grid item xs={12} sm={6} >
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6">Vendas Diárias</Typography>
                                    <Typography variant="h4">
                                        {dailySales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6">Vendas Mensais</Typography>
                                    <Typography variant="h4">
                                        {monthlySales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </>
                    )}
                </Grid>


                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={12}>
                        <SalesChart
                            dailyData={dailyData}
                            rankingData={rankingData}
                            isConsultant={userRole === 'consultora'}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Home;
