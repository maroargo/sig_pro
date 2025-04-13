"use client";

import { Button } from "@/components/ui/button";
import { Cross2Icon, PaperPlaneIcon, TrashIcon } from "@radix-ui/react-icons";
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

export default function RechazarSolicitud({ id }: { id: string }) {
  const { toast } = useToast();

  const handleUpdate = async () => {
    const response = await fetch(`/api/solicitudes/rechazar?id=${id}`, {
      method: "PUT",
    });
    if (response.ok) {
      mutate("/api/solicitudes");

      toast({
        title: "Éxito",
        description: "Solicitud rechazada.",
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
          className="mr-1 text-red-500 bg-red-100 hover:text-red-700 hover:bg-red-200"
        >
          <Cross2Icon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rechazar Solicitud</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro que desea rechazar la solicitud?
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
