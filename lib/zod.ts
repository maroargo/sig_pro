import { Decimal } from "@prisma/client/runtime/library";
import { z, object, string, number, date, boolean } from "zod";
 
export const signInSchema = object({
  id: string().optional(),
  email: string({ required_error: "Correo es requerido" })
    .min(1, "Correo es requerido")
    .email("Correo no válido"),
  password: string({ required_error: "Contraseña es requerido" })
    .min(1, "Contraseña es requerido")
    .min(6, "Contraseña debe tener mas de 6 caracteres")
    .max(12, "Contraseña debe tener menos de 12 caracteres")
});

export const userSchema = object({
  name: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
  email: string({ required_error: "Correo es requerido" })
    .min(1, "Correo es requerido")
    .email("Correo no válido"),
  phone: string().optional(),
  password: string({ required_error: "Contraseña es requerido" })
    .min(1, "Contraseña es requerido")
    .min(6, "Contraseña debe tener mas de 6 caracteres")
    .max(12, "Contraseña debe tener menos de 12 caracteres"), 
  idOrganization: string().optional(),
  idGerencia: string().optional(),
  idSubgerencia: string({ required_error: "Subgerencia es requerido" })
    .min(1, "Subgerencia es requerido"),
  idRole: string({ required_error: "Rol es requerido" })
    .min(1, "Rol es requerido")  
});

export const userUpdateSchema = object({
  name: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
    email: string({ required_error: "Correo es requerido" })
    .min(1, "Correo es requerido")
    .email("Correo no válido"),  
  phone: string({ required_error: "Celular es requerido" })
    .min(1, "Celular es requerido"), 
  idOrganization: string().optional(),
  idGerencia: string().optional(),   
  idSubgerencia: string({ required_error: "Subgerencia es requerido" })
    .min(1, "Subgerencia es requerido"),
  idRole: string({ required_error: "Rol es requerido" })
    .min(1, "Rol es requerido"),
  idStatus: string().optional()
});

export const accessRoleSchema = object({
  idRole: string(),    
  idMenu: string(),
  menu: string(),  
  access: boolean(),
  add: boolean()
});

export const roleSchema = object({ 
  name: string(),   
  idStatus: string().optional(), 
  accessRoles: z.array(accessRoleSchema)
});

export const menuSchema = object({
  name: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
  url: string(),    
  icon: string(),
  idMenu: string()
});

export const procesoSchema = object({    
  name: string({ required_error: "Nombre es requerido" })
  .min(1, "Nombre es requerido"),  
  siglas: string({ required_error: "Siglas es requerido" })
  .min(1, "Siglas es requerido"),  
  idPresupuesto: string().optional(),  
  idStatus: string().optional(),
});

export const presupuestoSchema = object({
  nombre: string().optional(),  
  idTipoPresupuesto: string().optional(), 
  idStatus: string().optional(), 
  procesos: z.array(procesoSchema).optional(),
});

export const periodoSchema = object({
  periodo: string({ required_error: "Período es requerido" })
    .min(1, "Período es requerido"),
  descripcion: string(),    
  nombre: string().optional(),  
  uit: string().optional(), 
  idOrganization: string().optional(),
  idStatusPeriodo: string().optional(),

  idStatus: string().optional(), 
  presupuestos: z.array(presupuestoSchema),  
});

export const organizationSchema = object({
  name: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
  email: string({ required_error: "Correo es requerido" })
    .min(1, "Correo es requerido")
    .email("Correo no válido"),
  address: string({ required_error: "Dirección es requerido" })
    .min(1, "Dirección es requerido"),  
  logo: string(),
  idStatus: string().optional()  
});

export const gerenciaSchema = object({
  nombre: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
  siglas: string({ required_error: "Siglas es requerido" })
    .min(1, "Siglas es requerido"),    
  titular: string({ required_error: "Titular es requerido" })
    .min(1, "Titular es requerido"),
  idOrganization: string({ required_error: "Organización es requerido" })
    .min(1, "Organización es requerido"),
  idStatus: string().optional()  
});

export const subgerenciaSchema = object({
  nombre: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
  siglas: string({ required_error: "Siglas es requerido" })
    .min(1, "Siglas es requerido"),    
  titular: string({ required_error: "Titular es requerido" })
    .min(1, "Titular es requerido"),
  idGerencia: string({ required_error: "Gerencia es requerido" })
    .min(1, "Gerencia es requerido"),
  idStatus: string().optional()  
});

export const prospectoSchema = object({  
  nombre: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),  
  acronimo: string({ required_error: "Acrónimo es requerido" })
    .min(1, "Acrónimo es requerido"), 
  idTipoProyecto: string({ required_error: "Tipo Proyecto es requerido" })
    .min(1, "Tipo Proyecto es requerido"),              
  idStatus: string().optional()
});

export const userProyectoSchema = object({  
  cargo: string().optional(),    
  idUser: string({ required_error: "Usuario es requerido" })
    .min(1, "Usuario es requerido"),     
  idProyecto: string().optional(), 
  idStatus: string().optional()
});

