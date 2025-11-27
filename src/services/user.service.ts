import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { throwError } from 'rxjs';

export interface UserPostData {
  name: string,
  username: string,
  email: string,
  password: string,
  rpassword?: string,
  roles?: string[],
  profiles?: string[]
}
@Injectable({
  providedIn: 'root'
})
export class UserService {

  public cartCount = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookie: CookieService
  ) { }
  list() {
    return this.http.get<any>(`${environment.apiV1}users`).pipe(map(user => {
      return user;
    }))
  }
  create(data: UserPostData) {
    return this.http.post<any>(`${environment.apiV1}users`, data).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let msg = 'Ha ocurrido un error, por favor intente más tarde.';
    if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        console.error('Error:', error.error.message);
    } else if (typeof error.error.errors !== 'undefined') {
        const listErrors = Object.values(error.error.errors) as string[][];
        listErrors.forEach((item) => {
            msg = item[0]; // Accedemos al primer mensaje del error
        });
    } else if (typeof error.error.exception !== 'undefined') {
        msg = error.error.message;
    }
    return throwError(() => new Error(msg));
}

  createCard(data:any) {
    return this.http.post<any>(`${environment.apiV1}pagos/save_customer_card`, data).pipe(catchError(this.handleError));
  }
  getCardsClient (){
    return this.http.get<any>(`${environment.apiV1}pagos/cards/client`).pipe(map(cards => {
      return cards;
    }))
  }
  asociarMonedero(userId: number) {
    return this.http.post<any>(`${environment.apiV1}asociar-monedero/${userId}`, {});
  }
}
