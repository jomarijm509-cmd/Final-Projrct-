import { Routes } from '@angular/router';
import { authGuard } from './_helpers/auth.guard';
import { Role } from './_models/role';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.routes').then(m => m.ACCOUNT_ROUTES)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./profile/profile.routes').then(m => m.PROFILE_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: [Role.Admin] },
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  // fallback
  { path: '**', redirectTo: '' }
];
