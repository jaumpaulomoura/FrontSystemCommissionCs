const API_BASE_URL = 'http://localhost:5001/api'; //DEV
// const API_BASE_URL = 'http://192.168.12.58:5001/api'; //PROD


export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  UPDATE_PASSWORD:`${API_BASE_URL}/update-password`,
  FORGOT_PASSWORD:`${API_BASE_URL}/forgotPassword`,
  RESET_PASSWORD:`${API_BASE_URL}/resetPassword`,
  COLABORADOR: `${API_BASE_URL}/colaborador`,
  COLABORADORCHB: `${API_BASE_URL}/colaboradorChb`,
  PREMIACAO_META: `${API_BASE_URL}/premiacaoMeta`,
  PREMIACAO_RECONQUISTA: `${API_BASE_URL}/premiacaoReconquista`,
  META: `${API_BASE_URL}/meta`,
  ORDER: `${API_BASE_URL}/orders`,
  ORDERITENS: `${API_BASE_URL}/ordersItem`,
  ORDERITENSGROUP: `${API_BASE_URL}/ordersItemGroup`,  
  PEDIDOS_DIARIO: `${API_BASE_URL}/ordersByDay`,
  PEDIDOS_MENSAL: `${API_BASE_URL}/ordersByMonth`,
  TICKET: `${API_BASE_URL}/ticket`,
  TICKETCUPOM: `${API_BASE_URL}/ticket/update-cupom`,
  TICKETSTATUS: `${API_BASE_URL}/ticket/update-status`,
  CLOSING:`${API_BASE_URL}/closing`,
  CLOSINGGROUP:`${API_BASE_URL}/closingGroup`,
  CLOSINGORDER:`${API_BASE_URL}/closingOrder`,
  RECONQUEST:`${API_BASE_URL}/reconquest`,
  RECONQUESTGROUP:`${API_BASE_URL}/reconquestGroup`,
};
