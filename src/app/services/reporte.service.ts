import { Injectable } from '@angular/core';
import { Usuario, Sesion, ListaUsuarios, ID, Respuesta, Mensaje, ListaReportes, Dictamen } from '../lib/crashify_pb';
import { TransitoClient } from '../lib/crashify_pb_service';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private client: TransitoClient;
  constructor() {
    this.client = new TransitoClient('http://localhost:8080', null);
  }

  obtenerReportes() {
    let msg: Mensaje = new Mensaje();
    msg.setMsg('getReportes');
    return new Promise((resolve, reject) => {
      this.client.obtenerReportes(msg, (err, listaReportes: ListaReportes) => {
        if (listaReportes != null) {
          resolve(listaReportes);
        } else {
          reject(err);
        }
      });
    });
  }

  dictaminarReporte(dictamen: Dictamen) {
    return new Promise((resolve, reject) => {
      this.client.dictaminarReporte(dictamen, (err, respuesta: Respuesta) => {
        if (respuesta != null) {
          resolve(respuesta);
        } else {
          reject(err);
        }
      });
    });
  }

  dictaminarReporteUnificado(dictamen: Dictamen) {
    return new Promise((resolve, reject) => {
      this.client.dictaminarReporteUnificado(dictamen, (err, respuesta) => {
        if (respuesta != null) {
          resolve(respuesta);
        } else {
          reject(err);
        }
      });
    })
  }

}
