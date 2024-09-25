import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/IUser';
import { ILogin, IResLogin } from '../interfaces/ILogin';

@Injectable({
  providedIn: 'root',
})
export class DataAuthService {
  constructor() {}

  usuario: IUser | undefined;

  async login(loginData: ILogin) {
    const res = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    if (res.status !== 200) return;
    const resJson: IResLogin = await res.json();
    if (!resJson.token) return;
    this.usuario = {
      username: loginData.username,
      token: resJson.token,
      isAdmin: false, 
    };
    return resJson;
  }
}
