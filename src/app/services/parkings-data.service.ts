import { Injectable } from "@angular/core";
import { IParking } from "../interfaces/IParking";

@Injectable({
    providedIn: 'root'
})
export class ParkingsDataService {
    parkings: IParking[] = []

    constructor() { }

    lastNumber = this.parkings[this.parkings.length-1]?.number || 0; // '?' -> if the element exists, an attempt is made to access the number property
    // (another use for '?' (ternary operator))
    // lastNumber = this.parkings.length === 0 ? 0 : this.parkings[this.parkings.length-1].number;

    addParking(){
        this.parkings.push({
            number: this.lastNumber + 1,
            available: true,
            entry: "-",
            isBig: true
        })
        this.lastNumber++;
    }

    deleteRow(index:number){
        this.parkings.splice(index,1);
    }

    deleteAll(){
        this.parkings = []
        this.lastNumber = 0
      }

    disableParking(index:number){
        this.parkings[index].available = false;
    }

    enableParking(index:number){
        this.parkings[index].available = true;
    }
}