import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  private mostrarFooterSource = new BehaviorSubject<boolean>(true);
  mostrarFooter$ = this.mostrarFooterSource.asObservable();

  actualizarVisibilidadFooter(visibilidad: boolean) {
    this.mostrarFooterSource.next(visibilidad);
  }
}
