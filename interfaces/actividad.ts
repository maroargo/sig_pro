import { User, Fase, EstadoActividad, Etapa } from "@prisma/client";

export interface IActividad {
    id: string
    nombre: string;

    fechaInicio: Date
    fechaFin: Date

    idEstadoActividad: string
    estadoActividad: EstadoActividad

    idFase: string
    fase: Fase
    idUser: string
    user: User
    idEtapa: string
    etapa: Etapa
         
}