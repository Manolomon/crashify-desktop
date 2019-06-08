import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
            alert(res.getNombre());
          }
        })
        .catch((err: ServiceError) => {
          if (err.code == 2) { //Si regresó null la consulta
            alert("Datos incorrectos");
          } else if (err.code == 14) { //Si no hay conexión con el servidor
            alert("Error de conexión con el servidor");
          }
        });
    } else {
      alert("Campos incompletos");
    }
    let usuarioPrueba = this.loginService.getCurrentUser();
    console.log(usuarioPrueba);
  }

  public cerrarSesion(): void {
    console.log('Cerrar sesión')
  }

}
