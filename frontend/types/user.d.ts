// types/user.d.ts

import { JWT } from 'next-auth/jwt';

// Definição do tipo User para o NextAuth
interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  token: string;
  descricao: string;
  profile_id: string;
}

// Extensão do tipo JWT para incluir o token
interface ExtendedJWT extends JWT {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  token?: string;
}

// Extensão do tipo Session para incluir o token
interface Session {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
  accessToken?: string; // Token JWT
}

// Adicione qualquer outro tipo global aqui se necessário
