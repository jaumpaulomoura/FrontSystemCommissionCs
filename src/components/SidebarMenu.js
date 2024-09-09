import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Avatar, Typography, Box, Stack } from '@mui/material';
import { Assessment, Refresh as RefreshIcon, ShoppingCart as ShoppingCartIcon, Home as HomeIcon, Group as GroupIcon, Star as StarIcon, Logout as LogoutIcon, ConfirmationNumber as ConfirmationNumberIcon, TrendingUp as TrendingUpIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SidebarMenu = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        onClose={onClose}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        }}
      >
        <Box>
          {user ? (
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ p: 2 }}
            >
              <Avatar alt={user.nome} src={user.avatar} />
              <Typography variant="subtitle1">{user.nome}</Typography>
            </Stack>
          ) : (
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ p: 2 }}
            >
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {user ? user.nome.charAt(0) : 'U'}
              </Avatar>
              <Typography variant="subtitle1">Faça Login</Typography>
            </Stack>
          )}
          <Divider />
          <List>
            <ListItem button onClick={() => handleNavigation('/home')}>
              <ListItemIcon>
                <Assessment />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <Divider />
            {user && user.funcao !== 'consultora' && (
              <>
                <ListItem button onClick={() => handleNavigation('/colaborador')}>
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText primary="Colaborador" />
                </ListItem>
                <ListItem button onClick={() => handleNavigation('/premiacaoMeta')}>
                  <ListItemIcon>
                    <StarIcon />
                  </ListItemIcon>
                  <ListItemText primary="Premiação Meta" />
                </ListItem>
                <ListItem button onClick={() => handleNavigation('/premiacaoReconquista')}>
                  <ListItemIcon>
                    <StarIcon />
                  </ListItemIcon>
                  <ListItemText primary="Premiação Reconquista" />
                </ListItem>


              </>
            )}
            <ListItem button onClick={() => handleNavigation('/meta')}>
              <ListItemIcon>
                <TrendingUpIcon />
              </ListItemIcon>
              <ListItemText primary="Meta" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/Ticket')}>
              <ListItemIcon>
                <ConfirmationNumberIcon />
              </ListItemIcon>
              <ListItemText primary="Ticket" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/Order')}>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Pedidos" />
            </ListItem>
            {user && user.time == 'Reconquista' && (
              <ListItem button onClick={() => handleNavigation('/reconquest')}>
                <ListItemIcon>
                  <RefreshIcon />
                </ListItemIcon>
                <ListItemText primary="Reconquista" />
              </ListItem>
            )}
            {user && user.funcao !== 'consultora' && (
              <ListItem button onClick={() => handleNavigation('/Closing')}>
                <ListItemIcon>
                  <CheckCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Fechamento" />
              </ListItem>
            )}


          </List>

        </Box>
        <Box>
          <Divider />
          <ListItem button onClick={openLogoutDialog} sx={{ mt: 'auto' }}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sair" />
          </ListItem>
        </Box>
      </Drawer>
      <Dialog
        open={logoutDialogOpen}
        onClose={closeLogoutDialog}
      >
        <DialogTitle>Confirmar Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza de que deseja sair?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="primary">
            Sair
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SidebarMenu;
