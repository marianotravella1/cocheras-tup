export interface ILogin {
  username: string;
  password: string;
}

export interface IResLogin {
  status: string;
  mensaje: string;
  token?: string;
  isAdmin: Number;
}
