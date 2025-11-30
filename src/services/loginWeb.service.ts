import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class LoginWebService {
  public token = '';

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
    private errorHandler: ErrorHandlerService
  ) {}

  // =========================================
  // LOGIN VENDEDOR (APP VENDEDOR LEONES)
  // POST /api/v1/vendor/login
  // =========================================
  loginVendor(data: any) {
    return this.http
      .post<any>(`${environment.apiV1}vendor/login`, data)
      .pipe(
        map((resp) => resp),
        catchError((error) => this.errorHandler.handleError(error))
      );
  }


  register(data: any) {
    return this.http
      .post<any>(`${environment.apiV1}register/web`, data)
      .pipe(map((result) => result));
  }

  getCountries() {
    return this.http
      .get<any>(`${environment.apiV1}catalogs/countries`)
      .pipe(map((paises) => paises));
  }

  getStates(idCountry: any) {
    const states = localStorage.getItem('states_' + idCountry);
    if (states) {
      const parsedStates = JSON.parse(states);
      return of(parsedStates);
    } else {
      return this.http
        .get<any>(`${environment.apiV1}catalogs/states/${idCountry}`)
        .pipe(
          map((estados) => {
            localStorage.setItem(
              'states_' + idCountry,
              JSON.stringify(estados)
            );
            return estados;
          })
        );
    }
  }

  getCities(idState: any) {
    const states = localStorage.getItem('cities_' + idState);
    if (states) {
      const parsedStates = JSON.parse(states);
      return of(parsedStates);
    } else {
      return this.http
        .get<any>(`${environment.apiV1}catalogs/cities/${idState}`)
        .pipe(
          map((estados) => {
            localStorage.setItem(
              'cities_' + idState,
              JSON.stringify(estados)
            );
            return estados;
          })
        );
    }
  }

  getMe() {
    return this.http.get<any>(`${environment.apiV1}client/me`).pipe(
      map((result) => {
        // por si lo necesitas todavía
        localStorage.setItem('user', JSON.stringify(result.data));
        return result;
      })
    );
  }

  desasociarMIFEL() {
    return this.http
      .post<any>(`${environment.apiV1}client/mifel/desasociar`, {})
      .pipe(catchError((error) => this.errorHandler.handleError(error)));
  }

  getPresale() {
    return this.http
      .get<any>(`${environment.apiV1}presale`)
      .pipe(map((result) => result));
  }

  getTotalSales() {
    return this.http
      .get<any>(`${environment.apiV1}client/totalsales`)
      .pipe(map((result) => result));
  }

  getMifelSales(lastdigits: any) {
    return this.http
      .get<any>(`${environment.apiV1}client/mifelsales/${lastdigits}`)
      .pipe(map((result) => result));
  }

  getPresaleMifel() {
    return this.http
      .get<any>(`${environment.apiV1}presale/mifel`)
      .pipe(map((result) => result));
  }

  setToken(token: string) {
    this.cookies.set('token', token);
  }

  getToken() {
    return this.cookies.get('token');
  }

  verifyLogin(data: any) {
    return this.http
      .post<any>(`${environment.apiV1}client/verifyLogin`, data)
      .pipe(
        map((result) => {
          if (result && result.access_token) {
            localStorage.setItem('token', result.access_token);
            localStorage.setItem('user_id', result.user.id);
          }
          return result;
        })
      );
  }

  validarCodigo(data: any) {
    return this.http
      .post<any>(`${environment.apiV1}client/verify`, data)
      .pipe(map((result) => result));
  }

  sentEmailCode(data: any) {
    return this.http
      .post<any>(`${environment.apiV1}client/sentEmail`, data)
      .pipe(map((result) => result));
  }

  verificarCorreo(data: any) {
    return this.http
      .post<any>(`${environment.apiV1}client/verificar-correo`, data)
      .pipe(map((result) => result));
  }

  verificarCodigoPassword(data: any) {
    return this.http
      .post<any>(`${environment.apiV1}client/verificar-codigo`, data)
      .pipe(map((result) => result));
  }

  cambiarContrasena(data: any) {
    return this.http
      .post<any>(`${environment.apiV1}client/cambiar-contrasena`, data)
      .pipe(map((result) => result));
  }
}