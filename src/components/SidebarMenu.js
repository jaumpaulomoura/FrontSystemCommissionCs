import React, { useState } from 'react';
import { ListItemButton, ClickAwayListener, Paper, MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Avatar, Typography, Box, Stack, IconButton, Collapse, } from '@mui/material';
import { Assessment, Refresh as RefreshIcon, ShoppingCart as ShoppingCartIcon, Home as HomeIcon, Group as GroupIcon, Star as StarIcon, Logout as LogoutIcon, ConfirmationNumber as ConfirmationNumberIcon, TrendingUp as TrendingUpIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import StarBorder from '@mui/icons-material/StarBorder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import KeyIcon from '@mui/icons-material/VpnKey';
const SidebarMenu = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [opens, setOpens] = useState(false);

  const handleClick = () => {
    setOpens(!opens);
  };

  const handleClickAway = () => {
    setOpens(false);
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    navigate('/');
  };


  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const userCookie = Cookies.get('user');
  const user = userCookie ? JSON.parse(userCookie) : null;
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
            <ClickAwayListener onClickAway={handleClickAway}>
              <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
              >
               
                <ListItemButton onClick={handleClick}>
                  <ListItemIcon>
                    <Avatar alt={user.nome} src={user.avatar} />
                  </ListItemIcon>
                  <ListItemText primary={user.nome} />
                  {opens ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={opens} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigation('/resetPassword')}>
                      <ListItemIcon>
                        <KeyIcon />
                      </ListItemIcon>
                      <ListItemText primary="Resetar Senha" />
                    </ListItemButton>
                  </List>
                </Collapse>
              </List>
            </ClickAwayListener>



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
            {user && user.funcao !== 'Consultora' && (
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
            {user && user.funcao !== 'Consultora' && (
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
        <DialogTitle> Tem certeza de que deseja sair?</DialogTitle>
        <DialogContent>
          
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Button onClick={closeLogoutDialog} sx={{ color: '#fff', backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}>
  Cancelar
</Button>
<Button onClick={handleLogout} sx={{ color: '#fff', backgroundColor: '#f44336', '&:hover': { backgroundColor: '#d32f2f' } }}>
  Sair
</Button>



        </DialogActions>
      </Dialog>
    </>
  );
};

export default SidebarMenu;
