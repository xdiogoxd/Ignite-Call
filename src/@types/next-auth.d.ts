import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    image_url: string;
  }
}
