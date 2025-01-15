import { Component, computed, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Video } from '../../interfaces/video.interface';
import { VideosService } from '../../services/videos.service';
import { of, switchMap } from 'rxjs';
import { AuthStatus } from '../../../auth/interfaces';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {

  public videos: Video[] = [];
  public user_email: any;

  constructor(
    private videosService: VideosService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ){}

  public finishedAuthCheck = computed<boolean>( () => {
    if ( (this.authService.authStatus() === AuthStatus.checking) || (this.authService.authStatus() === AuthStatus.notAuthenticated) ) {
      return false;
    }
    return true;
  });

  ngOnInit(): any {

    // Verifica si estás en un entorno de navegador
    if (typeof window === 'undefined') {
      console.error('No se puede acceder a localStorage fuera del navegador.');
      return of(undefined); // Devuelve un observable vacío
    }

    this.user_email = localStorage.getItem('user');

    this.activatedRoute.params
      .pipe(
        switchMap( ({title}) => this.videosService.searchVideoByName( title ))
      )
      .subscribe( videos => {
        if ( !videos ) return this.router.navigateByUrl('/list');
        this.videos = videos;
        return;
      });
  }

  playPreview(video: Video): void {
    const videoElement = document.querySelector('#video_' + video.id) as HTMLVideoElement;
    const imgElement = document.querySelector('#img_' + video.id) as HTMLImageElement;

    if (!videoElement || !imgElement) {
      console.error('No se encontraron los elementos de vídeo o imagen.');
      return;
    }

    // Oculta la imagen y muestra el vídeo
    imgElement.style.display = 'none';
    videoElement.style.display = 'block';
    videoElement.muted = true;
    videoElement.play().catch(error => console.error('Error al reproducir el vídeo:', error));
  }

  stopPreview(video: Video): void {
    const videoElement = document.querySelector('#video_' + video.id) as HTMLVideoElement;
    const imgElement = document.querySelector('#img_' + video.id) as HTMLImageElement;

    if (videoElement && imgElement) {
      // Muestra la imagen y oculta el vídeo
      imgElement.style.display = 'block';
      videoElement.style.display = 'none';
      videoElement.pause();
      videoElement.currentTime = 0; // Reinicia el vídeo
    }
  }

}
