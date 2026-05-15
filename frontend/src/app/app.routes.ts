import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { AdminPanelComponent } from './components/admin-panel/admin-panel';
import { CameraComponent } from './components/camera/camera';
import { ForbiddenComponent } from './components/forbidden/forbidden';
import { AllImagesComponent } from './components/all-images/all-images';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'camera', component: CameraComponent, canActivate: [authGuard] },
  {
    path: 'admin',
    component: AdminPanelComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] }
  },
  { path: 'forbidden', component: ForbiddenComponent },
  {
    path: 'all-images',
    component: AllImagesComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Supervisor'] }
  },
  { path: '**', redirectTo: 'login' }
];