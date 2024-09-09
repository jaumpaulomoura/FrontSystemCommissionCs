import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem } from '@mui/material';
import SidebarMenu from '../../components/SidebarMenu';
import { useNavigate } from 'react-router-dom';
import { createPremiacaoReconquista } from '../../services/apiService'; import ThemeToggleButton from '../../components/ThemeToggleButton';

const CreatePremiacaoReconquista = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    descricao: '',
    time: '',
    valor: '',
    minimo: '',
    maximo: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (!formData.descricao || !formData.time || !formData.valor) {
      setError('Todos os campos são obrigatórios!');
      return false;
    }
    if (isNaN(formData.valor)) {
      setError('Valor devem ser numéricos!');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await createPremiacaoReconquista(formData);
      setFormData({
        descricao: '',
        time: '',
        valor: '',
      });
      navigate('/premiacaoReconquista');
    } catch (error) {
      console.error('Erro ao criar Premiação:', error);
      setError('Erro ao criar Premiação. Verifique o console para mais detalhes.');
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
        <Typography variant="h4">Criar Premiacao Reconquista</Typography>
        <Paper sx={{ mt: 3, p: 3, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Descrição"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="filled"
              sx={{
                width: '400px',
                height: '56px',
                borderRadius: '8px',
              }}
            />
            <TextField
              select
              label="Time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              margin="normal"
              variant="filled"
              sx={{
                width: '400px',
                height: '56px',
                borderRadius: '8px',
              }}
            >
              <MenuItem value="Venda Ativa">Venda Ativa</MenuItem>
              <MenuItem value="Reconquista">Reconquista</MenuItem>
              {/* <MenuItem value="Todos">Todos</MenuItem> */}
            </TextField>
            <TextField
              label="Minimo"
              name="minimo"
              value={formData.minimo}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="filled"
              sx={{
                width: '400px',
                height: '56px',
                borderRadius: '8px',
              }}
            />
            <TextField
              label="Maximo"
              name="maximo"
              value={formData.maximo}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="filled"
              sx={{
                width: '400px',
                height: '56px',
                borderRadius: '8px',
              }}
            />

            <TextField
              label="Valor"
              name="valor"
              value={formData.valor}
              onChange={handleInputChange}
              margin="normal"
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
                onClick={() => navigate('/premiacaoReconquista')}
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

export default CreatePremiacaoReconquista;
