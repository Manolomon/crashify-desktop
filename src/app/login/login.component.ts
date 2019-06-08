import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Usuario, Sesion } from '../lib/crashify_pb';
import { TransitoClient, ServiceError } from '../lib/crashify_pb_service';
import { LoginService } from '../services/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private loginForm: FormGroup;
  private email: string;
  private password: string;

  constructor(
    private loginService: LoginService,
    private notifier: NotifierService,
  ) {
    this.email = '';
    this.password = '';
    this.loginForm = new FormGroup({
      emailControl: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordControl: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    localStorage.clear();
  }

  async onIniciarSesion(view) {
    if (this.loginForm.valid) {
      console.log('Holis prro...')
      await this.loginService.iniciarSesion(this.email, this.password)
        .then((res: Usuario) => {
          if (res.getUsuario() != null) {
            localStorage.setItem("usuario", JSON.stringify(res));
            this.notifier.notify("info", res.getNombre());
            console.log(res.getNombre());
          }
        })
        .catch((err: ServiceError) => {
          if (err.code === 2) { //Si regresó null la consulta
            this.notifier.notify("warning","Datos incorrectos");
          } else if (err.code === 14) { //Si no hay conexión con el servidor
            this.notifier.notify("error","Error de conexión con el servidor");
          }
        });
    } else {
      this.notifier.notify("warning","Campos incompletos");
    }
    let usuarioPrueba = this.loginService.getCurrentUser();
    console.log(usuarioPrueba);
  }

  public cerrarSesion(): void {
    console.log('Cerrar sesión');
  }

}
