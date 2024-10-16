import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Grid, Autocomplete } from '@mui/material';
import SidebarMenu from '../../components/SidebarMenu';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { useNavigate } from 'react-router-dom';
import { createTicket, getTicketData, getColaboradorData } from '../../services/apiService';
import Cookies from 'js-cookie';
import { useToast } from '../../components/ToastProvider';

const CreateTicket = ({ toggleTheme }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const [selectedName, setSelectedName] = useState('');
    const [selectedCupom, setSelectedCupom] = useState('');
    const [colaboradores, setColaboradores] = useState([]);
    const [user, setUser] = useState(null);
    const [nextIds, setNextIds] = useState('')
    const { showToast } = useToast();
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
                console.log('ticket', tickets);
                const lastId = tickets.length > 0 ? Math.max(...tickets.map(ticket => parseInt(ticket.id))) : 0;
                const nextId = lastId + 1;
                console.log('nextId', nextId)
                setNextIds(nextId)
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
        let isValid = true;
        const errors = [];

        // Verificação dos campos obrigatórios
        if (!formData.orderId) {
            errors.push('Número do Pedido');
            isValid = false;
        }
        if (!formData.octadeskId) {
            errors.push('Número do atendimento do Octadesk');
            isValid = false;
        }
        if (!formData.reason) {
            errors.push('Motivo');
            isValid = false;
        }

        // Se houver mensagens de erro, concatene-as e exiba o toast
        if (!isValid) {
            const message = `${errors.join(', ')} é obrigatório!`;
            showToast(message, 'error');
        }

        return isValid;
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault(); // Previne o comportamento padrão do formulário

    //     if (!validateForm()) return; // Se não for válido, exibe os toasts e retorna

    //     try {
    //         const response = await createTicket(formData); // Cria o ticket
    //         setFormData({
    //             id: '',
    //             orderId: '',
    //             octadeskId: '',
    //             reason: '',
    //             notes: '',
    //             status: 'Aberto',
    //             cupomvendedora: JSON.parse(Cookies.get('user'))?.name || '',
    //             dateCreate: '',
    //             dateUpdated: '',
    //         });
    //         showToast('Ticket criado com sucesso!', 'success'); // Toast de sucesso após criação
    //         navigate('/ticket'); // Navega para a página de tickets
    //     } catch (error) {
    //         console.error('Erro ao criar ticket:', error);
    //         showToast('Erro ao criar ticket. Verifique o console para mais detalhes.', 'error'); // Toast de erro
    //     }
    // };


    // useEffect para preencher cupom baseado na função do usuário
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getColaboradorData();
                const user = JSON.parse(Cookies.get('user'));
                console.log('user', user)

                if (user) {
                    if (user.funcao === "Consultora") {
                        // Se Consultora, preenche com seu próprio cupom e nome
                        setSelectedName(user.nome);
                        setSelectedCupom(user.cupom);
                        setFormData({ ...formData, cupomvendedora: user.cupom });
                    } else {
                        // Caso contrário, filtra por time ou exibe todos
                        const filteredColaboradores = user.time
                            ? data.filter(colaborador => colaborador.time === user.time)
                            : data;
                        setColaboradores(filteredColaboradores);
                    }
                } else {
                    console.warn('Usuário não encontrado.');
                    setColaboradores(data);
                }
            } catch (err) {
                showToast('Erro ao buscar dados dos colaboradores.', 'error');
                console.error('Erro ao buscar dados dos colaboradores:', err);
            }
        };

        fetchData();
    }, []);

    // Modifica handleNameChange para permitir seleção de outros cupons se não for Consultora
    const handleNameChange = (event, newValue) => {
        const nomeDigitado = newValue || '';
        setSelectedName(nomeDigitado);

        const colaborador = colaboradores.find(colab => colab.nome.toLowerCase() === nomeDigitado.toLowerCase());

        if (colaborador) {
            setSelectedCupom(colaborador.cupom);
            setFormData({ ...formData, cupomvendedora: colaborador.cupom });
            setError('');
        } else {
            setSelectedCupom('');
            setFormData({ ...formData, cupomvendedora: '' });
            setError('Colaborador não encontrado.');
        }
    }; const handleCupomChange = (event, newValue) => {
        const cupomDigitado = newValue || '';
        setSelectedCupom(cupomDigitado);
        setFormData({ ...formData, cupomvendedora: cupomDigitado });

        const colaborador = colaboradores.find(colab => colab.cupom.toLowerCase() === cupomDigitado.toLowerCase());

        if (colaborador) {
            setSelectedName(colaborador.nome);
        } else {
            setSelectedName('');
            setFormData({ ...formData, cupomvendedora: '' });
        }
    };

    // handleSubmit para tratar criação de ticket com base na função
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Dados do formulário antes da validação:', formData);
        if (!validateForm()) return;

        try {
            // Garante que Consultora usa seu próprio cupom, enquanto outros podem escolher
            const user = JSON.parse(Cookies.get('user'));
            const cupomVendedora = user.funcao === 'Consultora' ? user.cupom : formData.cupomvendedora;

            const response = await createTicket({
                ...formData,
                cupomvendedora: cupomVendedora,
                status: 'Aberto',
            });
            console.log('Resposta da API:', response);

            setFormData({
                id: '',
                orderId: '',
                octadeskId: '',
                reason: '',
                notes: '',
                status: 'Aberto',
                cupomvendedora: cupomVendedora,
                dateCreate: '',
                dateUpdated: '',
            });

            showToast('Ticket criado com sucesso!', 'success');
            navigate('/ticket');
        } catch (error) {
            console.error('Erro ao criar ticket:', error);
            showToast('Erro ao criar ticket. Verifique o console para mais detalhes.', 'error');
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

                        <Grid item xs={10} sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                            
                                <Grid item xs={2}>
                                    <TextField
                                        label="Número do Ticket"
                                        name="id"
                                        value={nextIds}
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
                                <Grid item xs={5}>
                                    <Autocomplete
                                        value={selectedName || ''}
                                        onChange={handleNameChange}
                                        options={user?.funcao === "Consultora" ? [user.name] : colaboradores.map(colab => colab.nome)}
                                        renderInput={(params) => <TextField {...params} label="Nome" variant="outlined" />}
                                        noOptionsText="Nenhuma opção disponível"
                                        isOptionEqualToValue={(option, value) => option === value}
                                        sx={{
                                            width: '180px',
                                            height: '56px',
                                            borderRadius: '8px',
                                        }}
                                    />
                                </Grid>


                                <Grid item xs={10}>
                                    <Autocomplete
                                        value={selectedCupom || ''}
                                        onChange={handleCupomChange}
                                        options={user?.funcao === "Consultora" ? [user.cupom] : colaboradores.map(colab => colab.cupom)}
                                        renderInput={(params) => <TextField {...params} label="Cupom" variant="outlined" />}
                                        noOptionsText="Nenhuma opção disponível"
                                        isOptionEqualToValue={(option, value) => option === value}
                                        sx={{
                                            width: '180px',
                                            height: '56px',
                                            borderRadius: '8px',
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
