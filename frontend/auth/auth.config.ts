import { NextAuthConfig, User } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import axios from 'axios';

// Obtém as variáveis de ambiente
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL_API ?? '';
const basicAuthUser = process.env.NEXT_PUBLIC_BASIC_AUTH_USER ?? '';
const basicAuthPass = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS ?? '';

// Cria o header de autorização com as variáveis de ambiente
const authHeader =
  'Basic ' +
  Buffer.from(`${basicAuthUser}:${basicAuthPass}`).toString('base64');

const authenticateUser = async (
  username: string,
  password: string
): Promise<User | null> => {
  try {
    const response = await axios.post(
      `${backendUrl}/login`,
      { username, password },
      {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data && response.data.user && response.data.token) {
      return {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        username: response.data.user.username
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao autenticar:', error);
    return null;
  }
};

const authConfig: NextAuthConfig = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? ''
    }),
    CredentialProvider({
      credentials: {
        username: {
          label: 'Username',
          type: 'text'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await authenticateUser(
          credentials.username as string,
          credentials.password as string
        );
        if (user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        username: token.username as string
      };
      (session as any).accessToken = token.accessToken as string; // Agora você pode definir accessToken
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    }
  }
};

export default authConfig;
