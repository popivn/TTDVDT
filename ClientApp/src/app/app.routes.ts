import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { AdminLayoutComponent } from './components/adminlayout/admin-layout.component';
import { AdminComponent } from './components/admin/admin.component';
import { SettingsManagementComponent } from './components/admin/settings-management/settings-management.component';
import { CoursesManagementComponent } from './components/admin/courses-management/courses-management.component';
import { ClassroomsManagementComponent } from './components/admin/classrooms-management/classrooms-management.component';
import { RegistrationsManagementComponent } from './components/admin/registrations-management/registrations-management.component';
import { authGuard } from './guards/auth.guard';
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
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: AdminComponent
      },
      {
        path: 'home',
        component: AdminComponent
      },
      {
        path: 'settings',
        component: SettingsManagementComponent
      },
      {
        path: 'courses',
        component: CoursesManagementComponent
      },
      {
        path: 'classrooms',
        component: ClassroomsManagementComponent
      },
      {
        path: 'registrations',
        component: RegistrationsManagementComponent
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
