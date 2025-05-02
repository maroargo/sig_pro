import { Etapa, Subetapa, EstadoCronograma } from "@prisma/client";
import { IFase } from "./fase";

export interface ICronograma {
    id: string
    tarea: string;
    fecha: Date    

    idFase: string
    fase: IFase    
    idEtapa: string
    etapa: Etapa
    idSubetapa: string
    subetapa: Subetapa
    idEstadoCronograma: string
    estadoCronograma: EstadoCronograma         
}