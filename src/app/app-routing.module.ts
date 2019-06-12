import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuardService as AuthGuard } from '../app/services/auth-guard.service';
import { ReportesComponent } from './reportes/reportes.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
  },

  //Aqui van las guardas para las demás pantallas
  //el componente es similar al del login pero se le añade la siguiente linea :
  //canActivate: [AuthGuard]

  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