export const proyectoSchema = object({
  idGerencia: string({ required_error: "Gerencia es requerido" })
  .min(1, "Gerencia es requerido"),  
  nombre: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),  
  acronimo: string({ required_error: "Acrónimo es requerido" })
    .min(1, "Acrónimo es requerido"),
  correlativo: z.number().optional(),
  codigo: string().optional(),
  anulado: boolean().optional(), 
  sustento: string().optional(),    
  idTipoProyecto: string({ required_error: "Tipo Proyecto es requerido" })
    .min(1, "Tipo Proyecto es requerido"),        
  idPresupuesto: string().optional(), 
  idProceso: string().optional(),
  idEstadoProyecto: string().optional(),   
  users: z.array(userProyectoSchema),
  idStatus: string().optional()
});

export const objetivoSchema = object({
  objetivo: string().optional(),  
});

export const nivelSchema = object({
  nivel: string().optional(),  
});

export const hitoSchema = object({
  hito: string().optional(),
  fecha: date().nullable(),  
});

export const resultadoSchema = object({
  nombre: string().optional(),  
  descripcion: string().optional(),  
});

export const solicitudSchema = object({
  correlativo: string().optional(),   
  nombre: string().optional(),
  
  noexiste: boolean().optional(),
  siglas: string().optional(),
  nombrePropuesto: string().optional(),

  objetivo: string({ required_error: "Objetivo es requerido" })
    .min(1, "Objetivo es requerido"),    
  resumen: string({ required_error: "Resumen es requerido" })
    .min(1, "Resumen es requerido"),  
  idProspecto: string().optional(),
  idEstadoSolicitud: string().optional(),
  idUser: string().optional(),   

  fechaSolicitud: date({ required_error: "Fecha Solicitud es requerida" }).nullable(),
  liderUsuario: string({ required_error: "Lider Usuario es requerido" })
    .min(1, "Lider Usuario es requerido"),
  patrocinador: string({ required_error: "Patrocinador es requerido" })
    .min(1, "Patrocinador es requerido"),
  idTipoRequerimiento: string({ required_error: "Tipo Requerimiento es requerido" })
    .min(1, "Tipo Requerimiento es requerido"),

  alcance: string({ required_error: "Alcance es requerido" })
    .min(1, "Alcance es requerido"),
  idTipoAlcance: string({ required_error: "Tipo Alcance es requerido" })
    .min(1, "Tipo Alcance es requerido"),
  
  objetivoGeneral: string({ required_error: "Objetivo General es requerido" })
    .min(1, "Objetivo General es requerido"),
  objetivos: z.array(objetivoSchema),

  niveles: z.array(nivelSchema),
  hitos: z.array(hitoSchema),

  resultados: z.array(resultadoSchema),
  terminos: string({ required_error: "Términos Legales es requerido" })
    .min(1, "Objetivo General es requerido"),
  directivas: string({ required_error: "Directivas es requerido" })
    .min(1, "Directivas es requerido"),
  
  beneficio: string().optional(),
  beneficioCuantitativo: string().optional(),
  beneficioCualitativo: string().optional(),

  idStatus: string().optional()
});

export const dimensionSchema = object({
  idTipoDimension: string({ required_error: "Etapa es requerido" })
    .min(1, "Etapa es requerido"),
  tarea: string({ required_error: "Tarea es requerido" })
    .min(1, "Tarea es requerido"),    
  requerimiento: string({ required_error: "Requerimiento es requerido" })
    .min(1, "Requerimiento es requerido"),
  idSolicitud: string().optional(),  
});

export const faseSchema = object({
  unico: boolean().optional(),
  nombre: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
  idProyecto: string({ required_error: "Proyecto es requerido" })
    .min(1, "Proyecto es requerido"),       
});

export const actividadSchema = object({
  nombre: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
  idFase: string({ required_error: "Fase es requerido" })
    .min(1, "Fase es requerido"),    
  idUser: string({ required_error: "Responsable es requerido" })
    .min(1, "Responsable es requerido"),
  idEtapa: string().optional(), 
  fechaInicio: date().nullable(),
  fechaFin: date().nullable(),
  idEstadoActividad: string().optional(),  
});

export const tareaSchema = object({
  nombre: string({ required_error: "Nombre es requerido" })
    .min(1, "Nombre es requerido"),
  idActividad: string().optional(),    
  idUser: string({ required_error: "Responsable es requerido" })
    .min(1, "Responsable es requerido"),  
  fechaInicio: date().nullable(),
  fechaFin: date().nullable(),
  idEstadoTarea: string().optional(),  
});


export type UserSchema = z.infer<typeof userSchema>;
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
export type RoleSchema = z.infer<typeof roleSchema>;
export type MenuSchema = z.infer<typeof menuSchema>;
export type AccessRoleSchema = z.infer<typeof accessRoleSchema>;
export type ProcesoSchema = z.infer<typeof procesoSchema>;
export type PeriodoSchema = z.infer<typeof periodoSchema>;
export type OrganizationSchema = z.infer<typeof organizationSchema>;

export type GerenciaSchema = z.infer<typeof gerenciaSchema>;
export type SubgerenciaSchema = z.infer<typeof subgerenciaSchema>;

export type ProspectoSchema = z.infer<typeof prospectoSchema>;
export type SolicitudSchema = z.infer<typeof solicitudSchema>;
export type DimensionSchema = z.infer<typeof dimensionSchema>;
export type ProyectoSchema = z.infer<typeof proyectoSchema>;
export type UserProyectoSchema = z.infer<typeof userProyectoSchema>;

export type FaseSchema = z.infer<typeof faseSchema>;
export type ActividadSchema = z.infer<typeof actividadSchema>;
export type TareaSchema = z.infer<typeof tareaSchema>;
