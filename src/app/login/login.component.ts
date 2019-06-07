import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario, Sesion } from '../lib/crashify_pb';
import { TransitoClient } from '../lib/crashify_pb_service';
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
  }

  async onIniciarSesion(view) {
    if (this.loginForm.valid) {
      console.log('Holis prro...')
      this.loginService.iniciarSesion(this.email, this.password)
        .then((res: Usuario) => {
          if (res != null) {
            alert(res.getNombre());
          } else {
            alert("Datos incorrectos");
          }
        })
    } else {
      alert("Campos incmpletos");
    }
  }

  public cerrarSesion(): void {
    console.log('Cerrar sesión')
  }

}
