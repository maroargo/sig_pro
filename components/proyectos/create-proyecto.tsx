"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { proyectoSchema, type ProyectoSchema } from "@/lib/zod";
import { useState } from "react";
import useSWR from "swr";

import { mutate } from "swr";
import ProyectoForm from "./proyecto-form";
import { useToast } from "@/hooks/use-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CreateProyecto() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();
  
  const form = useForm<ProyectoSchema>({
    resolver: zodResolver(proyectoSchema),
    defaultValues: {
      idGerencia: "",
      nombre: "",
      acronimo: "",      
      idPresupuesto: "",
      idStatus: "0"
    },
  });

  const { data: correlativoData } = useSWR<{
    codigo: string;
    correlativo: number;
  }>("/api/proyectos/correlativo", fetcher);

  const correlativoStr = correlativoData?.codigo || "";
  const correlativoNum = correlativoData?.correlativo || 0;

  const onSubmit = async (data: ProyectoSchema) => {    
    setIsSubmitting(true);
    try {      
      const response = await fetch("/api/proyectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Ocurrió un error"
        );
      }
      form.reset();
      setDialogOpen(false);
      mutate("/api/proyectos");
      setErrorMessage("");

      toast({
        title: "Éxito",
        description: "Proyecto creado satisfactoriamente.",
      })
    } catch (error) {      
      const errorMessage =
        error instanceof Error ? error.message : "Ocurrió un error";
      setErrorMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Crear</Button>
      </DialogTrigger>      
      
      <DialogContent className="sm:max-w-[925px] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle>Crear Proyecto:</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <ProyectoForm
          defaultValues={{
            idGerencia: "",
            nombre: "",
            acronimo: "",  
            correlativo: correlativoNum, 
            codigo: correlativoStr,                     
            idTipoProyecto: "",            
            idProceso: "",
            idPresupuesto: "",
            idEstadoProyecto: "",
            users: [],
            idStatus: "0",            
          }}
          onSubmit={onSubmit}
          submitButtonText="Crear"
          isSubmitting={isSubmitting}
          isUpdating={isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
}
