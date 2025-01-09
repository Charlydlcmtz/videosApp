import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Video } from '../interfaces/video.interface';
import { Comentario } from '../interfaces/comentario.interface';

@Injectable({providedIn: 'root'})
export class VideosService {

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) { }

  getVideos():Observable<Video[]>{
    return this.http.get<Video[]>(`${ this.baseUrl }/videos/inicio`);
  }

  getComentarios( id: number ):Observable<Comentario[]>{
    return this.http.get<Comentario[]>(`${ this.baseUrl }/comentarios/${ id }`);
  }

  getVideoById( id: number): Observable<Video | undefined>{

    // Verifica si estás en un entorno de navegador
    if (typeof window === 'undefined') {
      console.error('No se puede acceder a localStorage fuera del navegador.');
      return of(undefined); // Devuelve un observable vacío
    }

    const token = localStorage.getItem('token');

    return this.http.get<Video>(`${ this.baseUrl }/videos/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  addVideo( video: any ): Observable<any>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);

    return this.http.post<Video>(`${ this.baseUrl }/videos/video_save`, video, { headers });
  }

  updateVideo( video: Video): Observable<Video>{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);

    if ( !video.id ) throw Error('El video es requerido');
    return this.http.patch<Video>(`${ this.baseUrl }/editar/${ video.id }`, video, { headers })
      .pipe(
        catchError( err => throwError( () => err.error.message ))
      );
  }

  searchVideoByName( title: string): Observable<Video[] | undefined>{

    return this.http.get<Video[]>(`${ this.baseUrl }/buscar_video/${ title }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }
}
