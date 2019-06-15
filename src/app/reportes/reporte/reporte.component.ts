import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReporteData } from '../../models/ReporteData.model';
import { Reporte, Vehiculo, Foto } from 'src/app/lib/crashify_pb';
import { ReporteService } from 'src/app/services/reporte.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

export interface ReporteDataDetallado {
  fisrtData: ReporteData;
  additionalData: Reporte;
}

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss']
})
export class ReporteComponent implements OnInit {

  private fotos: Array<any> = [];

  private imageObject: Array<object> = [
    {
      // tslint:disable-next-line: max-line-length
      thumbImage: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
    {
      // tslint:disable-next-line: max-line-length
      thumbImage: 'https://images.unsplash.com/photo-1560382797-66b2d275cb56?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    },
    {
      // tslint:disable-next-line: max-line-length
      thumbImage: 'https://images.unsplash.com/photo-1543393716-375f47996a77?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReporteDataDetallado,
    public dialogRef: MatDialogRef<ReporteComponent>,
    private reporteService: ReporteService,
    private toastr: ToastrService,
  ) { }

  async ngOnInit() {
    let fotosReporte: Array<Foto> = [];
    await this.reporteService.obtenerFotosReporte(1)
      .then((fotos: Array<Foto>) => {
        console.log(fotos);
        fotos.forEach((foto) => {
          console.log(foto.getFoto_asU8());
          fotosReporte.push(foto);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    this.fotos = fotosReporte;
    console.log("salchichas con queso", this.fotos.length);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
