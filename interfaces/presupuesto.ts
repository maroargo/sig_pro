import { Periodo, TipoPresupuesto } from "@prisma/client"
import { IProceso } from "./proceso"

export interface IPresupuesto {
    id: string
    nombre: string

    periodo: Periodo
    idPeriodo: string
    tipoPresupuesto: TipoPresupuesto
    idTipoPresupuesto: string
    
    procesos: IProceso[]

    status: string
}