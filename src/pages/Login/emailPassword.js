import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { resetPassword } from '../../services/apiService';
import { useParams } from 'react-router-dom';
import { Token } from '@mui/icons-material';

const EmailPassword = ({ toggleTheme }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
       NewPassword: '',
        ConfirmNewPassword: ''

    });

    const [loading, setLoading] = React.useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const [passwordError, setPasswordError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        if (formData.NewPassword !== formData.ConfirmNewPassword) {
            setPasswordError('As senhas não coincidem');
            setLoading(false);
            return;
        }
    
        try {
            console.log('Token antes da requisição:', token);
            const segments = token.split('.');
            console.log('Número de segmentos:', segments.length);
    
            if (segments.length !== 3) {
                throw new Error('Token JWT inválido.');
            }
    
            const data = { new_password: formData.NewPassword };
            await resetPassword(data, token);
            setFormData({ NewPassword: '', ConfirmNewPassword: '' });
            navigate('/');
        } catch (error) {
            const errorMessage = error.message || 'Erro ao atualizar senha. Por favor, tente novamente.';
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
                <Typography variant="h3" sx={{ marginTop: '30px' }} gutterBottom>
                    Nova senha
                </Typography>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: '8px' }}
                            disabled={loading} 
                        >
                            Alterar Senha
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => navigate('/')}
                            sx={{ borderRadius: '8px' }}
                        >
                            Cancelar
                        </Button>
                    </Box>
                </form>



                <Typography variant="h6" gutterBottom sx={{ marginTop: 'auto' }}>
                    Versão: 0.0.1
                </Typography>
            </Box>
        </Box>
    );
};
export default EmailPassword;