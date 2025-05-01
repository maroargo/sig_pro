"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, CirclePlus } from "lucide-react";

import { faseSchema, type FaseSchema } from "@/lib/zod";

interface FaseFormProps {
  defaultValues: FaseSchema;
  onSubmit: (data: FaseSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isUpdating: boolean;
}

export default function FaseForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isUpdating,
}: FaseFormProps) {
  const form = useForm<FaseSchema>({
    resolver: zodResolver(faseSchema),
    defaultValues,
  });

  const { control, watch, setValue } = form;
  const unico = watch("unico");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fases", // fases debe existir en tu esquema zod y defaultValues
  });

  useEffect(() => {
    if (unico && fields.length > 1) {      
      const firstFase = fields[0];
      if (firstFase) {        
        firstFase.nombre = defaultValues.nombreProyecto ?? ""; // Asignar el nombre del proyecto a la fase
        setValue("fases", [firstFase]);
      } else {        
        setValue("fases", [{ nombre: defaultValues.nombreProyecto ?? "" }]);
      }
    }
  }, [unico, fields, setValue]);  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Checkbox: Proyecto unico */}
        <FormField
          control={control}
          name="unico"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>El proyecto tiene sólo una fase</FormLabel>
            </FormItem>
          )}
        />

        {/* Lista de fases */}
        {fields.map((fase, index) => (
          <div key={fase.id} className="flex items-center gap-2">
            <FormField
              control={control}
              name={`fases.${index}.nombre` as const}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Nombre de Fase {index + 1}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nombre de fase" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!unico && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}

        {/* Botón para agregar fases */}
        {!unico && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ nombre: "" })}
            className="flex items-center gap-2"
          >
            <CirclePlus className="w-4 h-4" /> Agregar Fase
          </Button>
        )}

        {/* Submit */}
        <Button disabled={isSubmitting} className="w-full relative" type="submit">
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/50 rounded-md">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {submitButtonText}
        </Button>

      </form>
    </Form>
  );
}