import { Injectable } from '@angular/core';
import { IUsuario } from '../interfaces/IUsuario';
import { ILogin } from '../interfaces/ILogin';

@Injectable({
  providedIn: 'root'
})
export class DataAuthService {

  constructor() { }

  usuario: IUsuario | undefined;

  async login(loginData:ILogin) {
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-type":"application/json"
      },
      body: JSON.stringify(loginData)
    })
    if (res.status !== 200) return;
    const resJson:ResLogin = await res.json();
    this.usuario = {
      username: loginData.username,
      token: resJson.token,
      esAdmin: false
    }
    return resJson
  }
  
  
}
