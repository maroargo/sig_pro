"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import useSWR from "swr";
import { Role } from "@prisma/client";

import { ICronograma } from "@/interfaces/cronograma";
import UpdateCronograma from "@/components/cronogramas/update-cronograma";
import DeleteCronograma from "@/components/cronogramas/delete-cronograma";
import CreateCronograma from "@/components/cronogramas/create-cronograma";
import AutocompleteCronograma from "@/components/cronogramas/autocomplete-cronograma";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Cronogramaes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openFaseId, setOpenFaseId] = useState<string | null>(null);

  const { data: cronogramas, error, isLoading } = useSWR<ICronograma[]>("/api/cronogramas", fetcher);
  const { data: role } = useSWR<Role>("/api/roles/user", fetcher);

  const isAdmin = role ? role.name === "Administrador" : false;
  const isFuncional = role ? role.name === "Analista Funcional" : false;  

  if (isLoading) return <div className="flex justify-center items-center h-[600px] bg-white">Cargando...</div>;
  if (error) return <div>Ocurrió un error.</div>;

  const cronogramaList = cronogramas || [];

  // Agrupar cronogramas por fase
  const fasesMap = cronogramaList.reduce((acc: any, item) => {
    const idFase = item.fase?.id;
    if (!idFase) return acc;

    if (!acc[idFase]) {
      acc[idFase] = {
        nombreFase: item.fase?.nombre,
        acronimoProyecto: item.fase?.proyecto?.acronimo,
        procesoProyecto: item.fase?.proyecto?.proceso?.siglas,
        cronogramas: [],
      };
    }
    acc[idFase].cronogramas.push(item);
    return acc;
  }, {});

  const fases = Object.entries(fasesMap);

  const handleToggle = (faseId: string) => {
    setOpenFaseId((prev) => (prev === faseId ? null : faseId));
  };

  return (
    <div className="bg-white p-6 rounded-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Programaciones</h1>
        <div className="flex gap-2">
          {isFuncional && (
            <CreateCronograma />                       
          )}
          {isFuncional && (
            <AutocompleteCronograma />                       
          )}                    
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar tarea..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="space-y-4">
        {fases.length > 0 ? (
          fases.map(([faseId, faseData]: any) => (
            <div key={faseId} className="border rounded-md shadow-sm">
              <button
                onClick={() => handleToggle(faseId)}
                className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-t-md"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-600">{faseData.procesoProyecto}</div>
                    <div className="font-bold text-lg">{faseData.acronimoProyecto} - {faseData.nombreFase}</div>                    
                  </div>
                  <div>{openFaseId === faseId ? "▲" : "▼"}</div>
                </div>
              </button>

              {openFaseId === faseId && (
                <div className="p-4 space-y-4 bg-gray-50 rounded-b-md">
                  {faseData.cronogramas
                    .filter((item: ICronograma) =>
                      item.tarea?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((item: ICronograma) => (
                      <div key={item.id} className="bg-white p-4 rounded shadow-sm flex flex-col gap-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <div className="font-medium text-gray-700">Etapa: {item.etapa?.name || "Sin etapa"}</div>
                            <div className="text-sm text-gray-600">Subetapa: {item.subetapa?.name || "Sin subetapa"}</div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.fecha
                              ? format(new Date(item.fecha), "dd/MM/yyyy", { locale: es })
                              : "Sin fecha"}
                          </div>
                        </div>
                        <div className="mt-2 text-gray-800">{item.tarea}</div>

                        <div className="flex gap-2 mt-2">
                          {isFuncional && (
                            <UpdateCronograma cronograma={item} />                       
                          )}
                          {isFuncional && (
                            <DeleteCronograma id={item.id} />                    
                          )}                                                    
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No se encontraron programaciones.</div>
        )}
      </div>
    </div>
  );
}
