import { Injectable } from '@angular/core';

declare const FB: any;
@Injectable({
  providedIn: 'root'
})
export class FacebookAuthService {

  constructor() {
    this.initFacebookSdk();
  }

  private initFacebookSdk(): void {
    (window as any).fbAsyncInit = () => {
      FB.init({
        appId: '711860661104318',
        cookie: true,
        xfbml: true,
        version: 'v14.0',
      });
    };
  
    // Verificar la existencia del script antes de agregarlo
    if (!document.getElementById('facebook-jssdk')) {
      const js = document.createElement('script');
      js.id = 'facebook-jssdk';
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
  
      const fjs = document.getElementsByTagName('script')[0];
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
    }
  }
  

  public checkLoginStatus(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.getLoginStatus((response: any) => {
        resolve(response);
      });
    });
  }
  public loginWithFacebook(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.login((response: any) => {
        if (response.authResponse) {
          resolve(response);
        } else {
          reject('Inicio de sesión cancelado por el usuario.');
        }
      }, {scope: 'public_profile,email'});
    });
  }
}
``
