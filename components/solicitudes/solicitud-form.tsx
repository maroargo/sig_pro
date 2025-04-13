"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

import { solicitudSchema, type SolicitudSchema } from "@/lib/zod";
import { Proyecto, TipoAlcance, TipoRequerimiento } from "@prisma/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CirclePlus, Trash2 } from "lucide-react";
import { DateOnlyPicker } from "../ui/dateonlypicker";
import { IUser } from "@/interfaces/user";

interface SolicitudFormProps {
  defaultValues: SolicitudSchema;
  onSubmit: (data: SolicitudSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isUpdating: boolean;
  isReadOnly: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SolicitudForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isUpdating,
  isReadOnly
}: SolicitudFormProps) {
  const form = useForm<SolicitudSchema>({
    resolver: zodResolver(solicitudSchema),
    defaultValues,
  });

  const { fields: fieldObjetivos, append: addObjetivo, remove: removeObjetivo } = useFieldArray({
    name: "objetivos",
    control: form.control,
  });
  
  const { fields: fieldNiveles, append: addNivel, remove: removeNivel } = useFieldArray({
    name: "niveles",
    control: form.control,
  });

  const { fields: fieldHito, append: addHito, remove: removeHito } = useFieldArray({
    name: "hitos",
    control: form.control,
  }); 
  
  const { fields: fieldRes, append: addRes, remove: removeRes } = useFieldArray({
    name: "resultados",
    control: form.control,
  });   

  const { data: prospectos } = useSWR<Proyecto[]>("/api/prospectos", fetcher);
  const prospectoList = prospectos || [];

  const { data: coordinadores } = useSWR<IUser[]>("/api/users/coordinador", fetcher);
  const coordinadorList = coordinadores || [];
 
  const { data: requerimientos } = useSWR<TipoRequerimiento[]>("/api/tipoRequerimientos", fetcher);
  const requerimientoList = requerimientos || [];

  const { data: alcances } = useSWR<TipoAlcance[]>("/api/tipoAlcances", fetcher);
  const alcanceList = alcances || [];     
  
  const noexiste = form.watch("noexiste"); // Observa el estado de noexiste
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        <Tabs defaultValue="informacion">
          <TabsList>
            <TabsTrigger value="informacion">Información</TabsTrigger>
            <TabsTrigger value="requerimiento">Requerimiento</TabsTrigger>
            <TabsTrigger value="alcance">Alcance</TabsTrigger>
            <TabsTrigger value="generales">Datos Generales</TabsTrigger>
            <TabsTrigger value="niveles">Niveles</TabsTrigger>
            <TabsTrigger value="beneficios">Beneficios</TabsTrigger>
            <TabsTrigger value="resultados">Resultados</TabsTrigger>
            <TabsTrigger value="referencias">Referencias</TabsTrigger>
          </TabsList>
          
          <TabsContent value="informacion" className="h-[500px] overflow-auto">
            <h2 className="text-lg font-semibold mb-2">Información General</h2>
            
            <FormField 
              control={form.control}
              name="objetivo"
              disabled={isReadOnly}
              render={({ field }) => (
                <FormItem className="mb-4 p-1">
                  <FormLabel>Objetivo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Objetivo"
                      className="resize-none h-[100px] overflow-auto"
                      {...field}
                    />                    
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="resumen"
              disabled={isReadOnly}
              render={({ field }) => (
                <FormItem className="mb-4 p-1">
                  <FormLabel>Resumen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Resumen"
                      className="resize-none h-[100px] overflow-auto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />                            

            <div className="grid auto-rows-min gap-4 md:grid-cols-2 mb-4">
              <FormField
                control={form.control}
                name="idProspecto"                
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prospecto</FormLabel>
                    <Select disabled={isReadOnly || noexiste} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione prospecto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {prospectoList.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.acronimo}
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
              name="noexiste"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-2 shadow">
                  <FormControl>
                    <Checkbox 
                      disabled={isReadOnly}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Mi proyecto no está en la lista
                    </FormLabel>  
                    <FormDescription>
                      Marque está opción si su proyecto no esta en la lista. Proponga un nombre en la sección de Requerimiento.
                    </FormDescription>                  
                  </div>
                </FormItem>
              )}
            /> 
          </TabsContent>

          <TabsContent value="requerimiento" className="h-[500px] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Información del Requerimiento</h2>
            
            {noexiste && (
              <div className="grid grid-cols-[70%_28%] gap-4">
                <FormField                  
                  control={form.control}
                  name="nombrePropuesto"
                  disabled={isReadOnly}
                  render={({ field }) => (
                    <FormItem className="mb-8">
                      <FormLabel>Nombre Propuesto</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField                  
                  control={form.control}
                  name="siglas"
                  disabled={isReadOnly}
                  render={({ field }) => (
                    <FormItem className="mb-8">
                      <FormLabel>Siglas</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>     
            )}
                       
            <FormField                  
              control={form.control}
              name="nombre"
              disabled={isReadOnly}
              render={({ field }) => (
                <FormItem className="mb-8">
                  <FormLabel>Requerimiento</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />            
            
            <div className="grid auto-rows-min gap-4 md:grid-cols-2 mb-8">
              <FormField                  
                control={form.control}
                name="liderUsuario"
                disabled={isReadOnly}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Líder Usuario</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField                  
                control={form.control}
                name="patrocinador"
                disabled={isReadOnly}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patrocinador</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />  
            </div>

            <div className="grid auto-rows-min gap-4 md:grid-cols-2 mb-8">
              <FormField 
                name="fechaSolicitud"              
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Solicitud</FormLabel>
                    <FormControl>
                      <DateOnlyPicker  
                        disabled={isReadOnly}
                        value={field.value ? new Date(field.value) : ""}
                        onChange={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idTipoRequerimiento"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo Requerimiento</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isReadOnly}
                        className="flex flex-row space-y-1"
                      >
                        {requerimientoList.map((t) => (
                          <FormItem
                            className="flex items-center space-x-3 space-y-0"
                            key={t.id}
                          >
                            <FormControl>
                              <RadioGroupItem value={t.id} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {t.name}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
          </TabsContent>
          
          <TabsContent value="alcance" className="h-[500px] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Detalle del Alcance</h2>

            <FormField
              control={form.control}
              name="idTipoAlcance"
              render={({ field }) => (
                <FormItem className="space-y-3 mb-8">
                  <FormLabel>Tipo Alcance</FormLabel>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isReadOnly}
                      className="flex flex-row space-y-1"
                    >
                      {alcanceList.map((t) => (
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          key={t.id}
                        >
                          <FormControl>
                            <RadioGroupItem value={t.id} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t.name}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alcance"
              disabled={isReadOnly}
              render={({ field }) => (
                <FormItem className="p-1">
                  <FormLabel>Alcance</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Alcance"
                      className="resize-none h-[150px] overflow-auto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="generales" className="h-[500px] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Datos Generales</h2>

            <FormField
              control={form.control}
              name="objetivoGeneral"
              disabled={isReadOnly}
              render={({ field }) => (
                <FormItem className="mb-8 p-1">
                  <FormLabel>Objetivo General</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Objetivo General"
                      className="resize-none h-[100px] overflow-auto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> 

            <div className="flex justify-between items-center mt-4 mb-4">
              <h2 className="text-lg font-semibold">Objetivos Específicos</h2>

              {!isReadOnly && (
                <Button
                  type="button"
                  onClick={() => {
                    addObjetivo({
                      objetivo: "",
                    });
                  }}
                >
                  <CirclePlus />                  
                </Button>
              )}
            </div>                      

            {fieldObjetivos.length > 0 ? (
              fieldObjetivos.map((field, index) => (
                <div key={field.id} className="w-full">
                  <div className="flex items-end mb-2 min-w-full gap-5">
                    <div className="w-full flex items-center gap-2">
                      {isReadOnly && <span className="font-semibold">{index + 1}.</span>}
                      <FormField
                        name={`objetivos.${index}.objetivo`}
                        disabled={isReadOnly}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input placeholder="Objetivo Específico" className="w-full" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {!isReadOnly && (
                      <Button type="button" onClick={() => removeObjetivo(index)}>
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <h3 className="text-center">No se encontraron objetivos</h3>
            )}                      
          </TabsContent>
          
          <TabsContent value="niveles" className="h-[500px] overflow-auto">
            <div className="flex flex-col h-full">
              
              {/* Sección de Lineamientos Estratégicos (50% superior) */}
              <div className="h-1/2 overflow-auto border-b pb-4">
                <div className="flex justify-between items-center mt-4 mb-4">
                  <h2 className="text-lg font-semibold">Lineamientos Estratégicos</h2>
                  {!isReadOnly && (
                    <Button type="button" onClick={() => addNivel({ nivel: "" })}>
                      <CirclePlus />
                    </Button>
                  )}
                </div>

                {fieldNiveles.length > 0 ? (
                  fieldNiveles.map((field, index) => (
                    <div key={field.id} className="mb-2">
                      <div className="flex justify-between items-end gap-5">
                        <div className="flex-1">
                          <FormField
                            name={`niveles.${index}.nivel`}
                            disabled={isReadOnly}
                            render={({ field }) => (
                              <FormItem>                            
                                <FormControl>
                                  <Input placeholder="Lineamiento" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        {!isReadOnly && (
                          <Button type="button" onClick={() => removeNivel(index)}>
                            <Trash2 />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <h3 className="text-center">No se encontraron lineamientos</h3>
                )}
              </div>

              {/* Sección de Hitos (50% inferior) */}
              <div className="h-1/2 overflow-auto pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Hitos</h2>
                  {!isReadOnly && (
                    <Button type="button" onClick={() => addHito({ hito: "", fecha: new Date() })}>
                      <CirclePlus />
                    </Button>
                  )}
                </div>

                {fieldHito.length > 0 ? (
                  fieldHito.map((field, index) => (
                    <div key={field.id} className="mb-2">
                      <div className="flex justify-between items-end gap-5">
                        {/* Hito (2/3 del ancho) */}
                        <div className="w-2/3 p-1">
                          <FormField
                            name={`hitos.${index}.hito`}
                            disabled={isReadOnly}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormControl>
                                  <Input className="w-full" placeholder="Hito" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Fecha (1/3 del ancho) */}
                        <div className="w-1/3">
                          <FormField
                            name={`hitos.${index}.fecha`}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormControl className="w-full">
                                  <DateOnlyPicker
                                    disabled={isReadOnly}
                                    value={field.value ? new Date(field.value) : ""}
                                    onChange={(date) => field.onChange(date)}
                                    className="w-full"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Botón de eliminar (solo si no es de solo lectura) */}
                        {!isReadOnly && (
                          <Button type="button" onClick={() => removeHito(index)}>
                            <Trash2 />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <h3 className="text-center">No se encontraron hitos</h3>
                )}
              </div>

            </div>
          </TabsContent>
          
          <TabsContent value="beneficios" className="h-[500px] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Beneficios del Producto</h2>

            <FormField
              control={form.control}
              name="beneficio"
              disabled={isReadOnly}
              render={({ field }) => (
                <FormItem className="mb-4 p-1">
                  <FormLabel>Beneficio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Beneficio del Producto"
                      className="resize-none h-[90px] overflow-auto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />             

            <FormField
              control={form.control}
              name="beneficioCuantitativo"
              disabled={isReadOnly}
              render={({ field }) => (
                <FormItem className="mb-4 p-1">
                  <FormLabel>Cuantitativo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cuantitativo"
                      className="resize-none h-[80px] overflow-auto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="beneficioCualitativo"
              disabled={isReadOnly}
              render={({ field }) => (
                <FormItem className="mb-8 p-1">
                  <FormLabel>Cualitativo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cualitativo"
                      className="resize-none h-[80px] overflow-auto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> 
          </TabsContent>

          <TabsContent value="resultados" className="h-[500px] overflow-auto">

            <div className="flex justify-between items-center mt-4 mb-4">
              <h2 className="text-lg font-semibold mb-4">Resultados Esperados</h2>

              {!isReadOnly && (
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    onClick={() => {
                      addRes({
                        nombre: "",
                        descripcion: "",
                      });
                    }}
                  >
                    <CirclePlus />                    
                  </Button>
                </div>
              )}
            </div>                        

            {fieldRes.length > 0 ? (
              fieldRes.map((field, index) => (
                <div key={field.id}>
                  <div className="flex justify-between items-end mb-2 min-w-full gap-5">
                    {/* Nombre con ancho definido */}
                    <div className="w-1/3 p-1">
                      <FormField
                        name={`resultados.${index}.nombre`}
                        disabled={isReadOnly}
                        render={({ field }) => (
                          <FormItem>                            
                            <FormControl>
                              <Input placeholder="Nombre" className="w-full" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Descripción más grande */}
                    <div className="w-2/3 p-1">
                      <FormField
                        name={`resultados.${index}.descripcion`}
                        disabled={isReadOnly}
                        render={({ field }) => (
                          <FormItem>                            
                            <FormControl>
                              <Input placeholder="Descripción" className="w-full" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {!isReadOnly && (
                      <Button type="button" onClick={() => removeRes(index)}>
                        <Trash2 />
                      </Button>
                    )}
                  </div>

                </div>
              ))
            ) : (
              <h3 className="text-center">No se encontraron resultados</h3>
            )}
            
          </TabsContent>

          <TabsContent value="referencias" className="h-[500px] overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Referencias y Directivas</h2>

            <FormField
              control={form.control}
              name="terminos"
              disabled={isReadOnly}
              render={({ field }) => (
                <FormItem className="mb-4 p-1">
                  <FormLabel>Términos</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Términos legales y regulatorios"
                      className="resize-none h-[120px] overflow-auto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />             

            <FormField
              control={form.control}
              name="directivas"
              disabled={isReadOnly}
              render={({ field }) => (
                <FormItem className="mb-4 p-1">
                  <FormLabel>Directivas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Directivas y procedimientos de referencia"
                      className="resize-none h-[120px] overflow-auto"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
          </TabsContent>
          
        </Tabs>                                                    

        {!isReadOnly && (
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
        )}
        
      </form>
    </Form>
  );
}
