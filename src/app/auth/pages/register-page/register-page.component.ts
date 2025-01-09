import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {

  private fb = inject( FormBuilder );
  private authService = inject( AuthService );
  private router = inject( Router );

  public previewUrl: string | ArrayBuffer | null = null;

  public registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, ]],
    lastname: ['', [Validators.required, ]],
    username: ['', [Validators.required, ]],
    email: ['', [Validators.required, Validators.email]],
    password: [ '', [ Validators.required, Validators.minLength(8) ]],
    img_user: [null, [Validators.required, ]],
  });

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Por favor, seleccione un archivo de imagen.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
        this.registerForm.patchValue({ img_user: file });
        this.registerForm.get('img_user')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  register() {

    // if (this.registerForm.invalid) {
    //   alert('Por favor, complete todos los campos correctamente.');
    //   return;
    // }

    const { name, lastname, username, email, password, img_user } = this.registerForm.value;

    // Crear el FormData
    const formData: FormData = new FormData();

    formData.append('name', name);
    formData.append('lastname', lastname);
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('img_user', img_user);

    this.authService.register(formData)
          .subscribe({
            next: () => this.router.navigateByUrl('/dashboard'),
            error: (message) => {
              console.log(message.error.message);
              let mensaje = message.error.message;
              Swal.fire('Aviso', mensaje, 'info')
            }
          })
  }

}
