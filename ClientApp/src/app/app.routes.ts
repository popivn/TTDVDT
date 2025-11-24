import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { AdminLayoutComponent } from './components/adminlayout/admin-layout.component';
import { AdminComponent } from './components/admin/admin.component';
export const routes: Routes = [
  // Routes with layout (header + footer)
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'force-admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: AdminComponent
      },
      {
        path: 'home',
        component: AdminComponent
      }
    ]
  },
  // Routes without layout (no header/footer)
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  // Wildcard redirect
  {
    path: '**',
    redirectTo: '/home'
  }
];
