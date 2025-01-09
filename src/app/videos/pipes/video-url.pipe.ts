import { Pipe, PipeTransform } from '@angular/core';
import { Video } from '../interfaces/video.interface';

@Pipe({
  name: 'videoUrl'
})
export class VideoUrlPipe implements PipeTransform {

  transform(video: Video | undefined): string {

    if (!video?.video_url) {
      console.error('video_url no definido:', video);
      return 'http://localhost:8080/videos_cargados/default-video.mp4';
    }
    return `http://localhost:8080/videos_cargados/${video.video_url}`;
  }

}
