import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem } from '@mui/material';
import SidebarMenu from '../../components/SidebarMenu';
import { useNavigate } from 'react-router-dom';
import { createColaborador } from '../../services/apiService';
import ThemeToggleButton from '../../components/ThemeToggleButton';

const CreateColaborador = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cupom: '',
    nome: '',
    funcao: '',
    time: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cupom || !formData.nome || !formData.funcao || !formData.time) {
      alert('Todos os campos são obrigatórios!');
      return;
    }

    try {
      console.log('Enviando dados:', formData); // Log dos dados enviados
      const response = await createColaborador(formData);
      console.log('Resposta recebida:', response); // Log da resposta do servidor
      setFormData({
        cupom: '',
        nome: '',
        funcao: '',
        time: '',
      });
      navigate('/colaborador'); // Assuming you want to go back to the list page
    } catch (error) {
      console.error('Erro ao criar colaborador:', error);
      //   alert('Erro ao criar colaborador. Verifique o console para mais detalhes.');
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
        <Typography variant="h4">Criar Colaborador</Typography>
        <Paper sx={{ mt: 3, p: 3, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Cupom"
              name="cupom"
              value={formData.cupom}
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
              label="Nome"
              name="nome"
              value={formData.nome}
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
              label="Função"
              name="funcao"
              value={formData.funcao}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="filled"
              sx={{
                width: '400px',
                height: '56px',
                borderRadius: '8px',
              }}
            >
              <MenuItem value="Consultora">Consultora</MenuItem>
              <MenuItem value="Gerente">Gerente</MenuItem>
              <MenuItem value="Administrador">Administrador</MenuItem>
            </TextField>

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
              <MenuItem value="Todos">Todos</MenuItem>
            </TextField>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" color="primary" sx={{ borderRadius: '8px' }}>
                Salvar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/colaborador')}
                sx={{ borderRadius: '8px' }}
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

export default CreateColaborador;
