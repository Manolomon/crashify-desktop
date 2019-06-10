import { Injectable } from '@angular/core';
import { Usuario, ListaUsuarios, ID, Respuesta } from '../lib/crashify_pb';
import { TransitoClient } from '../lib/crashify_pb_service';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private client: TransitoClient;
  constructor() {
    this.client = new TransitoClient('http://localhost:8080', null);
  }

  obtenerUsuarios(idSuperior: number) {
    let id: ID = new ID();
    id.setIdentifier(idSuperior);
    return new Promise((resolve, reject) => {
      this.client.obtenerUsuarios(id, (err, listaUsuarios: ListaUsuarios) => {
        if (listaUsuarios != null) {
          console.log(listaUsuarios.toObject());
          resolve(listaUsuarios);
        } else {
          reject(err);
        }
      });
    });
  }

  registrarUsuario(usuario: Usuario) {
    return new Promise((resolve, reject) => {
      this.client.registrarUsuario(usuario, (err, respuesta: Respuesta) => {
        if (respuesta != null) {
          resolve(respuesta);
        } else {
          reject(err);
        }
      });
    });
  }

  actualizarUsuario(usuario: Usuario) {
    return new Promise((resolve, reject) => {
      this.client.actualizarUsuario(usuario, (err, respuesta: Respuesta) => {
        if (respuesta != null) {
          resolve(respuesta);
        } else {
          reject(err);
        }
      });
    });
  }

  eliminarUsuario(id: number) {
    let idUsuario: ID = new ID();
    idUsuario.setIdentifier(id);
    return new Promise((resolve, reject) => {
      this.client.eliminarUsuario(idUsuario, (err, respuesta) => {
        if (respuesta != null) {
          resolve(respuesta);
        } else {
          reject(err);
        }
      });
    });
  }

}
