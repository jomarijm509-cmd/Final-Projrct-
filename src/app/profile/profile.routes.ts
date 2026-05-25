import { Routes } from '@angular/router';
import { ProfileLayoutComponent } from './layout.component';
import { DetailsComponent } from './details/details.component';
import { UpdateComponent } from './update/update.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '', component: ProfileLayoutComponent,
    children: [
      { path: '', component: DetailsComponent },
      { path: 'update', component: UpdateComponent }
    ]
  }
];
