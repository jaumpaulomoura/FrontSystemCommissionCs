import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';


// Função para obter dados de colaboradores
export const getColaboradorData = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.COLABORADOR);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de colaboradores:', error);
    throw error;
  }
};

// Função para criar um colaborador
export const createColaborador = async (data) => {
  try {
    const response = await axios.post(API_ENDPOINTS.COLABORADOR, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar colaborador:', error);
    throw error;
  }
};

// Função para excluir um colaborador
export const deleteColaborador = async (params) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axios.delete(`${API_ENDPOINTS.COLABORADOR}/?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir colaborador:', error);
    throw error;
  }
};

// Função para atualizar um colaborador
export const updateColaborador = async (cupom, data) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.COLABORADOR}/${cupom}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error);
    throw error;
  }
};

// Função para obter dados de meta
export const getMetaData = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.META);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de meta:', error);
    throw error;
  }
};
// Função para obter dados de meta
export const getFilteredMetaData = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      params.append('cupomvendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }
    const response = await axios.get(`${API_ENDPOINTS.META}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de meta:', error);
    throw error;
  }
};

// Função para criar uma meta
export const createMeta = async (data) => {
  try {
    const response = await axios.post(API_ENDPOINTS.META, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    throw error;
  }
};

// Função para excluir uma meta
export const deleteMeta = async (params) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axios.delete(`${API_ENDPOINTS.META}/?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir meta:', error);
    throw error;
  }
};

// Função para atualizar uma meta
export const updateMeta = async (cupom, data) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.META}/${cupom}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    throw error;
  }
};



export const getPremiacaoMetaData = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.PREMIACAO_META);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de PremiacaoMeta:', error);
    throw error;
  }
};

export const getFilteredPremiacaoMetaData = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userTime = user ? user.time : '';

    const params = new URLSearchParams();
    if (userTime) {
      params.append('time', userTime);
    }

    const response = await axios.get(`${API_ENDPOINTS.PREMIACAO_META}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de PremiacaoMeta:', error);
    throw error;
  }
};



// Função para criar um PremiacaoMeta
export const createPremiacaoMeta = async (data) => {
  try {
    const response = await axios.post(API_ENDPOINTS.PREMIACAO_META, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar PremiacaoMeta:', error);
    throw error;
  }
};

// Função para excluir um PremiacaoMeta
export const deletePremiacaoMeta = async (params) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axios.delete(`${API_ENDPOINTS.PREMIACAO_META}/?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir PremiacaoMeta:', error);
    throw error;
  }
};

// Função para atualizar um PremiacaoMeta
export const updatePremiacaoMeta = async (descricao, data) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.PREMIACAO_META}/${descricao}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar PremiacaoMeta:', error);
    throw error;
  }
};













export const getPremiacaoReconquistaData = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.PREMIACAO_RECONQUISTA);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de PremiacaoReconquista:', error);
    throw error;
  }
};

export const getFilteredPremiacaoReconquistaData = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userTime = user ? user.time : '';

    const params = new URLSearchParams();
    if (userTime) {
      params.append('time', userTime);
    }

    const response = await axios.get(`${API_ENDPOINTS.PREMIACAO_RECONQUISTA}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de PremiacaoReconquista:', error);
    throw error;
  }
};



// Função para criar um PremiacaoReconquista
export const createPremiacaoReconquista = async (data) => {
  try {
    const response = await axios.post(API_ENDPOINTS.PREMIACAO_RECONQUISTA, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar PremiacaoReconquista:', error);
    throw error;
  }
};

// Função para excluir um PremiacaoReconquista
export const deletePremiacaoReconquista = async (params) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axios.delete(`${API_ENDPOINTS.PREMIACAO_RECONQUISTA}/?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir PremiacaoReconquista:', error);
    throw error;
  }
};

// Função para atualizar um PremiacaoReconquista
export const updatePremiacaoReconquista = async (descricao, data) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.PREMIACAO_RECONQUISTA}/${descricao}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar PremiacaoMeta:', error);
    throw error;
  }
};





export const getPedidosDiaData = async (cupomVendedora, year, month, day) => {
  try {
    if (!cupomVendedora || !year || !month || !day) {
      throw new Error('Cupom da vendedora, ano, mês e dia são necessários');
    }
    const response = await axios.get(`${API_ENDPOINTS.PEDIDOS_DIARIO}?cupom_vendedora=${cupomVendedora}&year=${year}&month=${month}&day=${day}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de pedidos diários:', error);
    throw error;
  }
};


