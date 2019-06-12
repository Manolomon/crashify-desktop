import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ListaReportes, ReporteResumido } from '../lib/crashify_pb';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ReporteService } from '../services/reporte.service';
import { ServiceError } from '../lib/crashify_pb_service';

export interface Reporte {
  hora: string;
  id: number;
  autor: string;
  ciudad: string;
  estatus: string;
}

const DUMMY: Reporte[] = [
  {id: 1, hora: '10:45', autor: 'Manolo Pérez', ciudad: 'Xalapa', estatus: 'Dictaminado'},
  {id: 1, hora: '10:46', autor: 'Manolo Pérez', ciudad: 'Xalapa', estatus: 'Pendiente'},
  {id: 3, hora: '12:56', autor: 'Benji Somur', ciudad: 'Banderilla', estatus: 'Dictaminado'},
  {id: 2, hora: '11:43', autor: 'Daniel Escamilla', ciudad: 'Veracruz', estatus: 'Pendiente'},
  {id: 5, hora: '15:34', autor: 'Mario Moreno', ciudad: 'Guadalajara', estatus: 'Dictaminado'},
  {id: 6, hora: '16:23', autor: 'Santa Claus', ciudad: 'North Pole', estatus: 'Dictaminado'},
  {id: 4, hora: '14:54', autor: 'John Wick', ciudad: 'New York', estatus: 'Dictaminado'},
  {id: 4, hora: '14:55', autor: 'McLovin', ciudad: 'Hawai', estatus: 'Pendiente'},
  {id: 8, hora: '20:14', autor: 'Homer J. Simpson', ciudad: 'Springfield', estatus: 'Dictaminado'},
  {id: 3, hora: '13:00', autor: 'Sheldon J. Plankton', ciudad: 'Bikini Button', estatus: 'Pendiente'},
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
  dataSource = new MatTableDataSource<Reporte>(DUMMY);
  selection = new SelectionModel<Reporte>(true, []);

  constructor(
    private reporteService: ReporteService
  ) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.obtenerReportes();
  }

  async obtenerReportes() {
    console.log('Haciendo cosas');
    await this.reporteService.obtenerReportes()
      .then((res: ListaReportes) => {
        if (res.getReportesList() != null) {
          console.log(res.toObject().reportesList);
          res.getReportesList().forEach(element => {
            this.reportes.push(element);
          });
          console.log(this.reportes[1].getEstado());
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
  checkboxLabel(row?: Reporte): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  selectRow(row) {
    alert(row.autor);
  }
}
