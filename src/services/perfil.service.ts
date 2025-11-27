import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getUser(idUser:number){
    return this.http.get<any>(`${environment.apiV1}client/perfil`).pipe(map(result => {
        localStorage.setItem('user', result.data);
        return result;
      }));
  }
  me(){
    return this.http.get<any>(`${environment.apiV1}client/me`).pipe(map(result => {
        return result;
      }));
  }
  updateUser(id:number,data:any){
    return this.http.put<any>(`${environment.apiV1}client/update-profile`, data).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  checkBin(data:any){
    return this.http.post<any>(`${environment.apiV1}client/mifel/checkbin`, data).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  verifiCard(data:any){
    return this.http.post<any>(`${environment.apiV1}client/mifel/verificar`, data).pipe(catchError(error => this.errorHandler.handleError(error)));
  }





}
