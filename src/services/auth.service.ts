import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public token = '';
  constructor(
    private http: HttpClient,
    private router: Router,
    private cookie: CookieService,
    private errorHandler: ErrorHandlerService
  ) { }

  login(data:any) {
    return this.http.post<any>(`${environment.apiV1}login/web`, data).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  public get currentToken() {
    return this.cookie.get('access_token');
  }
  getAuthToken(): string | null {
    return this.cookie.get('access_token');
  }
  public get userData() {
    return JSON.parse(localStorage.getItem('user_data') ?? '{}');
}
  isLoggedIn(): boolean {
    const acces_token = localStorage.getItem('access_token');
    if(acces_token && acces_token!='undefined'){
      return !!localStorage.getItem('access_token');
    }else{
     return false;
    }
  }
  checkSession(): Observable<boolean> {
    return this.http.get<any>(`${environment.apiV1}client/validateToken`).pipe(
      map(response => {
        // Si el servidor devuelve un objeto de respuesta válido,
        // la sesión es válida
        return true;
      }),
      catchError(error => {
        // Si hay un error al verificar la sesión, 
        // lo manejamos aquí y devolvemos false
        console.error('Error al verificar la sesión:', error);
        return of(false); 
      })
    );
  }
}
