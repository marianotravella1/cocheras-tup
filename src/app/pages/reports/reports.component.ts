import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataGarageService } from '../../services/data-garage.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  dataGarageService = inject(DataGarageService);
}
