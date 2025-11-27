import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { throwError } from 'rxjs';
export interface PaginatedData {
    items: any[];
    totalItems: number;
    pageSize: number;
    pageIndex: number;
    last_page: number;
    next_page_url: number;
    prev_page_url: number;

  }
@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private infoMultiple: any;
    constructor(
        private http: HttpClient,
        private errorHandler: ErrorHandlerService
    ) { }
    getEventUpcomming(page: any,user: any) {
        return this.http.get<any>(`${environment.apiV1}client/events/upcomming?page=${page}`).pipe(catchError(error => this.errorHandler.handleError(error)));
    }
    getTicketsAbonados(currentPage: number, idUser: string | null) {
        return this.http.get<any>(`${environment.apiV1}client/events/abonados`).pipe(catchError(error => this.errorHandler.handleError(error)));
    }
    getEventPast(page: any, idUser: string | null) {
        return this.http.get<any>(`${environment.apiV1}client/events/past?page=${page}`).pipe(catchError(error => this.errorHandler.handleError(error)));
    }
    getInfoSale(id: any){
        return this.http.get<any>(`${environment.apiV1}client/sales/${id}`).pipe(catchError(error => this.errorHandler.handleError(error)));
    }
    downloadTicket(id: any){
        return this.http.post<any>(`${environment.apiV1}cliente/ticket/${id}/download`, id).pipe(map(event => {
            return event
          }))
    }
    getPDF2(data: any) {
        return this.http.post<any>(`${environment.apiTicketsV1}tickets/pdf2`, data).pipe(catchError(error => this.errorHandler.handleError(error)))
      }

}
