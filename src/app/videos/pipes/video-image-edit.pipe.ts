import { Pipe, PipeTransform } from '@angular/core';
import { Video } from '../interfaces/video.interface';

@Pipe({
  name: 'videoImageEdit'
})
export class VideoImageEditPipe implements PipeTransform {

  transform(video: Video, previewUrl?: string, type: 'image' | 'video' = 'image'): string {
    if (previewUrl) {
      return previewUrl; // Usar la previsualización si está definida
    }

    if (type === 'image') {
      return video.img_video ? `http://localhost:8080/img_video/${video.img_video}` : 'default-image-path';
    } else if (type === 'video') {
      return video.video_url ? `http://localhost:8080/videos_cargados/${video.video_url}` : 'default-video-thumbnail-path';
    }

    return 'default-placeholder-path';
  }

}
