import { inject, Injectable } from '@angular/core';
import { IGarage } from '../interfaces/IGarage';
import { ParkingsDataService } from './parkings-data.service';

@Injectable({
  providedIn: 'root',
})
export class DataGarageService {
  parkingsDataService = inject(ParkingsDataService);
  lastTransactions: IGarage[] = [];

  constructor() {
    this.getLastTransactions();
  }

  async getLastTransactions(quantity = 5) {
    if (!this.parkingsDataService.garages.length ) {
      console.error('No hay estacionamientos disponibles');
      console.log(this.parkingsDataService.garages);
    }

    const filteredTransactions = this.parkingsDataService.garages.filter(
      (garage) => garage.horaIngreso !== null && garage.horaEgreso !== undefined
    );

    const lastTransactions = filteredTransactions
      .sort(
        (a, b) =>
          new Date(b.horaIngreso.replace(' ', 'T')).getTime() -
          new Date(a.horaEgreso.replace(' ', 'T')).getTime()
      ) // Ordenar de más reciente a más antiguo
      .slice(0, quantity);

    this.lastTransactions = lastTransactions;
  }
}
