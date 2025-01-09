import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isNotAuthenticatedGuard } from './auth/guards/is-not-authenticated.guard';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';

const routes: Routes = [
  {
    path: 'auth',
    //guards
    canActivate: [ isNotAuthenticatedGuard ],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule ),
  },
  {
    path: 'dashboard',
    //guards
    canActivate: [ isAuthenticatedGuard ],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule ),
  },
  {
    path: 'videos',
    loadChildren: () => import('./videos/videos.module').then(m => m.VideosModule),
  },
  {
    path: '**',
    redirectTo: 'videos',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
