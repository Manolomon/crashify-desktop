import { Injectable } from '@angular/core';
import { Usuario, Sesion } from '../lib/crashify_pb';
import { TransitoClient, ServiceError } from '../lib/crashify_pb_service';
import { resolve } from 'url';
import { reject } from 'q';
import * as sha256 from 'js-sha256';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private client: TransitoClient;
  private usuario: Usuario = new Usuario();
  constructor() {
    this.client = new TransitoClient('http://localhost:8080', null);
  }

  iniciarSesion(email: string, password: string) {
    const sesion = new Sesion();

    sesion.setUsuario(email);
    sesion.setPassword(sha256.sha256(password));

    console.log("Comienza inicio de sesión")

    return new Promise((resolve, reject) => {
      this.client.iniciarSesion(sesion, (err, usuario: Usuario) => {
        if (usuario != null) {
          console.log(usuario)
          resolve(usuario);
        } else {
          reject(err);
        }
      });
    })
  }

  getCurrentUser() {
    let usuarioObjeto = JSON.parse(sessionStorage.getItem("usuario"));
    console.log(usuarioObjeto);
    this.usuario.setIdsuperior(usuarioObjeto.idsuperior);
    this.usuario.setIdusuario(usuarioObjeto.idusuario);
    this.usuario.setNombre(usuarioObjeto.nombre);
    this.usuario.setPassword(usuarioObjeto.password);
    this.usuario.setRol(usuarioObjeto.rol);
    this.usuario.setUsuario(usuarioObjeto.usuario);
    return this.usuario;
  }

  isLogged() {
    return JSON.parse(sessionStorage.getItem("usuario")) != null;
  }

  cerrarSesion() {
    sessionStorage.removeItem("usuario");
  }

}
