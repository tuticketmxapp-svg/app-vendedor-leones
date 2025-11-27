import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { throwError } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class BoletosService {
    private infoMultiple: any;
    constructor(
        private http: HttpClient,
        private errorHandler: ErrorHandlerService
    ) { }

    getHolToken() {
        return this.http.get<any>(`${environment.apiV1}seats/holdToken`).pipe(catchError(error => this.errorHandler.handleError(error)));
    }
    hold($data: any) {
        return this.http.post<any>(`${environment.apiV1}seats/hold`, $data).pipe(catchError(error => this.errorHandler.handleError(error)));
    }
    setSale(data: any, holdToken: any) {
        localStorage.setItem('setSale-' + holdToken, JSON.stringify(data));
    }
    thema() {
        return this.http.get<any>(`${environment.apiTicketsV1}tickets/thema`).pipe(catchError(error => this.errorHandler.handleError(error)));
    }
    setEvent(data: any, holdToken: any) {
        localStorage.setItem('setEvent-' + holdToken, JSON.stringify(data));
    }
    saleEvent(data: any) {
        let token = localStorage.getItem('access_token');
        const headers = { 'Authorization': `Bearer ${token}`, 'responseType': "text" };

        return this.http.post(`${environment.apiV1}sales`, data, { headers, responseType: 'text' });

    }
    setMultiple(data: any) {
        this.infoMultiple = data;
    }
    getMultiple() {
        return this.infoMultiple;
    }
    confirmAbonados($data: any) {
        return this.http.post<any>(`${environment.apiV1}sales/confirmarAsiento`, $data).pipe(catchError(error => this.errorHandler.handleError(error)));
    }
}
