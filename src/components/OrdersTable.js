import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

const OrdersTable = ({ orders = [] }) => {
  if (!Array.isArray(orders)) {
    return <div>Erro: Dados dos pedidos não disponíveis</div>;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">Todos os Pedidos</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pedido</TableCell>
              <TableCell>Data de Submissão</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Valor Pago</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>Nenhum pedido encontrado</TableCell>
              </TableRow>
            ) : (
              orders.map(order => (
                <TableRow key={order.pedido}>
                  <TableCell>{order.pedido}</TableCell>
                  <TableCell>{new Date(order.data_submissao).toLocaleDateString()}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.valor_pago}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrdersTable;
