import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataGarageService } from '../../services/data-garage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  dataGarageService = inject(DataGarageService);
}
