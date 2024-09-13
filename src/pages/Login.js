import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { getColaboradorData } from '../services/apiService';
import { getLogin } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const Login = ({ toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');  // Limpa o erro anterior
    try {
      // 1. Realiza o login e obtém o token
      const token = await getLogin(email, password);
  
      console.log(token);  // Verifique se o token está correto
  
      // 2. Armazena o token no localStorage
      localStorage.setItem('token', token);
  
      // 3. Usa o token para obter os dados do colaborador
      const colaboradores = await getColaboradorData();
  
      // 4. Busca o colaborador pelo email
      const colaborador = colaboradores.find(colaborador => colaborador.email === email);
      if (colaborador) {
        localStorage.setItem('user', JSON.stringify({
          email: colaborador.email,
          cupom: colaborador.cupom,
          nome: colaborador.nome,
          funcao: colaborador.funcao,
          time: colaborador.time,
        }));

        const simulatedUser = {
          name: colaborador.nome,
          avatar: 'https://example.com/avatar.jpg',
        };

        localStorage.setItem('simulatedUser', JSON.stringify(simulatedUser));

        login(email);
        navigate('/home');
      } else {
        setError('Usuário não encontrado');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Erro ao fazer login');
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center',
        backgroundImage: `url('/fundoGradiente.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        position="absolute"
        top={16}
        right={16}
      >
        <ThemeToggleButton toggleTheme={toggleTheme} />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          padding: 3,
          width: '100%',
          height: '90%',
          maxWidth: '50%',
          boxSizing: 'border-box',
          marginRight: '50px',
          marginTop: '30px',
        }}
      >
        <Box
          component="img"
          src="/icon.png"
          alt="Company Logo"
          sx={{ maxWidth: '500px', width: '100%', height: 'auto' }}
        />
        <Typography variant="h4" gutterBottom sx={{ color: 'white', textAlign: 'center' }}>
          Sistema de Controle de Comissões de Vendas
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          backdropFilter: 'blur(5px)',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(230, 230, 230, 0.5)' : 'rgba(245, 245, 245, 0.5)',
          borderRadius: 1,
          boxShadow: 3,
          padding: 3,
          width: '100%',
          height: '90%',
          maxWidth: '50%',
          boxSizing: 'border-box',
          marginRight: '50px',
          marginTop: '30px',
        }}
      >
        <Box
          component="img"
          src="/csLogo.png"
          alt="Company Logo"
          sx={{ marginTop: '30px', maxWidth: '400px', width: '100%', height: 'auto' }}
        />
        <Typography variant="h4" gutterBottom>
          Carmen Steffens
        </Typography>
        <TextField
          label="Email"
          variant="filled"
          margin="normal"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Usuário"
          sx={{ width: '50%' }}
        />
        <TextField
          label="Senha"
          type="password"
          variant="filled"
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Senha"
          sx={{ width: '50%' }}
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }} aria-live="assertive">
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2, width: '30%' }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Entrar'}
        </Button>
        <Typography variant="body1" gutterBottom sx={{ marginTop: '15px' }}>
          Esqueci minha senha
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ marginTop: 'auto' }}>
          Versão: 0.0.1
        </Typography>
      </Box>
    </Box>

  );
};

export default Login;