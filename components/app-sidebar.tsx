"use client"

import * as React from "react"
import { NavMain } from "./nav-main"

import {    
  CalendarCog,
  Dock,
  FolderDot,
  FolderKanban,  
  House,              
  PackageSearch,                
  School,       
  UserRound,
  Users,  
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { RolSwitcher } from "@/components/rol-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { IRolNav, IUserNav } from "@/interfaces/session"

export function AppSidebar({
  user, role
}: {
  user : IUserNav;
  role : IRolNav;
}) {  
  
  const menus = {
    navMainDefault: [
      {
        title: "Dashboard",      
        icon: House,
        isActive: true,
        url: "/home",      
      }                         
    ],
    navMainAdmin: [
      {
        title: "Dashboard",      
        icon: House,
        isActive: true,
        url: "/home",      
      },   
      {
        title: "Organización",      
        icon: School,
        isActive: true,
        url: "/organizations",      
      },   
      {
        title: "Gerencias",      
        icon: FolderKanban,
        isActive: true,
        url: "/gerencias",      
      },   
      {
        title: "Subgerencias",      
        icon: FolderKanban,
        isActive: true,
        url: "/subgerencias",      
      }, 
      {
        title: "Usuarios",      
        icon: UserRound,
        isActive: true,
        url: "/users",      
      }                      
    ],    
    navMainAnalista: [
      {
        title: "Dashboard",      
        icon: House,
        isActive: true,
        url: "/home",      
      },
      {
        title: "Proyectos",      
        icon: FolderDot,
        isActive: true,
        url: "/proyectos",      
      }
    ],    
    navMainComite: [
      {
        title: "Dashboard",      
        icon: House,
        isActive: true,
        url: "/home",      
      },
      {
        title: "Solicitudes",      
        icon: Dock,
        isActive: true,
        url: "/solicitudes",      
      }
    ],    
    navMainCoord: [
      {
        title: "Dashboard",      
        icon: House,
        isActive: true,
        url: "/home",      
      },
      {
        title: "Periodos",      
        icon: CalendarCog,
        isActive: true,
        url: "/periodos",      
      },
      {
        title: "Procesos Electorales",      
        icon: PackageSearch,
        isActive: true,
        url: "/procesos",      
      },
      {
        title: "Prospectos",      
        icon: FolderDot,
        isActive: true,
        url: "/prospectos",      
      },
      {
        title: "Solicitudes",      
        icon: Dock,
        isActive: true,
        url: "/solicitudes",      
      },
      {
        title: "Proyectos",      
        icon: FolderDot,
        isActive: true,
        url: "/proyectos",      
      }
    ],    
    navMainUser: [
      {
        title: "Dashboard",      
        icon: House,
        isActive: true,
        url: "/home",      
      },
      {
        title: "Solicitudes",      
        icon: Dock,
        isActive: true,
        url: "/solicitudes",      
      }
    ]
  }   
    
  const navItems = role.name === "Administrador" ? menus.navMainAdmin 
    : (role.name === "Comité de Gobierno y Transformación Digital" ? menus.navMainComite 
      : (role.name === "Coordinador" ? menus.navMainCoord 
        : (role.name === "Usuario" ? menus.navMainUser 
          : (role.name === "Analista Funcional" ? menus.navMainAnalista : menus.navMainDefault))));
   
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <RolSwitcher role={role} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />              
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
