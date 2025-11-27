import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
declare var OpenPay: any;

@Injectable({
    providedIn: 'root'
})
export class PaymentService {
    constructor(private http: HttpClient,
        private errorHandler: ErrorHandlerService) {
        OpenPay.setId(environment.OpenPay.Id);
        OpenPay.setApiKey(environment.OpenPay.ApiKey);
        OpenPay.setSandboxMode(environment.OpenPay.SandboxMode);
    }

    extractFormAndCreate(formObject: any, successCallback: any, errorCallback: any): void {
        OpenPay.token.extractFormAndCreate(formObject, successCallback, errorCallback);
    }
    charge(data:any) {
        return this.http.post<any>(`${environment.apiV1}pagos/charge`, data).pipe(catchError(error => this.errorHandler.handleError(error)));
    }
    sendEmail(data:any) {
        return this.http.post<any>(`${environment.apiV1}pagos/enviaBoletos`, data).pipe(catchError(error => this.errorHandler.handleError(error)));
    }
    secure(data:any){
        return this.http.post<any>(`${environment.secure}openpayresponse`,data).pipe(catchError(error => this.errorHandler.handleError(error)));
    }
}