import { Component, OnInit, Injectable } from '@angular/core';
import { Usuario, ListaUsuarios } from '../lib/crashify_pb';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../services/login.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  private usuarioObjeto;
  private usuario: Usuario = new Usuario();
  private loginServicio: LoginService = new LoginService();
  private usuarioService: UsuarioService = new UsuarioService();
  private route: ActivatedRoute;

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.usuarioObjeto = JSON.parse(sessionStorage.getItem("usuario"));
    this.usuario.setIdsuperior(this.usuarioObjeto.idSuperior);
    this.usuario.setIdusuario(this.usuarioObjeto.id);
    this.usuario.setNombre(this.usuarioObjeto.nombre);
    this.usuario.setPassword(this.usuarioObjeto.password);
    this.usuario.setRol(this.usuarioObjeto.rol);
    this.usuario.setUsuario(this.usuarioObjeto.usuario);
    console.log(this.usuario.getNombre());
  }

  public onCerrarSesion(): void {
    this.loginServicio.cerrarSesion();
    this.router.navigate(['login']);
  }

}
