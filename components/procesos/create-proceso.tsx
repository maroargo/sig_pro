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

import { procesoSchema, type ProcesoSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import ProcesoForm from "./proceso-form";
import { useToast } from "@/hooks/use-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CreateProceso() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();
  
  const form = useForm<ProcesoSchema>({
    resolver: zodResolver(procesoSchema),
    defaultValues: {      
      name: "",
      siglas: "", 
      idPresupuesto: "",  
      idStatus: "0"
    },
  });  

  const onSubmit = async (data: ProcesoSchema) => {
    setIsSubmitting(true);
    try {      

      const response = await fetch("/api/procesos", {
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
      mutate("/api/procesos");
      setErrorMessage("");

      toast({
        title: "Éxito",
        description: "Proceso creado satisfactoriamente.",
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
      
      <DialogContent className="sm:max-w-[625px] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle>Crear Proceso</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <ProcesoForm
          defaultValues={{            
            name: "",
            siglas: "",            
            idPresupuesto: "",
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
