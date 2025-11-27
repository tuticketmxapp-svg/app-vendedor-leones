import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  constructor(
    private http: HttpClient
  ) { }

  getCountries(){
    return this.http.get<any>(`${environment.apiV1}catalogs/countries` ).pipe(map(paises => {
        return paises;
    }));
  }

  getStates(idCountry:number){
    return this.http.get<any>(`${environment.apiV1}catalogs/states/${idCountry}` ).pipe(map(estados => {
        return estados;
    }));
  }

  getCities(idState:number){
    return this.http.get<any>(`${environment.apiV1}catalogs/cities/${idState}` ).pipe(map(ciudades => {
        return ciudades;
    }));
  }
}
