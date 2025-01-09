import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environments.baseUrl;
  private http = inject( HttpClient );

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );

  //! Al mundo exterior
  public currentUser = computed( () => this._currentUser() );
  public authStatus = computed( () => this._authStatus() );

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean {

    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );

    if (typeof window === 'undefined') {
      // Si no estamos en el navegador, devolvemos false
      return false;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('user', user.correo);

    return true;
  }

  login( username: string, password: string ): Observable<boolean> {
    const url = `${ this.baseUrl }/auth/login`;
    const body = { username, password };

    return this.http.post<LoginResponse>( url, body )
      .pipe(
        map( ({ user, token }) => this.setAuthentication (user, token )),
        // Todo: Errores
        catchError( err => throwError( () => err ))
      )
  }

  register(formData: FormData): Observable<boolean> {

    const url = `${ this.baseUrl }/auth/register`;
    const body = formData;

    return this.http.post<LoginResponse>( url, body )
      .pipe(
        map( ({ user, token }) => this.setAuthentication (user, token )),
        // Todo: Errores
        catchError( err => throwError( () => err ))
      )
  }

  checkAuthStatus():Observable<boolean> {
    const url = `${ this.baseUrl }/auth/check-token`;

    if (typeof window === 'undefined') {
      // Si no estamos en el navegador, devolvemos false
      return of(false);
    }

    const token = localStorage.getItem('token')?.trim();
    const user = localStorage.getItem('user');

    if ( !token ) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<CheckTokenResponse>(url, {}, { headers })
      .pipe(
        map( ({ user, token }) => this.setAuthentication( user, token)),
        catchError( () => {
          this._authStatus.set( AuthStatus.notAuthenticated );
          return of(false);
        })
      )
  }

  logout(): Observable<boolean> {

    if (typeof window === 'undefined') {
      // Si no estamos en el navegador, devolvemos false
      return of(false);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );
    return of(true);
  }

}
