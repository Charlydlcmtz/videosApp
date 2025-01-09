import { Pipe, PipeTransform } from '@angular/core';
import { Comentario } from '../interfaces/comentario.interface';

@Pipe({
  name: 'usuarioImage'
})
export class UsuarioImagePipe implements PipeTransform {

  transform(comentario: Comentario): string {
      let img_usuario = comentario.img_usuario != null ? comentario.img_usuario : '';

      if ( !comentario.img_usuario ) {
        return 'http://localhost:8080/img_errors/no-image.png';
      }

      return `http://localhost:8080/avatar/${ comentario.img_usuario }`;
    }

}
