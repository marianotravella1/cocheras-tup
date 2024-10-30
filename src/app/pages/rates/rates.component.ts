import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { dataRatesService } from '../../services/data-rate.service';
import { ModalService } from '../../services/modals.service';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './rates.component.html',
  styleUrl: './rates.component.scss',
})
export class RatesComponent {
  dataRatesService = inject(dataRatesService);
  modalService = inject(ModalService);

  isAdmin = true;

  async updateRateValue(rateId: string) {
    this.modalService
        .inputModal("Update Rate", "Enter new rate value", "Rate Value", "number")
        .then((rateValue) => {
          if (rateValue) {
            this.dataRatesService.updateRateValue(rateId, rateValue);
          }
        });
  }
}
