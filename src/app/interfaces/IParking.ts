import { IGarage } from "./IGarage";

export interface IParking {
    id: number;
    descripcion: string;
    deshabilitada: number;
    eliminada: number;
    estacionamiento: IGarage | undefined;
}

