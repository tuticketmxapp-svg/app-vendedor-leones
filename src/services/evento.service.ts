import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventoService {
  public binlistUrl = 'https://lookup.binlist.net/';
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getEvent(id: number) {
    return this.http.get<any>(`${environment.apiV1}events/${id}`).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  getEventURL(url:string) {
    return this.http.get<any>(`${environment.apiV1}eventos/${url}`).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  getEvents(filters: any) {
    let params = '';
    (filters != '') ? params = '?search=' + filters : '';
    return this.http.get<any>(`${environment.apiV1}events${params}`).pipe(map(events => {
      return events
    }));
  }
  listEvent() {
    return this.http.get<any>(`${environment.apiV1}catalogs/curent-events`).pipe(map(result => {
      return result;
    }));
  }
  createEvent(data:any) {
    let token = localStorage.getItem('access_token');
    let token_type = localStorage.getItem('token_type');
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.post<any>(`${environment.apiV1}events`, data, { headers }).pipe(map(event => {
      return event
    }))
  }

  tipeEvent() {
    return this.http.get<any>(`${environment.apiV1}catalogs/event-types`).pipe(map(result => {
      return result;
    }));
  }

  enclosures() {
    return this.http.get<any>(`${environment.apiV1}catalogs/enclosures`).pipe(map(result => {
      return result;
    }));
  }
  currency() {
    return this.http.get<any>(`${environment.apiV1}catalogs/currencies`).pipe(map(result => {
      return result;
    }));
  }
  thema() {
    return this.http.get<any>(`${environment.apiTicketsV1}tikets/thema`).pipe(map(result => {
      return result;
    }));
  }
  statusEvent() {
    return this.http.get<any>(`${environment.apiV1}catalogs/event-status`).pipe(map(result => {
      return result;
    }));
  }
  imagesUpload(files:any) {
    const arrImg = [];
    const formData = new FormData();
    let token = localStorage.getItem('access_token');
    let token_type = localStorage.getItem('token_type');
    const headers = { 'Authorization': `Bearer ${token}` };
    for (const file of [files]) {
      arrImg.push(file);
      formData.append("image", file);
    }
    //return;
    return this.http.post<any>(`${environment.apiV1}images/upload`, formData, { headers }).pipe(
      map((result) => {
        return result;
      })
    );
  }
  eventPlaces() {
    return this.http.get<any>(`${environment.apiV1}catalogs/event-places`).pipe(map(result => {
      return result;
    }));
  }
  curentEvents() {
    return this.http.get<any>(`${environment.apiV1}catalogs/curent-events`).pipe(map(result => {
      return result;
    }));
  }

  getSales() {
    return this.http.get<any>(`${environment.apiV1}events/${'1'}`).pipe(map(response => {
      return response;
    }));
  }
  setSale(data:any) {
    localStorage.setItem('setSale', JSON.stringify(data));
  }
  saleEvent(data:any) {
    let token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}`, 'responseType' :"text" };
    return this.http.post(`${environment.apiV1}sales`, data, { headers, responseType: 'text' }).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  prebook(data:any) {
    let token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}`, 'responseType' :"text" };
    return this.http.post<any>(`${environment.apiV1}salesOpenPay`, data).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  prebookOxxo(data:any) {
    let token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}`, 'responseType' :"text" };
    return this.http.post<any>(`${environment.apiV1}salesOxxo`, data).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  prebookMonedero(data: any) {
    let token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}`, 'responseType' :"text" };
    return this.http.post<any>(`${environment.apiV1}salesMonedero`, data).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  premonedero(data: any) {
    let token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}`, 'responseType' :"text" };
    return this.http.post<any>(`${environment.apiV1}wallet/store-premonedero`, data).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  getCurrentEvents(from:any, to:any) {
    return this.http.get<any>(`${environment.apiV1}catalogs/curent-events?from=${from}&to=${to}`).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  getUpcomingEvents(from:any, to:any) {
    return this.http.get<any>(`${environment.apiV1}events/upcoming?from=${from}&to=${to}`).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  getActiveEvents(channel:any) {
    return this.http.get<any>(`${environment.apiV1}events/active?channel=${channel}`).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  validateCodeEvent(id:any, data:any) {
    return this.http.post<any>(`${environment.apiV1}events/${id}/validatecode`,data).pipe(catchError(error => this.errorHandler.handleAPIError(error)));
  }
  releaseHold($holdToken:any){
    return this.http.post<any>(`${environment.apiV1}seats/hold/release`,{
      holdToken: $holdToken
    }).pipe(catchError(error => this.errorHandler.handleAPIError(error)));
  }
  detectBanck(bin: string): Observable<any> {
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    return this.http.get(`${this.binlistUrl}${bin}`, { headers });
  }
  getBlackList() {
    return this.http.get<any>(`${environment.apiV1}blacklist`).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  getBanner() {
    return this.http.get<any>(`${environment.apiV1}getBannerHomeVentasP`).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
}
