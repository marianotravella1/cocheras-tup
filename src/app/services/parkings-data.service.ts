import { inject, Injectable } from '@angular/core';
import { IParking } from '../interfaces/IParking';
import { DataAuthService } from './data-auth.service';
import { IGarage } from '../interfaces/IGarage';

@Injectable({
  providedIn: 'root',
})
export class ParkingsDataService {
  cocheras: IParking[] = [];
  estacionamientos: IGarage[] = [];
  authService = inject(DataAuthService);


  constructor() {
    this.loadData();
  }

  async loadData() {
    await this.getParkings();
    await this.getGarages();
    this.relateParkingsAndGarages();
  }

  async getParkings() {
    const res = await fetch('http://localhost:4000/cocheras', {
      headers: {
        authorization: 'Bearer ' + this.authService.usuario?.token,
      },
    });
    if (res.status !== 200) return;
    const resJson: IParking[] = await res.json();
    this.cocheras = resJson;
  }

  async getGarages() {
    const res = await fetch('http://localhost:4000/estacionamientos', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    });
    if (res.status !== 200) return;
    const resJson: IGarage[] = await res.json();
    this.estacionamientos = resJson;
  }

  relateParkingsAndGarages() {
    this.cocheras = this.cocheras.map((cochera) => {
      const estacionamiento = this.estacionamientos.find(g => g.idCochera === cochera.id && g.horaEgreso == null);
      return { ...cochera, estacionamiento };
    });
  }

  

  lastNumber = this.cocheras[this.cocheras.length - 1]?.id || 0; // '?' -> if the element exists, an attempt is made to access the number property
  // (another use for '?' (ternary operator))
  // lastNumber = this.parkings.length === 0 ? 0 : this.parkings[this.parkings.length-1].number;

  addParking() {
    this.cocheras.push({
      id: this.lastNumber + 1,
      descripcion: '',
      deshabilitada: 1,
      eliminada: 0,
      estacionamiento: undefined,
    });
    this.lastNumber++;
  }

  deleteRow(index: number) {
    this.cocheras.splice(index, 1);
  }

  deleteAll() {
    this.cocheras = [];
    this.lastNumber = 0;
  }

  disableParking(index: number) {
    this.cocheras[index].deshabilitada = 0;
  }

  enableParking(index: number) {
    this.cocheras[index].deshabilitada = 1;
  }

  async openGarage(
    patente: string,
    idUsuarioIngreso: string,
    idCochera: number
  ) {
    const body = { patente, idUsuarioIngreso, idCochera };
    const res = await fetch('http://localhost:4000/estacionamientos/abrir', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
      body: JSON.stringify(body),
    });
    if (res.status !== 200) {
      console.log('Error en abrir estacionamiento');
    } else {
      console.log('Creacion de estacionamiento exitoso');
      this.loadData();
    }
  }

  async closeGarage(patente: string, idUsuarioEgreso: string) {
    const body = { patente, idUsuarioEgreso };
    const res = await fetch('http://localhost:4000/estacionamientos/cerrar', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + this.authService.usuario?.token,
      },
      body: JSON.stringify(body),
    });
    if (res.status !== 200) {
      console.log('Error en el cerrado del estacionamiento');
    } else {
      console.log('Cerrado del estacionamiento exitoso');
      console.log(res);
      this.loadData();
    }
  }
}
