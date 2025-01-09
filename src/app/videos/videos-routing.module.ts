import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { isAuthenticatedGuard } from '../auth/guards/is-authenticated.guard';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { VideoPageComponent } from './pages/video-page/video-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'new-video', canActivate: [ isAuthenticatedGuard ], component: NewPageComponent },
      { path: 'edit/:id', canActivate: [ isAuthenticatedGuard ], component: NewPageComponent },
      { path: 'search/:name', component: SearchPageComponent },
      { path: 'list', component: ListPageComponent },
      { path: ':id', component: VideoPageComponent },
      { path: '**', redirectTo: 'list' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideosRoutingModule { }
