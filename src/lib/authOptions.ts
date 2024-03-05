import { NextAuthOptions } from "next-auth"
import { prisma } from "./client"
import bcrypt from 'bcrypt';
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "username" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          
          const user = await prisma.user.findUnique({
            where: {
              username: credentials?.username
            }
          })
        
          if(user && (await bcrypt.compare(credentials?.password as string, user.password))) {
            const { password , ...userWithoutPass } = user
            let outletId = null

            if(user.isSubAccount){
              const userAccess = await prisma.userOutlet.findFirst({
                where: {
                  userId: user.id,
                  outlet: {
                    storeId: Number(user.storeId)
                  }
                }
              })

              outletId = userAccess?.outletId
            } else {
              const outlet = await prisma.outlet.findFirst({
                where: {
                  storeId: Number(user.storeId)
                }
              })

              outletId = outlet?.id
            }
        
            return {
              ...userWithoutPass,
              outletId,
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
    async jwt({token, trigger, session}){
      if(trigger === 'update' && session){
        token = {
          ...token,
          ...session?.user,
        }
      }

      return token
    },
    async session({session, token, trigger}){
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
