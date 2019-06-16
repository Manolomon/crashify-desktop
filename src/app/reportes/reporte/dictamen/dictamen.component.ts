import { Component, OnInit, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatStepper } from '@angular/material/stepper';
import { LoginService } from '../../../services/login.service';
import { ReporteService } from '../../../services/reporte.service';
import { Dictamen, Respuesta } from 'src/app/lib/crashify_pb';
import { ReporteData } from 'src/app/models/ReporteData.model';
import { isNullOrUndefined } from 'util';
import { ServiceError } from 'src/app/lib/crashify_pb_service';

@Component({
  selector: 'app-dictamen',
  templateUrl: './dictamen.component.html',
  styleUrls: ['./dictamen.component.scss']
})
export class DictamenComponent implements OnInit {

  @Input() private reporteResumido: ReporteData;
  @Input() private stepper: MatStepper;

  private dictamenForm: FormGroup;
  private veredicto: string;

  constructor(
    private reporteService: ReporteService,
    private loginService: LoginService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.dictamenForm = new FormGroup({
      veredictoControl: new FormControl('', [Validators.required, Validators.minLength(5)])
    });
    if (this.reporteResumido.estado === 1) {
      this.dictamenForm.enable();
    } else {
      this.dictamenForm.disable();
    }
  }

  async onGuardarDictamen(myForm: NgForm) {
    if (this.dictamenForm.valid) {
      const idUsuario = this.loginService.getCurrentUser().getIdusuario();
      console.log(idUsuario);
      const dictamen = new Dictamen();
      dictamen.setIdusuario(idUsuario);
      dictamen.setIdreporte(this.reporteResumido.idReporte);
      dictamen.setDictamen(this.veredicto);
      if (isNullOrUndefined(this.reporteResumido.idSiniestroFinal)) {
        dictamen.setIdsiniestro(this.reporteResumido.idSiniestro);
      } else {
        dictamen.setIdsiniestro(this.reporteResumido.idSiniestroFinal);
      }
      await this.reporteService.dictaminarReporte(dictamen)
        .then((res: Respuesta) => {
          console.log(res);
          if (res.getCode() === 1) {
            this.toastr.success('Dictamen almacenado con éxito', 'Éxito');
          } else if (res.getCode() !== 99) {
            this.toastr.error(res.getMensaje(), 'error');
          } else {
            this.toastr.error('Datos incorrectos', 'error');
          }
          console.log(dictamen);
          this.reporteResumido.estado = 2;
          this.dictamenForm.disable();
        })
        .catch((err: ServiceError) => {
          this.toastr.error(err.message.toString(), 'Error de conexión');
        });
    } else {
      this.toastr.warning('Es necesario establecer un veredicto', 'Datos Incompletos');
    }
  }

  cancelarDictamen() {
    this.stepper.previous();
    this.ngOnInit();
  }

}
