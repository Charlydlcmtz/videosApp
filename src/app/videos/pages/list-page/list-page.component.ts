import { Component, computed, inject } from '@angular/core';
import { Video } from '../../interfaces/video.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { VideosService } from '../../services/videos.service';
import { AuthStatus } from '../../../auth/interfaces';

@Component({
  selector: 'list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.css'
})
export class ListPageComponent {

  private authService = inject( AuthService );
  public videos: Video[] = [];

  constructor( private videosService: VideosService ){}

  ngOnInit(): void {
    this.videosService.getVideos()
      .subscribe( videos => this.videos = videos );
  }

  public finishedAuthCheck = computed<boolean>( () => {
    if ( (this.authService.authStatus() === AuthStatus.checking) || (this.authService.authStatus() === AuthStatus.notAuthenticated) ) {
      return false;
    }
    return true;
  });
}
