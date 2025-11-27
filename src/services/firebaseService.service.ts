import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firebase: any;

  constructor() {
    this.firebase = (window as any).firebase;
  }

  getFirebase(): any {
    return this.firebase;
  }
}
