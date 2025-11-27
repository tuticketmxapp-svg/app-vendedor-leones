import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LottieService {
  private loading: HTMLIonLoadingElement | undefined;

  constructor(private loadingController: LoadingController) {}

  async showLoader() {
    this.loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles',
    });
    await this.loading.present();
  }

  async hideLoader() {
 
    if (this.loading) {
      console.log('Ocultando loader');
      await this.loading.dismiss();
    }
  }
}
