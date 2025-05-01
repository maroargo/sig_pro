"use client";

import { useState } from "react";
import { mutate } from "swr";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import FaseForm from "@/components/fases/fase-form";
import { type FaseSchema } from "@/lib/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { IProyecto } from "@/interfaces/proyecto";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UpdateFase({ proyecto }: { proyecto: IProyecto }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { toast } = useToast();

    const { data: fases } = useSWR(
        `/api/fases/proyecto?idProyecto=${proyecto.id}`,
        fetcher
    );    
    const faseList = fases || [];

    const onSubmit = async (data: FaseSchema) => {
        setIsSubmitting(true);
        try {            
            const response = await fetch("/api/fases", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, id: proyecto.id }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "Ocurrió un error"
                );
            }

            setErrorMessage("");
            setDialogOpen(false);
            mutate(`/api/fases/proyecto?idProyecto=${proyecto.id}`);
            mutate("/api/proyectos");

            toast({
              title: "Éxito",
              description: "Proyecto actualizado satisfactoriamente.",
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
                    <DialogTitle>Fases del Proyecto</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}
                <FaseForm
                    defaultValues={{
                        idProyecto: proyecto.id || "",
                        nombreProyecto: proyecto.nombre || "",
                        unico: faseList.length === 1, // Si hay solo 1 fase, marcar "único"
                        fases: faseList.map((fase: any) => ({ nombre: fase.nombre })) // Adaptar estructura
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
