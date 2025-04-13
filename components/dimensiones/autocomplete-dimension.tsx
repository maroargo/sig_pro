"use client";

import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { mutate } from "swr";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Settings } from "lucide-react";

export default function AutocompleteDimension({ idSolicitud }: { idSolicitud: string }) {
  const { toast } = useToast();

  const handleUpdate = async () => {
    const response = await fetch(`/api/dimensiones/autocomplete?idSolicitud=${idSolicitud}`, {
      method: "PUT",
    });

    if (response.ok) {      
      mutate(`/api/dimensiones?idSolicitud=${idSolicitud}`);

      toast({
        title: "Éxito",
        description: "Dimensiones creadas satisfactoriamente.",
      });
    } else {
      toast({
        title: "Error",
        description: "Ocurrió un error.",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Generar
          </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Advertencia</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea generar automáticamente las dimensiones de la solicitud?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
