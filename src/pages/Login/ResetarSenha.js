import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import SidebarMenu from '../../components/SidebarMenu';
import { useNavigate } from 'react-router-dom';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Cookies from 'js-cookie';
import { updatePassword } from '../../services/apiService'; 

const ResetPassword = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    NewPassword: '',
    ConfirmNewPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = React.useState('');
  
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const userCookie = Cookies.get('email');
    const email = userCookie || '';
    setFormData(prevState => ({
      ...prevState,
      email: email
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (formData.NewPassword !== formData.ConfirmNewPassword) {
      setPasswordError('As senhas não coincidem.');
      setLoading(false);
      return;
    }
  
    setPasswordError('');
  
    try {
      const data = {
        current_password: formData.password,
        new_password: formData.NewPassword,
      };
  
      await updatePassword(formData.email, data);
  
      setFormData({
        email: '',
        password: '',
        NewPassword: '',
        ConfirmNewPassword: ''
      });
      navigate('/home');  
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : 'Erro ao atualizar senha. Por favor, tente novamente.';
      console.error('Erro ao atualizar senha:', errorMessage);
      setPasswordError(errorMessage); 
    } finally {
      setLoading(false);
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
        <Typography variant="h4">Redefinir Senha</Typography>
        <Paper sx={{ mt: 3, p: 3, borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              fullWidth
              margin="normal"
              variant="filled"
              placeholder="Digite seu email"
              autoComplete="off"
              sx={{ width: '400px', height: '56px', borderRadius: '8px' }}
              disabled
            />
            <TextField
              label="Senha Atual"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="filled"
              placeholder="Digite sua senha Atual"
              autoComplete="off"
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
              sx={{ width: '400px', height: '56px', borderRadius: '8px' }}
            />
            <TextField
              label="Nova Senha"
              name="NewPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.NewPassword}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="filled"
              placeholder="Digite sua Nova senha"
              autoComplete="off"
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
              sx={{ width: '400px', height: '56px', borderRadius: '8px' }}
            />
            <TextField
              label="Confirme sua nova Senha"
              name="ConfirmNewPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.ConfirmNewPassword}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="filled"
              placeholder="Digite novamente sua Nova senha"
              autoComplete="off"
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
              sx={{ width: '400px', height: '56px', borderRadius: '8px' }}
              error={!!passwordError}
              helperText={passwordError}
            />
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ borderRadius: '8px' }}
                disabled={loading}  
              >
                {loading ? 'Redefinindo...' : 'Redefinir Senha'}
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

export default ResetPassword;
