import axios from 'axios';

// Define o tipo para a resposta da API de login
interface LoginResponse {
  username: string;
  token: string;
}

// Define o tipo para os parâmetros de login
interface LoginParams {
  username: string;
  password: string;
}

export class LoginService {
  private apiUrl = 'http://localhost:5000/api/login';

  // Método para autenticar o usuário
  async login(credentials: LoginParams): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        this.apiUrl,
        credentials
      );
      return response.data;
    } catch (error) {
      // Pode adicionar tratamento de erro mais detalhado aqui
      console.error('Erro ao fazer login:', error);
      throw new Error('Falha ao fazer login');
    }
  }
}
