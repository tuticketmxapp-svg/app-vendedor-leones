import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  public token = '';
  private countriesSubjec: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  countries$ = this.countriesSubjec.asObservable();
  constructor(
    private http: HttpClient,
  ) { }
  setCountries() {
    const countries = localStorage.getItem('countries');
    if (countries) {
      const parsedCountries = JSON.parse(countries);
      this.countriesSubjec.next(parsedCountries);
      return of(parsedCountries);
    } else {
      return this.http.get<any>(`${environment.apiV1}catalogs/countries`).pipe(
      map(paises => {
        localStorage.setItem('countries', JSON.stringify(paises));
        this.countriesSubjec.next(paises);
        return paises;
      })
      );
    }
  }

  getStates(idCountry: string) {
    const states = localStorage.getItem('states_'+idCountry);
    if (states) {
      const parsedStates = JSON.parse(states);
      return of(parsedStates);
    } else {
      return this.http.get<any>(`${environment.apiV1}catalogs/states/${idCountry}`).pipe(map(estados => {
        localStorage.setItem('states_'+idCountry, JSON.stringify(estados));
        return estados;
      })
      );
    }
  }

  getCities(idState: string) {
    const states = localStorage.getItem('cities_'+idState);
    if (states) {
      const parsedStates = JSON.parse(states);
      return of(parsedStates);
    } else {
      return this.http.get<any>(`${environment.apiV1}catalogs/states/${idState}`).pipe(map(ciudades => {
        localStorage.setItem('cities_'+idState, JSON.stringify(ciudades));
        return ciudades;
      })
      );
    }
  }
}
