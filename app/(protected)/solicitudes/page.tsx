"use client";

import React, {useState} from 'react';

import CreateSolicitud from '@/components/solicitudes/create-solicitud';
import DeleteSolicitud from '@/components/solicitudes/delete-solicitud';
import useSWR from "swr";

import { Button } from "@/components/ui/button";

import { ISolicitud } from '@/interfaces/solicitud';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Role } from '@prisma/client';
import EnviarSolicitud from '@/components/solicitudes/enviar-solicitud';
import EstimarSolicitud from '@/components/solicitudes/estimar-solicitud';
import AprobarSolicitud from '@/components/solicitudes/aprobar-solicitud';
import RechazarSolicitud from '@/components/solicitudes/rechazar-solicitud';
import { CheckCircle, Clock, FileText, RefreshCw } from 'lucide-react';
import ViewSolicitud from '@/components/solicitudes/view-solicitud';
import Link from 'next/link';
import { MagicWandIcon } from '@radix-ui/react-icons';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Solicitudes() {
  const [searchTerm, setSearchTerm] = useState('');     

  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);
  const isUsuario = role ? role.name == "Usuario" : false; 
  const isCoordinador = role ? role.name == "Coordinador" : false;
  const isComite = role ? role.name == "Comité de Gobierno y Transformación Digital" : false;
  
  const {
    data: solicitudes,
    error,
    isLoading,
  } = useSWR<ISolicitud[]>(
    "/api/solicitudes",
    fetcher    
  );   
  const solicitudList = solicitudes || [];   

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
  
  const filteredData = solicitudList.filter(item => 
    item.correlativo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para obtener icono y color según el estado
  const getEstadoIcono = (estado: string) => {    
    switch (estado) {      
      case "5":
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case "4":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />; // Estado pendiente
    }
  };

  return (
    <>
      <div className="bg-white p-4 py-6 rounded-md">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-medium">Solicitudes</h1>

          {isUsuario && (
            <CreateSolicitud />
          )}
        </div>

        <div className="flex justify-between items-center ">
          <div className="flex justify-between items-center mb-4">
             
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <input 
              type="text" 
              placeholder="Buscar por solicitud..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px] border border-colorprimario1 rounded-md  px-3 py-1"
            />
          </div>
          
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-colorprimario1 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Solicitud</th>
                <th className="px-4 py-2 text-left">Prospecto</th>
                <th className="px-4 py-2 text-left">Fecha</th>
                <th className="px-4 py-2 text-left">Gerencia</th>                                
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((solicitud) => (
                  <tr
                    key={solicitud.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >                    
                    <td className="px-4 py-2 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      {solicitud.correlativo}
                    </td>
                    <td className="px-4 py-2">{solicitud.prospecto?.acronimo}</td>
                    <td className="px-4 py-2">
                      {solicitud.fechaSolicitud
                        ? format(new Date(solicitud.fechaSolicitud), "dd/MM/yyyy HH:mm", { locale: es })
                        : "Sin fecha"}
                    </td>
                    <td className="px-4 py-2">{solicitud.user?.subgerencia?.gerencia?.siglas} - {solicitud.user?.subgerencia?.siglas}</td>
                    <td className="px-4 py-2 flex items-center gap-2 min-h-[60px]">
                      {getEstadoIcono(solicitud.estadoSolicitud?.value || "")}
                      {solicitud.estadoSolicitud?.name}
                    </td>                                    
                    <td className="px-4 py-2">
                      {isUsuario && (
                        <EstimarSolicitud id={solicitud.id} />
                      )}
                      {isCoordinador && (
                        <Link href={`/solicitudes/${solicitud.id}`}>
                          <Button
                              variant="ghost"
                              size="icon"
                              className="mr-1 text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-blue-200"
                          >
                              <MagicWandIcon className="h-4 w-4" />
                          </Button>
                        </Link>                        
                      )}
                      {isCoordinador && (
                        <EnviarSolicitud id={solicitud.id} />
                      )}
                      {isComite && (
                        <AprobarSolicitud id={solicitud.id} />
                      )}
                       {isComite && (
                        <RechazarSolicitud id={solicitud.id} />
                      )}

                      <ViewSolicitud solicitud={solicitud} />
                      {isUsuario && (
                        <DeleteSolicitud id={solicitud.id} /> 
                      )}                                                                                                             
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
