import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { getColaboradorData, getLogin } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import Cookies from 'js-cookie';
import { useToast } from '../../components/ToastProvider';

const Login = ({ toggleTheme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
        const token = await getLogin(email, password);

        // Check if a token is received
        if (!token) {
            showToast('Senha incorreta ou email inválido', 'error');
            return; // Exit if no token is returned
        }

        // Store the token and email in cookies
        Cookies.set('token', token, { expires: 7 });
        Cookies.set('email', email, { expires: 7 });

        const colaboradores = await getColaboradorData();
        const colaborador = colaboradores.find(colaborador => colaborador.email === email);

        if (colaborador) {
            Cookies.set('user', JSON.stringify({
                email: colaborador.email,
                cupom: colaborador.cupom,
                nome: colaborador.nome,
                funcao: colaborador.funcao,
                time: colaborador.time,
            }), { expires: 7 });

            const simulatedUser = {
                name: colaborador.nome,
                avatar: 'https://example.com/avatar.jpg',
            };

            Cookies.set('simulatedUser', JSON.stringify(simulatedUser), { expires: 7 });

            login(email, token);
            showToast('Login realizado com sucesso', 'success');
            navigate('/home');
        } else {
            showToast('Usuário não encontrado', 'error');
        }
    } catch (error) {
        // Check if the error is due to incorrect credentials
        if (error.response && error.response.status === 401) {
            // Unauthorized error - invalid credentials
            showToast('Senha incorreta ou email inválido', 'error');
        } else {
            // Other errors
            showToast('Erro ao fazer login. Tente novamente mais tarde', 'error');
        }
    } finally {
        setLoading(false);
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
        <Typography
          variant="body1"
          gutterBottom
          sx={{ marginTop: '15px', cursor: 'pointer' }}
          onClick={() => navigate('/forgotPassword')}
        >
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