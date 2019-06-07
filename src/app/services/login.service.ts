import { Injectable } from '@angular/core';
import { Usuario, Sesion } from '../lib/crashify_pb';
import { TransitoClient } from '../lib/crashify_pb_service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private client: TransitoClient;

  constructor() {
    this.client = new TransitoClient('http://localhost:8080', null);
  }

  iniciarSesion(email: string, password: string): Usuario {
    const sesion = new Sesion();

    sesion.setUsuario(email);
    sesion.setPassword(password);
    let user: Usuario;

    this.client.iniciarSesion(sesion, (err, usuario: Usuario) => {
      if (usuario == null) {
        throw err;
      } else {
        user = usuario;
        console.log(user);
      }
    });
    return user;
  }
}
