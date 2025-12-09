import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal, NavController, ToastController } from '@ionic/angular';
import { SharedModule } from 'src/app/shared.module';
import { CashlessService } from 'src/services/cashless.service';
import { LottieService } from 'src/services/lottie.service';
import { UserService } from 'src/services/user.service';
declare var OpenPay: any;
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    SharedModule,
    CommonModule,
    FormsModule,
  ],
})
export class CarritoComponent implements OnInit {

  @ViewChild('cantModal') cantModal!: IonModal;
  @ViewChild('cantNModal') cantNModal!: IonModal;

  cartList:any = [];
  subtotal: number = 0;
  total: number = 0;
  descuento: number = 0;
  isLoading: boolean = true;
  inputCount: any;

  cartIndex = 0;

  constructor(
  private navCtrl: NavController,
  private cashlessService: CashlessService,
  private loaderService: LottieService, 
  private toastCtrl: ToastController,
  public userService: UserService
  ) { }

  ngOnInit(): void {
    this.getCart();
  }

  back(){
    this.navCtrl.back();
  }

  goStore(){
    this.navCtrl.navigateRoot('home');
  }

  getCart(){

    this.loaderService.showLoader();
    this.isLoading = true;
    //Carga los detalles del producto
    this.cashlessService.getCart().subscribe((r: any) => {
      this.isLoading = false;
      this.loaderService.hideLoader();

      console.log(r || []);
      this.cartList = r.items || [];
      
      this.calculateTotal();
    });
  }

  calculateTotal(){

    this.total = 0;
    this.subtotal = 0;

    this.cartList.forEach((cart: any) => {

      this.total += (cart.precio + cart.comision) * cart.cantidad;
      this.subtotal += (cart.precio + cart.comision) * cart.cantidad;

    });
  }

  openCant(i: number){
    this.cartIndex = i;
    console.log(this.cartIndex);
    this.cantModal.present();
  }

  selectCount(opc: number){

    this.cantModal.dismiss();
    this.cantNModal.dismiss();

    if(opc == -1){
      this.cantNModal.present();
      return;
    }

    const product = {
      "product_id": this.cartList[this.cartIndex].product_id,
      "quantity": opc,
      "atributo": this.cartList[this.cartIndex].atributo,
      "variant_label": this.cartList[this.cartIndex].atributo,
    }

    this.loaderService.showLoader();

    this.cashlessService.addToCart(product).subscribe(r => {
      this.cartList[this.cartIndex].cantidad = opc;
      this.loaderService.hideLoader();
      this.calculateTotal();

      this.cashlessService.getCartCount().subscribe((response: any) =>{
          
        this.userService.cartCount = response.cart_count
        localStorage.setItem('cart', response.cart_count);
      });
    });

    
  }

  removeCart(cart: any){
    this.cashlessService.removeToCart(cart.product_id, cart.atributo).subscribe(r => {
      this.showToast("Se ha eliminado el carrito correctamente");
      this.getCart();
    });
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
  }

  salesProduct(){
    /*this.productInfo.atributeSel = this.attributeSelect;
    this.productInfo.count = this.productCount;*/ 
    let products: any = [];

    this.cartList.forEach((cart:any) => {
      
      products.push({
        imagen: cart.imagen,
        nombre: cart.nombre,
        precio: cart.precio,
        comision: cart.comision,
        atributo: cart.atributo,
        count: cart.cantidad,
      });

    });    

    this.navCtrl.navigateRoot(['home/detalleCompra'], {
      queryParams: { products: JSON.stringify(products), isCart: true },
      state: { from: '/' }
    });
  }
}
