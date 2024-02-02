import { NextAuthOptions } from "next-auth"
import { prisma } from "../api/client"
import bcrypt from 'bcrypt';
import CredentialsProvider from "next-auth/providers/credentials";
import { signJwtAccessToken } from "./jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {

          const user = await prisma.user.findFirst({
            where: {
              username: credentials?.username
            }
          })
        
          if(user && (await bcrypt.compare(credentials?.password as string, user.password))) {
            const { password , ...userWithoutPass } = user
            const acceessToken = signJwtAccessToken(userWithoutPass)
        
            return {
              ...userWithoutPass,
              acceessToken
            }
          } else {
            return null
          }
        }
      }
    )
  ],
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({token, user}){
      return { ...token, ...user}
    },
    async session({session, token}){
     session.user = token as any

     return session
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  }
}
