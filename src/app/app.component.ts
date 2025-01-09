import { Component, computed, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';
import { AuthStatus } from './auth/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  private authService = inject( AuthService );
  private router = inject( Router );

  public finishedAuthCheck = computed<boolean>( () => {


    if ( (this.authService.authStatus() === AuthStatus.checking) || (this.authService.authStatus() === AuthStatus.notAuthenticated) ) {
      return false;
    }
    return true;
  });
}
