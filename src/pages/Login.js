import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeToggleButton from '../components/ThemeToggleButton';
import { getColaboradorData } from '../services/apiService'; // Importe a função

const Login = ({ toggleTheme }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const colaboradores = await getColaboradorData(); // Obtém os dados dos colaboradores

      // Verifica se o username existe na lista de colaboradores
      const colaborador = colaboradores.find(colaborador => colaborador.cupom === username);

      if (colaborador) {
        // Armazenar informações do colaborador no localStorage
        localStorage.setItem('user', JSON.stringify({
          cupom: colaborador.cupom,
          nome: colaborador.nome,
          funcao: colaborador.funcao,
          time: colaborador.time,
        }));

        // Simular autenticação e obter informações do usuário
        const simulatedUser = {
          name: colaborador.nome, // Nome do usuário a partir do colaborador
          avatar: 'https://example.com/avatar.jpg', // URL fictícia para o avatar
        };

        // Armazenar informações do usuário no localStorage
        localStorage.setItem('simulatedUser', JSON.stringify(simulatedUser));

        // Navegar para a página inicial após o login
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
            theme.palette.mode === 'dark' ? 'rgba(230, 230, 230, 0.5)' : 'rgba(245, 245, 245, 0.5)', // Mais transparente
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
          sx={{ marginTop:'30px',maxWidth: '400px', width: '100%', height: 'auto' }}
        />
        <Typography variant="h4" gutterBottom>
          Carmen Steffens
        </Typography>
        <TextField
          label="Usuário"
          variant="filled"
          margin="normal"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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