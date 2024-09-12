import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import createMyTheme from './theme';
import Login from './pages/Login';
import Home from './pages/Home';
import Colaborador from './pages/Colaborador/Colaborador';
import CreateColaborador from './pages/Colaborador/Create';
import PremiacaoMeta from './pages/PremiacaoMeta/PremiacaoMeta';
import CreatePremiacaoMeta from './pages/PremiacaoMeta/Create';
import PremiacaoReconquista from './pages/PremiacaoReconquista/PremiacaoReconquista';
import CreatePremiacaoReconquista from './pages/PremiacaoReconquista/Create';
import Meta from './pages/Meta/Meta';
import CreateMeta from './pages/Meta/Create';
import Ticket from './pages/Ticket/Ticket';
import CreateTicket from './pages/Ticket/Create';
import Order from './pages/Order/Order';
import Closing from './pages/Closing/Closing';
import CreateClosing from './pages/Closing/Create';
import Reconquest from './pages/Reconquest/Reconquest';
import SidebarMenu from './components/SidebarMenu';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  const [mode, setMode] = useState('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = createMyTheme(mode);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <SidebarMenu open={sidebarOpen} onClose={handleSidebarToggle} />
          <Routes>
            <Route path="/" element={<Login toggleTheme={toggleTheme} />} />
            <Route path="/home" element={<Home toggleTheme={toggleTheme} />} />

            <Route path="/colaborador" element={<Colaborador toggleTheme={toggleTheme} />} />
            <Route path="/colaborador/create" element={<CreateColaborador toggleTheme={toggleTheme} />} />
            <Route path="/premiacaoMeta" element={<PremiacaoMeta toggleTheme={toggleTheme} />} />
            <Route path="/premiacaoMeta/create" element={<CreatePremiacaoMeta toggleTheme={toggleTheme} />} />
            <Route path="/premiacaoReconquista" element={<PremiacaoReconquista toggleTheme={toggleTheme} />} />
            <Route path="/premiacaoReconquista/create" element={<CreatePremiacaoReconquista toggleTheme={toggleTheme} />} />
            <Route path="/meta" element={<Meta toggleTheme={toggleTheme} />} />
            <Route path="/meta/create" element={<CreateMeta toggleTheme={toggleTheme} />} />
            <Route path="/ticket" element={<Ticket toggleTheme={toggleTheme} />} />
            <Route path="/ticket/create" element={<CreateTicket toggleTheme={toggleTheme} />} />
            <Route path="/order" element={<Order toggleTheme={toggleTheme} />} />
            <Route path="/closing" element={<Closing toggleTheme={toggleTheme} />} />
            <Route path="/closing/create" element={<CreateClosing toggleTheme={toggleTheme} />} />
            <Route path="/closing/create/:mes_ano" element={<CreateClosing toggleTheme={toggleTheme} />} /> 
            <Route path="/reconquest" element={<Reconquest toggleTheme={toggleTheme} />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
