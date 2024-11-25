import axios from 'axios';
import { API_ENDPOINTS } from '../config/apiConfig';
import Cookies from 'js-cookie';

export const getLogin = async (email, password) => {
  try {
    const response = await axios.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    
    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};
export const updatePassword = async (email, data) => {
  try {
    const token = Cookies.get('token');
    console.log('data', data);

    const response = await axios.put(`${API_ENDPOINTS.LOGIN}`, 
      { email, ...data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      
      if (error.response.status === 401) {
        console.error('Senha Incorreta');
        throw new Error(error.response.data.message || 'Senha Incorreta'); 
      } else {
        console.error('Erro ao atualizar senha:', error.response.data.message);
        throw new Error(error.response.data.message || 'Erro desconhecido');
      }
    } else if (error.request) {
      
      console.error('Erro na requisição:', error.request);
      throw new Error('Erro na requisição');
    } else {
      
      console.error('Erro na configuração:', error.message);
      throw new Error('Erro na configuração da requisição');
    }
  }
};
export const emailPassword = async (data) => {
  try {
    const response = await axios.post(`${API_ENDPOINTS.FORGOT_PASSWORD}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Erro ao enviar e-mail. Por favor, tente novamente.');
    } else if (error.request) {
      throw new Error('Erro na requisição');
    } else {
      throw new Error('Erro na configuração da requisição');
    }
  }
};
export const resetPassword = async (data, token) => {
  try {
      console.log('Token antes da requisição:', token);
      const response = await axios.put(`${API_ENDPOINTS.RESET_PASSWORD}`, data, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      console.log('Resposta da API:', response.data);
      return response.data;
  } catch (error) {
      if (error.response) {
          console.error('Erro na resposta:', error.response.data);
          throw new Error(error.response.data.message || 'Erro ao alterar senha. Por favor, tente novamente.');
      } else if (error.request) {
          throw new Error('Erro na requisição');
      } else {
          throw new Error('Erro na configuração da requisição');
      }
  }
};

export const getColaboradorData = async () => {
  try {
    
    const token = Cookies.get('token');
    
    
    const response = await axios.get(API_ENDPOINTS.COLABORADOR, {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de colaboradores:', error);
    throw error;
  }
};
export const getColaboradorDataChb = async () => {
  try {
    
    const token = Cookies.get('token');
    
    
    const response = await axios.get(API_ENDPOINTS.COLABORADORCHB, {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de colaboradores:', error);
    throw error;
  }
};



export const createColaborador = async (data) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.post(API_ENDPOINTS.COLABORADOR, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      },);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar colaborador:', error);
    throw error;
  }
};


export const deleteColaborador = async (params) => {
  try {
    const token = Cookies.get('token');
    const queryParams = new URLSearchParams(params).toString();
    const response = await axios.delete(`${API_ENDPOINTS.COLABORADOR}/?${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir colaborador:', error);
    throw error;
  }
};


export const updateColaborador = async (cupom, data) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.put(`${API_ENDPOINTS.COLABORADOR}/${cupom}`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar colaborador:', error);
    throw error;
  }
};


export const getMetaData = async () => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(API_ENDPOINTS.META,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de meta:', error);
    throw error;
  }
};

export const getFilteredMetaData = async () => {
  try {
    const token = Cookies.get('token');
    const user = JSON.parse(Cookies.get('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'Consultora') {
      params.append('cupomvendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }
    const response = await axios.get(`${API_ENDPOINTS.META}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de meta:', error);
    throw error;
  }
};


export const createMeta = async (data) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.post(API_ENDPOINTS.META, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    throw error;
  }
};


export const deleteMeta = async (params) => {
  try {
    const token = Cookies.get('token');
    const queryParams = new URLSearchParams(params).toString();
    const response = await axios.delete(`${API_ENDPOINTS.META}/?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir meta:', error);
    throw error;
  }
};


export const updateMeta = async (cupom, data) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.put(`${API_ENDPOINTS.META}/${cupom}`, data,
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    })
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    throw error;
  }
};



export const getPremiacaoMetaData = async () => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(API_ENDPOINTS.PREMIACAO_META,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de PremiacaoMeta:', error);
    throw error;
  }
};

export const getFilteredPremiacaoMetaData = async () => {
  try {
    const token = Cookies.get('token');
    const user = JSON.parse(Cookies.get('user'));
    const userTime = user ? user.time : '';

    const params = new URLSearchParams();
    if (userTime) {
      params.append('time', userTime);
    }

    const response = await axios.get(`${API_ENDPOINTS.PREMIACAO_META}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de PremiacaoMeta:', error);
    throw error;
  }
};




export const createPremiacaoMeta = async (data) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.post(API_ENDPOINTS.PREMIACAO_META, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar PremiacaoMeta:', error);
    throw error;
  }
};


export const deletePremiacaoMeta = async (params) => {
  try {
    const token = Cookies.get('token');
    const { descricao, time, valor } = params;

    
    console.log("Parâmetros a serem enviados:", { descricao, time, valor });

    const response = await axios.delete(`${API_ENDPOINTS.PREMIACAO_META}`, {
      params: {
        descricao,
        time,
        valor,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Resposta do servidor:", response.data); 
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir PremiacaoMeta:', error);
    throw error;
  }
};




export const updatePremiacaoMeta = async (descricao, data) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.put(`${API_ENDPOINTS.PREMIACAO_META}/${descricao}`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar PremiacaoMeta:', error);
    throw error;
  }
};













export const getPremiacaoReconquistaData = async () => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(API_ENDPOINTS.PREMIACAO_RECONQUISTA,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de PremiacaoReconquista:', error);
    throw error;
  }
};

export const getFilteredPremiacaoReconquistaData = async () => {
  try {
    const token = Cookies.get('token');
    const user = JSON.parse(Cookies.get('user'));
    const userTime = user ? user.time : '';

    const params = new URLSearchParams();
    if (userTime) {
      params.append('time', userTime);
    }

    const response = await axios.get(`${API_ENDPOINTS.PREMIACAO_RECONQUISTA}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de PremiacaoReconquista:', error);
    throw error;
  }
};




export const createPremiacaoReconquista = async (data) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.post(API_ENDPOINTS.PREMIACAO_RECONQUISTA, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar PremiacaoReconquista:', error);
    throw error;
  }
};


export const deletePremiacaoReconquista = async (params) => {
  try {
    const token = Cookies.get('token');
    const { descricao, time, valor } = params; 
    
    const response = await axios.delete(`${API_ENDPOINTS.PREMIACAO_RECONQUISTA}`, {
      params: {
        descricao: descricao,  
        time: time,
        valor: valor
      },
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir PremiacaoReconquista:', error);
    throw error;
  }
};



export const updatePremiacaoReconquista = async (descricao, data) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.put(`${API_ENDPOINTS.PREMIACAO_RECONQUISTA}/${descricao}`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar PremiacaoMeta:', error);
    throw error;
  }
};





export const getPedidosDiaData = async (cupomVendedora, year, month, day) => {
  try {
    const token = Cookies.get('token');
    if (!cupomVendedora || !year || !month || !day) {
      throw new Error('Cupom da vendedora, ano, mês e dia são necessários');
    }
    const response = await axios.get(`${API_ENDPOINTS.PEDIDOS_DIARIO}?cupom_vendedora=${cupomVendedora}&year=${year}&month=${month}&day=${day}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de pedidos diários:', error);
    throw error;
  }
};

export const getFilteredPedidosDiaData = async (year, month, day) => {
  try {
    const token = Cookies.get('token');

    
    
    if (!token) {
      throw new Error('Token não encontrado nos cookies');
    }
    
    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;
    if (!user) {
      throw new Error('Usuário não encontrado nos cookies');
    }
    
    const params = new URLSearchParams();
    if (user.funcao === 'Consultora') {
      params.append('cupom_vendedora', user.cupom);
    } else {
      params.append('team_name', user.time);
    }
    
    params.append('year', year);
    params.append('month', month);
    params.append('day', day);
    
    
    const response = await axios.get(API_ENDPOINTS.PEDIDOS_DIARIO, {
      params: {
        year,
        month,
        day,
        cupom_vendedora: user.funcao === 'Consultora' ? user.cupom : undefined,
        team_name: user.funcao !== 'Consultora' ? user.time : undefined
      },
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });
    

    return response.data;
    
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};








export const getFilteredPedidosItemData = async (startDate, endDate) => {
      try {
      const token = Cookies.get('token');
      const user = JSON.parse(Cookies.get('user'));
      if (!user) {
        throw new Error('Usuário não encontrado no localStorage');
      }
  
      const params = new URLSearchParams();
  
     
      if (startDate) {
        params.append('startDate', startDate);
      }
      if (endDate) {
        params.append('endDate', endDate);
      }
      if (user.funcao === 'Consultora') {
        params.append('cupomvendedora', user.cupom);
      } else {
        params.append('time', user.time);
      }
  
   
      const response = await axios.get(`${API_ENDPOINTS.ORDERITENS}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter e filtrar dados de pedidios item:', error);
      throw error;
    }
  };






  export const getFilteredPedidosItemDataGroup = async (startDate, endDate) => {
    try {
    const token = Cookies.get('token');
    const user = JSON.parse(Cookies.get('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

   
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }
    if (user.funcao === 'Consultora') {
      params.append('cupom_vendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }

 
    const response = await axios.get(`${API_ENDPOINTS.ORDERITENSGROUP}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de pedidios item:', error);
    throw error;
  }
};






export const getPedidosMensalData = async (cupomVendedora, year, month) => {
  try {
    const token = Cookies.get('token');
    
    if (!cupomVendedora || !year || !month) {
      throw new Error('Cupom da vendedora, ano e mês são necessários');
    }
    const response = await axios.get(`${API_ENDPOINTS.PEDIDOS_MENSAL}?cupom_vendedora=${cupomVendedora}&year=${year}&month=${month}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de pedidos mensal:', error);
    throw error;
  }
};


export const getFilteredPedidosmensalData = async (year, month) => {
  try {
    const token = Cookies.get('token');
    
    const userCookie = Cookies.get('user');
    const user = userCookie ? JSON.parse(userCookie) : null;
    
    if (!user) {
      throw new Error('Usuário não encontrado nos cookies');
    }

    const params = new URLSearchParams();
    if (user.funcao === 'Consultora') {
      params.append('cupom_vendedora', user.cupom);
    } else {
      params.append('team_name', user.time);
    }

    params.append('year', year);
    params.append('month', month);

    const response = await axios.get(API_ENDPOINTS.PEDIDOS_MENSAL, {
      params: params,  
      headers: {
        Authorization: `Bearer ${token}`  
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de pedidos mensais:', error);
    throw error;
  }
};



export const getTicketData = async () => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(API_ENDPOINTS.TICKET,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de tickets:', error);
    throw error;
  }
};



export const getFilteredTicketData = async () => {
  try {
    const token = Cookies.get('token');
    const user = JSON.parse(Cookies.get('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'Consultora') {
      params.append('cupomvendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }

    const response = await axios.get(`${API_ENDPOINTS.TICKET}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};



export const createTicket = async (data) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.post(API_ENDPOINTS.TICKET, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    throw error;
  }
};


export const deleteTicket = async ({ id }) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.delete(`${API_ENDPOINTS.TICKET}?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir ticket:', error);
    throw error;
  }
};



export const updateTicket = async (id, data) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.put(`${API_ENDPOINTS.TICKET}/${id}`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    throw error;
  }
};





export const updateTicketCupom = async (orderId, novoCupom) => {
  try {
    const token = Cookies.get('token');
    const data = { order_id: orderId, novo_cupom: novoCupom };
    const response = await axios.put(`${API_ENDPOINTS.TICKETCUPOM}`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    throw error;
  }
};





export const updateTicketStatus = async (orderId, novoStatus) => {
  try {
    const token = Cookies.get('token');
    const data = { order_id: orderId, novo_status: novoStatus };
    const response = await axios.put(`${API_ENDPOINTS.TICKETSTATUS}`, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    throw error;
  }
};


export const getOrderData = async () => {
  try {
    const token = Cookies.get('token');
    const response = await axios.get(API_ENDPOINTS.ORDER,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter dados de tickets:', error);
    throw error;
  }
};





export const getFilteredOrderData = async (startDate, endDate) => {
  try {
    const token = Cookies.get('token');
    const user = JSON.parse(Cookies.get('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

   
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }
    if (user.funcao === 'Consultora') {
      params.append('cupomvendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }

 
    const response = await axios.get(`${API_ENDPOINTS.ORDER}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};


export const getFilteredOrderItensData = async (startDate, endDate) => {
  try {
    const token = Cookies.get('token');
    const user = JSON.parse(Cookies.get('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

   
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }
    if (user.funcao === 'Consultora') {
      params.append('cupomvendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }

 
    const response = await axios.get(`${API_ENDPOINTS.ORDERITENS}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};


export const getFilteredOrderItensVigenciaData = async (startDate, endDate) => {
  try {
    const token = Cookies.get('token');
    const user = JSON.parse(Cookies.get('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

   
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }
    if (user.funcao === 'Consultora') {
      params.append('cupomvendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }

 
    const response = await axios.get(`${API_ENDPOINTS.ORDERITENSVIGENCIA}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};






export const getFilteredClosingData = async (startDate, endDate) => {
  try {
    const token = Cookies.get('token');
    const user = JSON.parse(Cookies.get('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'Consultora') {
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

    const response = await axios.get(`${API_ENDPOINTS.CLOSING}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};
export const getFilteredReconquestData = async (startDate, endDate) => {
  try {
    const token = Cookies.get('token');
    const user = JSON.parse(Cookies.get('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'Consultora') {
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

    const response = await axios.get(`${API_ENDPOINTS.RECONQUEST}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};



export const getFilteredClosingGroupData = async () => {
  try {
    const token = Cookies.get('token');
    const url = new URL(API_ENDPOINTS.CLOSINGGROUP);

    const user = JSON.parse(Cookies.get('user'));
    const time = user ? user.time : '';

    if (time) {
      url.searchParams.append('time', time);
    }

    const response = await axios.get(url.toString(),
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de fechamento:', error);
    throw error;
  }
};

export const getFilteredOClosingOrderData = async (startDate, endDate) => {
  try {
    const token = Cookies.get('token');
    const user = JSON.parse(Cookies.get('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'Consultora') {
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

    const response = await axios.get(`${API_ENDPOINTS.CLOSINGORDER}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de fechamentos:', error);
    throw error;
  }
};



export const getFilteredReconquestGroupData = async (startDate, endDate) => {
  try {
    const token = Cookies.get('token');
    const user = JSON.parse(Cookies.get('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'Consultora') {
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

    const response = await axios.get(`${API_ENDPOINTS.RECONQUESTGROUP}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de tickets:', error);
    throw error;
  }
};


export const getFilteredClosingsData = async (mesAno) => {
  try {
    const token = Cookies.get('token');
    const user = JSON.parse(Cookies.get('user'));
    if (!user) {
      throw new Error('Usuário não encontrado no localStorage');
    }

    const params = new URLSearchParams();

    if (user.funcao === 'Consultora') {
      params.append('cupom_vendedora', user.cupom);
    } else {
      params.append('time', user.time);
    }

    if (mesAno) {
      params.append('mes_ano', mesAno);
    }

    const response = await axios.get(`${API_ENDPOINTS.CLOSING}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao obter e filtrar dados de fechamento:', error);
    throw error;
  }
};


export const createClosing = async (data) => {
  try {
    const token = Cookies.get('token');
    const response = await axios.post(API_ENDPOINTS.CLOSING, data,
      {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar fechamento:', error);
    throw error;
  }
};