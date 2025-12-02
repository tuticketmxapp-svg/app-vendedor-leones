import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from 'src/services/error-handler.service';

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
    return this.http.post(`${environment.apiV1}vendor/cart/add`, data);
  }

  removeToCart(product_id: number, atributo: string){
    return this.http.delete(`${environment.apiV1}vendor/cart/${product_id}?atributo=${atributo}`);
  }

  getCartCount(){

    return this.http.get(`${environment.apiV1}vendor/cart/count`);
  }

  getCart(){
    let userStr: any = localStorage.getItem("user_data");
    const userData: any = JSON.parse(userStr);
    return this.http.get(`${environment.apiV1}vendor/cart/${userData.id}`);
  }
}