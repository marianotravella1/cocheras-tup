import { inject, Injectable } from '@angular/core';
import { DataAuthService } from './data-auth.service';
import { IRate } from '../interfaces/IRate';
import { ModalService } from './modals.service';

@Injectable({
  providedIn: 'root'
})
export class dataRatesService {
  rates: IRate[] = []
  authService = inject(DataAuthService);
  modalService = inject(ModalService)

  constructor() { 
    this.getRates()
  }

  async getRates(){
    const res = await fetch('http://localhost:4000/tarifas',{
      headers: {
        authorization:'Bearer '+this.authService.usuario?.token
      },
    })
    if(res.status !== 200) {
      console.log("Error")
    } else {
      this.rates = await res.json();
    }
  }

  async updateRateValue(rateId: string, value: number) {
    const cfg = {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        authorization: "Bearer " + this.authService.usuario?.token,
      },
      body: JSON.stringify({ valor: value }),
    };
    const res = await fetch(`${'http://localhost:4000/tarifas'}/${rateId}`, cfg);

    if (res.status === 200) {
      this.modalService.successModal(
        "Success",
        "Rate value updated successfully"
      );

      this.getRates();
    }
  };

}
