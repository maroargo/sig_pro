import { EstadoProyecto, Fase, Gerencia, Presupuesto, Proceso, Proyecto, TipoProyecto, User, UserProyecto } from "@prisma/client"

export interface IProyecto {
    id: string
    idGerencia: string
    gerencia: Gerencia
        
    nombre: string
    acronimo: string
    correlativo: number,
    codigo: string
    anulado: boolean
    sustento: string
      
    idTipoProyecto: string
    tipoProyecto: TipoProyecto
        
    idPresupuesto: string
    presupuesto: Presupuesto
    idProceso: string
    proceso: Proceso

    idEstadoProyecto: string
    estadoProyecto: EstadoProyecto

    users: IUserProyecto[]
    fases: Fase[]

    status: string 
}

export interface IUserProyecto {
    id: string    
    cargo: string    
      
    idUser: string
    user: User
    
    idProyecto: string
    proyecto: Proyecto
    
    status: string 
}