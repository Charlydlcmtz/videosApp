import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideosRoutingModule } from './videos-routing.module';
import { VideoPageComponent } from './pages/video-page/video-page.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { ListPageComponent } from './pages/list-page/list-page.component';
import { NewPageComponent } from './pages/new-page/new-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { VideoImagePipe } from './pipes/video-image.pipe';
import { ReactiveFormsModule } from '@angular/forms';
import { VideoUrlPipe } from './pipes/video-url.pipe';
import { UsuarioImagePipe } from './pipes/usuario-image.pipe';
import { VideoImageEditPipe } from './pipes/video-image-edit.pipe';


@NgModule({
  declarations: [
    VideoPageComponent,
    LayoutPageComponent,
    ListPageComponent,
    NewPageComponent,
    SearchPageComponent,
    VideoImagePipe,
    VideoUrlPipe,
    UsuarioImagePipe,
    VideoImageEditPipe
  ],
  imports: [
    CommonModule,
    VideosRoutingModule,
    ReactiveFormsModule,
  ]
})
export class VideosModule { }
