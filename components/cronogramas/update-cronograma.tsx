"use client";

import { useState } from "react";
import { mutate } from "swr";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import CronogramaForm from "@/components/cronogramas/cronograma-form";
import { type CronogramaSchema } from "@/lib/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { ICronograma } from "@/interfaces/cronograma";

export default function UpdateCronograma({ cronograma }: { cronograma: ICronograma }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { toast } = useToast();

    const onSubmit = async (data: CronogramaSchema) => {
        setIsSubmitting(true);
        try {            
            const response = await fetch("/api/cronogramas", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, id: cronograma.id }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "Ocurrió un error"
                );
            }

            setErrorMessage("");
            setDialogOpen(false);
            mutate("/api/cronogramas");

            toast({
              title: "Éxito",
              description: "Cronograma actualizado satisfactoriamente.",
            });
        } catch (error) {            
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Ocurrió un error";
            setErrorMessage(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="mr-1 text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-blue-200"
                >
                    <Pencil1Icon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[725px] overflow-auto bg-white">
                <DialogHeader>
                    <DialogTitle>Actualizar Cronograma</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}
                <CronogramaForm
                    defaultValues={{ 
                        tarea: cronograma.tarea,
                        fecha: cronograma.fecha,  
                        idFase: cronograma.idFase,                
                        idEtapa: cronograma.idEtapa,
                        idSubetapa: cronograma.idSubetapa,                       
                    }}
                    onSubmit={onSubmit}
                    submitButtonText="Actualizar"
                    isSubmitting={isSubmitting}
                    isUpdating={isUpdating}
                />
            </DialogContent>
        </Dialog>
    );
}
