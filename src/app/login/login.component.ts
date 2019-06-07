import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario, Sesion } from '../lib/crashify_pb';
import { TransitoClient } from '../lib/crashify_pb_service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private loginForm: FormGroup;
  private email: string;
  private password: string;

  constructor() {
    this.email = '';
    this.password = '';
    this.loginForm = new FormGroup({
      emailControl: new FormControl('', [Validators.required, Validators.minLength(6)]),
      passwordControl: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
  }

  onIniciarSesion(view) {
    console.log("holis prro");
    const client = new TransitoClient('http://localhost:8080', null);
    const sesion = new Sesion();

    sesion.setUsuario(this.email);
    sesion.setPassword(this.password);

    client.iniciarSesion(sesion, (err, usuario) => {
      if (usuario == null) {
        console.log(err);
      } else {
        alert(usuario.getNombre());
      }
    });
  }

  public cerrarSesion(): void {
    console.log('Cerrar sesión')
  }

}
