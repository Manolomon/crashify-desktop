import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Usuario } from 'src/app/lib/crashify_pb';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

export interface TempUser {
  nombre: string;
  cargo: number;
  username: string;
  password: string;
  idUsuario: number;
  idSuperior: number;
}


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

  @Input() private usuarioObjeto: Usuario;
  @Input() private habilitaCampos: boolean;
  @Input() private eliminarProducto: boolean;
  @Input() private nuevoUsuario: boolean;
  @Output() private creacionCancelada = new EventEmitter<boolean>(false);
  @Output() private cargarProductos = new EventEmitter<boolean>(false);
  @Output() private edicionCancelada = new EventEmitter<boolean>(false);

  

  private hide = true;
  private usuarioForm: FormGroup;
  private cargoControl: FormControl = new FormControl('', [Validators.required]);
  private usuarioTemp: TempUser = {
    nombre: '',
    cargo: 0,
    username: '',
    password: '',
    idUsuario: 0,
    idSuperior:0
  };

constructor(
  private usuarioService: UsuarioService,
) {
  this.usuarioForm = new FormGroup({
    nombreControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
    usernameControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
    passwordControl: new FormControl('', [Validators.required, Validators.minLength(2)])
  });
  this.usuarioForm.addControl("cargoControl", this.cargoControl);
}

ngOnInit() {
  if (!isNullOrUndefined(this.usuarioObjeto)) {
    this.llenarCampos();
  }

  if (this.habilitaCampos) {
    this.usuarioForm.enable();
  } else {
    this.usuarioForm.disable();
  }
}

  public llenarCampos() {
  this.usuarioTemp.idUsuario = this.usuarioObjeto.getIdusuario();
  this.usuarioTemp.idSuperior = this.usuarioObjeto.getIdsuperior();
  this.usuarioTemp.nombre = this.usuarioObjeto.getNombre();
  this.usuarioTemp.cargo = this.usuarioObjeto.getRol();
  this.usuarioTemp.username = this.usuarioObjeto.getUsuario();
}

  public cancelarEdicion() {
  if (!isNullOrUndefined(this.usuarioTemp.idUsuario)) {
    this.habilitaCampos = false;
    this.ngOnInit();
    this.edicionCancelada.emit(false);
  } else {
    this.nuevoUsuario = !this.nuevoUsuario;
    this.creacionCancelada.emit(false);
  }
}

  public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
  if (this.habilitaCampos) {
    this.usuarioForm.enable();
  } else {
    this.usuarioForm.disable();
  }
}

}
