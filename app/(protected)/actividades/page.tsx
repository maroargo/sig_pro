"use client";

import React, { useState } from "react";
import { format, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import useSWR from "swr";

import { Role } from "@prisma/client";
import { IActividad } from "@/interfaces/actividad";

import UpdateActividad from "@/components/actividades/update-actividad";
import DeleteActividad from "@/components/actividades/delete-actividad";
import CreateActividad from "@/components/actividades/create-actividad";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Actividades() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: actividades, error, isLoading } = useSWR<IActividad[]>("/api/actividades", fetcher);
  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);

  const isAdmin = role ? role.name === "Administrador" : false;
  const isCoordinador = role ? role.name === "Coordinador" : false; 
  const isFuncional = role ? role.name === "Analista Funcional" : false; 

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[600px] bg-white">
        <div className="animate-spin h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full"></div>
      </div>
    );

  if (error) return <div>Ocurrió un error.</div>;

  const actividadList = actividades || [];

  const filteredData = actividadList.filter((item) =>
    item.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hoy = new Date();

  return (
    <div className="bg-white p-6 rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Actividades</h1>

        {(isCoordinador || isFuncional) && (
          <CreateActividad />                      
        )}         
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar actividad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.length > 0 ? (
          filteredData.map((actividad) => {
            const fechaFin = actividad.fechaFin ? new Date(actividad.fechaFin) : null;
            const vencida = fechaFin ? isAfter(hoy, fechaFin) : false;

            const bgColor = vencida ? "bg-red-100" : "bg-green-100";

            return (
              <div key={actividad.id} className={`${bgColor} p-5 rounded-lg shadow-sm flex flex-col gap-4`}>
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-bold text-gray-800">{actividad.nombre}</h2>

                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Responsable:</span> {actividad.user?.name || "Sin asignar"}
                  </div>

                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Fase:</span> {actividad.fase?.nombre || "Sin fase"}
                  </div>

                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">Etapa:</span> {actividad.etapa?.name || "Sin etapa"}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2 mt-3">
                    {/* Fecha Inicio */}
                    <div className="flex flex-col items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-md shadow-sm">
                      <span className="text-xs font-semibold uppercase">Inicio</span>
                      <span className="text-base font-bold">
                        {actividad.fechaInicio
                          ? format(new Date(actividad.fechaInicio), "dd/MM/yyyy", { locale: es })
                          : "Sin fecha"}
                      </span>
                    </div>

                    {/* Fecha Fin */}
                    <div className="flex flex-col items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-md shadow-sm">
                      <span className="text-xs font-semibold uppercase">Fin</span>
                      <span className="text-base font-bold">
                        {actividad.fechaFin
                          ? format(new Date(actividad.fechaFin), "dd/MM/yyyy", { locale: es })
                          : "Sin fecha"}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-700 mt-2">
                    <span className="font-semibold">Estado:</span> {actividad.estadoActividad?.name || "Sin estado"}
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {(isCoordinador || isFuncional) && (
                    <UpdateActividad actividad={actividad} />                   
                  )} 
                  {(isCoordinador || isFuncional) && (
                    <DeleteActividad id={actividad.id} />                   
                  )}                                    
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 col-span-full">No se encontraron actividades.</div>
        )}
      </div>
    </div>
  );
}
