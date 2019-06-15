import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { Usuario, Respuesta } from 'src/app/lib/crashify_pb';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { LoginService } from '../../services/login.service';
import { ServiceError } from 'src/app/lib/crashify_pb_service';
import { ToastrService } from 'ngx-toastr';

export interface TempUser {
  nombre: string;
  cargo: string;
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
  @Output() private recargarUsuarios = new EventEmitter<boolean>(false);
  @Output() private edicionCancelada = new EventEmitter<boolean>(false);


  private hide = true;
  private usuarioForm: FormGroup;
  private cargoControl: FormControl = new FormControl('', [Validators.required]);
  private passwordControl: FormControl;
  private passwordTemp: string;
  private usuarioTemp: TempUser = {
    nombre: '',
    cargo: '',
    username: '',
    password: '',
    idUsuario: 0,
    idSuperior: 0
  };

  constructor(
    private usuarioService: UsuarioService,
    private loginService: LoginService,
    private toastr: ToastrService,
  ) {
    this.usuarioForm = new FormGroup({
      nombreControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
      usernameControl: new FormControl('', [Validators.required, Validators.minLength(2)]),
    });

    this.passwordControl = new FormControl('', [Validators.required, Validators.minLength(2)]);
    this.usuarioForm.addControl('passwordControl', this.passwordControl);
    this.usuarioForm.addControl('cargoControl', this.cargoControl);
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
    this.usuarioTemp.idSuperior = this.loginService.getCurrentUser().getIdusuario();
    this.usuarioTemp.nombre = this.usuarioObjeto.getNombre();
    this.usuarioTemp.cargo = String(this.usuarioObjeto.getRol());
    this.usuarioTemp.username = this.usuarioObjeto.getUsuario();
  }

  async onGuardarUsuario(myForm: NgForm) {
    console.log('Agregando Usuario');
    if (this.usuarioForm.valid || !this.nuevoUsuario) {
      if (this.nuevoUsuario) {
        console.log('Agregando Usuario');
        const user = new Usuario();
        user.setNombre(this.usuarioTemp.nombre);
        user.setIdsuperior(this.loginService.getCurrentUser().getIdusuario());
        user.setRol(Number(this.usuarioTemp.cargo));
        user.setUsuario(this.usuarioTemp.username);
        user.setPassword(this.passwordTemp);
        await this.usuarioService.registrarUsuario(user)
          .then((res: Respuesta) => {
            if (res.getCode() != null) {
              console.log(res.toObject().mensaje);
              this.toastr.success('Usuario almacenado', 'Éxito');
              this.recargarUsuarios.emit(false);
              this.creacionCancelada.emit(false);
            }
          })
          .catch((err: ServiceError) => {
            if (err.code === 2) { // Si regresó null la consulta
              this.toastr.warning('No se encontraron usuarios', 'Warning');
            } else if (err.code === 14) { // Si no hay conexión con el servidor
              this.toastr.error('Error de conexión', 'error');
            }
          });
      } else {
        console.log('Modificando usuario');
        const user = new Usuario();
        user.setNombre(this.usuarioTemp.nombre);
        user.setIdsuperior(this.usuarioTemp.idSuperior);
        user.setIdusuario(this.usuarioTemp.idUsuario);
        user.setRol(Number(this.usuarioTemp.cargo));
        user.setUsuario(this.usuarioTemp.username);
        user.setPassword(this.usuarioObjeto.getPassword());
        await this.usuarioService.actualizarUsuario(user)
          .then((res: Respuesta) => {
            if (res.getCode() != null) {
              console.log(res.toObject().mensaje);
              this.toastr.success('Usuario almacenado', 'Éxito');
              this.recargarUsuarios.emit(false);
              this.creacionCancelada.emit(false);
            }
          })
          .catch((err: ServiceError) => {
            if (err.code === 2) { // Si regresó null la consulta
              this.toastr.warning('No se encontraron usuarios', 'Warning');
            } else if (err.code === 14) { // Si no hay conexión con el servidor
              this.toastr.error('Error de conexión', 'error');
            }
          });
      }
    } else {
      this.toastr.warning('Datos incompletos o invalidos', 'Warning');
    }
  }

  public cancelarEdicion() {
    if (!this.nuevoUsuario) {
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
