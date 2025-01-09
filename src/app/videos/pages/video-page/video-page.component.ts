import { Component, computed, inject, OnInit } from '@angular/core';
import { Video } from '../../interfaces/video.interface';
import { VideosService } from '../../services/videos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthStatus } from '../../../auth/interfaces';
import { AuthService } from '../../../auth/services/auth.service';
import { Comentario } from '../../interfaces/comentario.interface';

@Component({
  selector: 'app-video-page',
  templateUrl: './video-page.component.html',
  styleUrl: './video-page.component.css'
})
export class VideoPageComponent implements OnInit {

  public video?: Video;
  public videos: Video[] = [];
  public comentarios: Comentario[] = [];
  private authService = inject( AuthService );

  constructor(
    private videoService: VideosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.getVideos();
    this.getComments();
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.videoService.getVideoById(id) ),
      ).subscribe( video => {
        if ( !video ) return this.router.navigate(['/videos/list']);
        this.video = video;
        return;
      })
  }

  goBack(): void{
    this.router.navigateByUrl('videos/list');
  }

  getVideos(): void{
    this.videoService.getVideos()
      .subscribe( videos => this.videos = videos );
  }

  getComments(): void{
    this.activatedRoute.params
      .pipe(
        switchMap( ({ id }) => this.videoService.getComentarios(id) ),
      ).subscribe( comentarios => {
        if ( !comentarios ) return this.router.navigate(['/videos/list']);
        this.comentarios = comentarios;
        return;
      });
  }

  public finishedAuthCheck = computed<boolean>( () => {
      if ( (this.authService.authStatus() === AuthStatus.checking) || (this.authService.authStatus() === AuthStatus.notAuthenticated) ) {
        return false;
      }
      return true;
    });

}
