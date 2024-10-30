import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IParking } from '../../interfaces/IParking';
import { ParkingsDataService } from '../../services/parkings-data.service';
import Swal from 'sweetalert2';
import { DataAuthService } from '../../services/data-auth.service';
import { DataGarageService } from '../../services/data-garage.service';
import { dataRatesService } from '../../services/data-rate.service';

@Component({
  selector: 'app-parking-state',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './parking-state.component.html',
  styleUrl: './parking-state.component.scss',
})
export class ParkingStateComponent {
  authService = inject(DataAuthService);
  parkinsDataService = inject(ParkingsDataService);
  dataGarageService = inject(DataGarageService);
  dataRatesService = inject(dataRatesService)

  isAdmin = true

  tableHeader = {
    c1: 'N°',
    c2: 'Availability',
    c3: 'Description',
    c4: 'Actions',
  };

  addParking() {
    this.parkinsDataService.addParking();
  }

  deleteRow(index: number) {
    this.parkinsDataService.deleteRow(index);
  }

  deleteAll() {
    this.parkinsDataService.deleteAll();
  }

  disableParking(index: number) {
    this.parkinsDataService.disableParking(index);
  }

  enableParking(index: number) {
    this.parkinsDataService.enableParking(index);
  }

  deleteParkingAlert(index: number) {
    Swal.fire({
      title: 'Do you want to delete this parking?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteRow(index);
        Swal.fire('Parking deleted!', '', 'success');
      }
    });
  }

  deleteAllAlert() {
    Swal.fire({
      title: 'Do you want to delete all parkings?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete all',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteAll();
        Swal.fire('Parkings deleted!', '', 'success');
      }
    });
  }

  openGarage(parkingId: number) {
    const idUserEntry = 'ADMIN';
    Swal.fire({
      title: 'Open Parking',
      html: `<input type="text" id="plate" class="swal2-input" placeholder="Ingrese patente">`,
      showCancelButton: true,
      confirmButtonText: 'Open',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const plateInput = document.getElementById(
          'patente'
        ) as HTMLInputElement;
        if (!plateInput || !plateInput.value) {
          Swal.showValidationMessage('Please enter a plate');
          return false;
        }
        return { plate: plateInput.value };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { plate } = result.value;
        await this.parkinsDataService.openGarage(plate, idUserEntry, parkingId);
      }
    });
  }

  closeGarage(parking: IParking) {
    const time = parking.garage?.entryHour;
    let entryDate;
    let hours = 0; 
    let minutes = 0; 
    let plate: string;
    let rateToSearch: string;
    let total;

    if (time) {
      entryDate = new Date(time);

        if (entryDate) {
            const currentDate = new Date();
            const differenceInMiliseconds = currentDate.getTime() - entryDate.getTime();
            hours = Math.floor(differenceInMiliseconds / (1000 * 60 * 60));
            minutes = Math.floor((differenceInMiliseconds % (1000 * 60 * 60)) / (1000 * 60));
        }

        plate = parking.garage?.plate!;

        const totalMinutes = hours * 60 + minutes;
        if (totalMinutes <= 30) {
          rateToSearch = "MEDIAHORA";
        } else if (totalMinutes <= 60) {
          rateToSearch = "PRIMERAHORA";
        } else {
          rateToSearch = "VALORHORA";
        }

        total = this.dataRatesService.rates.find(t => t.id === rateToSearch)?.value;
    }

    const horaFormateada = entryDate ? entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    Swal.fire({
        html: `
            <div style="text-align: left;">
                <h4>Horario de inicio: ${horaFormateada}</h4>
                <h4>Tiempo transcurrido: ${hours} horas y ${minutes} minutos</h4>
                <hr style="border: 1px solid #ccc;">
                <h2 style="margin: 20px 0 10px; text-align: center;">Total a cobrar</h2>
                <div style="background-color: #28a745; color: white; font-size: 24px; padding: 10px; border-radius: 5px; text-align: center; margin: 0 auto; display: block; width: fit-content;">
                    $${total}
                </div>
                <div style="margin-top: 20px; text-align: center;">
                    <button id="cobrar" class="swal2-confirm swal2-styled" style="background-color: #007bff; padding: 10px 24px;">Cobrar</button>
                    <button id="volver" class="swal2-cancel swal2-styled" style="background-color: #aaa; padding: 10px 24px;">Volver</button>
                </div>
            </div>`,
        showConfirmButton: false,
        didOpen: () => {
            const cobrarButton = document.getElementById('cobrar');
            const volverButton = document.getElementById('volver');
            
            if (cobrarButton) {
                cobrarButton.addEventListener('click', async () => {
                    const idUsuarioEgreso = "ADMIN";
                    await this.parkinsDataService.closeGarage(plate, idUsuarioEgreso);
                    Swal.close();
                });
            }
            
            if (volverButton) {
                volverButton.addEventListener('click', () => {
                    Swal.close();
                });
            }
        }
    });
  }
}
