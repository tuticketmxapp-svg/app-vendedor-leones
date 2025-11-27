import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginWebService {
  public token = '';
  constructor(
    private http: HttpClient,
    private cookies: CookieService,
    private errorHandler: ErrorHandlerService
  ) { }

  login(data:any) {
    return this.http.post<any>(`${environment.apiV1}login/web`, data).pipe(
      map(response => {
        if (response && response.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user_id', response.user.id);
          this.cookies.set('access_token', response.access_token, 2, '/');
          this.token = response.access_token;
          localStorage.setItem("access_token", this.token);

        }
        return response;
      })
    );
  }

  register(data:any) {
    return this.http.post<any>(`${environment.apiV1}register/web`, data).pipe(map(result => {
      return result;
    }));
  }
  getCountries() {
    return this.http.get<any>(`${environment.apiV1}catalogs/countries`).pipe(map(paises => {
      return paises;
    }));
  }

  getStates(idCountry:any) {
    const states = localStorage.getItem('states_' + idCountry);
    if (states) {
      const parsedStates = JSON.parse(states);
      return of(parsedStates);
    } else {
      return this.http.get<any>(`${environment.apiV1}catalogs/states/${idCountry}`).pipe(map(estados => {
        localStorage.setItem('states_' + idCountry, JSON.stringify(estados));
        return estados;
      })
      );
    }
  }

  getCities(idState:any) {
    const states = localStorage.getItem('cities_' + idState);
    if (states) {
      const parsedStates = JSON.parse(states);
      return of(parsedStates);
    } else {
      return this.http.get<any>(`${environment.apiV1}catalogs/cities/${idState}`).pipe(map(estados => {
        localStorage.setItem('cities_' + idState, JSON.stringify(estados));
        return estados;
      })
      );
    }
  }
  getMe() {
    return this.http.get<any>(`${environment.apiV1}client/me`).pipe(map(result => {
      localStorage.setItem('user', result.data);
      return result;
    }));
  }
  desasociarMIFEL() {
    return this.http.post<any>(`${environment.apiV1}client/mifel/desasociar`, {}).pipe(catchError(error => this.errorHandler.handleError(error)));

  }
  getPresale() {
    return this.http.get<any>(`${environment.apiV1}presale`).pipe(map(result => {
      return result;
    }));
  }
  getTotalSales() {
    return this.http.get<any>(`${environment.apiV1}client/totalsales`).pipe(map(result => {
      return result;
    }));
  }
  getMifelSales(lastdigits:any) {
    return this.http.get<any>(`${environment.apiV1}client/mifelsales/${lastdigits}`).pipe(map(result => {
      return result;
    }));
  }
  getPresaleMifel() {
    return this.http.get<any>(`${environment.apiV1}presale/mifel`).pipe(map(result => {
      return result;
    }));
  }
  setToken(token: string) {
    this.cookies.set("token", token);
  }
  getToken() {
    return this.cookies.get("token");
  }
  verifyLogin(data:any) {
    return this.http.post<any>(`${environment.apiV1}client/verifyLogin`, data).pipe(map(result => {
      if (result && result.access_token) {
        localStorage.setItem('token', result.access_token);
        localStorage.setItem('user_id', result.user.id);
      }
      return result;
    }));
  }
  validarCodigo(data:any) {
    return this.http.post<any>(`${environment.apiV1}client/verify`, data).pipe(map(result => {
      return result;
    }));
  }
  sentEmailCode(data:any) {
    return this.http.post<any>(`${environment.apiV1}client/sentEmail`, data).pipe(map(result => {
      return result;
    }));
  }
  verificarCorreo(data:any) {
    return this.http.post<any>(`${environment.apiV1}client/verificar-correo`, data).pipe(map(result => {
      return result;
    }));
  }
  verificarCodigoPassword(data:any) {
    return this.http.post<any>(`${environment.apiV1}client/verificar-codigo`, data).pipe(map(result => {
      return result;
    }));
  }
  cambiarContrasena(data:any) {
    return this.http.post<any>(`${environment.apiV1}client/cambiar-contrasena`, data).pipe(map(result => {
      return result;
    }));
  }
}
