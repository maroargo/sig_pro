import { IGerenciaSession } from "@/interfaces/gerencia";
import { IOrganizationSession } from "@/interfaces/organization";
import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: { 
            idUser?: string,
            idOrganization?: string,
            organization?: IOrganizationSession,  
            gerencia?: IGerenciaSession,         
            role?: IRoleSession 
        } & DefaultSession["user"];
    }

    interface User {
        idUser?: string,
        idOrganization?: string,                
        organization?: IOrganizationSession,   
        gerencia?: IGerenciaSession,     
        role?: IRoleSession
    }
}

declare module "next-auth/jwt" {
    interface JWT { 
        idUser?: string,  
        idOrganization?: string,                    
        organization?: IOrganizationSession,
        gerencia?: IGerenciaSession,     
        role?: IRoleSession
    }
}