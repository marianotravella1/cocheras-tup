import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ILogin, IResLogin } from '../../interfaces/ILogin';
import { DataAuthService } from '../../services/data-auth.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  router = inject(Router);
  authService = inject(DataAuthService);

  errorLogin = false;

  async login(loginForm: NgForm) {
    const {usuario, password} = loginForm.value;
    const loginData: ILogin = {username: usuario, password}
    const res = await this.authService.login(loginData);
    if (res?.status === 'ok') this.router.navigate(['/parking-state']);
    else this.errorLogin = true;
  }
}