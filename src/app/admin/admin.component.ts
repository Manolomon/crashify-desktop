import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { UsuarioService } from '../services/usuario.service'
import { Usuario, ListaUsuarios, Respuesta } from '../lib/crashify_pb';
import { ServiceError } from '../lib/crashify_pb_service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  private admin: Usuario;
  private usuarios: Array<Usuario>;

  private indexExpanded = -1;
  private camposHabilitados: boolean;
  private eliminaUsuario: boolean;
  private agregaUsuario: boolean;

  constructor(
    private loginService: LoginService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.admin = this.loginService.getCurrentUser();
    this.cargarUsuarios();
    this.camposHabilitados = false;
    this.eliminaUsuario = false;
    this.agregaUsuario = false;
    this.togglePanels(-1);
  }

  public recargarUsuarios(cargar: boolean) {
    this.ngOnInit();
  }

  async cargarUsuarios() {
    this.usuarios = [];
    const docRefs: Array<any> = [];
    await this.usuarioService.obtenerUsuarios(this.admin.getIdusuario())
      .then((res: ListaUsuarios) => {
        if (res.getUsuariosList() != null) {
          console.log(res.toObject().usuariosList);
          res.getUsuariosList().forEach(element => {
            docRefs.push(element);
          });
          console.log(docRefs);
          this.toastr.success('Conexion exitosa', 'success');
        }
      })
      .catch((err: ServiceError) => {
        if (err.code === 2) { // Si regresó null la consulta
          this.toastr.warning('No se encontraron usuarios', 'Warning');
        } else if (err.code === 14) { // Si no hay conexión con el servidor
          this.toastr.error('Error de conexión', 'error');
        }
      });
    this.usuarios = docRefs;
  }

  async eliminarProducto(i: number) {
    let resultado: boolean;
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '400px',
      disableClose: true,
      data: {
        mensaje: '¿Desea eliminar a este usuario?',
        dobleBoton: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      resultado = result;
      if (result) {
        this.usuarioService.eliminarUsuario(this.usuarios[i].getIdusuario())
          .then((res: Respuesta) => {
            if (res.getCode() != null) {
              console.log(res.getCode());
              this.toastr.success('Se eliminó correctamente al usuario', 'success');
            }
            this.ngOnInit();
          })
          .catch((err: ServiceError) => {
            if (err.code === 2) { // Si regresó null la consulta
              this.toastr.warning('Error al eliminar', 'Warning');
            } else if (err.code === 14) { // Si no hay conexión con el servidor
              this.toastr.error('Error de conexión', 'error');
            }
          });
      }
    });
  }

  public habilitarCampos() {
    this.camposHabilitados = !this.camposHabilitados;
  }

  togglePanels(index: number) {
    this.indexExpanded = index === this.indexExpanded ? -1 : index;
  }
}
