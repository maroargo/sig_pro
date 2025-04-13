import { TipoDimension } from "@prisma/client"
import { ISolicitud } from "./solicitud"

export interface IDimension {
    id: string
    tarea: string
    requerimiento: string    

    idTipoDimension: string
    tipoDimension: TipoDimension

    idSolicitud: string
    solicitud: ISolicitud
         
}