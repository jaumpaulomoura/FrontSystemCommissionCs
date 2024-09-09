import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Grid } from '@mui/material';
import SidebarMenu from '../../components/SidebarMenu';
import { useNavigate } from 'react-router-dom';
import { createMeta } from '../../services/apiService';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import { width } from '@mui/system';
dayjs.locale('pt-br');
const metaDataInitial = [
  { meta: 'Não atingiu a meta', porcentagem: '0.005', valor: '0' },
  { meta: 'Meta', porcentagem: '0.01', valor: '0' },
  { meta: 'Super meta', porcentagem: '0.015', valor: '0' },
  { meta: 'Meta Desafio', porcentagem: '0.02', valor: '0' },
];

const CreateMeta = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cupom: '',
  });
  const [metaData, setMetaData] = useState(metaDataInitial);
  const [selectedDate, setSelectedDate] = useState(null); // Estado para o DatePicker
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMetaData = metaData.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setMetaData(updatedMetaData);
  };

  const validateForm = () => {
    if (!formData.cupom || !selectedDate) {
      setError('Cupom e Mês/Ano são obrigatórios!');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedDate = dayjs(selectedDate).format('MM-YYYY');

    const metaDataArray = metaData.map(item => ({
      cupom: formData.cupom,
      mes_ano: formattedDate,
      meta: item.meta,
      porcentagem: item.porcentagem,
      valor: item.valor
    }));

    try {
      await createMeta(metaDataArray);
      setSuccess('Meta criada com sucesso!');
      setFormData({ cupom: '' });
      setMetaData(metaData.map(item => ({ ...item, valor: '0' })));
      setSelectedDate(null); // Resetar a data
      setTimeout(() => navigate('/meta'), 2000);
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      setError('Erro ao criar meta. Verifique o console para mais detalhes.');
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
        <Typography variant="h4">Criar Meta</Typography>
        <Paper sx={{ mt: 3, p: 3, borderRadius: '12px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Grid container spacing={4}>
                <Grid item xs={2.05}>
                  <TextField
                    label="Cupom"
                    name="cupom"
                    value={formData.cupom}
                    onChange={(e) => setFormData({ ...formData, cupom: e.target.value })}
                    fullWidth
                    margin="normal"
                    variant="filled"
                    style={{  height: '56px', borderRadius: '8px' }}
                  />
                </Grid>
                <Grid item xs={2.05} sx={{ mt: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                    <DatePicker
                      views={['month', 'year']}
                      label="Mês/Ano"
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          style={{
                            marginTop:'1px',
                            maxWidth: '200px',
                            height: '56px',
                            fontSize: '13px',
                            borderRadius: '8px',
                          }}
                        />
                      )}
                      inputFormat="MM-YYYY"
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Grid container spacing={2}>
                {metaData.map((item, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={4}>
                      <TextField
                        label="Meta"
                        value={item.meta}
                        InputProps={{
                          readOnly: true,
                          style: { backgroundColor: '#f5f5f5' }
                        }}
                        variant="filled"
                        fullWidth
                        sx={{ borderRadius: '8px' }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label="Porcentagem"
                        value={item.porcentagem}
                        InputProps={{
                          readOnly: true,
                          style: { backgroundColor: '#f5f5f5' }
                        }}
                        variant="filled"
                        fullWidth
                        sx={{ borderRadius: '8px' }}
                      />
                    </Grid>
                    <Grid item xs={2.5}>
                      <TextField
                        label="Valor"
                        name="valor"
                        value={item.valor}
                        onChange={(e) => handleInputChange(e, index)}
                        variant="filled"
                        fullWidth
                        sx={{
                          borderRadius: '8px',
                          backgroundColor: '#f5f5f5',
                          '& .MuiInputBase-input': { padding: '16px' },
                        }}
                      />
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Box>

            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="primary">{success}</Typography>}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#45a049' } }}
              >
                Salvar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/meta')}
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

export default CreateMeta;
