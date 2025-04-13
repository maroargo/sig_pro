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

import SolicitudForm from "@/components/solicitudes/solicitud-form";
import { type SolicitudSchema } from "@/lib/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { Status } from "@prisma/client";
import { ISolicitud } from "@/interfaces/solicitud";

export default function UpdateSolicitud({ solicitud }: { solicitud: ISolicitud }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false);

    const { toast } = useToast();

    const onSubmit = async (data: SolicitudSchema) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/solicitudes", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, id: solicitud.id }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData.message || "Ocurrió un error"
                );
            }

            setErrorMessage("");
            setDialogOpen(false);
            mutate("/api/solicitudes");

            toast({
              title: "Éxito",
              description: "Solicitud actualizada satisfactoriamente.",
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
            <DialogContent className="sm:max-w-[925px] overflow-auto bg-white">
                <DialogHeader>
                    <DialogTitle>Actualizar Solicitud</DialogTitle>
                </DialogHeader>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">
                        {errorMessage}
                    </div>
                )}
                <SolicitudForm
                    defaultValues={{
                        correlativo: solicitud.correlativo || "", 
                        nombre: solicitud.nombre || "",
                        noexiste: solicitud.noexiste,
                        siglas: solicitud.siglas || "",
                        nombrePropuesto: solicitud.nombrePropuesto || "",

                        objetivo: solicitud.objetivo || "", 
                        resumen: solicitud.resumen || "", 
                        idProspecto: solicitud.idProspecto || "",                                                 
                        
                        fechaSolicitud: solicitud.fechaSolicitud,
                        liderUsuario: solicitud.liderUsuario || "",
                        patrocinador: solicitud.patrocinador || "",
                        idTipoRequerimiento: solicitud.idTipoRequerimiento || "",

                        alcance: solicitud.alcance || "",
                        idTipoAlcance: solicitud.idTipoAlcance || "",
                        objetivoGeneral: solicitud.objetivoGeneral || "",
                        objetivos: solicitud.objetivos || [],

                        niveles: solicitud.niveles || [],
                        hitos: solicitud.hitos || [],                        

                        beneficio: solicitud.beneficio || "",
                        beneficioCualitativo: solicitud.beneficioCualitativo || "",
                        beneficioCuantitativo: solicitud.beneficioCuantitativo || "",

                        resultados: solicitud.resultados || [],
                        terminos: solicitud.terminos || "",
                        directivas: solicitud.directivas || "",

                        idEstadoSolicitud: solicitud.idEstadoSolicitud || "", 
                        idStatus: solicitud.status == Status.activo ? "0" : "1",                              
                    }}
                    onSubmit={onSubmit}
                    submitButtonText="Actualizar"
                    isSubmitting={isSubmitting}
                    isUpdating={isUpdating}
                    isReadOnly={false}
                />
            </DialogContent>
        </Dialog>
    );
}
