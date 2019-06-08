import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario, Sesion } from '../lib/crashify_pb';
import { TransitoClient, ServiceError } from '../lib/crashify_pb_service';
import { LoginService } from '../services/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


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
    private router: Router,
    private toastr: ToastrService,
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
      await this.loginService.iniciarSesion(this.email, this.password)
        .then((res: Usuario) => {
          if (res.getUsuario() != null) {
            localStorage.setItem('usuario', JSON.stringify(res));
            this.toastr.success('Conexion exitosa', 'success');
            this.router.navigate(['menu']);
          }
        })
        .catch((err: ServiceError) => {
          if (err.code === 2) { // Si regresó null la consulta
            this.toastr.warning('Datos incorrectos', 'Warning');
          } else if (err.code === 14) { // Si no hay conexión con el servidor
            this.toastr.error('Error de conexión', 'error');
          }
        });
    } else {
      this.toastr.warning('Campos incompletos', 'warning');
    }
    let usuarioPrueba = this.loginService.getCurrentUser();
    console.log(usuarioPrueba);
  }

  public cerrarSesion(): void {
    console.log('Cerrar sesión');
  }

}
