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

  public previewUrl: string | undefined = undefined; // Única previsualización para imagen y vídeo
  isLoadingVideo: boolean = false; // Estado de carga del vídeo

  private fb = inject( FormBuilder );

  public videoForm: FormGroup = this.fb.group({
    id: new FormControl<number>(0, { nonNullable: true}),
    title: ['', [Validators.required, Validators.maxLength(50) ]],
    descripcion: ['', [Validators.required, Validators.maxLength(200) ]],
    img_video: [null, [Validators.required ]],
    video_url: [null, [Validators.required ]],
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
        alert('El archivo es demasiado grande. Seleccione un archivo menor a 100 MB.');
        return;
      }

      if (type === 'image' && !file.type.startsWith('image/')) {
        alert('Por favor, seleccione un archivo de imagen.');
        return;
      } else if (type === 'video' && !file.type.startsWith('video/')) {
        alert('Por favor, seleccione un archivo de vídeo válido (MP4, WebM, OGG).');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.previewUrl = reader.result; // Solo asigna cadenas de texto
          if (type === 'image') {
            this.videoForm.patchValue({ img_video: file });
          } else if (type === 'video') {
            this.videoForm.patchValue({ video_url: file });
          }
        }
      };

      reader.onerror = () => {
        alert('Error al cargar el archivo. Inténtelo nuevamente.');
      };

      reader.readAsDataURL(file);
    }
  }

  isValidField(field: string): boolean | null {
    return this.videoForm.controls[field].errors
      && this.videoForm.controls[field].touched;
  }

  getFieldError(field: string): string | null {
    if (!this.videoForm.controls[field]) return null;

    const errors = this.videoForm.controls[field].errors || {};

    if (errors['required']) {
      if (field === 'title') return 'El campo título es requerido';
      if (field === 'descripcion') return 'El campo descripción es requerido';
      if (field === 'img_video') return 'Es necesario subir una imagen para el video';
      if (field === 'video_url') return 'Es necesario subir un video.';
    }

    if (errors['maxlength']) {
      const maxLength = errors['maxlength'].requiredLength;
      return `El campo ${field} puede tener como máximo ${maxLength} caracteres.`;
    }

    return null;
  }

  onSubmit():void {

    if ( this.videoForm.invalid ) {
      this.videoForm.markAllAsTouched();
      return;
    }

    if ( this.currentVideo.id ) {
      const { id, title, descripcion, img_video, video_url } = this.videoForm.value;
      const formDataEdit: FormData = new FormData();

      formDataEdit.append('id', id);
      formDataEdit.append('title', title);
      formDataEdit.append('descripcion', descripcion);
      formDataEdit.append('estatus', 'true');

      // Asegúrate de agregar el campo `img_video` siempre
      if (typeof img_video === 'object' && img_video instanceof File) {
        formDataEdit.append('img_video', img_video); // Archivo seleccionado
      } else {
        formDataEdit.append('img_video', new Blob([""], { type: "text/plain" })); // Placeholder vacío
      }

      // Si no hay un nuevo archivo seleccionado para img_video
      if (typeof video_url === 'object' && video_url instanceof File) {
        formDataEdit.append('video_url', video_url); // Archivo seleccionado
      } else {
        formDataEdit.append('video_url', new Blob([""], { type: "text/plain" })); // Placeholder vacío
      }

      console.log('Contenido del FormData:');
      formDataEdit.forEach((value, key) => {
        console.log(key, value);
      });

      this.videosService.updateVideo( this.currentVideo, formDataEdit )
        .subscribe({
          next: () => {
            Swal.fire('Actualizado', 'Video actualizado correctamente', 'success')
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
        Swal.fire('Guardado', video.message, 'success').then((result) => {
          if (result.isConfirmed) {
            this.videoForm.reset();
            this.previewUrl = '';
          }
        })
      }),
      catchError(error =>
        Swal.fire('Aviso', error, 'info').then((result) => {
          if (result.isConfirmed) {
            this.videoForm.reset();
            this.previewUrl = '';
          }
        })
      )
  }
}
