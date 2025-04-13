import { EstadoSolicitud, Hito, Nivel, Objetivo, Prospecto, Resultado, TipoAlcance, TipoRequerimiento } from "@prisma/client"
import { IUser } from "./user"

export interface ISolicitud {
    id: string
    correlativo: string 
    nombre: string
    
    noexiste: boolean
    siglas: string 
    nombrePropuesto: string   

    objetivo: string    
    resumen: string               
    idProspecto: string
    prospecto: Prospecto
    idUser: string
    user: IUser

    fechaSolicitud: Date 
    liderUsuario: string
    patrocinador: string
    idTipoRequerimiento: string
    tipoRequerimiento: TipoRequerimiento   
    
    alcance: string
    tipoAlcance: TipoAlcance
    idTipoAlcance: string

    objetivoGeneral: string
    objetivos: Objetivo[]

    niveles: Nivel[]
    hitos: Hito[]

    beneficio: string
    beneficioCuantitativo: string
    beneficioCualitativo: string

    resultados: Resultado[]
    terminos: string
    directivas: string

    status: string 
    idEstadoSolicitud: string
    estadoSolicitud: EstadoSolicitud
}