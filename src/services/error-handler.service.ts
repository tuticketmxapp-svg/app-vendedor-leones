import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
  ) {
  }

  private errorsToJson(errors: any) {
    const formattedErrors = Object.entries(errors).map(([key, value]) => {
      const formattedValue = Array.isArray(value) ? value.join(', ') : value;
      return `<li class="fs-6">${key}: ${formattedValue}</li>`;
    }).join('');
    return formattedErrors;
  }
  public codesMessages(code:any, message:any, url:any) {
    let errorMessage = '';
    switch (code) {
      case 401:
        errorMessage = `<div class="fs-6">${message}</div>`;
        break
      case 404:
        errorMessage = `<div class="fs-6">${message}</div>`;
        break
      case 500:
        errorMessage = `<div class="fs-6">${message}</div>`;
        break
      default:
        errorMessage = `<div class="fs-6">${message}</div>`;
        break
    }
    return errorMessage;
  }
  public handleAPIError(error:any) {
    return throwError({
      status: error.status,
      title: error.error.title || '',
      message: error.error.message || ''
    });
  }
  public handleClientError(error: ErrorEvent) {
    return throwError(error);
  }
  public handleError(error: HttpErrorResponse) {
    let errorMessage = '';


    //detectar que es un objeto de items
    if (typeof error.error.errors != 'undefined') {
      if (typeof (error.error.errors) == 'object') {
        errorMessage = this.errorsToJson(error.error.errors);
      }
    } else {
      const url = error.url ? error.url : '';
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        let jsonErro = error.error;
        if(typeof error.error!='object'){
          jsonErro = JSON.parse(error.error);
        }
        let msg = "";
        if (jsonErro) {
          msg = jsonErro.message;
        } else {
          msg = error.error.message ? error.error.message : error.message;
        }
        errorMessage = this.codesMessages(error.status, msg, url);
      }
    }
    // Puedes lanzar una nueva excepción o devolver el error como un Observable
    return throwError(errorMessage);
  }
}
