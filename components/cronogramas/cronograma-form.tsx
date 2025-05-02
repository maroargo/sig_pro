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
import { Textarea } from "@/components/ui/textarea";

import { cronogramaSchema, type CronogramaSchema } from "@/lib/zod";
import { IUser } from "@/interfaces/user";
import { Etapa, Fase } from "@prisma/client";
import { DateOnlyPicker } from "../ui/dateonlypicker";

interface CronogramaFormProps {
  defaultValues: CronogramaSchema;
  onSubmit: (data: CronogramaSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isUpdating: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CronogramaForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isUpdating,
}: CronogramaFormProps) {
  const form = useForm<CronogramaSchema>({
    resolver: zodResolver(cronogramaSchema),
    defaultValues,
  }); 

  const { data: fases } = useSWR<Fase[]>("/api/fases/user", fetcher);
  const faseList = fases || [];

  const { data: etapas } = useSWR<Etapa[]>("/api/etapas", fetcher);
  const etapaList = etapas || [];

  const { data: subetapas } = useSWR<IUser[]>("/api/subetapas", fetcher);
  const subetapaList = subetapas || [];        

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        <FormField
          control={form.control}
          name="idFase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fase</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione fase" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {faseList.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nombre}
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
          name="idEtapa"
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
                  {etapaList.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
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
          name="idSubetapa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sub Etapa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione sub-etapa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subetapaList.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
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
            <FormItem className="mb-4 p-1">
              <FormLabel>Tarea</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tarea"
                  className="resize-none h-[100px] overflow-auto"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />           

        <FormField 
          name="fecha"              
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <DateOnlyPicker                     
                  value={field.value ? new Date(field.value) : new Date()}                        
                  onChange={(date) => field.onChange(date)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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