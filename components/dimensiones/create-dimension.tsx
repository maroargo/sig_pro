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

import { dimensionSchema, type DimensionSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import DimensionForm from "./dimension-form";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

export default function CreateDimension({ idSolicitud }: { idSolicitud: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();
  
  const form = useForm<DimensionSchema>({
    resolver: zodResolver(dimensionSchema),
    defaultValues: {
      idSolicitud: idSolicitud,
      idTipoDimension: "",
      tarea: "",      
      requerimiento: "",
    },
  });

  const onSubmit = async (data: DimensionSchema) => {
    setIsSubmitting(true);
    try {      
      const response = await fetch("/api/dimensiones", {
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
      mutate(`/api/dimensiones?idSolicitud=${idSolicitud}`);
      setErrorMessage("");

      toast({
        title: "Éxito",
        description: "Dimensión creada satisfactoriamente.",
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
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar
        </Button>
      </DialogTrigger>      
      
      <DialogContent className="sm:max-w-[425px] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle>Agregar Dimensión</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <DimensionForm
          defaultValues={{
            idSolicitud: idSolicitud,
            idTipoDimension: "",
            tarea: "",
            requerimiento: "",       
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
