import { IProyecto } from "./proyecto";

export interface IFase {
    id: string
    nombre: string;
        
    idProyecto: string
    proyecto: IProyecto         
}