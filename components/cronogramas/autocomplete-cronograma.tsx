"use client";

import { useState } from "react";
import useSWR from "swr";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AutocompleteCronograma() {
  const { toast } = useToast();
  const { data: fases } = useSWR("/api/fases/user", fetcher);
  const faseList = fases || [];

  const [selectedFase, setSelectedFase] = useState<string>("");

  const handleUpdate = async () => {
    if (!selectedFase) {
      toast({
        title: "Error",
        description: "Debe seleccionar una fase.",
      });
      return;
    }

    const response = await fetch(`/api/cronogramas/autocomplete`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idFase: selectedFase }),
    });

    if (response.ok) {
      mutate(`/api/cronogramas`);

      toast({
        title: "Éxito",
        description: "Programaciones creadas satisfactoriamente.",
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
          <AlertDialogTitle>Generación Automática</AlertDialogTitle>
          <AlertDialogDescription>
            Seleccione la fase para la cual desea generar el cronograma:
          </AlertDialogDescription>
          <Select onValueChange={setSelectedFase}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione fase" />
            </SelectTrigger>
            <SelectContent>
              {faseList.map((fase: any) => (
                <SelectItem key={fase.id} value={fase.id}>
                  {fase.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}