

import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, Grid, Autocomplete, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText,MenuItem } from '@mui/material';
import SidebarMenu from '../../components/SidebarMenu';
import { useNavigate } from 'react-router-dom';
import { createMeta } from '../../services/apiService';
import { getColaboradorData } from '../../services/apiService';
import ThemeToggleButton from '../../components/ThemeToggleButton';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { useToast } from '../../components/ToastProvider';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';

dayjs.locale('pt-br');

const metaDataConsultora = [
  { meta: 'Não atingiu a meta', porcentagem: '0.005', valor: '0' },
  { meta: 'Meta', porcentagem: '0.01', valor: '0' },
  { meta: 'Super meta', porcentagem: '0.015', valor: '0' },
  { meta: 'Meta Desafio', porcentagem: '0.02', valor: '0' },
];
const metaDataLider = [
  { meta: 'Não atingiu a meta', porcentagem: '0.0015', valor: '0' },
  { meta: 'Meta', porcentagem: '0.0025', valor: '0' },
  { meta: 'Super meta', porcentagem: '0.0035', valor: '0' },
  { meta: 'Meta Desafio', porcentagem: '0.005', valor: '0' },
];
const metaDataSupervisora = [
  { meta: 'Não atingiu a meta', porcentagem: '0.003', valor: '0' },
  { meta: 'Meta', porcentagem: '0.005', valor: '0' },
  { meta: 'Super meta', porcentagem: '0.007', valor: '0' },
  { meta: 'Meta Desafio', porcentagem: '0.01', valor: '0' },
];




