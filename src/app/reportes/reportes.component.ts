import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ListaReportes, ReporteResumido, Dictamen, Usuario, Respuesta, DictamenUnificado, Reporte } from '../lib/crashify_pb';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ReporteService } from '../services/reporte.service';
import { ServiceError } from '../lib/crashify_pb_service';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { ReporteData } from '../models/ReporteData.model';
import { HereService } from '../services/here.service';


@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  private reportes: Array<ReporteData>;

  displayedColumns: string[] = ['select', 'conductor', 'hora', 'ciudad', 'estado', 'idSiniestro'];
  dataSource: MatTableDataSource<ReporteData>;
  selection = new SelectionModel<ReporteData>(true, []);

  constructor(
    private reporteService: ReporteService,
    private loginService: LoginService,
    private toastr: ToastrService,
    private here: HereService,
  ) { }

  async ngOnInit() {
    this.obtenerReportes();
    this.dataSource = new MatTableDataSource(this.reportes);
    this.dataSource.sort = this.sort;
    //this.unificarReportes();
    //this.dictaminarReporteUnificado();
    //this.dictaminarReporte();
  }

  async obtenerReportes() {
    this.reportes = [];
    const docRefs: Array<any> = [];
    await this.reporteService.obtenerReportes()
      .then((res: ListaReportes) => {
        if (res.getReportesList() != null) {
          res.getReportesList().forEach(element => {
            const dummy: ReporteData = {
              idReporte: element.getIdreporte(),
              idSiniestro: element.getIdsiniestro(),
              conductor: 'Santa Claus',
              hora: element.getHora(),
              ciudad: 'Xalapa',
              estado: element.getEstado(),
            };
            docRefs.push(dummy);
          });
        }
      })
      .catch((err: ServiceError) => {
        if (err.code === 2) { // Si regresó null la consulta
          this.toastr.warning('No se encontraron reportes', 'Warning');
        } else if (err.code === 14) { // Si no hay conexión con el servidor
          this.toastr.error('Error de conexión', 'error');
        }
      });
    this.reportes = docRefs;
    console.log(this.reportes);
    this.reportes.push(
      { idReporte: 1, idSiniestro: 2, conductor: 'No c', ciudad: 'Coateyork', hora: '23:45', estado: 0 }
    );
  }

  //async dictaminarReporte() {
  //  let usuario: Usuario = this.loginService.getCurrentUser();
  //  const reporteAux: ReporteResumido = this.reportes[0];
  //  let dictamen: Dictamen = new Dictamen();
  //  dictamen.setHora(reporteAux.getHora.toString());
  //  dictamen.setIdreporte(reporteAux.getIdreporte());
  //  dictamen.setIdsiniestro(reporteAux.getIdsiniestro());
  //  dictamen.setIdusuario(usuario.getIdusuario());
  //  dictamen.setDictamen("EL puñetas se mamó");
  //  await this.reporteService.dictaminarReporte(dictamen)
  //    .then((res: Respuesta) => {
  //      if (res.getCode() == 1) {
  //        this.toastr.success(res.getMensaje(), "success");
  //      } else if (res.getCode() != 99) {
  //        this.toastr.error(res.getMensaje(), "error")
  //      } else {
  //        this.toastr.error("Datos incorrectos", "error");
  //      }
  //    })
  //    .catch((err: ServiceError) => {
  //      this.toastr.error(err.message.toString(), "Error de conexión");
  //   });
  //}

  async dictaminarReporteUnificado() {
    let dictamen: DictamenUnificado = new DictamenUnificado();
    let usuario: Usuario = this.loginService.getCurrentUser();
    let idReportes: number[] = [];
    idReportes.push(this.reportes[0].idReporte);
    idReportes.push(this.reportes[1].idReporte);
    dictamen.setHora(this.reportes[0].hora.toString());
    dictamen.setIdreporteList(idReportes);
    dictamen.setIdsiniestro(this.reportes[0].idSiniestro);
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
    let idReporte1: number = this.reportes[0].idReporte;
    let idReporte2: number = this.reportes[1].idReporte;
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

  selectRow(row) {
    alert(row.autor);
  }

  public getCityFromCoordinates(lat: number, lon: number) {
    const position = lat + ',' + lon;
    let locations: Array<any>;
    let response = 'Not found';
    return this.here.getAddressFromLatLng(position).then(result => {
      locations = result as Array<any>;
      console.log(locations);
      return locations[0].Location.Address.City;
    }, error => {
      return response;
    });
  }

  public round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}
