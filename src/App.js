import React, { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import createMyTheme from './theme';
import Login from './pages/Login/Login';
import ResetPassword from './pages/Login/ResetarSenha';
import ForgotPassword from './pages/Login/forgotPassword'
import EmailPassword from './pages/Login/emailPassword'
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
import PrivateRoute from './components/PrivateRoute';
import { ToastProvider } from './components/ToastProvider';

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
      <ToastProvider>
        <AuthProvider>
          <Router>
            <SidebarMenu open={sidebarOpen} onClose={handleSidebarToggle} />
            <Routes>
              <Route path="/" element={<Login toggleTheme={toggleTheme} />} />
              <Route path="/home" element={<PrivateRoute element={<Home toggleTheme={toggleTheme} />} />} />
              <Route path="/resetPassword" element={<PrivateRoute element={<ResetPassword toggleTheme={toggleTheme} />} />} />
              <Route path="/emailPassword/:token" element={<EmailPassword toggleTheme={toggleTheme} />} />
              <Route path="/colaborador" element={<PrivateRoute element={<Colaborador toggleTheme={toggleTheme} />} />} />
              <Route path="/colaborador/create" element={<PrivateRoute element={<CreateColaborador toggleTheme={toggleTheme} />} />} />
              <Route path="/premiacaoMeta" element={<PrivateRoute element={<PremiacaoMeta toggleTheme={toggleTheme} />} />} />
              <Route path="/premiacaoMeta/create" element={<PrivateRoute element={<CreatePremiacaoMeta toggleTheme={toggleTheme} />} />} />
              <Route path="/premiacaoReconquista" element={<PrivateRoute element={<PremiacaoReconquista toggleTheme={toggleTheme} />} />} />
              <Route path="/premiacaoReconquista/create" element={<PrivateRoute element={<CreatePremiacaoReconquista toggleTheme={toggleTheme} />} />} />
              <Route path="/meta" element={<PrivateRoute element={<Meta toggleTheme={toggleTheme} />} />} />
              <Route path="/meta/create" element={<PrivateRoute element={<CreateMeta toggleTheme={toggleTheme} />} />} />
              <Route path="/ticket" element={<PrivateRoute element={<Ticket toggleTheme={toggleTheme} />} />} />
              <Route path="/ticket/create" element={<PrivateRoute element={<CreateTicket toggleTheme={toggleTheme} />} />} />
              <Route path="/order" element={<PrivateRoute element={<Order toggleTheme={toggleTheme} />} />} />
              <Route path="/closing" element={<PrivateRoute element={<Closing toggleTheme={toggleTheme} />} />} />
              <Route path="/closing/create" element={<PrivateRoute element={<CreateClosing toggleTheme={toggleTheme} />} />} />
              <Route path="/closing/create/:mes_ano" element={<PrivateRoute element={<CreateClosing toggleTheme={toggleTheme} />} />} />
              <Route path="/reconquest" element={<PrivateRoute element={<Reconquest toggleTheme={toggleTheme} />} />} />
              <Route path="/forgotPassword" element={<ForgotPassword toggleTheme={toggleTheme} />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
