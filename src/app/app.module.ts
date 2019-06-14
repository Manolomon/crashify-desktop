import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, Toast } from 'ngx-toastr';
import { NgImageSliderModule } from 'ng-image-slider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { ReportesComponent } from './reportes/reportes.component';
import { LoginService } from './services/login.service';
import { Usuario, Sesion } from './lib/crashify_pb';
import { ReporteComponent } from './reportes/reporte/reporte.component';
import { AdminComponent } from './admin/admin.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { DialogoComponent } from './dialogo/dialogo.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    ReportesComponent,
    ReporteComponent,
    AdminComponent,
    UsuarioComponent,
    DialogoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: 'menu', component: MenuComponent },
    ]),
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    NgImageSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogoComponent,
    ReporteComponent
  ]
})
export class AppModule { }
