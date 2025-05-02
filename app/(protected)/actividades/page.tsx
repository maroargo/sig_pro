"use client";

import React, {useState} from 'react';
import { format } from "date-fns";

import { Role } from '@prisma/client';
import useSWR from "swr";

import { IActividad } from '@/interfaces/actividad';

import { es } from "date-fns/locale";
import UpdateActividad from '@/components/actividades/update-actividad';
import DeleteActividad from '@/components/actividades/delete-actividad';
import CreateActividad from '@/components/actividades/create-actividad';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Actividades() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    data: actividades,
    error,
    isLoading,
  } = useSWR<IActividad[]>("/api/actividades", fetcher);  

  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);
  const isAdmin = role ? role.name == "Administrador" : false;

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

  const actividadList = actividades || [];

  const filteredData = actividadList.filter(item => 
    item.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Actividades</h1>

          <CreateActividad />   
        </div>

        <div className="flex justify-between items-center ">
          <div className="flex justify-between items-center mb-4">
            <label className="text-sm text-gray-600">
              <span className="pr-1">Mostrar</span>

              <select className="border border-gray-300 rounded px-2 py-1">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="pl-1">registros</span>
            </label>  
          </div>
          
          <input 
            type="text" 
            placeholder="Buscar por actividad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-colorprimario1 rounded-md  px-3 py-1"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-colorprimario1 text-white">
              <tr>
              <th className="px-4 py-2 text-left">Fase</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Etapa</th> 
                <th className="px-4 py-2 text-left">Fecha Inicio</th>
                <th className="px-4 py-2 text-left">Fecha Fin</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((actividad) => (
                  <tr
                    key={actividad.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >                    
                    <td className="px-4 py-2">{actividad.fase?.nombre}</td>   
                    <td className="px-4 py-2">{actividad.nombre}</td>
                    <td className="px-4 py-2">{actividad.etapa?.name}</td>                 
                    <td className="px-4 py-2">{actividad.fechaInicio
                                            ? format(new Date(actividad.fechaInicio), "dd/MM/yyyy", { locale: es })
                                            : "Sin fecha"}</td>
                    <td className="px-4 py-2">{actividad.fechaFin
                                            ? format(new Date(actividad.fechaFin), "dd/MM/yyyy", { locale: es })
                                            : "Sin fecha"}</td>
                    <td className="px-4 py-2">{actividad.estadoActividad?.name}</td>
                    <td className="px-4 py-2">
                      <UpdateActividad actividad={actividad} />
                      <DeleteActividad id={actividad.id} />                                              
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2">No se encontraron registros</td>
                </tr>
              )}
              
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
