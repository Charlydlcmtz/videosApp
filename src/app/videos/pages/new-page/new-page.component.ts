import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VideosService } from '../../services/videos.service';
import { Video } from '../../interfaces/video.interface';
import { catchError, switchMap } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'new-page',
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.css'
})
export class NewPageComponent implements OnInit {

  public previewUrl: string | ArrayBuffer | null = null;
  public previewUrlVideo: string | ArrayBuffer | null = null;
  isLoadingVideo: boolean = false; // Estado de carga del vídeo

  private fb = inject( FormBuilder );

  public videoForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(50) ]],
    descripcion: ['', [Validators.required, Validators.maxLength(200) ]],
    img_video: [null, [Validators.required, ]],
    video_url: [null, [Validators.required, ]],
  });

  constructor(
    private videosService: VideosService,
    private activateRoute: ActivatedRoute,
    private router: Router,
  ){}

  get currentVideo(): Video {
    const video = this.videoForm.value as Video;
    return video;
  }

  ngOnInit(): void {
    if ( !this.router.url.includes('edit')) return;

    this.activateRoute.params
      .pipe(
        switchMap( ({ id }) => this.videosService.getVideoById(id) ),
      ).subscribe( video => {

        if ( !video ) return this.router.navigateByUrl('/list');
        this.videoForm.reset( video );
        return;
      });
  }

  onFileSelected(event: Event, type: 'image' | 'video'): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const maxFileSize = 100 * 1024 * 1024; // 100 MB

      if (file.size > maxFileSize) {
        alert('El archivo es demasiado grande. Seleccione un vídeo menor a 100 MB.');
        return;
      }

      // Validar tipo de archivo
      if (type === 'image' && !file.type.startsWith('image/')) {
        alert('Por favor, seleccione un archivo de imagen.');
        return;
      } else if (type === 'video' && !file.type.startsWith('video/')) {
        alert('Por favor, seleccione un archivo de vídeo válido (MP4, WebM, OGG).');
        return;
      }

      // Mostrar estado de carga para vídeos
      if (type === 'video') {
        this.isLoadingVideo = true;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'image') {
          this.previewUrl = reader.result as string;
          this.videoForm.patchValue({ img_video: file });
        } else if (type === 'video') {
          this.previewUrlVideo = reader.result as string;
          this.videoForm.patchValue({ video_url: file });
          this.isLoadingVideo = false; // Finaliza la carga
        }
      };

      reader.onerror = () => {
        alert('Error al cargar el archivo. Inténtelo nuevamente.');
        this.isLoadingVideo = false; // En caso de error
      };

      reader.readAsDataURL(file);
    }
  }

  isValidField( field: string): boolean | null {
    return this.videoForm.controls[field].errors
      && this.videoForm.controls[field].touched
  }

  getFieldError( field: string ): string | null {

    if ( !this.videoForm.controls[field] ) return null;

    const errors = this.videoForm.controls[field].errors || {};

    switch ( field ) {
      case 'title':
        for (const key of Object.keys(errors)) {
          switch ( key ) {
            case 'required':
              return 'El campo titulo es requerido';
            break;

            case 'minlength':
              return `El campo titulo requiere mínimo ${ errors['minlength'].requiredLength } letras.`;
            break;

          }
        }
      break;

      case 'descripcion':
        for (const key of Object.keys(errors)) {
          switch ( key ) {
            case 'required':
              return 'El campo descripción es requerido';
            break;

            case 'minlength':
              return `El campo descripción requiere mínimo ${ errors['minlength'].requiredLength } letras.`;
            break;

          }
        }
      break;

      case 'img_video':
        for (const key of Object.keys(errors)) {
          switch ( key ) {
            case 'required':
              return 'Es necesario subir una imagen para el video';
            break;
          }
        }
      break;

      case 'video_url':
        for (const key of Object.keys(errors)) {
          switch ( key ) {
            case 'required':
              return 'Es necesario subir un video.';
            break;
          }
        }
      break;

    }

    return null;
  }

  onSubmit():void {
    if ( this.videoForm.invalid ) {
      this.videoForm.markAllAsTouched();
      return;
    }

    if ( this.currentVideo.id ) {
      this.currentVideo.method = 'PATCH';
      this.videosService.updateVideo( this.currentVideo )
        .subscribe({
          next: () => {
            Swal.fire('Actualizado', 'Heroe actualizado correctamente', 'success')
          },
          error: (message) => {
            message = message != '' && message != undefined ? message : 'Ocurrio un error.';
            Swal.fire('Aviso', message , 'info');
          }
        });
        return;
    }

    const { title, descripcion, img_video, video_url } = this.videoForm.value;
    const formData: FormData = new FormData();

    formData.append('title', title);
    formData.append('descripcion', descripcion);
    formData.append('img_video', img_video);
    formData.append('video_url', video_url);

    this.videosService.addVideo( formData )
      .subscribe( video => {
        console.log(video);
        //TODO: mostrar snackbar, navegador a /heroes/Edit heroe.id
        // this.router.navigate(['/heroes/edit', heroe.id]);
        Swal.fire('Guardado', video.message, 'success').then((result) => {
          if (result.isConfirmed) {
            this.videoForm.reset();
            this.previewUrl = null;
            this.previewUrlVideo = null;
          }
        })
      }),
      catchError(error =>
        Swal.fire('Aviso', error, 'info').then((result) => {
          if (result.isConfirmed) {
            this.videoForm.reset();
            this.previewUrl = null;
            this.previewUrlVideo = null;
          }
        })
      )
  }
}
