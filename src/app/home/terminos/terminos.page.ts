import { Component, OnInit } from '@angular/core';
import { ModalPagoOpenPayComponent } from 'src/app/home/modal-pago-openpay/modal-pago-openpay.page';
import { EventoService } from 'src/services/evento.service';
import { PaymentService } from 'src/services/payment.service';
import { SweetAlertService } from 'src/services/sweet-alert.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LottieService } from 'src/services/lottie.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CashlessService } from 'src/services/cashless.service';
import { SharedModule } from 'src/app/shared.module';

declare var OpenPay: any;
@Component({
  selector: 'app-terminosPay',
  templateUrl: './terminos.page.html',
  styleUrls: ['./terminos.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
  ],
})
export class TerminosPayProductComponent implements OnInit {
  contentHtml:any;

  constructor(public ngxModalRef_: BsModalRef,
    private eventoService: EventoService,
    public ngxModalRef: BsModalRef,
    public ngxModalService: BsModalService,
    private alertService: SweetAlertService,
    private paymentService: PaymentService,
    private loaderService: LottieService,
    private route: Router,
    private modalController: ModalController,
    private cashService: CashlessService
  ) { }

  ngOnInit(): void {
    console.log('this.contentHtml',this.contentHtml);
  }
  closeModal(): void {
    this.modalController.dismiss({
     
    });
  }
  ngAfterViewInit(): void {
  }
  cerrarModal() {
    this.ngxModalRef.hide();
  }
  saleProduct() {
    this.loaderService.showLoader();

    console.log("Se pagó", this.contentHtml);
    
    this.cashService.saleProduct(this.contentHtml).subscribe((r:any) => {
      this.contentHtml.ordenId = r.venta_id;
      this.contentHtml.total = r.resumen.total_compra;
      this.loaderService.hideLoader();
      console.log("Env:", this.contentHtml);
      this.tokenOpepay(this.contentHtml);
    },
      (err) => {
        this.loaderService.hideLoader();
        this.alertService.error(err);
      }
    );
  }
  tokenOpepay(data: { formObject: any; }) {
    OpenPay.token.create(data.formObject, (response: any) => {
      console.log('response',response);
      this.SuccessCallback(response);

    }, (error: any) => {
      this.loaderService.hideLoader();
      if (error.data) {
        //this.alertService.error("Error", error.data.description);
        this.ErrorCallback(error.data.description);
      } else {
        //this.alertService.error("Error", error.description);
        this.ErrorCallback(error.data.description);
      }
    });
  }
  async SuccessCallback(response: any): Promise<void> {
    //this.loaderService.showLoader();
    const modals = document.querySelectorAll('ion-modal'); 
    const firstModal = modals[0] as any; // Obtiene el primer modal abierto
    await firstModal.dismiss();

    this.closeModal();
    console.log('this.contentHtml',this.contentHtml)
    var json = {
      'source_id': response.data.id,
      'method': 'card',
      'amount': this.contentHtml.total.toString(),
      'description': this.contentHtml.ordenId + '- Compra producto',
      'device_session_id': this.contentHtml.device_session_id,
      'order_id': this.contentHtml.ordenId,
      'id': this.contentHtml.ordenId,
      'name': this.contentHtml.cliente.nombre,
      'last_name': this.contentHtml.cliente.nombre,
      'phone_number': this.contentHtml.cliente.telefono,
      'email': this.contentHtml.cliente.correo,
      'status': 'CO',
      "use_3d_secure": true,
      "user_id": this.contentHtml.user_id,
      'payments': this.contentHtml.msi || 1,
      'origin': "product"
    };
    console.log('json',json)
    this.paymentService.charge(json).subscribe(async (r) => {
      console.log('r',r);
      this.loaderService.hideLoader();
      if (r.status == '200') {
        this.loaderService.hideLoader();
        delete this.contentHtml.formObject;
        var jsonThank = {
          'email_titular': this.contentHtml.cliente.correo,
          'ordenId': this.contentHtml.ordenId,
          'descriptionEvento': this.contentHtml.ordenId + '- Compra producto',
          'event_date': this.contentHtml.event_date,
          'event_time': this.contentHtml.event_time,
          'enclosure_name': this.contentHtml.enclosure_name,
          'long_description': this.contentHtml.long_description,
          'tickets': this.contentHtml.tickets,
          'subtotal': this.contentHtml.subtotal,
          'comision': this.contentHtml.comision,
          'total': this.contentHtml.total,
          'image_event_online': this.contentHtml.image_event_online,
          'urlOpenpay': r.charge,
          'urlOxxo': '',
          'monedero':this.contentHtml.monedero,
          'origin': "product"
        }
        localStorage.setItem("saleData", JSON.stringify(jsonThank));

        // const modalOptions: ModalOptions = {
        //   initialState: { contentHtml: jsonThank },
        //   class: 'modal-md', backdrop: 'static', keyboard: false,
        // }
        // this.ngxModalRef_.hide();
        // this.ngxModalRef = this.ngxModalService.show(ModalPagoOpenPayComponent, modalOptions);
        // this.ngxModalRef?.onHidden?.subscribe((response) => {
        // });

        const modal = await this.modalController.create({
          component: ModalPagoOpenPayComponent,
          componentProps: {
            contentHtml: jsonThank
          }
        });
        await modal.present();
        modal.onDidDismiss().then((data) => {

        });
      } else {
        this.loaderService.hideLoader();
        this.cerrarModal();
        this.ErrorCallback(r);
      }

      //this.swal.success("", r.message);

    },
      (err) => {
        const mensaje = err.replace(/<[^>]*>/g, '').trim();
        this.alertService.error(mensaje);
        this.loaderService.hideLoader();
        this.cerrarModal();
        this.ErrorCallback(err);
      }
    );
  }
  ErrorCallback(response: any): void {
    let month;
    var regex = /expiration_month (\d+)/;
    var coincidencias = response.match(regex);
    if (coincidencias && coincidencias.length > 1) {
      month = coincidencias[1];

    }
    if (response == 'The expiration date has expired') {
      response = 'La fecha de vencimiento ha expirado.'
    }
    if (response.startsWith("expiration_month")) {
      response = 'El mes de vencimiento' + ' ' + month + ' ' + 'no es válido, los meses de vencimiento válidos son del 01 al 12.';
    }
    var nombreCompleto = this.contentHtml.nombre_titular;
    var partes = nombreCompleto.split(" ");
    var nombre = partes[0];
    var apellidos = partes.slice(1).join(" ");
    if (partes.length > 2) {
      nombre = partes[0] + " " + partes[1];
      apellidos = partes.slice(2).join(" ");
    }
    this.alertService.error(response);

  }
  envioEmail(data: any) {
    this.paymentService.sendEmail(data).subscribe((r) => {
    },
      (err) => {
        this.alertService.error("", err.message);

      }
    );

  }

}
