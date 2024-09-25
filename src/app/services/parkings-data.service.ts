import { inject, Injectable } from "@angular/core";
import { IParking } from "../interfaces/IParking";
import { DataAuthService } from "./data-auth.service";

@Injectable({
    providedIn: 'root'
})
export class ParkingsDataService {
    parkings: IParking[] = []
    authService = inject(DataAuthService)

    constructor() { 

    this.getParkings()
   }

  async getParkings() {
    const res = await fetch('http://localhost:4000/cocheras',{
      headers: {
        authorization:'Bearer '+this.authService.usuario?.token
      },
    })
    if(res.status !== 200) return;
    const resJson: IParking [] = await res.json();
    console.log(resJson);
    this.parkings = resJson;
  }

    lastNumber = this.parkings[this.parkings.length-1]?.id || 0; // '?' -> if the element exists, an attempt is made to access the number property
    // (another use for '?' (ternary operator))
    // lastNumber = this.parkings.length === 0 ? 0 : this.parkings[this.parkings.length-1].number;

    addParking(){
        this.parkings.push({
            id: this.lastNumber + 1,
            descripcion: "",
            deshabilitada: 0,
            eliminada: 0
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
        this.parkings[index].deshabilitada = 0;
    }

    enableParking(index:number){
        this.parkings[index].deshabilitada = 1;
    }
}