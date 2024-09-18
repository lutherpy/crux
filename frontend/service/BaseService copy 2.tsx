import axios from 'axios';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth'; // Importar a interface Session

// Estender a interface Session para incluir accessToken
interface ExtendedSession extends Session {
  accessToken?: string;
}

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL_API
});

// Interceptor para requisições
axiosInstance.interceptors.request.use(
  async (config) => {
    // Obter o token da sessão
    const session = (await getSession()) as ExtendedSession;
    const token = session?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error('Token JWT não encontrado na sessão.');
    }

    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

export class BaseService {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  async listarTodos() {
    try {
      const response = await axiosInstance.get(this.url);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Erro ao listar todos:',
          error.response ? error.response.data : error.message
        );
      } else {
        console.error('Erro desconhecido ao listar todos:', error);
      }
      throw error; // Re-throw the error if you want it to propagate
    }
  }

  async buscarPorId(id: number) {
    try {
      const response = await axiosInstance.get(`${this.url}/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Erro ao buscar por ID:',
          error.response ? error.response.data : error.message
        );
      } else {
        console.error('Erro desconhecido ao buscar por ID:', error);
      }
      throw error;
    }
  }

  async inserir(objeto: any) {
    console.log('Request body:', objeto); // Log do corpo do request
    try {
      const response = await axiosInstance.post(this.url, objeto);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Erro ao inserir:',
          error.response ? error.response.data : error.message
        );
      } else {
        console.error('Erro desconhecido ao inserir:', error);
      }
      throw error;
    }
  }

  async alterar(objeto: any) {
    console.log('Request enviado para alterar:', objeto);
    try {
      const response = await axiosInstance.put(
        `${this.url}/${objeto.id}`,
        objeto
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Erro ao alterar:',
          error.response ? error.response.data : error.message
        );
      } else {
        console.error('Erro desconhecido ao alterar:', error);
      }
      throw error;
    }
  }

  async alterarPass(objeto: any) {
    console.log('Request enviado para alterar a senha:', objeto);
    try {
      const response = await axiosInstance.put(
        `${this.url}/pass/${objeto.id}`,
        objeto
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Erro ao alterar a senha:',
          error.response ? error.response.data : error.message
        );
      } else {
        console.error('Erro desconhecido ao alterar a senha:', error);
      }
      throw error;
    }
  }

  async excluir(id: number) {
    try {
      const response = await axiosInstance.delete(`${this.url}/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Erro ao excluir:',
          error.response ? error.response.data : error.message
        );
      } else {
        console.error('Erro desconhecido ao excluir:', error);
      }
      throw error;
    }
  }
}
