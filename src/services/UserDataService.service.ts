import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly USER_DATA_KEY = 'user_data';

  // observable para que el menú y otras partes sepan cuando cambia el usuario
  public userSubject$ = new BehaviorSubject<any | null>(this.getUserData());

  /** Guarda datos del usuario (vendedor / cliente) */
  setUserData(user: any): void {
    localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
    this.userSubject$.next(user);
  }

  /** Obtiene los datos del usuario desde localStorage */
  getUserData(): any | null {
    const raw = localStorage.getItem(this.USER_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  /** Limpia datos del usuario */
  clearUserData(): void {
    localStorage.removeItem(this.USER_DATA_KEY);
    this.userSubject$.next(null);
  }

  /** Helpers genéricos, por si los usas en otros lados */
  setItem(key: string, value: any): void {
    localStorage.setItem(
      key,
      typeof value === 'string' ? value : JSON.stringify(value)
    );
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }
}