import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeToggleButton from '../../components/ThemeToggleButton';

import { emailPassword } from '../../services/apiService';

const ForgotPassword = ({ toggleTheme }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',

    });

    const [loading, setLoading] = React.useState(false);


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

        try {
            const data = { email: formData.email };
            await emailPassword(data);
            setFormData({ email: '' });
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
                <Typography variant="h3" sx={{ marginTop: '30px'}} gutterBottom>
                   Esqueci minha senha
                </Typography>
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
                        onChange={handleInputChange} 
                    />

                    <Box sx={{ mt: 3, display: 'flex',justifyContent:'center', gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ borderRadius: '8px' }}
                            disabled={loading} 
                        >
                            Enviar email
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
export default ForgotPassword;