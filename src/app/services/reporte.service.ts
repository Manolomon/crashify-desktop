import { Injectable } from '@angular/core';
import {
  Usuario, Sesion, ListaUsuarios, ID,
  Respuesta, Mensaje, ListaReportes, Dictamen,
  DictamenUnificado, Reporte, ListaID, Foto
} from '../lib/crashify_pb';
import { TransitoClient, ServiceError } from '../lib/crashify_pb_service';

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

  unificarReportes(idReportesList: number[]) {
    let listaId: ListaID = new ListaID();
    idReportesList.forEach(element => {
      listaId.addListaid(element);
    });
    return new Promise((resolve, reject) => {
      this.client.unificarReportes(listaId, (err: ServiceError, respuesta: Respuesta) => {
        if (respuesta != null) {
          resolve(respuesta);
        } else {
          reject(err);
        }
      });
    });
  }

  getDetallesReporte(idReporte: number) {
    let id: ID = new ID();
    id.setIdentifier(idReporte);
    return new Promise((resolve, reject) => {
      this.client.obtenerDetalleReporte(id, (err, reporte: Reporte) => {
        if (reporte != null) {
          resolve(reporte);
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

  async obtenerFotosReporte(idReporte: number) {
    let id: ID = new ID();
    id.setIdentifier(idReporte);
    let fotos: Array<Foto> = [];
    return new Promise((resolve, reject) => {
      this.client.obtenerFotosReporte(id)
        .on('data', (foto) => {
          fotos.push(foto);
        })
        .on('end', () => {
          if (fotos.length != 0) {
            resolve(fotos)
          } else {
            reject(new Error("error"));
          }
        });
    });
  }

}
