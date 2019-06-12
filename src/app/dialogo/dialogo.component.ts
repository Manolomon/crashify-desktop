import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  mensaje: string;
  resultado: boolean;
  dobleBoton: boolean;
}

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.scss']
})
export class DialogoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  clickCancelar(): void {
    this.data.resultado = false;
    this.dialogRef.close(this.data.resultado);
  }

  clickAceptar(): void {
    this.data.resultado = true;
    this.dialogRef.close(this.data.resultado);
  }

}
