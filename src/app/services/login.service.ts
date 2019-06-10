import { Injectable } from '@angular/core';
import { Usuario, Sesion } from '../lib/crashify_pb';
import { TransitoClient, ServiceError } from '../lib/crashify_pb_service';
import { resolve } from 'url';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private client: TransitoClient;
  private user: Usuario = null;
  constructor() {
    this.client = new TransitoClient('http://localhost:8080', null);
  }

  iniciarSesion(email: string, password: string) {
    const sesion = new Sesion();

    sesion.setUsuario(email);
    sesion.setPassword(password);

    console.log("Comienza inicio de sesión")

    return new Promise((resolve, reject) => {
      this.client.iniciarSesion(sesion, (err, usuario: Usuario) => {
        if (usuario != null) {
          console.log("Iniciado sesion")
          resolve(usuario);
        } else {
          reject(err);
        }
      });
    })
  }

  getCurrentUser() {
    let user: Usuario = JSON.parse(sessionStorage.getItem("usuario"));
    return user;
  }

  isLogged() {
    return JSON.parse(sessionStorage.getItem("usuario")) != null;
  }

  cerrarSesion() {
    sessionStorage.removeItem("usuario");
  }

}
