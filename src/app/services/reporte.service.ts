import { Injectable } from '@angular/core';
import {
  Usuario, Sesion, ListaUsuarios, ID,
  Respuesta, Mensaje, ListaReportes, Dictamen,
  DictamenUnificado, Reporte, ListaID
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

  unificarReportes(idReporte1: number, idReporte2: number) {
    let listaId: ListaID = new ListaID();
    listaId.addListaid(idReporte1);
    listaId.addListaid(idReporte2);
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

  dictaminarReporteUnificado(dictamen: DictamenUnificado) {
    return new Promise((resolve, reject) => {
      this.client.dictaminarReporteUnificado(dictamen, (err, respuesta) => {
        if (respuesta != null) {
          resolve(respuesta);
        } else {
          reject(err);
        }
      });
    });
  }

}
