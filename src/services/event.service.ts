import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private userUpdatedSource = new Subject<void>();

  userUpdated$ = this.userUpdatedSource.asObservable();

  emitUserUpdated() {
    this.userUpdatedSource.next();
  }
}
