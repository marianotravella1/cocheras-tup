import { IGarage } from "./IGarage";

export interface IParking {
    id: number;
    description: string;
    disabled: number;
    deleted: number;
    garage: IGarage | undefined;
}

