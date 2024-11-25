import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem, Grid, Autocomplete } from '@mui/material';
import SidebarMenu from '../../components/SidebarMenu';
import { useNavigate } from 'react-router-dom';
import { createColaborador, getColaboradorDataChb } from '../../services/apiService';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useToast } from '../../components/ToastProvider';



const CreateColaborador = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [colaboradoresChb, setColaboradoresChb] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [formData, setFormData] = useState({
    cupom: '',
    nome: '',
    
    funcao: '',
    time: '',
    email: '',
    password: '',
    dtadmissao: '',
    dtdemissao: ''

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getColaboradorDataChb();
        setColaboradoresChb(data);
      } catch (error) {
        console.error("Erro ao buscar dados dos colaboradores:", error);
      }
    };

    fetchData();
  }, []);

  const formatText = (text) => {
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleNameChange = (event, newValue) => {
    
    setSelectedName(newValue);
    const formattedName = formatText(newValue);
    
    const colaboradorSelecionado = colaboradoresChb.find(colab => formatText(colab.fp02nom) === formattedName);

    if (colaboradorSelecionado) {
      setFormData({
        ...formData,
        nome: formattedName, 
        dtadmissao: colaboradorSelecionado.fp02dtadmi || '', 
        dtdemissao: colaboradorSelecionado.dt_demissao || '', 
      });
    } else {
      
      setFormData({
        ...formData,
        nome: formattedName,
        dtadmissao: '',
        dtdemissao: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cupom || !formData.nome || !formData.funcao || !formData.time || !formData.email || !formData.password) {
      alert('Todos os campos são obrigatórios!');
      return;
    }

    try {
      const response = await createColaborador({
        ...formData,
        nome: formatText(formData.nome.trim()), 
      });
      setFormData({
        cupom: '',
        nome: '',
        funcao: '',
        time: '',
        email: '',
        password: '',
        dtadmissao: '',
        dtdemissao: ''
      });
      showToast('Colaborador criado com sucesso!', 'success');
      navigate('/colaborador');
    } catch (error) {
      showToast('Erro ao criar colaborador:', 'error');
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };


  const [showPassword, setShowPassword] = useState(false);


  const handleClickShowPassword = () => setShowPassword(!showPassword);

  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString.trim());
    if (isNaN(date.getTime())) return ''; 
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
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
            <Grid item xs={5}>
              <Autocomplete
                value={selectedName || ''}
                onChange={handleNameChange}
                options={colaboradoresChb.map(colab => formatText(colab.fp02nom))}
                renderInput={(params) => <TextField {...params} label="Nome" variant="outlined" />}
                noOptionsText="Nenhuma opção disponível"
                isOptionEqualToValue={(option, value) => option === value}
                sx={{ width: '400px', height: '56px', borderRadius: '8px' }}
              />
            </Grid>

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
              <MenuItem value="Supervisora">Supervisora</MenuItem>
              <MenuItem value="Lider">Lider</MenuItem>
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
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="filled"
              placeholder="Digite seu email"
              sx={{
                width: '400px',
                height: '56px',
                borderRadius: '8px',
              }}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="filled"
              placeholder="Digite sua senha"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                width: '400px',
                height: '56px',
                borderRadius: '8px',
              }}
            />
          <TextField
  label="Data de Admissão"
  name="dtadmissao"
  value={formatDate(formData.dtadmissao)} 
  onChange={handleInputChange}
  fullWidth
  margin="normal"
  variant="filled"
  InputProps={{ readOnly: true }} 
  sx={{ width: '400px', height: '56px', borderRadius: '8px' }}
/>
<TextField
  label="Data de Demissão"
  name="dtdemissao"
  value={formatDate(formData.dtdemissao)} 
  onChange={handleInputChange}
  fullWidth
  margin="normal"
  variant="filled"
  InputProps={{ readOnly: true }} 
  sx={{ width: '400px', height: '56px', borderRadius: '8px' }}
/>

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
