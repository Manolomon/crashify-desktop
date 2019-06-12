import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ListaReportes, ReporteResumido, Dictamen, Usuario, Respuesta, DictamenUnificado } from '../lib/crashify_pb';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ReporteService } from '../services/reporte.service';
import { ServiceError } from '../lib/crashify_pb_service';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';

export interface ReporteAux {
  hora: string;
  id: number;
  autor: string;
  ciudad: string;
  estatus: string;
}

const DUMMY: ReporteAux[] = [
  { id: 1, hora: '10:45', autor: 'Manolo Pérez', ciudad: 'Xalapa', estatus: 'Dictaminado' },
  { id: 1, hora: '10:46', autor: 'Manolo Pérez', ciudad: 'Xalapa', estatus: 'Pendiente' },
  { id: 3, hora: '12:56', autor: 'Benji Somur', ciudad: 'Banderilla', estatus: 'Dictaminado' },
  { id: 2, hora: '11:43', autor: 'Daniel Escamilla', ciudad: 'Veracruz', estatus: 'Pendiente' },
  { id: 5, hora: '15:34', autor: 'Mario Moreno', ciudad: 'Guadalajara', estatus: 'Dictaminado' },
  { id: 6, hora: '16:23', autor: 'Santa Claus', ciudad: 'North Pole', estatus: 'Dictaminado' },
  { id: 4, hora: '14:54', autor: 'John Wick', ciudad: 'New York', estatus: 'Dictaminado' },
  { id: 4, hora: '14:55', autor: 'McLovin', ciudad: 'Hawai', estatus: 'Pendiente' },
  { id: 8, hora: '20:14', autor: 'Homer J. Simpson', ciudad: 'Springfield', estatus: 'Dictaminado' },
  { id: 3, hora: '13:00', autor: 'Sheldon J. Plankton', ciudad: 'Bikini Button', estatus: 'Pendiente' },
];


@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private reportes: Array<ReporteResumido> = [];

  displayedColumns: string[] = ['select', 'autor', 'hora', 'ciudad', 'estatus', 'id'];
  dataSource = new MatTableDataSource<ReporteAux>(DUMMY);
  selection = new SelectionModel<ReporteAux>(true, []);

  constructor(
    private reporteService: ReporteService,
    private loginService: LoginService,
    private toastr: ToastrService,
  ) { }

  async ngOnInit() {
    this.dataSource.sort = this.sort;
    await this.obtenerReportes();
    //this.unificarReportes();
    //this.dictaminarReporteUnificado();
    //this.dictaminarReporte();
  }

  async obtenerReportes() {
    await this.reporteService.obtenerReportes()
      .then((res: ListaReportes) => {
        if (res.getReportesList() != null) {
          console.log(res.toObject().reportesList);
          res.getReportesList().forEach(element => {
            this.reportes.push(element);
          });
          console.log(this.reportes[0].getEstado());
          //sessionStorage.setItem('reporte', JSON.stringify(res.toObject()));
          //this.toastr.success('Conexion exitosa', 'success');
        }
      })
      .catch((err: ServiceError) => {
        if (err.code === 2) { // Si regresó null la consulta
          //this.toastr.warning('Datos incorrectos', 'Warning');
        } else if (err.code === 14) { // Si no hay conexión con el servidor
          //this.toastr.error('Error de conexión', 'error');
        }
      });
  }

  async dictaminarReporte() {
    let usuario: Usuario = this.loginService.getCurrentUser();
    let reporteAux: ReporteResumido = this.reportes[0];
    let dictamen: Dictamen = new Dictamen();
    dictamen.setHora(reporteAux.getHora.toString());
    dictamen.setIdreporte(reporteAux.getIdreporte());
    dictamen.setIdsiniestro(reporteAux.getIdsiniestro());
    dictamen.setIdusuario(usuario.getIdusuario());
    dictamen.setDictamen("EL puñetas se mamó");
    await this.reporteService.dictaminarReporte(dictamen)
      .then((res: Respuesta) => {
        if (res.getCode() == 1) {
          this.toastr.success(res.getMensaje(), "success");
        } else if (res.getCode() != 99) {
          this.toastr.error(res.getMensaje(), "error")
        } else {
          this.toastr.error("Datos incorrectos", "error");
        }
      })
      .catch((err: ServiceError) => {
        this.toastr.error(err.message.toString(), "Error de conexión");
      });
  }

  async dictaminarReporteUnificado() {
    let dictamen: DictamenUnificado = new DictamenUnificado();
    let usuario: Usuario = this.loginService.getCurrentUser();
    let idReportes: number[] = [];
    idReportes.push(this.reportes[0].getIdreporte());
    idReportes.push(this.reportes[1].getIdreporte());
    dictamen.setHora(this.reportes[0].getHora.toString());
    dictamen.setIdreporteList(idReportes);
    dictamen.setIdsiniestro(this.reportes[0].getIdsiniestro());
    dictamen.setIdusuario(usuario.getIdusuario());
    dictamen.setDictamen("Ambos puñetas se mamaron");
    await this.reporteService.dictaminarReporteUnificado(dictamen)
      .then((res: Respuesta) => {
        if (res.getCode() == 1) {
          this.toastr.success(res.getMensaje(), "success");
        } else if (res.getCode() != 99) {
          this.toastr.error(res.getMensaje(), "error")
        } else {
          this.toastr.error("Datos incorrectos", "error");
        }
      })
      .catch((err) => {
        this.toastr.error(err.message.toString(), "Error de conexión");
        console.log(err);
      });
  }

  async unificarReportes() {
    let idReporte1: number = this.reportes[0].getIdreporte();
    let idReporte2: number = this.reportes[1].getIdreporte();
    await this.reporteService.unificarReportes(idReporte1, idReporte2)
      .then((res: Respuesta) => {
        if (res.getCode() == 1) {
          this.toastr.success(res.getMensaje(), "success");
        } else if (res.getCode() != 99) {
          this.toastr.error(res.getMensaje(), "error");
        } else {
          this.toastr.error("Error de conexixón", "error");
        }
      })
      .catch((err: ServiceError) => {
        this.toastr.error(err.message.toString(), "error");
      });

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ReporteAux): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  selectRow(row) {
    alert(row.autor);
  }
}
