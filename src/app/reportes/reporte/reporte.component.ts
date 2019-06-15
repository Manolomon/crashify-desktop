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

  private imageObject: Array<object> = [
    {
      // tslint:disable-next-line: max-line-length
      thumbImage: 'https://blogs.uao.es/sociedad-debate/wp-content/uploads/sites/4/2014/05/image.png'
    }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ReporteDataDetallado,
    public dialogRef: MatDialogRef<ReporteComponent>,
    private reporteService: ReporteService,
    private toastr: ToastrService,
  ) { this.loadImages(this.data.additionalData.getIdreporte()); }

  async ngOnInit() {
  }

  async loadImages(idReporte: number) {
    const fotosReporte: Array<object> = [];
    await this.reporteService.obtenerFotosReporte(idReporte)
      .then((fotos: Array<Foto>) => {
        console.log(fotos);
        fotos.forEach((foto) => {
          const loadedImage = 'data:image/jpeg;base64,' + foto.getFoto_asB64();
          fotosReporte.push({
            thumbImage: loadedImage
          });
        });
      })
      .catch((err) => {
        this.toastr.warning('No se encontraron fotos asociadas al evento', 'Warning');
      });
    this.imageObject = fotosReporte;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
