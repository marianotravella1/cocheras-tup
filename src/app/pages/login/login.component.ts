import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ILogin, IResLogin } from '../../interfaces/ILogin';
import { DataAuthService } from '../../services/data-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginData: ILogin = {
    username: 'admin',
    password: 'admin',
  };

  router = inject(Router);
  authService = inject(DataAuthService);

  // MÉTODO 1 (No recomendable)
  //login() {
  //  console.log('Comienzo login');
  //  fetch('http://localhost:4000/login', {
  //    method: 'POST',
  //    headers: {
  //      'Content-type': 'application/json',
  //    },
  //    body: JSON.stringify(this.loginData),
  //  }).then(res => {
  //    console.log('Tengo respuesta del back', res)
  //    res.json().then(resJson => {
  //      console.log(resJson)
  //    })
  //  })
  //  console.log('Despues del fetch');
  //}


  // METODO 2
  async login(){
    const res = await fetch("http://localhost:4000/login", {
      method: 'POST',
      headers: {
        'Content-type':'application/json'
      },
      body: JSON.stringify(this.loginData)
    })
    if (res.status !== 200) return;
    const resJson:IResLogin = await res.json();
    if (!resJson.token) return;
    this.authService.usuario = {
      username: this.loginData.username,
      token: resJson.token,
      esAdmin: false
    }
    this.router.navigate(["./parking-state"]);
  }

  errorLogin = false
}
