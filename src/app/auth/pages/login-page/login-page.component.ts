import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private fb = inject( FormBuilder );
  private AuthService = inject( AuthService );
  private router = inject( Router );

  public myForm: FormGroup = this.fb.group({
    username: [ '', [ Validators.required, Validators.email ]],
    password: [ '', [ Validators.required, Validators.minLength(8) ]],
  });

  login(){
    const { username, password } = this.myForm.value;

    this.AuthService.login(username, password)
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
