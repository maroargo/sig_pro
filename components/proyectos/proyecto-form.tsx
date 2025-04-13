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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { proyectoSchema, type ProyectoSchema } from "@/lib/zod";
import { IStatus } from "@/interfaces/status";
import { Gerencia, Proceso, TipoProyecto } from "@prisma/client";
import { CirclePlus, Trash2 } from "lucide-react";
import { IUser } from "@/interfaces/user";
import { IPresupuesto } from "@/interfaces/presupuesto";
import { useEffect, useState } from "react";

interface ProyectoFormProps {
  defaultValues: ProyectoSchema;
  onSubmit: (data: ProyectoSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isUpdating: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProyectoForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isUpdating,
}: ProyectoFormProps) {
  const form = useForm<ProyectoSchema>({
    resolver: zodResolver(proyectoSchema),
    defaultValues,
  });

  const [procesoList, setProcesoList] = useState<Proceso[]>([]);
  const [selectedPresupuesto, setSelectedPresupuesto] = useState("");

  const statusList: IStatus[] = [
    { id: "0", name: "Activo" },
    { id: "1", name: "Inactivo" },
  ];

  const { fields, append, remove } = useFieldArray({
    name: "users",
    control: form.control,
  });

  const { data: gerencias } = useSWR<Gerencia[]>("/api/gerencias", fetcher);
  const gerenciaList = gerencias || [];

  const { data: tipoProyectos } = useSWR<TipoProyecto[]>("/api/tipoProyectos", fetcher);
  const tipoProyectoList = tipoProyectos || [];

  const { data: presupuestos } = useSWR<IPresupuesto[]>("/api/presupuestos/active", fetcher);
  const presupuestoList = presupuestos || [];

  const { data: users } = useSWR<IUser[]>("/api/users/active", fetcher);
  const userList = users || [];

  // Estado para el código mostrado
  const [displayCodigo, setDisplayCodigo] = useState(defaultValues.codigo || "");

  // Efecto para inicialización
  useEffect(() => {
    const gerenciaInicial = gerenciaList.find(g => g.id === defaultValues.idGerencia);
    const siglasIniciales = gerenciaInicial ? `${gerenciaInicial.siglas}-` : "";
    const codigoInicial = defaultValues.codigo ? 
      defaultValues.codigo.replace(/^[A-Z]+-/, '') : "";
    
    setDisplayCodigo(`${siglasIniciales}${codigoInicial}`);
  }, [gerenciaList, defaultValues.idGerencia, defaultValues.codigo]);

  // Actualización cuando cambia la gerencia
  const idGerencia = form.watch("idGerencia");
  useEffect(() => {
    if (idGerencia) {
      const gerencia = gerenciaList.find(g => g.id === idGerencia);
      if (gerencia) {
        const currentCodigo = form.getValues("codigo") || "";
        const codigoLimpio = currentCodigo.replace(/^[A-Z]+-/, '');
        const nuevoCodigo = `${gerencia.siglas}-${codigoLimpio}`;
        
        setDisplayCodigo(nuevoCodigo);
        form.setValue('codigo', nuevoCodigo, {
          shouldValidate: false,
          shouldDirty: true
        });
      }
    }
  }, [idGerencia, gerenciaList, form]);   

  // useEffect para cargar subgerencias cuando se selecciona una gerencia
  useEffect(() => {
    if (selectedPresupuesto) {      
      const fetchProcesos = async () => {
        const response = await fetch(
          `/api/procesos/presupuesto?idPresupuesto=${selectedPresupuesto}`
        );
        const procesosData: Proceso[] = await response.json();
        setProcesoList(procesosData || []);        
      };

      fetchProcesos();
    }
  }, [selectedPresupuesto]); // Este efecto se ejecuta cuando cambia la gerencia seleccionada

  //Para inicializar los valores del formulario  
  useEffect(() => {
    if (defaultValues.idPresupuesto) {
      setSelectedPresupuesto(defaultValues.idPresupuesto);
    }    
  }, [defaultValues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     
        {/* Primera Columna: Campos Principales */}
        <div className="space-y-4">           

          <FormField
            control={form.control}
            name="idGerencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gerencia</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione gerencia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gerenciaList.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.siglas}
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

          <div className="grid auto-rows-min gap-4 md:grid-cols-2 mb-4">
            <FormField
              control={form.control}
              name="acronimo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acrónimo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> 

            <FormField
              control={form.control}
              name="idTipoProyecto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo Proyecto</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione tipo proyecto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tipoProyectoList.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>                             

          <FormField
            control={form.control}
            name="idPresupuesto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Presupuesto</FormLabel>
                <Select onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedPresupuesto(value);  // Actualizamos la opcion seleccionada
                  }} defaultValue={field.value}>                
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione presupuesto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {presupuestoList.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        ({p.periodo?.descripcion}) {p.nombre}
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
            name="idProceso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proceso Electoral</FormLabel>
                <Select 
                  disabled={procesoList.length==0}
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {procesoList.map((pro) => (
                      <SelectItem key={pro.id} value={pro.id}>
                        {pro.siglas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />          

          {/* Correlativo resaltado */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center">              
              <p className="text-xl font-bold text-primary">
                {displayCodigo}
              </p>
            </div>
          </div>
        </div>

        {/* Segunda Columna: Lista de Usuarios y Botón de Agregar */}
        <div className="space-y-4">
          <Button
            type="button"
            onClick={() => append({ cargo: "", idUser: "", idProyecto: "" })}
            className="w-full"
          >
            <CirclePlus className="mr-2" /> Agregar Integrante
          </Button>

          {fields.length > 0 ? (
            fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-[150px_220px_auto] gap-2 items-end w-full">
                {/* Primera columna: Cargo */}
                
                <FormField
                  name={`users.${index}.cargo`}                  
                  render={({ field }) => (
                    <FormItem className="w-[150px]">                      
                      <FormControl>
                        <Input placeholder="Cargo" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Segunda columna: Integrante (con tamaño fijo en SelectTrigger) */}
                <FormField
                  control={form.control}
                  name={`users.${index}.idUser`}
                  render={({ field }) => (
                    <FormItem className="w-[220px]">                      
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="min-w-0 w-full truncate">
                            <SelectValue placeholder="Seleccionar integrante" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userList.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name} ({u.role?.name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Botón de eliminar */}
                <Button type="button" variant="destructive" className="h-10 w-10 flex justify-center items-center" onClick={() => remove(index)}>
                  <Trash2 size={18} />
                </Button>
              </div>

            ))
          ) : (
            <h3 className="text-center text-gray-500">No se encontraron integrantes</h3>
          )}
        </div>

        {/* Botón de Enviar */}
        <div className="col-span-2">
          <Button disabled={isSubmitting} className="w-full relative" type="submit">
            {isSubmitting && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/50 rounded-md">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}