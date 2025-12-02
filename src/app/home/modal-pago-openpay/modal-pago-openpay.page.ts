import { Component, ElementRef, Injectable, OnInit } from '@angular/core';
import { SweetAlertService } from 'src/services/sweet-alert.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { PaymentService } from 'src/services/payment.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared.module';
import { FormsModule } from '@angular/forms';

declare var OpenPay: any;
@Component({
    selector: 'app-modal-pago-openpay',
    templateUrl: './modal-pago-openpay.page.html',
    styleUrls: ['./modal-pago-openpay.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        SharedModule
    ],
})
export class ModalPagoOpenPayComponent implements OnInit {
    contentHtml!: any;
    contenidoIframe: any;
    urlOpenpay!: SafeResourceUrl;
    constructor(private el: ElementRef,
        public ngxModalRef_: BsModalRef,
        private sanitizer: DomSanitizer,
        public swal: SweetAlertService,
        private route: Router,
        private paymentService: PaymentService,
        private modalController: ModalController
    ) {
    }

    ngOnInit(): void {
        this.contentHtml = JSON.parse(localStorage.getItem('saleData') ?? '[]');
        this.urlOpenpay = this.sanitizer.bypassSecurityTrustResourceUrl(this.contentHtml.urlOpenpay);
        console.log("Se abrió openpay", this.urlOpenpay);
    }

    ngAfterViewInit(): void {
        window.addEventListener('message', (e) => {
            console.log('Llegó un mensaje', e)
            this.receiveMessage(e);
        });

    }
    closeModal(): void {
        this.modalController.dismiss({
            //isConfirmed: false,
            //selectedObjects: this.selectedObjectsFromModal
        });

    }
    receiveMessage = (event: MessageEvent) => {
        this.contentHtml.urlOpenpay = 'undefined';

        this.route.navigate(['/boletos/venta/thankyoupage'], {
            queryParams: { data: JSON.stringify(this.contentHtml.ordenId), origin: this.contentHtml.origin },
        });

        this.closeModal();
    }

}