const CreateMeta = ({ toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({ cupom: '' });
  const [metaData, setMetaData] = useState(metaDataConsultora);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState('');
  const [colaboradores, setColaboradores] = useState([]);
  const [selectedName, setSelectedName] = useState('');
  const [selectedCupom, setSelectedCupom] = useState('');
  const { showToast } = useToast();
  const [salvarDialogOpen, setSalvarDialogOpen] = useState(false);
  const [funcao, setFuncao] = useState('Consultora'); 
  const navigate = useNavigate();

  const handleNivelChange = (event) => {
    const selectedNivel = event.target.value;
    setFuncao(selectedNivel);

    
    if (selectedNivel === 'Lider') {
      setMetaData(metaDataLider);
    } else if (selectedNivel === 'Supervisora') {
      setMetaData(metaDataSupervisora);
    } else {
      setMetaData(metaDataConsultora);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getColaboradorData();
        console.log(data)


        const user = JSON.parse(Cookies.get('user'));
        console.log(user);
        if (user && user.time) {
          const filteredColaboradores = data.filter(colaborador => colaborador.time === user.time);

          setColaboradores(filteredColaboradores);
          console.log(filteredColaboradores);
        } else {
          console.warn('A propriedade "time" não existe no objeto user.');
          setColaboradores(data);
        }
      } catch (err) {
        showToast('Erro ao buscar os dados dos colaboradores.', 'error');
        console.error('Erro ao buscar dados dos colaboradores:', err);
      }
    };

    fetchData();
  }, []);




  const handleInputChange = (event, index) => {
    const { name } = event.target;
    let inputValue = event.target.value.replace(/[^\d]/g, ''); 

    
    const trimmedValue = inputValue.replace(/^0+/, '');

    
    if (trimmedValue.length === 0) {
      const updatedMetaData = metaData.map((item, i) =>
        i === index ? { ...item, [name]: '' } : item
      );
      setMetaData(updatedMetaData);
      return;
    }

    
    let formattedValue = '';
    const integerPart = trimmedValue.slice(0, -2); 
    const decimalPart = trimmedValue.slice(-2); 

    
    if (integerPart) {
      formattedValue = 'R$ ' + integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    
    if (decimalPart) {
      formattedValue += ',' + decimalPart.padStart(2, '0');
    }

    
    const updatedMetaData = metaData.map((item, i) =>
      i === index ? { ...item, [name]: formattedValue } : item
    );
    setMetaData(updatedMetaData);
  };

  const validateForm = () => {

    let isValid = true;
    let errors = [];
    let warnings = [];
    console.log('Valores do Formulário:', formData);
    if (!formData.cupom) {
      errors.push('Cupom é obrigatório!');
    }
    if (!selectedDate) {
      errors.push('Mês/Ano é obrigatório!');
    }

    metaData.forEach((item) => {
      
      const valorStr = item.valor.replace(/[R$ .]/g, '').replace(',', '.');
      const porcentagem = item.porcentagem.replace(',', '.');

      
      const valor = parseFloat(valorStr); 
      if (isNaN(valor)) {
        errors.push(`Valor inválido para a meta "${item.meta}"!`);
      } else if (valor < 0) {
        warnings.push(`O valor para a meta "${item.meta}" não pode ser negativo.`);
      }

      
      if (!porcentagem || isNaN(porcentagem)) {
        errors.push(`Porcentagem inválida para a meta "${item.meta}"!`);
      } else if (parseFloat(porcentagem) < 0) {
        warnings.push(`A porcentagem para a meta "${item.meta}" não pode ser negativa.`);
      }
    });
    metaData.forEach((item) => {
      
      const valorStr = item.valor.replace(/[R$ .]/g, '').replace(',', '.');
      const porcentagem = item.porcentagem.replace(',', '.');

      
      const valor = parseFloat(valorStr); 
      if (isNaN(valor)) {
        errors.push(`Valor inválido para a meta "${item.meta}"!`);
      } else if (valor < 0) {
        warnings.push(`O valor para a meta "${item.meta}" não pode ser negativo.`);
      }

      
      if (!porcentagem || isNaN(porcentagem)) {
        errors.push(`Porcentagem inválida para a meta "${item.meta}"!`);
      } else if (parseFloat(porcentagem) < 0) {
        warnings.push(`A porcentagem para a meta "${item.meta}" não pode ser negativa.`);
      }
    });

    console.log('metaData', metaData)
    
    if (errors.length > 0) {
      showToast(errors.join(' '), 'error'); 
      return false;
    }

    
    if (warnings.length > 0) {
      warnings.forEach(warning => showToast(warning, 'warning'));
    }

    
    return true;
  };
  const handleSubmit = (e) => {

    e.preventDefault();
    if (!validateForm()) return;

    
    openSalvarDialog();
  };

  const handleConfirmSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formattedDate = dayjs(selectedDate).format('MM-YYYY');

    const metaDataArray = metaData.map(item => {
      
      const valor = item.valor.replace(/[R$ .]/g, '').replace(',', '.');
      const porcentagem = item.porcentagem.replace(',', '.'); 

      return {
        cupom: formData.cupom,
        nome: formData.nome,
        mes_ano: formattedDate,
        meta: item.meta,
        porcentagem: porcentagem,
        valor: valor
      };
    });

    console.log('metaDataArray', metaDataArray); 
    try {
      const response = await createMeta(metaDataArray);
      const responseData = response || {};

      const errors = responseData.errors || [];
      const success = responseData.success || [];

      if (Array.isArray(errors) && errors.length > 0) {
        showToast(errors[0], 'error');
      } else if (Array.isArray(success) && success.length > 0) {
        showToast('Metas Criadas com sucesso', 'success');
        navigate('/meta');
      } else {
        showToast('Erro inesperado ao criar meta.', 'error');
      }

    } catch (error) {
      if (error.response) {
        const responseData = error.response.data || {};
        const errors = responseData.errors || [];
        if (Array.isArray(errors) && errors.length > 0) {
          showToast(errors[0], 'error');
        } else {
          showToast('Erro inesperado ao criar meta.', 'error');
        }
      } else {
        showToast('Erro ao criar meta. Verifique o console para mais detalhes.', 'error');
      }
    }
  };


  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };





  const handleNameChange = (event, newValue) => {
    const nomeDigitado = newValue || ''; 
    setSelectedName(nomeDigitado);
  
    const colaborador = colaboradores.find(
      (colab) => colab.nome.toLowerCase() === nomeDigitado.toLowerCase()
    );
  
    if (colaborador) {
      setSelectedCupom(colaborador.cupom);
      setFormData({ ...formData, cupom: colaborador.cupom, nome: colaborador.nome });
      setFuncao(colaborador.funcao); 
      setError('');
  
      
      handleNivelChange({ target: { value: colaborador.funcao } });
    } else {
      setSelectedCupom('');
      setFormData({ ...formData, cupom: '' });
      setFuncao(''); 
      setError('Colaborador não encontrado.');
    }
  };
  
  const handleCupomChange = (event, newValue) => {
    const cupomDigitado = newValue || '';
    setSelectedCupom(cupomDigitado);
    setFormData({ ...formData, cupom: cupomDigitado });
  
    const colaborador = colaboradores.find(
      (colab) => colab.cupom.toLowerCase() === cupomDigitado.toLowerCase()
    );
  
    if (colaborador) {
      setSelectedName(colaborador.nome);
      setFormData({ ...formData, nome: colaborador.nome });
      setFuncao(colaborador.funcao); 
      setError('');
  
      
      handleNivelChange({ target: { value: colaborador.funcao } });
    } else {
      setSelectedName('');
      setFormData({ ...formData, cupom: '' });
      setFuncao(''); 
      setError('Cupom não encontrado.');
    }
  };
  

  const openSalvarDialog = () => {
    console.log('openSalvarDialog foi chamado'); 
    setSalvarDialogOpen(true);
  };
  const closeSalvarDialog = () => {
    setSalvarDialogOpen(false);
  };
  const handleSaveClick = (e) => {
    e.preventDefault(); 



    const isValid = validateForm(); 


    if (isValid) {

      openSalvarDialog(); 
    } else {
      console.log('Formulário inválido. Não abrindo o modal.'); 
    }
  };


  const formatCurrency = (value) => {
    
    const numericValue = value.replace(/\D/g, '');

    
    return (Number(numericValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };


  const [value, setValue] = useState('');

  const handleChange = (event) => {
    const inputValue = event.target.value.replace(/[^\d]/g, ''); 

    
    const trimmedValue = inputValue.replace(/^0+/, '');

    
    if (trimmedValue.length === 0) {
      setValue('');
      return;
    }

    
    let formattedValue = '';
    const integerPart = trimmedValue.slice(0, -2); 
    const decimalPart = trimmedValue.slice(-2); 

    
    if (integerPart) {
      formattedValue = 'R$ ' + integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    
    if (decimalPart) {
      formattedValue += ',' + decimalPart.padStart(2, '0');
    }

    setValue(formattedValue);
  };





  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarMenu open={sidebarOpen} onClose={handleSidebarToggle} />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Box position="absolute" top={16} right={16}>
          <ThemeToggleButton toggleTheme={toggleTheme} />
        </Box>
        <Typography variant="h4">Criar Meta</Typography>
        <Paper sx={{ mt: 3, p: 3, borderRadius: '12px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Grid container spacing={4}>

                <Grid item xs={2.5}>
                  <Autocomplete
                    value={selectedName || ''}
                    onChange={handleNameChange}
                    options={colaboradores.map((colab) => colab.nome)}
                    renderInput={(params) => (
                      <TextField {...params} label="Nome" variant="outlined" />
                    )}
                    noOptionsText="Nenhuma opção disponível"
                    isOptionEqualToValue={(option, value) => option === value}
                  />
                </Grid>
                <Grid item xs={2.5}>
                  <Autocomplete
                    value={selectedCupom || ''}
                    onChange={handleCupomChange}
                    options={colaboradores.map((colab) => colab.cupom)}
                    renderInput={(params) => (
                      <TextField {...params} label="Cupom" variant="outlined" />
                    )}
                    noOptionsText="Nenhuma opção disponível"
                    isOptionEqualToValue={(option, value) => option === value}
                  />
                </Grid>
                <Grid item xs={2.5}>
  <TextField
    label="Função"
    value={funcao} 
    fullWidth
    required
    InputProps={{
      readOnly: true, 
    }}
  />
</Grid>
                <Grid item xs={2.4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                    <DatePicker
                      label="Selecione Mês/Ano"
                      views={['year', 'month']}
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                      format="MM/YYYY" 
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>


              </Grid>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Grid container spacing={2}>
                {metaData.map((item, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={4}>
                      <TextField
                        label="Meta"
                        value={item.meta}
                        InputProps={{
                          readOnly: true,
                          style: { backgroundColor: '#f5f5f5' }
                        }}
                        variant="filled"
                        fullWidth
                        sx={{ borderRadius: '8px' }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label="Porcentagem"
                        value={
                          item.porcentagem
                            ? `${(item.porcentagem * 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
                            : ''
                        }
                        InputProps={{
                          readOnly: true,
                          style: { backgroundColor: '#f5f5f5' }
                        }}
                        variant="filled"
                        fullWidth
                        sx={{ borderRadius: '8px' }}
                      />
                    </Grid>

                    <Grid item xs={2.5}>





                      <TextField
                        label={`Valor ${item.meta}`}
                        variant="outlined"
                        name="valor" 
                        value={item.valor} 
                        onChange={(e) => handleInputChange(e, index)} 
                      />












                    </Grid>



                  </React.Fragment>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: '#388e3c', color: '#fff', '&:hover': { backgroundColor: '#45a049' } }}
              >
                Salvar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/meta')}
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
              onClick={handleConfirmSave} 
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

export default CreateMeta;
