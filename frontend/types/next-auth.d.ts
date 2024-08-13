import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  type UserSession = DefaultSession['user'];
}
interface Session {
  accessToken?: string;
  user: {
    id: string;
    username: string;
  } & DefaultSession['user'];
}
declare module 'next-auth' {
  interface User {
    username: string;
  }
  interface User extends DefaultUser {
    username: string;
  }

  interface CredentialsInputs {
    username: string;
    password: string;
  }
  interface JWT {
    accessToken?: string;
    id?: string;
  }
}
