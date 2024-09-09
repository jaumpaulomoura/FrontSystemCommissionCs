import { createTheme } from '@mui/material/styles';
import { amber, grey, blue } from '@mui/material/colors';

const createMyTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: mode === 'light' ? amber : blue,
    ...(mode === 'light'
      ? {
          divider: amber[200],
          background: {
            default: '#fff',
            paper: '#fff',
          },
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
          action: {
            active: grey[700],
            hover: grey[200],
            selected: grey[300],
            disabled: grey[400],
            disabledBackground: grey[100],
          },
        }
      : {
          divider: grey[700],
          background: {
            default: '#121212',
            paper: '#121212',
          },
          text: {
            primary: '#fff',
            secondary: grey[500],
          },
          action: {
            active: '#fff',
            hover: grey[700],
            selected: grey[800],
            disabled: grey[600],
            disabledBackground: grey[800],
          },
        }),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light' ? amber[500] : blue[500],
          color: '#fff',
          '&:hover': {
            backgroundColor: mode === 'light' ? amber[700] : blue[700],
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: mode === 'light' ? grey[500] : grey[600], // Border color
            },
            '&:hover fieldset': {
              borderColor: mode === 'light' ? '#fff' : '#bbb', // Border color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: mode === 'light' ? '#fff' : '#bbb', // Border color when focused
            },
          },
          '& .MuiInputBase-input': {
            backgroundColor: mode === 'light' ? '#fff' : '#424242', // Background color of input field
            color: mode === 'light' ? grey[900] : '#fff', // Text color of input field
          },
        },
      },
    },
  },
});

export default createMyTheme;
