import NextAuth from "next-auth/next"

declare module 'next-auth'{
  interface Session {
    user: {
      id: string
      name: string
      username: string
      outletId: string
      emailVerified: boolean,
      image: string,
      phone: string,
      storeId: string,
      isSubAccount: boolean,
      isActive: boolean,
      lastLogin: Date,
      roles: any
    }
  }
}