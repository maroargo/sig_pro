import NextAuth from "next-auth"
import authConfig from "./app/(auth)/auth.config"
 
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.idUser = user.idUser,
        token.idOrganization = user.idOrganization,                

        token.organization = user.organization;  
        token.gerencia = user.gerencia;          
        token.role = user.role;
      }
      return token
    },
    session({ session, token }) {      
      if (session.user) { 
        session.user.idUser = token.idUser,
        session.user.idOrganization = token.idOrganization,                

        session.user.organization = token.organization;  
        session.user.gerencia = token.gerencia;             
        session.user.role = token.role;
      }
      return session
    },
  },
  ...authConfig,
})