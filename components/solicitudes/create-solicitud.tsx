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
import useSWR from "swr";

import { solicitudSchema, type SolicitudSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import SolicitudForm from "./solicitud-form";
import { useToast } from "@/hooks/use-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CreateSolicitud() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();
  
  const form = useForm<SolicitudSchema>({
    resolver: zodResolver(solicitudSchema),
    defaultValues: {
      nombre: "",
      siglas: "",
      nombrePropuesto: "", 
      noexiste: false,
      objetivo: "",
      resumen: "",      
      idEstadoSolicitud: "",           
      idStatus: "0"
    },
  });

  const { data: correlativo } = useSWR<string>("/api/solicitudes/correlativo", fetcher);   
  const correlativoStr = correlativo || "";

  const onSubmit = async (data: SolicitudSchema) => {
    setIsSubmitting(true);
    try {      
      const response = await fetch("/api/solicitudes", {
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
      mutate("/api/solicitudes");
      setErrorMessage("");

      toast({
        title: "Éxito",
        description: "Solicitud creada satisfactoriamente.",
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
          <DialogTitle>Crear Solicitud: SOL-{correlativoStr}</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <SolicitudForm
          defaultValues={{
            correlativo: correlativoStr, 
            nombre: "", 
            noexiste: false,
            siglas: "", 
            nombrePropuesto: "",         
            objetivo: "",
            resumen: "",                                 

            fechaSolicitud: new Date(),
            liderUsuario: "",
            patrocinador: "",
            idTipoRequerimiento: "",

            alcance: "",
            idTipoAlcance: "",
            objetivoGeneral: "",
            objetivos: [],

            niveles: [],
            hitos: [],

            beneficio: "",
            beneficioCualitativo: "",
            beneficioCuantitativo: "",

            resultados: [],
            terminos: "",
            directivas: "",

            idEstadoSolicitud: "",
            idStatus: "0",            
          }}
          onSubmit={onSubmit}
          submitButtonText="Crear"
          isSubmitting={isSubmitting}
          isUpdating={isUpdating}
          isReadOnly={false}
        />
      </DialogContent>
    </Dialog>
  );
}
