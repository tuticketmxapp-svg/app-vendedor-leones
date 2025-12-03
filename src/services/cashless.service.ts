import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from 'src/services/error-handler.service';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';

@Injectable({
  providedIn: 'root'
})
export class CashlessService {

    constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getCategoriaConProductos() {
    return this.http.get<any>(`${environment.apiV1}categories_prod/categorias-con-productos`).pipe(catchError(error => this.errorHandler.handleError(error)));
  }

  getProductoFiltro(filters: any) {
    let params = '';
    (filters != '') ? params = '?nombre=' + filters : '';
    return this.http.get<any>(`${environment.apiV1}stock_products/getProducts${params}`).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
  
  saleProduct(data: any){
    return this.http.post(`${environment.apiV1}venta_cash/crear_venta`, data);
  }

  addToCart(data: any){
    let token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}`, 'responseType' :"text" };
    return this.http.post(`${environment.apiV1}vendor/cart/add`, data, {headers: headers});
  }

  removeToCart(product_id: number, atributo: string){
    let token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}`, 'responseType' :"text" };
    return this.http.delete(`${environment.apiV1}vendor/cart/${product_id}?atributo=${atributo}`, {headers});
  }

  getCartCount(){
    let token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}`, 'responseType' :"text" };
    return this.http.get(`${environment.apiV1}vendor/cart/count`, {headers});
  }

  getCart(){
    let token = localStorage.getItem('access_token');
    const headers = { 'Authorization': `Bearer ${token}`, 'responseType' :"text" };
    return this.http.get(`${environment.apiV1}vendor/cart`, {headers});
  }

  async scan(val?: number){
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: val || 17,
        cameraDirection: 1
      });

      return result.ScanResult;
    } catch (error) {
      throw error;
    }
  }

  getClientesByEmail(data: any) {
      return this.http.get<any>(`${environment.apiV1}clientes/buscar-email?q=${data}`).pipe(catchError(error => this.errorHandler.handleError(error)));
  }
}