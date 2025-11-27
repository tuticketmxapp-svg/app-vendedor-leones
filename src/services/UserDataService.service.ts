import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
    private localStorageChangeSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    localStorageChange$ = this.localStorageChangeSubject.asObservable();
    private userSubject = new BehaviorSubject<any>(null);
    userSubject$ = this.userSubject.asObservable();
    constructor() {
      window.addEventListener('storage', (event) => {
        if (event.storageArea === localStorage) {
          this.localStorageChangeSubject.next(event.key); // Aquí `event.key` puede ser string o null.
        }
      });
    }

  getItem(key: string): any {
    return localStorage.getItem(key);
  }
  setUser(user: any) {
    this.userSubject.next(user);
  }
}
