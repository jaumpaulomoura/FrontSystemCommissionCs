import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import SidebarMenu from '../../components/SidebarMenu';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { useNavigate } from 'react-router-dom';
import { createTicket, getTicketData } from '../../services/apiService';
import Cookies from 'js-cookie'; 

const CreateTicket = ({ toggleTheme }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: '',
        orderId: '',
        octadeskId: '',
        reason: '',
        notes: '',
        status: 'Aberto',
        cupomvendedora: '',
        dateCreate: '',
        dateUpdated: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTicketsAndSetId = async () => {
            try {
                const tickets = await getTicketData();
                const lastId = tickets.length > 0 ? Math.max(...tickets.map(ticket => parseInt(ticket.id))) : 0;
                const nextId = lastId + 1;

                const today = new Date();
                const formattedDate = today.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                const user = JSON.parse(Cookies.get('user'));
                const cupomvendedora = user ? user.cupom : 'Nome Padrão';
                setFormData((prevData) => ({
                    ...prevData,
                    id: nextId,
                    dateCreate: formattedDate,
                    cupomvendedora,
                }));
            } catch (error) {
                setError('Erro ao buscar dados de tickets.');
                console.error('Erro ao buscar dados de tickets:', error);
            }
        };

        fetchTicketsAndSetId();
    }, []);


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'dateCreate') {
            const formattedDate = value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1/$2')
                .replace(/(\d{2})(\d)/, '$1/$2')
                .slice(0, 10);

            setFormData({
                ...formData,
                [name]: formattedDate,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const validateForm = () => {
        if (!formData.orderId || !formData.octadeskId || !formData.reason) {
            setError('Todos os campos são obrigatórios!');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await createTicket(formData);

            setFormData({
                id: '',
                orderId: '',
                octadeskId: '',
                reason: '',
                notes: '',
                status: 'Aberto',
                cupomvendedora: JSON.parse(Cookies.get('user'))?.name || '',
                dateCreate: '',
                dateUpdated: '',
            });
            navigate('/ticket');
        } catch (error) {
            console.error('Erro ao criar ticket:', error);
            setError('Erro ao criar ticket. Verifique o console para mais detalhes.');
        }
    };



    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <SidebarMenu open={sidebarOpen} onClose={handleSidebarToggle} />
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                <Box position="absolute" top={16} right={16}>
                    <ThemeToggleButton toggleTheme={toggleTheme} />
                </Box>
                <Typography variant="h4">Criar Ticket</Typography>
                <Paper sx={{ mt: 3, p: 3, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <TextField
                                    label="Número do Ticket"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleInputChange}
                                    fullWidth
                                    variant="filled"
                                    sx={{
                                        width: '180px',
                                        height: '56px',
                                        borderRadius: '8px',
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Cupom"
                                    name="cupomvendedora"
                                    value={formData.cupomvendedora}
                                    onChange={handleInputChange}
                                    fullWidth
                                    variant="filled"
                                    sx={{
                                        width: '190px',
                                        height: '56px',
                                        borderRadius: '8px',
                                    }}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            label="Número do Pedido"
                            name="orderId"
                            value={formData.orderId}
                            onChange={handleInputChange}
                            fullWidth
                            variant="filled"
                            sx={{
                                width: '400px',
                                height: '56px',
                                borderRadius: '8px',
                            }}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="select_reason">Motivo</InputLabel>
                            <Select
                                labelId="select_reason"
                                id="select_reason_select"
                                name="reason"
                                value={formData.reason}
                                label="Motivo"
                                onChange={handleInputChange}
                                variant="filled"
                                sx={{
                                    width: '400px',
                                    height: '56px',
                                    borderRadius: '8px',
                                }}
                            >
                                <MenuItem value="Instabilidade">Instabilidade</MenuItem>
                                <MenuItem value="Troca">Troca</MenuItem>
                                <MenuItem value="Chance">Chance</MenuItem>
                                <MenuItem value="Reconquista">Reconquista</MenuItem>
                                <MenuItem value="Status para Aprovado">Status para Aprovado</MenuItem>
                                <MenuItem value="Status para Cancelado">Status para Cancelado</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Número do Atendimento no Octadesk"
                            name="octadeskId"
                            value={formData.octadeskId}
                            onChange={handleInputChange}
                            fullWidth
                            variant="filled"
                            sx={{
                                width: '400px',
                                height: '56px',
                                borderRadius: '8px',
                            }}
                        />

                        <TextField
                            label="Observação"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            fullWidth
                            variant="filled"
                            sx={{
                                width: '400px',
                                height: '56px',
                                borderRadius: '8px',
                            }}
                        />

                        {error && <Typography color="error">{error}</Typography>}

                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            <Button type="submit" variant="contained" sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#45a049' } }}>
                                Salvar
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate('/ticket')}
                                sx={{ backgroundColor: 'red', color: '#fff', '&:hover': { backgroundColor: '#d32f2f' } }}
                            >
                                Cancelar
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Box>
    );
};

export default CreateTicket;
