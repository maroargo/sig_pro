"use client";

import React, { useState } from 'react';
import CreateProyecto from '@/components/proyectos/create-proyecto';
import UpdateProyecto from '@/components/proyectos/update-proyecto';
import DeleteProyecto from '@/components/proyectos/delete-proyecto';
import { Role } from '@prisma/client';
import useSWR from "swr";
import { IProyecto } from '@/interfaces/proyecto';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UpdateFase from '@/components/fases/update-fase';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Proyectos() {
  const [searchTerm, setSearchTerm] = useState('');  
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
 
  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);
  const isAdmin = role ? role.name == "Administrador" : false; 
  const isCoordinador = role ? role.name == "Coordinador" : false;   
  const isFuncional = role ? role.name == "Analista Funcional" : false; 

  const {
    data: proyectos,
    error,
    isLoading,
  } = useSWR<IProyecto[]>("/api/proyectos", fetcher);   
  
  const proyectoList = Array.isArray(proyectos) ? proyectos : [];

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[600px] bg-white">
        <div className="relative w-12 h-12">
          <div className="absolute w-12 h-12 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute w-12 h-12 border-4 border-primary rounded-full animate-ping opacity-25"></div>
        </div>
      </div>
    );

  if (error) return <div>Ocurrió un error.</div>;
  
  // Obtener lista única de usuarios y tipos de proyecto
  const usuarios = Array.from(
    new Set(proyectoList.flatMap((proyecto) => proyecto.users.map((u) => u.user?.name)))
  ).filter(Boolean);

  const tiposProyecto = Array.from(
    new Set(proyectoList.map((proyecto) => proyecto.tipoProyecto?.name))
  ).filter(Boolean);

  // Filtrar proyectos según búsqueda, usuario y tipo de proyecto
  const filteredData = proyectoList.filter((proyecto) => {
    const matchesSearch =
      proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proyecto.acronimo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser =
      !selectedUser || proyecto.users.some((u) => u.user?.name === (selectedUser=='default' ? u.user?.name : selectedUser));

    const matchesTipo =
      !selectedTipo || proyecto.tipoProyecto?.name === (selectedTipo=='default' ? proyecto.tipoProyecto?.name : selectedTipo);

    return matchesSearch && matchesUser && matchesTipo;
  });

  return (
    <div className="bg-white p-6 rounded-md">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-medium">Proyectos</h1>
        
        {isCoordinador && <CreateProyecto />}
      </div>

      {/* Barra de búsqueda y filtro de usuario */}
      <div className="mb-4 flex space-x-4">
        {/* Campo de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por proyecto o acrónimo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
        />

        {/* Combo Box de usuarios */}
        <Select onValueChange={setSelectedUser} value={selectedUser ?? "default"}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todos los Coordinadores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Todos los usuarios</SelectItem>
            {usuarios.map((user) => (
              <SelectItem key={user} value={user}>{user}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Combo Box de Tipo de Proyecto */}
        <Select onValueChange={setSelectedTipo} value={selectedTipo ?? "default"}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todos los Tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Todos los proyectos</SelectItem>
            {tiposProyecto.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((proyecto) => (
            <div key={proyecto.id} className="border rounded-lg shadow-md p-6 bg-white flex flex-col space-y-4">
              {/* Nombre del Proyecto */}
              <h2 className="text-xl font-bold text-gray-900 break-words">{proyecto.nombre}</h2>

              {/* Avatar y Detalles */}
              <div className="flex justify-between items-start">
                {/* Detalles en una columna */}
                <div className="flex flex-col text-sm text-gray-700 flex-1 space-y-1">
                  <p><span className="font-semibold">Acrónimo:</span> {proyecto.acronimo}</p>
                  <p><span className="font-semibold">Proceso Electoral:</span> <span className="text-blue-600 font-bold">{proyecto.proceso?.siglas}</span></p>
                  <p><span className="font-semibold">Tipo:</span> {proyecto.tipoProyecto?.name}</p>
                  <p><span className="font-semibold">Fases:</span> {proyecto.fases?.length}</p>
                  <p><span className="font-semibold">Estado:</span> {proyecto.status}</p>
                </div>
                
                {proyecto.users.length>0 && 
                  <div className="flex flex-col items-center ml-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage 
                        src={proyecto.users[0]?.user?.genero === "F" ? "/female.png" : "/male.png"} 
                        alt={proyecto.users[0]?.user?.name} 
                      />
                      <AvatarFallback>{proyecto.users[0]?.user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700 mt-2">
                      {proyecto.users[0]?.user?.name}
                    </span>
                  </div>
                }
              </div>

              {/* Código del Proyecto y Botones */}
              <div className="flex justify-between items-center mt-4">
                {/* Código del Proyecto */}
                <span className="text-sm font-semibold text-gray-700">{proyecto.codigo}</span>
                
                {/* Botones */}
                <div className="flex space-x-2">   
                  {isFuncional && <UpdateFase proyecto={proyecto} />}                
                  {isCoordinador && <UpdateProyecto proyecto={proyecto} />} 
                  {isAdmin && <DeleteProyecto id={proyecto.id} />}                
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No se encontraron registros</p>
        )}
      </div>
    </div>
  );
}