import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/IUser';
import { ILogin, IResLogin } from '../interfaces/ILogin';
import { IRegister } from '../interfaces/IRegister';

@Injectable({
  providedIn: 'root',
})
export class DataAuthService {
  constructor() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.usuario = {
        username: '',
        token: token,
        isAdmin: Number(localStorage.getItem('role')),
      };
    } else {
      this.usuario = undefined;
    }
  }

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
      isAdmin: resJson.isAdmin,
    };
    
    localStorage.setItem('authToken', resJson.token);
    localStorage.setItem('role', JSON.stringify(resJson.isAdmin ? 1 : 0))
    
    return resJson;
  }

  async register(registerData: IRegister) {
    const res = await fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    if (res.status !== 201) return;
    return res;
  }
}
//     const userDetailsRes = await fetch(
//       `http://localhost:4000/usuarios/${encodeURIComponent(
//         loginData.username
//       )}`,
//       {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${resJson.token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     if (userDetailsRes.status !== 200) return;

//     const userDetailsResJson = await userDetailsRes.json();

//     this.usuario.isAdmin = userDetailsResJson.isAdmin;

//     console.log(this.usuario); /////////////////////////////////////

//     return userDetailsRes;
//   }

 

//   getToken() {
//     return localStorage.getItem('authToken');
//   }

//   clearToken() {
//     localStorage.removeItem('authToken');
//   }
// }