export const getFilteredPedidosDiaData = async (year, month, day) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      params.append('cupom_vendedora', user.cupom);
    } else {
      params.append('team_name', user.time);
    }

    params.append('year', year);
    params.append('month', month);
    params.append('day', day);

    const response = await axios.get(`${API_ENDPOINTS.PEDIDOS_DIARIO}`, {
      params
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};



export const getPedidosMensalData = async (cupomVendedora, year, month) => {
  try {
    if (!cupomVendedora || !year || !month) {
      throw new Error('Cupom da vendedora, ano e mês são necessários');
    }
    const response = await axios.get(`${API_ENDPOINTS.PEDIDOS_MENSAL}?cupom_vendedora=${cupomVendedora}&year=${year}&month=${month}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de pedidos mensal:', error);
    throw error;
  }
};


export const getFilteredPedidosmensalData = async (year, month) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      params.append('cupom_vendedora', user.cupom);
    } else {
      params.append('team_name', user.time);
    }

    params.append('year', year);
    params.append('month', month);

    const response = await axios.get(`${API_ENDPOINTS.PEDIDOS_MENSAL}`, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};



export const getTicketData = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.TICKET);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de tickets:', error);
    throw error;
  }
};


// Função para obter dados de ticket filtrados pelo cupomvendedora do usuário logado
export const getFilteredTicketData = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      params.append('cupomvendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }

    const response = await axios.get(`${API_ENDPOINTS.TICKET}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};


// Função para criar um ticket
export const createTicket = async (data) => {
  try {
    const response = await axios.post(API_ENDPOINTS.TICKET, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    throw error;
  }
};

// Função para excluir um ticket
export const deleteTicket = async ({ id }) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.TICKET}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir ticket:', error);
    throw error;
  }
};


// Função para atualizar um ticket
export const updateTicket = async (id, data) => {
  try {
    const response = await axios.put(`${API_ENDPOINTS.TICKET}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    throw error;
  }
};




// Função para atualizar um ticket
export const updateTicketCupom = async (orderId, novoCupom) => {
  try {
    const data = { order_id: orderId, novo_cupom: novoCupom };
    const response = await axios.put(`${API_ENDPOINTS.TICKETCUPOM}`, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    throw error;
  }
};






// Função para obter dados de ticket
export const getOrderData = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.ORDER);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de tickets:', error);
    throw error;
  }
};





export const getFilteredOrderData = async (startDate, endDate) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      params.append('cupomvendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }

    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }

    const response = await axios.get(`${API_ENDPOINTS.ORDER}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};






export const getFilteredClosingData = async (startDate, endDate) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      params.append('cupomvendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }

    if (startDate) {
      const startMesAno = startDate.slice(0, 7);
      params.append('mes_ano', startMesAno);
    }
    if (endDate) {
      const endMesAno = endDate.slice(0, 7);
      params.append('mes_ano', endMesAno);
    }

    const response = await axios.get(`${API_ENDPOINTS.CLOSING}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};
export const getFilteredReconquestData = async (startDate, endDate) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      params.append('cupomvendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }

    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }

    const response = await axios.get(`${API_ENDPOINTS.RECONQUEST}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};



export const getFilteredClosingGroupData = async () => {
  try {
    const url = new URL(API_ENDPOINTS.CLOSINGGROUP);

    const user = JSON.parse(localStorage.getItem('user'));
    const time = user ? user.time : '';

    if (time) {
      url.searchParams.append('time', time);
    }

    const response = await axios.get(url.toString());
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de fechamento:', error);
    throw error;
  }
};

export const getFilteredOClosingOrderData = async (startDate, endDate) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      params.append('cupomvendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }

    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }

    const response = await axios.get(`${API_ENDPOINTS.CLOSINGORDER}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de fechamentos:', error);
    throw error;
  }
};



export const getFilteredReconquestGroupData = async (startDate, endDate) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      params.append('cupomvendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }

    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }

    const response = await axios.get(`${API_ENDPOINTS.RECONQUESTGROUP}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};


export const getFilteredClosingsData = async (mesAno) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      params.append('cupom_vendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }

    if (mesAno) {
      params.append('mes_ano', mesAno);
    }

    const response = await axios.get(`${API_ENDPOINTS.CLOSING}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de fechamento:', error);
    throw error;
  }
};

// Função para criar um ticket
export const createClosing = async (data) => {
  try {
    const response = await axios.post(API_ENDPOINTS.CLOSING, data);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar fechamento:', error);
    throw error;
  }
};