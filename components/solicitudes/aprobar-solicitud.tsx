"use client";

import { Button } from "@/components/ui/button";
import { CheckIcon, PaperPlaneIcon, TrashIcon } from "@radix-ui/react-icons";
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

export default function AprobarSolicitud({ id }: { id: string }) {
  const { toast } = useToast();

  const handleUpdate = async () => {
    const response = await fetch(`/api/solicitudes/aprobar?id=${id}`, {
      method: "PUT",
    });
    if (response.ok) {
      mutate("/api/solicitudes");

      toast({
        title: "Éxito",
        description: "Solicitud aprobada.",
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
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-blue-200"
        >
          <CheckIcon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Aprobar Solicitud</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea aprobar la solicitud?
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
