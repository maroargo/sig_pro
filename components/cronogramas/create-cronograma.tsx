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

import { cronogramaSchema, type CronogramaSchema } from "@/lib/zod";
import { useState } from "react";
import useSWR from "swr";

import { mutate } from "swr";
import CronogramaForm from "./cronograma-form";
import { useToast } from "@/hooks/use-toast";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CreateCronograma() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();
  
  const form = useForm<CronogramaSchema>({
    resolver: zodResolver(cronogramaSchema),
    defaultValues: {
      tarea: "",
      fecha: new Date(),
      idFase: "",               
      idEtapa: "",
      idSubetapa: "",  
    },
  });  

  const onSubmit = async (data: CronogramaSchema) => {    
    setIsSubmitting(true);
    try {      
      const response = await fetch("/api/cronogramas", {
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
      mutate("/api/cronogramas");
      setErrorMessage("");

      toast({
        title: "Éxito",
        description: "Cronograma creado satisfactoriamente.",
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
      
      <DialogContent className="sm:max-w-[725px] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle>Crear Cronograma:</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <CronogramaForm
          defaultValues={{
            tarea: "",
            fecha: new Date(),
            idFase: "",               
            idEtapa: "",
            idSubetapa: "",            
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
