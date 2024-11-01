import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { DataAuthService } from '../../services/data-auth.service';
import { ParkingsDataService } from '../../services/parkings-data.service';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [RouterOutlet, RouterModule, RouterLink],
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.scss',
})
export class DashboardContainerComponent {
  authService = inject(DataAuthService);
  parkingsService = inject(ParkingsDataService)

  isAdmin = true;


}
  