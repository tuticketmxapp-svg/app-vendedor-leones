import { Injectable } from '@angular/core';
// import Swal from "sweetalert2";
import Swal, { SweetAlertResult } from 'sweetalert2';

export type SweetAlertType = 'success' | 'error' | 'warning' | 'info' |
    'question';
export interface ConfirmOptions {
    title?: string;
    text?: string;
    type?: SweetAlertType | 'info';
    showCancelButton?: boolean;
    confirmButtonColor?: string; // = '#E84042';
    cancelButtonColor?: string; // = '#F7FBFE';
    confirmButtonText?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SweetAlertService {

    constructor() { }

    alert($title = '', $msg = '', $status = '') {
        let title = '';
        let msg = '';
        let statusIcon = '';

        let swalHtml = '';
        if ($title !== '' && $title !== null) {
            title = '<div class="sw-alert-title text-sm-left text-xs-center">'.concat($title).concat('</div>');
        }
        if ($msg !== '' && $msg !== null) {
            msg = '<div class="sw-alert-msg text-sm-left text-xs-center">'.concat($msg).concat('</div>');
        }
        switch ($status) {
            case 'success':
                statusIcon = '';
                break;
            case 'info':
                statusIcon = '';
                break;
            case 'warning':
                statusIcon = '';
                break;
            case 'error':
                statusIcon = '';
                break;
            case 'question':
                statusIcon = '';
                break;
            default:
                statusIcon = '';
                break;
        }
        if (statusIcon !== '') {
            swalHtml = '<div class="row"><div class="col-xs-12 col-sm-4 d-flex align-self-stretch align-items-center justify-content-center sw-alert-icon">'.concat(statusIcon).concat('</div><div class="col-xs-12 col-sm-8 d-flex flex-column justify-content-center">').concat(title).concat(msg).concat('</div></div>');
        } else {
            swalHtml = '<div class="row">'.concat('<div class="col-12 d-flex flex-column justify-content-center">').concat(title).concat(msg).concat('</div></div>');
        }
        Swal.fire({
            html: swalHtml,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#E9610B'
        });
    }
    success($title = '', $msg = '') {
        Swal.fire({
            title: $title,
            html: '<div>' + $msg + '</div>',
            icon: 'success',
            confirmButtonText: 'Aceptar',

            confirmButtonColor: '#E9610B'
        });
    }
    warning($title = '', $msg = '') {
        Swal.fire({
            title: $title,
            html: $msg,
            icon: 'warning',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#E9610B'
        });
    }
    error($title = '', $msg = '', data = null) {
        let title = '';
        let msg = '';
        if ($title !== '' && $title !== null) {
            title = $title;
        }
        if ($msg !== '' && $msg !== null) {
            msg = '<div class="text-center">'.concat($msg).concat('</div>');
        }
        Swal.fire({
            icon: 'error',
            title: title,
            html: msg,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#E84042'
        });
    }
    info($title = '', $msg = '') {
        let title = '';
        let msg = '';

        if ($title !== '' && $title !== null) {
            title = $title;
        }
        if ($msg !== '' && $msg !== null) {
            msg = '<div class="text-center">'.concat($msg).concat('</div>');
        }
        Swal.fire({
            title: title,
            html: msg,
            icon: 'info',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#E84042'
        });
    }
    question($title = '', $msg = '') {
        let title = '';
        let msg = '';
        let statusIcon = '';
        let swalHtml = '';

        if ($title !== '' && $title !== null) {
            title = '<div class="sw-alert-title text-sm-left text-xs-center">'.concat($title).concat('</div>');
        }
        if ($msg !== '' && $msg !== null) {
            msg = '<div class="sw-alert-msg text-sm-left text-xs-center">'.concat($msg).concat('</div>');
        }
        statusIcon = '<div class="swal2-icon swal2-question swal2-animate-question-icon" style="display: flex;"><span class="swal2-icon-text">?</span></div>';
        swalHtml = '<div class="row"><div class="col-xs-12 col-sm-4 d-flex align-self-stretch align-items-center justify-content-center sw-alert-icon">'.concat(statusIcon).concat('</div><div class="col-xs-12 col-sm-8 d-flex flex-column justify-content-center">').concat(title).concat(msg).concat('</div></div>');
        Swal.fire({
            html: swalHtml,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#E84042'
        });

    }
    toast($text = '', $type: SweetAlertType = 'success') {
        const toast = Swal.mixin({
            toast: true, position:
                'top-end',
            showConfirmButton: false,
            title: '',
            timer: 3000
        });
        toast.fire({
            icon: $type,
            text: $text
        });
    }
    toastFull($title = '', $text = '', $type: SweetAlertType = 'success') {
        const toast = Swal.mixin({
            toast: true, position:
                'top-end',
            showConfirmButton: false,
            title: $title,
            timer: 3000
        });
        toast.fire({
            icon: $type,
            title: $title,
            text: $text
        });
    }
    confirm(options: ConfirmOptions, callback: (result: SweetAlertResult) => void): void {
        Swal.fire({
            title: options.title,
            html: options.text,
            icon: options.type,
            showCancelButton: options.showCancelButton || true,
            confirmButtonColor: '#E84042',
            cancelButtonColor: '#bdc3c7',
            confirmButtonText: options.confirmButtonText
        }).then((result: SweetAlertResult) => {
            if (result.isConfirmed) {  // `isConfirmed` es lo adecuado para confirmar la acción
                callback(result); // Pasa todo el objeto result, no solo `result.value`
            }
        });
    }

    closeSwal() {
        Swal.close();
    }



} 