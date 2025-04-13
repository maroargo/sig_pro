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

import ProcesoForm from "@/components/procesos/proceso-form";
import { type ProcesoSchema } from "@/lib/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { Proceso, Status } from "@prisma/client";

export default function UpdateProceso({ proceso }: { proceso: Proceso }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { toast } = useToast();

    const onSubmit = async (data: ProcesoSchema) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/procesos", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, id: proceso.id }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "Ocurrió un error"
                );
            }

            setErrorMessage("");
            setDialogOpen(false);
            mutate("/api/procesos");

            toast({
              title: "Éxito",
              description: "Proceso actualizado satisfactoriamente.",
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
            <DialogContent className="sm:max-w-[625px] overflow-auto bg-white">
                <DialogHeader>
                    <DialogTitle>Actualizar Proceso</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}
                <ProcesoForm
                    defaultValues={{                                            
                        name: proceso.name || "",
                        siglas: proceso.siglas || "", 
                        idPresupuesto: proceso.idPresupuesto || "",                         
                        idStatus: proceso.status == Status.activo ? "0" : "1",                        
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
