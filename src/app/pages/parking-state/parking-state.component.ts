import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IParking } from '../../interfaces/IParking';
import { ParkingsDataService } from '../../services/parkings-data.service';
import Swal from 'sweetalert2';
import { DataAuthService } from '../../services/data-auth.service';

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

  isAdmin = this.parkinsDataService.authService.usuario?.isAdmin;

  
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
}
