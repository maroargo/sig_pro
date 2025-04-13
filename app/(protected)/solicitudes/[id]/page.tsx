"use client";

import React from 'react';

import useSWR from "swr";

import { Role } from '@prisma/client';
import CreateDimension from '@/components/dimensiones/create-dimension';
import { IDimension } from '@/interfaces/dimension';
import UpdateDimension from '@/components/dimensiones/update-dimension';
import DeleteDimension from '@/components/dimensiones/delete-dimension';
import { useParams } from 'next/navigation';
import AutocompleteDimension from '@/components/dimensiones/autocomplete-dimension';

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dimensiones() {
  
  const params = useParams(); 
  const idSolicitud = params.id as string; // Asegurar que es string  

  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);    
  const isCoordinador = role ? role.name == "Coordinador" : false;

  const {
    data: dimensiones,
    error,
    isLoading,
  } = useSWR<IDimension[]>(
    `/api/dimensiones?idSolicitud=${idSolicitud}`,
    fetcher    
  );   
  const dimensionList = dimensiones || [];   
    
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

  if (!isCoordinador)
    return (
      <div className="flex justify-center items-center h-[600px] bg-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No tienes acceso a esta opción
          </h2>
          <p className="text-gray-500">Por favor, contacta con el administrador si crees que esto es un error.</p>
        </div>
      </div>
    );

  return (
    <>      
      <div className="bg-white p-4 py-6 rounded-md">

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/home">Inicio</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/solicitudes">Solicitudes</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dimensionamiento</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Dimensionamiento</h1>
          
          <div className="ml-auto flex gap-2">
            <CreateDimension idSolicitud={idSolicitud} />
            <AutocompleteDimension idSolicitud={idSolicitud} />
          </div> 
        </div>        

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-colorprimario1 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Etapa</th>
                <th className="px-4 py-2 text-left">Tarea</th>
                <th className="px-4 py-2 text-left">Requerimiento</th>                
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {dimensionList.length > 0 ? (
                dimensionList.map((dimension) => (
                  <tr
                    key={dimension.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >                    
                    <td className="px-4 py-2">{dimension.tipoDimension.name}</td>
                    <td className="px-4 py-2">{dimension.tarea}</td> 
                    <td className="px-4 py-2">{dimension.requerimiento}</td>
                    <td className="px-4 py-2">
                      <UpdateDimension idSolicitud={idSolicitud} dimension={dimension} />
                      <DeleteDimension idSolicitud={idSolicitud} id={dimension.id} />  
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
