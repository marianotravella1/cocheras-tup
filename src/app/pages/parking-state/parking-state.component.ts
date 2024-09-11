import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ICochera } from '../../interfaces/cochera';



@Component({
  selector: 'app-parking-state',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './parking-state.component.html',
  styleUrl: './parking-state.component.scss'
})
export class ParkingStateComponent {

  title: string = 'TUParking';
 
  tableHeader = {
    c1: 'Spot Number',
    c2: 'Availability',
    c3: 'Ingress Time',
    c4: 'Actions'
  }

  parking: ICochera[] = []

  lastNumber = this.parking[this.parking.length-1]?.number || 0;
  addNew(){
    this.parking.push(
      {
        number: this.lastNumber + 1,
        available: true,
        entry: '-'
      }
    )
  this.lastNumber++;
  }

  deleteAll(){
    this.parking = []
    this.lastNumber = 0
  }

  deleteThatSpot(index: number){
    this.parking.splice(index, 1)
  }

  occupyParkingState(index: number){
    this.parking[index].available = false
  }

  setFreeParkingState(index: number){
    this.parking[index].available = true
  }
}



