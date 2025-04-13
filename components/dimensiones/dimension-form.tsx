"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { dimensionSchema, type DimensionSchema } from "@/lib/zod";
import { TipoDimension } from "@prisma/client";
import { Textarea } from "../ui/textarea";

interface DimensionFormProps {
  defaultValues: DimensionSchema;
  onSubmit: (data: DimensionSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isUpdating: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DimensionForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isUpdating,
}: DimensionFormProps) {
  const form = useForm<DimensionSchema>({
    resolver: zodResolver(dimensionSchema),
    defaultValues,
  });  

  const { data: tipos } = useSWR<TipoDimension[]>("/api/tipoDimensiones", fetcher);
  const tipoList = tipos || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
      <FormField
          control={form.control}
          name="idTipoDimension"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etapa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione etapa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tipoList.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tarea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tarea</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requerimiento"          
          render={({ field }) => (
            <FormItem className="p-1">
              <FormLabel>Requerimiento</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Requerimiento de alto nivel"
                  className="resize-none h-[50px] overflow-auto"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />             

        <Button
          disabled={isSubmitting}
          className="w-full relative"
          type="submit"
        >
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
