import { TipoProyecto } from "@prisma/client"

export interface IProspecto {
    id: string    
    nombre: string
    acronimo: string
      
    idTipoProyecto: string
    tipoProyecto: TipoProyecto
    
    status: string 
}