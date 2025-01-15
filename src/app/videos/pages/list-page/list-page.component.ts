import { Component, computed, inject } from '@angular/core';
import { Video } from '../../interfaces/video.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { VideosService } from '../../services/videos.service';
import { AuthStatus } from '../../../auth/interfaces';
import { of } from 'rxjs';

@Component({
  selector: 'list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent {

  private authService = inject( AuthService );
  public videos: Video[] = [];
  public user_email: any;

  constructor(
    private videosService: VideosService,
  ){}

  ngOnInit(): any {

    // Verifica si estás en un entorno de navegador
    if (typeof window === 'undefined') {
      console.error('No se puede acceder a localStorage fuera del navegador.');
      return of(undefined); // Devuelve un observable vacío
    }

     this.user_email = localStorage.getItem('user');

    this.videosService.getVideos()
      .subscribe( videos => this.videos = videos );
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

  public finishedAuthCheck = computed<boolean>( () => {
    if ( (this.authService.authStatus() === AuthStatus.checking) || (this.authService.authStatus() === AuthStatus.notAuthenticated) ) {
      return false;
    }
    return true;
  });

}
