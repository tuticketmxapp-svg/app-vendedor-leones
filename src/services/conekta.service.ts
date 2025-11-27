import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConektaService {

  constructor(private http: HttpClient) { }

  createPaymentLink(body: any): Observable<any> {
    const headers = new HttpHeaders({
      accept: 'application/vnd.app-v2.1.0+json',
      'Accept-Language': 'es',
      'content-type': 'application/json',
      authorization: `Basic ${btoa(environment.authorizationConekta + ':')}`, 
    });
    return this.http.post<any>(environment.apiConekta, body, { headers });
  }


  enviarDatos(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${environment.apiV1}pagos/chargeConekta`, data, { headers });
  }
}
