import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';
import { ListComponent } from './accounts/list.component';
import { AddEditComponent } from './accounts/add-edit.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '', component: AdminLayoutComponent,
    children: [
      { path: '', component: OverviewComponent },
      { path: 'accounts', component: ListComponent },
      { path: 'accounts/add', component: AddEditComponent },
      { path: 'accounts/edit/:id', component: AddEditComponent }
    ]
  }
];
