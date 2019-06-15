import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ListaReportes, ReporteResumido, Dictamen, Usuario, Respuesta, DictamenUnificado, Reporte } from '../lib/crashify_pb';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ReporteService } from '../services/reporte.service';
import { ServiceError } from '../lib/crashify_pb_service';
import { LoginService } from '../services/login.service';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { ReporteData } from '../models/ReporteData.model';
import { HereService } from '../services/here.service';
import { ReporteComponent } from './reporte/reporte.component';


@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  private reportes: ReporteData[] = [];

  displayedColumns: string[] = ['select', 'conductor', 'fecha' , 'hora', 'ciudad', 'estado', 'idSiniestro', 'idSiniestroFinal'];
  dataSource: MatTableDataSource<ReporteData>;
  selection = new SelectionModel<ReporteData>(true, []);

  constructor(
    private reporteService: ReporteService,
    private loginService: LoginService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private here: HereService,
  ) { }

  async ngOnInit() {
    this.reportes = [];
    await this.obtenerReportes();
    this.dataSource = new MatTableDataSource(this.reportes);
    this.selection = new SelectionModel<ReporteData>(true, []);
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
          console.log(res);
          res.getReportesList().forEach(element => {
            const dummy: ReporteData = {
              idReporte: element.getIdreporte(),
              idSiniestro: element.getIdsiniestro(),
              idSiniestroFinal: element.getIdsiniestrounificado(),
              conductor: element.getNombreconductor(),
              hora: new Date(element.getHora()),
              ciudad: 'Not found',
              direccion: 'Not found',
              estado: element.getEstado(),
            };
            docRefs.push(dummy);
            const position = element.getLatitud() + ',' + element.getLongitud();
            let locations: Array<any>;
            this.here.getAddressFromLatLng(position)
              .then((result) =>  {
                locations = result as Array<any>;
                console.log(locations);
                dummy.ciudad = locations[0].Location.Address.City;
                dummy.direccion = locations[0].Location.Address.Label;
              })
              .catch((err) => {
                console.log('Error de getCity: ', err);
              });
          });
        }
      })
      .catch((err: ServiceError) => {
        if (err.code === 2) { // Si regresó null la consulta
          this.toastr.warning('No se encontraron reportes', 'Warning');
        } else if (err.code === 14) { // Si no hay conexión con el servidor
          console.log(err);
          this.toastr.error('Error de conexión', 'error');
        }
      });
    this.reportes = docRefs;
    console.log(this.reportes);
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

  //async dictaminarReporteUnificado() {
  //  let dictamen: DictamenUnificado = new DictamenUnificado();
  //  let usuario: Usuario = this.loginService.getCurrentUser();
  //  let idReportes: number[] = [];
  //  idReportes.push(this.reportes[0].idReporte);
  //  idReportes.push(this.reportes[1].idReporte);
  //  dictamen.setHora(this.reportes[0].hora.toString());
  //  dictamen.setIdreporteList(idReportes);
  //  dictamen.setIdsiniestro(this.reportes[0].idSiniestro);
  //  dictamen.setIdusuario(usuario.getIdusuario());
  //  dictamen.setDictamen("Ambos puñetas se mamaron");
  //  await this.reporteService.dictaminarReporteUnificado(dictamen)
  //    .then((res: Respuesta) => {
  //      if (res.getCode() == 1) {
  //        this.toastr.success(res.getMensaje(), "success");
  //      } else if (res.getCode() != 99) {
  //        this.toastr.error(res.getMensaje(), "error")
  //      } else {
  //        this.toastr.error("Datos incorrectos", "error");
  //      }
  //    })
  //    .catch((err) => {
  //      this.toastr.error(err.message.toString(), "Error de conexión");
  //      console.log(err);
  //    });
  //}

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

  async detalleReporte(row) {
    console.log(row.idReporte);
    await this.reporteService.getDetallesReporte(row.idReporte)
      .then((res: Reporte) => {
        if (res.getIdreporte() != null) {
          console.log(res);
          var resultado: boolean;
          const dialogRef = this.dialog.open(ReporteComponent, {
            width: '50%',
            data: {
              firstData: row,
              additionalData: res
            }
          });
          dialogRef.afterClosed().subscribe(result => {
            resultado = result;
            if (result) {
              console.log('Creo que lo cerró');
            }
          });
        }
      })
      .catch((err: ServiceError) => {
        if (err.code === 2) { // Si regresó null la consulta
          this.toastr.warning('Error al cargar datos', 'Warning');
        } else if (err.code === 14) { // Si no hay conexión con el servidor
          console.log(err);
          this.toastr.error('Error de conexión', 'error');
        }
      });
  }

  async getCityFromCoordinates(lat: number, lon: number) {
    const position = lat + ',' + lon;
    let locations: Array<any>;
    let response = 'Not found';
    let ciudad = null;
    await this.here.getAddressFromLatLng(position)
      .then((result) => {
        locations = result as Array<any>;
        console.log(locations);
        ciudad = locations[0].Location.Address.City;
      })
      .catch((err) => {
        console.log('Error de getCity: ', err);
        return response;
      });
    return ciudad;
  }

  public round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  async unificar() {
    console.log('Unificando...');
    console.log(this.selection.selected);
    const id = this.selection.selected[0].idSiniestro;
    let diferentes = false;
    this.selection.selected.forEach(element => {
      if (element.idSiniestro !== id) {
        console.log('Hey');
        diferentes = true;
        return;
      }
    });
    if (diferentes) {
      this.toastr.warning('Los reportes seleccionados son de diferentes eventos', 'Warning');
      return;
    } else {
      let listsIdReportes: number[] = [];
      this.selection.selected.forEach(element => {
        listsIdReportes.push(element.idReporte);
      });
      await this.reporteService.unificarReportes(listsIdReportes)
        .then((res: Respuesta) => {
          if (res.getCode() === 1) {
            this.toastr.success(res.getMensaje(), 'success');
          } else if (res.getCode() !== 99) {
            this.toastr.error(res.getMensaje(), 'error');
          } else {
            this.toastr.error('Error de conexixón', 'error');
          }
        })
        .catch((err: ServiceError) => {
          this.toastr.error(err.message.toString(), 'error');
        });
      this.ngOnInit();
    }
  }
}
