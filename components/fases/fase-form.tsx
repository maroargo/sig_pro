"use client";

import { useFieldArray, useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { faseSchema, type FaseSchema } from "@/lib/zod";
import { CirclePlus, Trash2 } from "lucide-react";

interface FaseFormProps {
  defaultValues: FaseSchema;
  onSubmit: (data: FaseSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isUpdating: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">                

        <FormField
          control={form.control}
          name="unico"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 shadow">
              <FormControl>
                <Checkbox                   
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  El proyecto tiene sólo una fase
                </FormLabel>                                  
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
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