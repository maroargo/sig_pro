import { Organization } from "@prisma/client"
import { IPresupuesto } from "./presupuesto"

export interface IPeriodo {
    id: string
    periodo: string
    descripcion: string
    nombre: string
    uit: string

    organization: Organization
    idOrganization:  string

    statusPeriodo: string 
    status: string
    
    presupuestos: IPresupuesto[]
}
