import axios, { AxiosInstance } from 'axios';
import { useRouter } from 'next/router';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL_API
});

// Interceptor para requisições
axiosInstance.interceptors.request.use(
  (config) => {
    const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
    const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;

    if (username && password) {
      const authHeader = `Basic ${Buffer.from(
        `${username}:${password}`
      ).toString('base64')}`;
      config.headers.Authorization = authHeader;
    }

    //console.log('Request:', config);
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

  listarTodos() {
    return axiosInstance
      .get(this.url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error(
          'Erro ao listar todos:',
          error.response ? error.response.data : error.message
        );
        throw error; // Re-throw the error if you want it to propagate
      });
  }

  buscarPorId(id: number) {
    return axiosInstance.get(`${this.url}/${id}`);
  }

  inserir(objeto: any) {
    console.log('Request body:', objeto); // Log do corpo do request
    return axiosInstance
      .post(this.url, objeto)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error(
          'Erro ao inserir:',
          error.response ? error.response.data : error.message
        );
        throw error; // Re-throw the error if you want it to propagate
      });
  }

  alterar(objeto: any) {
    // Logando o request antes de enviar
    console.log('Request enviado para alterar:', objeto);

    return axiosInstance.put(`${this.url}/${objeto.id}`, objeto);
  }

  alterarPass(objeto: any) {
    // Logando o request antes de enviar
    console.log('Request enviado para alterar:', objeto);

    return axiosInstance.put(`${this.url}/pass/${objeto.id}`, objeto);
  }

  excluir(id: number) {
    return axiosInstance.delete(`${this.url}/${id}`);
  }
}
