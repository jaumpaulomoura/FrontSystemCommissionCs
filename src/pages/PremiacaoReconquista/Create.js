import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import SidebarMenu from '../../components/SidebarMenu';
import { useNavigate } from 'react-router-dom';
import { createPremiacaoReconquista } from '../../services/apiService'; import ThemeToggleButton from '../../components/ThemeToggleButton';
import { useToast } from '../../components/ToastProvider';

const CreatePremiacaoReconquista = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [salvarDialogOpen, setSalvarDialogOpen] = useState(false);
  const { showToast } = useToast();
  const [warnings, setWarnings] = useState([]);
  const [formData, setFormData] = useState({
    descricao: '',
    time: 'Reconquista',
    valor: '',
    minimo: '',
    maximo: ''
  });
  const [error, setError] = useState('');


  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Check if the input field is for a currency or numeric value
    if (name === 'valor') {
        // Remove non-numeric characters, except for commas and periods
        let inputValue = value.replace(/[^\d]/g, ''); // Remove everything that's not a number
        let formattedValue = '';

        // Avoid leading zeros
        const trimmedValue = inputValue.replace(/^0+/, '');

        // Check if the value is empty
        if (trimmedValue.length === 0) {
            setFormData({
                ...formData,
                [name]: '',
            });
            return;
        }

        // Add correct formatting
        const integerPart = trimmedValue.slice(0, -2); // Integer part
        const decimalPart = trimmedValue.slice(-2); // Decimal part

        // Format the integer part with dots
        if (integerPart) {
            formattedValue = 'R$ ' + integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        // Add the decimal part, ensuring two decimal places
        if (decimalPart) {
            formattedValue += ',' + decimalPart.padStart(2, '0');
        }

        // Update state with the formatted value
        setFormData({
            ...formData,
            [name]: formattedValue,
        });
    } else {
        // For other fields like "Descrição" or "Time"
        setFormData({
            ...formData,
            [name]: value, // Set the value directly for non-numeric fields
        });
    }
};
  const validateForm = () => {
    let isValid = true;
    const errorMessages = [];
    const warningMessages = [];

    // Verificação dos campos obrigatórios
    if (!formData.descricao) {
      errorMessages.push('Descrição');
      isValid = false;
    }
 
    if (!formData.minimo) {
      errorMessages.push('Minimo');
      isValid = false;
    }
    if (!formData.maximo) {
      errorMessages.push('Maximo');
      isValid = false;
    }
    if (!formData.valor) {
      errorMessages.push('Valor');
      isValid = false;
  } else {
      // Remove currency formatting and convert to a float
      const valor = formData.valor
          .replace('R$ ', '')          // Remove currency symbol
          .replace(/\./g, '')         // Remove thousands separators
          .replace(',', '.');          // Replace comma with decimal point

      // Check if the transformed value is a number
      if (isNaN(valor)) {
          warningMessages.push(`Valor inválido: ${formData.valor}!`);
          isValid = false;
      } else if (parseFloat(valor) < 0) {
          warningMessages.push('O valor não pode ser negativo.');
      }
  }

    // Se houver mensagens de erro, concatene-as e exiba o toast
    if (errorMessages.length > 0) {
      const message = `${errorMessages.join(', ')} é obrigatório!`;
      showToast(message, 'error');
    }

    // Se houver mensagens de aviso, exiba-as
    if (warningMessages.length > 0) {
      const warningMessage = warningMessages.join(', ');
      showToast(warningMessage, 'warning'); // Exibir toast para avisos
    }

    return isValid;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Abre o modal de confirmação
    openSalvarDialog();
  };

  const handleConfirmSave = async () => {
    closeSalvarDialog(); // Fecha o modal

    try {
      const processedValor = formData.valor
      .replace('R$ ', '')          // Remove currency symbol
      .replace(/\./g, '')         // Remove thousands separators
      .replace(',', '.');          // Replace comma with decimal point

  // Prepare the data to send to the API
  const dataToSend = {
      ...formData,
      valor: processedValor,      // Use the processed valor
  };
console.log(formData)
      const response = await createPremiacaoReconquista(dataToSend);
      // Resetar todos os campos do formData
      setFormData({
        descricao: '',
        time: '',
        minimo: '',
        maximo: '',
        valor: '',
      });
      navigate('/premiacaoReconquista');
    } catch (error) {
      if (error.response) {
        const responseData = error.response.data || {};
        const errors = responseData.errors || [];
        if (Array.isArray(errors) && errors.length > 0) {
          showToast(errors[0], 'error');
        } else {
          showToast('Erro inesperado ao criar premiação reconquista.', 'error');
        }
      } else {
        showToast('Erro ao criar meta. Verifique o console para mais detalhes.', 'error');
      }
    }
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const openSalvarDialog = () => {
    setSalvarDialogOpen(true);
  };

  const closeSalvarDialog = () => {
    setSalvarDialogOpen(false);
  };

  const handleSaveClick = (e) => {
    e.preventDefault(); // Previne o envio padrão do formulário
  
    
  
    const isValid = validateForm(); // Chama a função de validação
    
  
    if (isValid) {
      
      openSalvarDialog(); // Abre o modal de confirmação se o formulário for válido
    } else {
      console.log('Formulário inválido. Não abrindo o modal.'); // Log se a validação falhar
    }
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
              label="Time"
              name="time"
              value="Reconquista" // Definindo o valor fixo
              margin="normal"
              variant="filled"
              InputProps={{
                readOnly: true, // Define como somente leitura
              }}
              sx={{
                width: '400px',
                height: '56px',
                borderRadius: '8px',
              }}
            />

            <TextField
              label="Minimo"
              name="minimo"
              value={formData.minimo}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="filled"
              type="number" // Adicionando o tipo number
              inputProps={{
                min: 0, // Opcional: define o valor mínimo como 0
                step: 1, // Apenas números inteiros
              }}
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
              type="number" // Adicionando o tipo number
              inputProps={{
                min: 0, // Opcional: define o valor mínimo como 0
                step: 1, // Apenas números inteiros
              }}
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
  onChange={(e) => handleInputChange(e)} // Passando apenas o evento
  margin="normal"
  variant="filled"
  type="text" // Permite formatação do valor
  inputProps={{
    step: "0.01", // Embora seja um input de texto, você ainda pode manter esse passo, se necessário
  }}
  sx={{
    width: '400px',
    height: '56px',
    borderRadius: '8px',
  }}
/>

            {error && <Typography color="error">{error}</Typography>}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
                type="button"
                variant="contained"
                sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#45a049' } }}
                onClick={handleSaveClick} 
              >
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
      <Dialog
        open={salvarDialogOpen}
        onClose={closeSalvarDialog}
      >
        <DialogTitle>Confirmar Salvar</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja Salvar?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              onClick={closeSalvarDialog}
              sx={{
                backgroundColor: 'red',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#d32f2f',
                }
              }}
            >
              Cancelar
            </Button>
          </Box>
          <Box>
            <Button
              onClick={handleConfirmSave} // Chama a função para salvar
              sx={{
                backgroundColor: '#45a049',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#388e3c',
                }
              }}
            >
              Confirmar
            </Button>
          </Box>
        </DialogActions>
      </Dialog>






    </Box>
  );
};

export default CreatePremiacaoReconquista;
