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
    await this.getCocheras();
    await this.getEstacionamientos();
    this.asociarEstacionamientosConCocheras();
  }

  async getCocheras() {
    const res = await fetch('http://localhost:4000/cocheras', {
      headers: {
        authorization: 'Bearer ' + this.authService.usuario?.token,
      },
    });
    if (res.status !== 200) return;
    const resJson: IParking[] = await res.json();
    this.cocheras = resJson;
  }

  async getEstacionamientos() {
    const res = await fetch('http://localhost:4000/estacionamientos', {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('authToken'),
      },
    });
    if (res.status !== 200) return;
    const resJson: IGarage[] = await res.json();
    this.estacionamientos = resJson;
  }

  asociarEstacionamientosConCocheras() {
    this.cocheras = this.cocheras.map((cochera) => {
      const estacionamiento = this.estacionamientos.find((e) => e.idCochera === cochera.id && !e.horaEgreso);
      return { ...cochera, estacionamiento };
    });
  }

  lastNumber = this.cocheras[this.cocheras.length - 1]?.id || 0; 

  async agregarCochera(nombreCochera:string){
    const cochera = {"descripcion" : nombreCochera};
    const res = await fetch('http://localhost:4000/cocheras',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:'Bearer '+localStorage.getItem("authToken")
      },
      body: JSON.stringify(cochera)
    })
    if(res.status !== 200) {
      console.log("Error en la creacion de una nueva cochera")
    } else {
      console.log("Creacion de cochera exitosa")
      this.loadData();
    };
  }

  async borrarCochera(index: number) {
    const res = await fetch(`http://localhost:4000/cocheras/${index}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + localStorage.getItem("authToken")
      },
    });
    if (res.status !== 200) {
      console.log('Error en la eliminacion de la cochera');
    } else {
      console.log('Cochera eliminada con exito');
      this.loadData();
    }
  }

  async deshabilitarCochera(idCochera:number){
    const res = await fetch("http://localhost:4000/cocheras/"+idCochera+"/disable",{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:'Bearer '+ localStorage.getItem("authToken")
      },
    })
    if(res.status === 200) {
      console.log("Cochera deshabilitada")
      this.loadData()
    } else {
      console.warn("Error deshabilitando cochera")
    };
  }

  async habilitarCochera(idCochera:number){
    const res = await fetch('http://localhost:4000/cocheras/'+idCochera+'/enable',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization:'Bearer '+ localStorage.getItem("authToken")
      },
    })
    if(res.status === 200) {
      console.log("Cochera hablitada")
      this.loadData()
    } else {
      console.warn("Error habilitando cochera")
    };
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
