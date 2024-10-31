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

  openGarage(idCochera: number) {
    const idUsuarioIngreso = "ADMIN"
    Swal.fire({
      title: "Abrir Cochera",
      html: `<input type="text" 
      id="patente" 
      class="swal2-input" 
      placeholder="Ingrese patente" 
      oninput="this.value = this.value.toUpperCase().replace(/\\s/g, '')"
      maxlength="7">`,
      showCancelButton: true,
      confirmButtonText: "Abrir",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const patenteInput = document.getElementById("patente") as HTMLInputElement
        if (!patenteInput || !patenteInput.value) {
          Swal.showValidationMessage("Por favor, ingrese una patente")
          return false;
        }
        return { patente: patenteInput.value };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { patente } = result.value;
        await this.parkinsDataService.openGarage(patente, idUsuarioIngreso, idCochera);
      }
    })
  }

  closeGarage(cochera: IParking) {
    const horario = cochera.estacionamiento?.horaIngreso;
    let fechaIngreso;
    let horasPasadas = 0; 
    let minutosPasados = 0; 
    let patente: string;
    let tarifaABuscar: string;
    let total;

    if (horario) {
        fechaIngreso = new Date(horario);

        if (fechaIngreso) {
            const fechaActual = new Date();
            const diferenciaEnMilisegundos = fechaActual.getTime() - fechaIngreso.getTime();
            horasPasadas = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60));
            minutosPasados = Math.floor((diferenciaEnMilisegundos % (1000 * 60 * 60)) / (1000 * 60));
        }

        patente = cochera.estacionamiento?.patente!;

        const totalMinutos = horasPasadas * 60 + minutosPasados;
        if (totalMinutos <= 30) {
            tarifaABuscar = "MEDIAHORA";
        } else if (totalMinutos <= 60) {
            tarifaABuscar = "PRIMERAHORA";
        } else {
            tarifaABuscar = "VALORHORA";
        }

        total = this.dataRatesService.rates.find(t => t.id === tarifaABuscar)?.valor;
    }

    const horaFormateada = fechaIngreso ? fechaIngreso.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    Swal.fire({
        html: `
            <div style="text-align: left;">
                <h4>Horario de inicio: ${horaFormateada}</h4>
                <h4>Tiempo transcurrido: ${horasPasadas} horas y ${minutosPasados} minutos</h4>
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
                    await this.parkinsDataService.closeGarage(patente, idUsuarioEgreso);
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

  formatPlate(plate: string | undefined): string {
    if (!plate) return '';
  
    if (plate.length === 6) {
      // Formato "ABC 123"
      return `${plate.slice(0, 3)} ${plate.slice(3)}`;
    } else if (plate.length === 7) {
      // Formato "AB 123 CD"
      return `${plate.slice(0, 2)} ${plate.slice(2, 5)} ${plate.slice(5)}`;
    } else {
      // En caso de que no tenga el formato esperado
      return plate;
    }
  }
}
