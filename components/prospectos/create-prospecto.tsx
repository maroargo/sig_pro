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

import { prospectoSchema, type ProspectoSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import ProspectoForm from "./prospecto-form";
import { useToast } from "@/hooks/use-toast";

export default function CreateProspecto() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();
  
  const form = useForm<ProspectoSchema>({
    resolver: zodResolver(prospectoSchema),
    defaultValues: {
      idTipoProyecto: "",
      nombre: "",
      acronimo: "",      
      idStatus: "0"
    },
  });

  const onSubmit = async (data: ProspectoSchema) => {
    setIsSubmitting(true);
    try {      
      const response = await fetch("/api/prospectos", {
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
      mutate("/api/prospectos");
      setErrorMessage("");

      toast({
        title: "Éxito",
        description: "Prospecto creado satisfactoriamente.",
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
      
      <DialogContent className="sm:max-w-[425px] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle>Crear Prospecto</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <ProspectoForm
          defaultValues={{
            idTipoProyecto: "",
            nombre: "",
            acronimo: "",            
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
