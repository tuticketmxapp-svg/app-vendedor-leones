import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, IonModal, MenuController, NavController } from '@ionic/angular';
import { SharedModule } from 'src/app/shared.module';
import { CashlessService } from 'src/services/cashless.service';
import { ClientService } from 'src/services/client.service';
import { LottieService } from 'src/services/lottie.service';
import { UserService } from 'src/services/user.service';
import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";


@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    SharedModule,
    CommonModule,
    FormsModule
  ],
})
export class DetalleProductoComponent  implements OnInit {

  @ViewChild('cartModal') cartModal!: IonModal;
  @ViewChild('cantModal') cantModal!: IonModal;
  @ViewChild('cantNModal') cantNModal!: IonModal;

  id_producto: number = 0;
  productoName: string = '';
  productInfo: any = [];
  atributosList: any = [];
  productCount: number = 1;
  inputCount: any;
  prevProductCount: number = 0;
  attributeSelect: any;

  cartList: any = [];

  isFound: boolean = true;
  isLoading: boolean = true;

  constructor( public clientService: ClientService,
    private loaderService: LottieService, 
    private navCtrl: NavController, 
    private route: Router, 
    private router: ActivatedRoute, 
    private cashlessService: CashlessService, 
    private menuCtrl: MenuController, 
    private menu: MenuController, 
    public userService: UserService, ) {

    this.router.queryParams.subscribe(params => {
      this.id_producto = params['id_producto'];
      this.productoName = params['productoName'];
    });

  }

  async verificarHuella() {
    try {
      // Verificar si hay biometría disponible
      const result = await NativeBiometric.isAvailable();

      if (!result.isAvailable) {
        console.log("Biometría no disponible");
        return;
      }

      // Abrir el diálogo de huella/FaceID
      await NativeBiometric.verifyIdentity({
        reason: "Verificación de huella",
        title: "Autenticación",
        subtitle: "Coloca tu huella",
        description: "Verificando identidad",
      });

      alert("Huella detectada correctamente");

    } catch (error) {
      alert("No se detectó la huella o fue incorrecta");
    }
  }


  ngOnInit() {
    this.getProducto();
  }

  
  generateQR() {
  }

  back(){
    this.navCtrl.back();
  }

  goCart(){
    this.cartModal.dismiss();
    this.navCtrl.navigateRoot('home/carrito');
  }

  goStore(){
    this.cartModal.dismiss();
    this.navCtrl.navigateRoot('home');
  }

  async addToCart(){

    let quantity = this.productCount < 1 ? 1 : this.productCount;
    quantity += this.prevProductCount; 

    const product = {
      "product_id": this.productInfo.id,
      "quantity": quantity,
      "atributo": this.attributeSelect,
      "variant_label": this.attributeSelect
    }

    this.loaderService.showLoader();

    this.cashlessService.addToCart(product).subscribe(r => {
      this.loaderService.hideLoader();
      this.prevProductCount = quantity;

      this.cartModal.present();

      this.cashlessService.getCartCount().subscribe((response: any) =>{
          
        this.userService.cartCount = response.cart_count
        localStorage.setItem('cart', response.cart_count);
      });
    });
    
  }

  getProducto(){
    this.atributosList = []
    this.loaderService.showLoader();
    //Carga los detalles del producto
    this.cashlessService.getProductoFiltro(this.productoName).subscribe(r => {
      
      this.productInfo = r.data[0] || [];
      if(this.productInfo.length === 0){
        this.isFound = false;
        this.loaderService.hideLoader();
        return;
      }

      //Obtiene los atributos y los pone a una lista
      const atributes = this.productInfo.atributos;

      atributes.forEach((item: any) => {
        const atributoObject = {
          name: item,
          count: 0,
          isSelected: false,
        }

        this.atributosList.push(atributoObject);
      });

      this.loaderService.hideLoader();
      this.isLoading = false;
      this.selectAttribute(0);

      
      this.cashlessService.getCart().subscribe((r2: any) => {
        
        this.cartList = r2.items.filter((cart: any) => cart.product_id == this.productInfo.id);
        this.loaderService.hideLoader();
        this.isLoading = false;
        this.selectAttribute(0);

      });

    });
  }

  selectCount(opc: number){

    this.cantModal.dismiss();
    this.cantNModal.dismiss();

    if(opc == -1){
      this.cantNModal.present();
      return;
    }

    this.productCount = opc;

    this.atributosList.forEach((atributos: any) => {
      atributos.count = 0;

      if(atributos.isSelected){
        atributos.count = this.productCount;
      }
    });

  }

  verifyAnyProduct(){
    this.productCount = 0;
    this.atributosList.forEach((item: any) => {
      this.productCount += item.count;
    });
  }

  selectAttribute(index: number){

    console.log('list', this.atributosList);

    if(this.atributosList.length > 0){

      this.atributosList.forEach((atributos: any) => {
        atributos.isSelected = false;
      });

      this.atributosList[index].isSelected = true;
      this.attributeSelect = this.atributosList[index].name;
      this.atributosList.count = this.productCount;

    }else{
      this.attributeSelect = "Único"
    }

    const cart = this.cartList.find((cart: any) => cart.atributo == this.attributeSelect);
    this.prevProductCount = cart?.cantidad || 0;
  }

  onSelectProduct(){

    /*this.productInfo.atributeSel = this.attributeSelect;
    this.productInfo.count = this.productCount;
    const products = [{ productInfo: this.productInfo, productSelect: this.atributosList }];*/

    let products: any = [];
    
    products.push({
      imagen: this.productInfo.imagen,
      nombre: this.productInfo.nombre,
      precio: this.productInfo.precio,
      comision: this.productInfo.comision,
      atributo: this.attributeSelect || 'Unico',
      count: this.productCount,
    });


    this.navCtrl.navigateRoot(['home/detalleCompra'], {
      queryParams: { products: JSON.stringify(products), isCart: false },
      state: { from: '/' }
    });
  }
}
