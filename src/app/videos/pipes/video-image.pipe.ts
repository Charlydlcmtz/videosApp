import { Pipe, PipeTransform } from '@angular/core';
import { Video } from '../interfaces/video.interface';

@Pipe({
  name: 'videoImage'
})
export class VideoImagePipe implements PipeTransform {

  transform(video: Video): string {
    let img_video = video.img_video != null ? video.img_video : '',
    nombreSinExtension = '';

    // Verificar si img_video no esta vacío antes de intentar manipularlo
    if (img_video !== '') {
      // Dividir el nombre de la imagen en partes usando el punto como separador
      let partes = img_video.split('.');

      // Tomar la primera parte, que es el nombre del archivo sin la extension
      nombreSinExtension = partes[1];
    }

    if ( !video.title && !video.img_video ) {
      return 'http://localhost:8080/img_errors/no-image.png';
    }

    if ( video.img_video == '') {
      return 'http://localhost:8080/img_errors/no-image.png';
    }

    if ( video.title.toLocaleLowerCase()+'.'+nombreSinExtension != video.img_video) {
      //return `${video.img_video}`;
      return `http://localhost:8080/img_video/${ video.img_video }`
    }

    return `http://localhost:8080/img_video/${ video.img_video }`;
  }

}
