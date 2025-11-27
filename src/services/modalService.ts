import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalCommunicationService {
  private modalOpenedSource = new Subject<void>();
  private modalClosedSource = new Subject<{ loggedIn: boolean; seleccionados: any[] }>();
  modalClosed$ = this.modalClosedSource.asObservable();
  private modalSelectionSource = new Subject<any[]>();
  modalOpened$ = this.modalOpenedSource.asObservable();
 

  notifyModalOpened(): void {
    this.modalOpenedSource.next();
  }

  notifyModalClosed(loggedIn: boolean, seleccionados: any[]): void {
    this.modalClosedSource.next({ loggedIn, seleccionados });
  }
}
