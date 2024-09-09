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
    console.log('Resposta da API:', response);
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

    // Construir os parâmetros de consulta
    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      // Filtrar por cupomvendedora se a função for CONSULTORA
      params.append('cupomvendedora', user.cupom);
    } else {
      // Filtrar por time se a função não for CONSULTORA
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
    console.log('Resposta da API:', response);
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
    // Obter o valor do time do usuário do localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const userTime = user ? user.time : '';

    // Construir os parâmetros de consulta
    const params = new URLSearchParams();
    if (userTime) {
      params.append('time', userTime);
    }

    // Enviar a solicitação com parâmetros de consulta
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
    console.log('Resposta da API:', response);
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
    // Obter o valor do time do usuário do localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const userTime = user ? user.time : '';

    // Construir os parâmetros de consulta
    const params = new URLSearchParams();
    if (userTime) {
      params.append('time', userTime);
    }

    // Enviar a solicitação com parâmetros de consulta
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
    console.log('Resposta da API:', response);
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
    // Obter o valor do usuário logado
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    // Construir os parâmetros de consulta
    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      // Filtrar por cupom_vendedora se a função for CONSULTORA
      params.append('cupom_vendedora', user.cupom);
    } else {
      // Filtrar por team se a função não for CONSULTORA
      params.append('team_name', user.time);
    }

    // Adicionar ano, mês e dia aos parâmetros
    params.append('year', year);
    params.append('month', month);
    params.append('day', day);

    // Obter os tickets filtrados
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
    // Obter o valor do usuário logado
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    // Construir os parâmetros de consulta
    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      // Filtrar por cupom_vendedora se a função for CONSULTORA
      params.append('cupom_vendedora', user.cupom);
    } else {
      // Filtrar por team se a função não for CONSULTORA
      params.append('team_name', user.time);
    }

    // Adicionar ano e mês aos parâmetros
    params.append('year', year);
    params.append('month', month);

    // Obter os tickets filtrados
    const response = await axios.get(`${API_ENDPOINTS.PEDIDOS_MENSAL}`, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};


















// Função para obter dados de ticket
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
    // Obter o valor do usuário logado
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    // Construir os parâmetros de consulta
    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      // Filtrar por cupomvendedora se a função for CONSULTORA
      params.append('cupomvendedora', user.cupom);
    } else {
      // Filtrar por time se a função não for CONSULTORA
      params.append('time', user.time);
    }

    // Obter os tickets filtrados
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
    console.log('Resposta da API:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    throw error;
  }
};

// Função para excluir um ticket
export const deleteTicket = async ({ id }) => {
  try {
    // Construindo a URL com o parâmetro de consulta ID
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
    // Obter o valor do usuário logado
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    // Construir os parâmetros de consulta
    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      // Filtrar por cupomvendedora se a função for CONSULTORA
      params.append('cupomvendedora', user.cupom);
    } else {
      // Filtrar por time se a função não for CONSULTORA
      params.append('time', user.time);
    }

    // Adicionar filtros de data
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }

    // Obter os tickets filtrados
    const response = await axios.get(`${API_ENDPOINTS.ORDER}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};






export const getFilteredClosingData = async (startDate, endDate) => {
  try {
    // Obter o valor do usuário logado
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    // Construir os parâmetros de consulta
    const params = new URLSearchParams();

    // Adicionar filtros baseados na função do usuário
    if (user.funcao === 'consultora') {
      // Filtrar por cupomvendedora se a função for CONSULTORA
      params.append('cupomvendedora', user.cupom);
    } else {
      // Filtrar por time se a função não for CONSULTORA
      params.append('time', user.time);
    }

    // Adicionar filtros de data no formato mes_ano (ex: '2023-08')
    if (startDate) {
      const startMesAno = startDate.slice(0, 7); // Extrai ano-mês de startDate
      params.append('mes_ano', startMesAno);
    }
    if (endDate) {
      const endMesAno = endDate.slice(0, 7); // Extrai ano-mês de endDate
      params.append('mes_ano', endMesAno);
    }

    // Obter os tickets filtrados com os parâmetros construídos
    const response = await axios.get(`${API_ENDPOINTS.CLOSING}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};
export const getFilteredReconquestData = async (startDate, endDate) => {
  try {
    // Obter o valor do usuário logado
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    // Construir os parâmetros de consulta
    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      // Filtrar por cupomvendedora se a função for CONSULTORA
      params.append('cupomvendedora', user.cupom);
    } else {
      // Filtrar por time se a função não for CONSULTORA
      params.append('time', user.time);
    }

    // Adicionar filtros de data
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }

    // Obter os tickets filtrados
    const response = await axios.get(`${API_ENDPOINTS.RECONQUEST}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};



export const getFilteredClosingGroupData = async () => {
  try {
    // Cria a URL com o endpoint da API
    const url = new URL(API_ENDPOINTS.CLOSINGGROUP);
    
    // Obtém o usuário do localStorage e extrai o parâmetro time
    const user = JSON.parse(localStorage.getItem('user'));
    const time = user ? user.time : '';

    // Adiciona o parâmetro de tempo à URL, se disponível
    if (time) {
      url.searchParams.append('time', time);
    }

    // Faz a requisição GET para a API
    const response = await axios.get(url.toString());
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de fechamento:', error);
    throw error;
  }
};

export const getFilteredOClosingOrderData = async (startDate, endDate) => {
  try {
    // Obter o valor do usuário logado
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    // Construir os parâmetros de consulta
    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      // Filtrar por cupomvendedora se a função for CONSULTORA
      params.append('cupomvendedora', user.cupom);
    } else {
      // Filtrar por time se a função não for CONSULTORA
      params.append('time', user.time);
    }

    // Adicionar filtros de data
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }

    // Obter os tickets filtrados
    const response = await axios.get(`${API_ENDPOINTS.CLOSINGORDER}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de fechamentos:', error);
    throw error;
  }
};



export const getFilteredReconquestGroupData = async (startDate, endDate) => {
  try {
    // Obter o valor do usuário logado
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    // Construir os parâmetros de consulta
    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      // Filtrar por cupomvendedora se a função for CONSULTORA
      params.append('cupomvendedora', user.cupom);
    } else {
      // Filtrar por time se a função não for CONSULTORA
      params.append('time', user.time);
    }

    // Adicionar filtros de data
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }

    // Obter os tickets filtrados
    const response = await axios.get(`${API_ENDPOINTS.RECONQUESTGROUP}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};


export const getFilteredClosingsData = async (mesAno) => {
  try {
    // Obter o valor do usuário logado
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    // Construir os parâmetros de consulta
    const params = new URLSearchParams();

    if (user.funcao === 'consultora') {
      // Filtrar por cupomvendedora se a função for CONSULTORA
      params.append('cupom_vendedora', user.cupom); // Corrigido de 'cupomvendedora' para 'cupom_vendedora'
    } else {
      // Filtrar por time se a função não for CONSULTORA
      params.append('time', user.time);
    }

    // Adicionar filtro por mes_ano
    if (mesAno) {
      params.append('mes_ano', mesAno);
    }

    // Obter os dados filtrados
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
    console.log('Resposta da API:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar fechamento:', error);
    throw error;
  }
};