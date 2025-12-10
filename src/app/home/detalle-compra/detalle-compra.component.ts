import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, IonModal, ModalController, NavController } from '@ionic/angular';
import { SweetAlertService } from 'src/services/sweet-alert.service';
import { LocalStorageService } from 'src/services/UserDataService.service';
import { CashlessService } from 'src/services/cashless.service';
import { LottieService } from 'src/services/lottie.service';
import { UserService } from 'src/services/user.service';
import { TerminosPayProductComponent } from '../terminos/terminos.page';
import { CatalogosService } from 'src/services/catalogos.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { NativeBiometric, BiometryType } from "@capgo/capacitor-native-biometric";
import { Capacitor } from '@capacitor/core';
import { SharedModule } from 'src/app/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as CryptoJS from "crypto-js";
declare var OpenPay: any;

@Component({
  selector: 'app-detalle-compra',
  templateUrl: './detalle-compra.component.html',
  styleUrls: ['./detalle-compra.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    SharedModule,
    CommonModule,
    FormsModule,
  ],
})
export class DetalleCompraComponent  implements OnInit {
  @ViewChild('buyModal') buyModal!: IonModal;
  @Input() contentHtml: any; 
  deviceDataId: any;
  countryCode: string | undefined;
  listCountries: any[] | undefined;
  banderaCambioEstado = false;
  listStates: { name: any; }[] | undefined;
  me;
  isCart: boolean = false;

  searchEmail: string = "";
  isSearchEmail: boolean = false;
  isQRconfirm: boolean = false;
  isEfectiveOrTerminal: boolean = false;

  isValidSearchEmail = true;
  isValidName = true;
  isValidEmail = true;
  isValidTelefono = true;
  isValidCalle = true;
  isValidCountry = true;
  isValidState = true;
  isValidCity = true;
  isValidColonia = true;
  isValidCP = true;
  isValidFechaNacimiento = true;

  isValidNameTitular = true;
  isValidTelefonoTitular = true;
  isValidEmailTitular = true;
  isValidConfirmarEmail = true;
  isValidTarjeta = true;
  isValidFV = true;
  isValidCVV = true;

  vendedorData: any = [
    {
      name: "",
      email: ""
    }
  ];
  
  userData: any = [
    {
      abonado: false,
      calle: "",
      ciudad: "Mérida",
      country: "Mexico",
      country_id: null,
      colonia: "",
      cp: "",
      email: "",
      fechaNacimiento: "",
      id: 0,
      invitado: 0,
      mifel: false,
      monedero: "",
      name: "",
      numero: "",
      saldo_monedero: null,  
      state: "Yucatán",
      state_id: null,
      telefono: "",

      isValidNameTitular: '',
      isValidTelefonoTitular: '',
      isValidEmailTitular: '',
      isValidConfirmarEmail: '',
      isValidTarjeta: '',
      isValidFV: '',
      isValidCVV: ''
    }
  ];

  optionsPay = [
    { value: 'openpay', imageUrl: './assets/img/visa_mastercard.png', altText: 'Visa/MasterCard', name: 'Visa/MasterCard' },
    { value: 'monedero', imageUrl: './assets/img/efectivo.png', altText: 'monedero', name: 'monedero' },
  ];

  metodoPago = {
    "monedero": {
        cbase: 0.0,
        cimporte: 0,
        cmeses: {
            3: 0, // 4.8% de comisión para transacciones de 3 meses
            6: 0, // 78% de comisión para transacciones de 6 meses
            9: 0, // 108% de comisión para transacciones de 9 meses
            12: 0, //13.8% de comisión para transacciones de 12 meses
        }
    },
    "terminal": {
        cbase: 0.029,
        cimporte: 2.5,
        cmeses: {
            3: 0.048, // 4.8% de comisión para transacciones de 3 meses
            6: 0.078, // 78% de comisión para transacciones de 6 meses
            9: 0.0108, // 108% de comisión para transacciones de 9 meses
            12: 0.0138, //13.8% de comisión para transacciones de 12 meses
        }
    },
    "efectivo": {
        cbase: 0.020,
        cimporte: 2.0,
        cmeses: {
          3: 0, // 4.8% de comisión para transacciones de 3 meses
          6: 0, // 78% de comisión para transacciones de 6 meses
          9: 0, // 108% de comisión para transacciones de 9 meses
          12: 0, //13.8% de comisión para transacciones de 12 meses
        }
    },
  };
  sumCommision = 0;
  desgloseComision: any;
  totalComision = 0;
  cargoBancario = 0;
  totalCobrar = 0;
  totalCobrarOrg = 0;

  subtotalStr: number = 0;
  totalCobrarStr: number = 0;

  excludeComisionBancaria = 0;
  exerpexcerptcb = 0;
  subtotal: number = 0;
  diablePay: boolean | undefined;

  tarjeta: string = "";
  cvv: string = "";
  fv: string = "";

  plan = 1;
  tasaIVA = 16;

  productPay:any = {
    "metodo_pago": "monedero",
    "origin": "productos",
    "producto_id": 0,
    "user_id": 0,
    "productos": [
      {
        "idProducto": 0,
        "cantidad": 0,
        "iMSI": 0
      }
    ],
    "cliente": {
      "nombre": "",
      "correo": "",
      "telefono": "",
      "tarjeta": {
        "numero": "",
        "exp_month": "",
        "exp_year": "",
        "cvv": ""
      }
    },
  }

  methodPay: string = "monedero";
  products: any = [];
  productSelect: any = [];
  productCount: number = 0;
  private subscription: Subscription = new Subscription();
  

  constructor(private navCtrl: NavController,
    private localStorageService: LocalStorageService,
    private router: ActivatedRoute,
    private alertService: SweetAlertService,
    private cashservice: CashlessService,
    private lottieService: LottieService,
    public userService: UserService,
    private modalController: ModalController,
    private catalogosService: CatalogosService,
    private swal: SweetAlertService,
    private loaderService: LottieService

  ) { 
    const userData: any = this.localStorageService.getItem('user_data')
    this.me = JSON.parse(userData);

    this.router.queryParams.subscribe(params => {
      this.products = JSON.parse(params['products']);
      this.isCart = JSON.parse(params['isCart']);
      console.log(this.products, this.isCart);

      this.verifyAnyProduct();

      this.subtotal = 0;
      
      this.products.forEach((product: any) => {
        
        console.log(`${product.precio} + ${product.count}`);

        this.subtotal += ((product.precio + product.comision) * product.count)
        this.subtotalStr = this.subtotal;
      });
      
      console.log(this.products);
    });
  }

  ngOnInit() {
    this.getCountries();
    const vendorData: any = this.localStorageService.getItem('user_data');
    this.vendedorData = JSON.parse(vendorData);
    console.log(vendorData);

    this.addComisionConIVA(this.methodPay as keyof typeof this.metodoPago, 1, this.subtotal || 0);

    setTimeout(() => {
        // this.chanceCountry('MX');
        
        this.chanceCountry(this.me.country);

        console.log("country: ", this.me.country, this.countryCode);
    }, 2000);
  }
  
  searchClient() {
    this.lottieService.showLoader();
    //Servicio que obtiene los clientes según el filtro

    this.cashservice.getClientesByEmail(this.searchEmail).subscribe(response => {
      
      console.log(response);

      if(response?.id){
        const re = response;
        this.searchEmail = re?.email;

        this.userData.id = re.id;
        this.userData.name = re.name;
        this.userData.email = re.email;
        this.userData.telefono = re.telefono;

        this.isSearchEmail = true;
        this.isValidSearchEmail = true;

      }else{
        if(response.length === 1){
          const re = response[0];
          this.searchEmail = re?.email;

          this.userData.id = re.id;
          this.userData.name = re.name;
          this.userData.email = re.email;
          this.userData.telefono = re.telefono;

          this.isSearchEmail = true;
          this.isValidSearchEmail = true;

        }else{
          this.isSearchEmail = false;
          this.isQRconfirm = false;
          this.alertService.error("El cliente no existe", "El cliente no se encuentra disponible o no existe, intente nuevamente.");
        }

      }

      this.lottieService.hideLoader();

    });
  }

  addComisionConIVA(pasarela: keyof typeof this.metodoPago, meses: number, importe: number) {
        

    let item = this.metodoPago[pasarela];
    let comision = item.cbase;
    const exerpexcerptcb = this.exerpexcerptcb;
    const importeComisioable = importe - exerpexcerptcb;

    let totalPagar = importe;
    let comisionConIVA = 0;

    if (importeComisioable > 0) {
        if ((item as any).cmeses && meses > 1 && (item as any).cmeses[meses] !== undefined) {
            comision += (item as any).cmeses[meses];
        }
        

        const IVA = 1 + this.tasaIVA / 100;
        let resultado = importeComisioable * comision;
        let resultadoRedondeafo = parseFloat(resultado.toFixed(2));
        const numerador = IVA * (resultadoRedondeafo + item.cimporte);
        // const denominador = 1 - (comision * IVA);
        // comision = numerador / denominador;

        // Redondeo la comisión con IVA a 2 decimales
        comisionConIVA = numerador //Math.round(comision * 100) / 100;
        totalPagar = importe + comisionConIVA;

    }

    //this.boleto.total = totalPagar;
    this.desgloseComision = { comision: comisionConIVA, monto: importe };
    this.cargoBancario = comisionConIVA;
    this.totalCobrar = this.desgloseComision.comision + this.desgloseComision.monto;
    this.totalCobrarStr = this.totalCobrar;

    if(this.totalCobrar == 0){
    this.diablePay = true;
    }
    return this.desgloseComision;
  }

  back(){
    this.navCtrl.back();
  }

  verifyAnyProduct(){
    this.productCount = 0;
    this.products.forEach((item: any) => {
      this.productCount += item.count;
    });
  }

  comision() {

    let result = this.addComisionConIVA(this.methodPay as keyof typeof this.metodoPago, 1, this.subtotal || 0);

    this.cargoBancario = result.comision;
    this.totalCobrar = result.comision + result.monto;
    console.log(result);
    if (this.subtotal == 0 || this.subtotal == undefined) {
      this.diablePay = true;
    }
  }

  openBuyModal(){ 

    this.isValidSearchEmail = this.isSearchEmail;

    if(this.isValidSearchEmail){

      this.buyModal.present();
    }
    
  }

  resetEmail(){
    this.userData.id = 0;
    this.searchEmail = "";
    this.isSearchEmail = false;
    this.isQRconfirm = false;
  }

  closeBuyModal(){
    this.buyModal.dismiss();
  }

  formatVal() {
    
    let v = this.fv.replace(/\D/g, '');

    if (v.length > 4) v = v.slice(0, 4);

    if (v.length > 2) {
      v = (Number(v.slice(0, 2)) > 12) ? '12' : v;
      v = v.slice(0, 2) + '/' + v.slice(2);
    }

    this.fv = v;
  }

  async saleProduct(){
    this.closeBuyModal();

    this.loaderService.showLoader();
    const productsL: any = [];
    //Verifica si el cliente se encuentra antes de hacer la compra
    for (const product of this.products) {

      const r = await firstValueFrom(this.cashservice.getProductoFiltro(product.nombre));

      let count = product.count;

      const prod = {
        "idProducto": r.data[0].id,
        "cantidad": count,
        "iMSI": 0,
        "atributo": product.atributo
      };

      productsL.push(prod);

    };

    if(productsL.length > 0){ 

      if(this.methodPay !== "monedero"){

        try {
          // Verifica si hay biometría disponible
          if(Capacitor.getPlatform() !== 'web'){
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
          } 

          this.productPay = {
            "metodo_pago": this.methodPay,
            "origin": "productos",
            "user_id": this.userData.id,
            "productos": productsL,
            "cliente": {
              "nombre": this.userData.name,
              "correo": this.userData.email,
              "telefono": this.userData.telefono,
            },
            "subtotal": this.subtotalStr,
            "comision": this.cargoBancario,
            "total": this.totalCobrarStr,
            "vendedor": {
              id: this.vendedorData.id,
              name: this.vendedorData.name,
              email: this.vendedorData.email
            },
          }
          console.log(this.productPay);
          this.loaderService.hideLoader();

          this.cashservice.saleProduct(this.productPay).subscribe({
                
            next: (rest: any) => {
              
              this.alertService.success("Venta realizada con éxito");
              if(this.isCart){
                console.log("Se limpia el carrito");
                this.cashservice.clearCart().subscribe(r => {
                  
                });
              }

              this.back();
              this.lottieService.hideLoader();
            },
            error: (err)  => {
              this.alertService.error(err.error.error);
              this.lottieService.hideLoader();
            }

          });

        } catch (error) {
          this.alertService.error("Hubo un error al obtener la autenticación", "La huella dactilar o FaceID no coincidieron correctamente, intente nuevamente.");
          this.lottieService.hideLoader();
        }

      }else{
        
        try {
          // Verifica si hay biometría disponible
          if(Capacitor.getPlatform() !== 'web'){
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

          } 

          this.productPay = {
            "metodo_pago": this.methodPay,
            "origin": "productos",
            "user_id": this.userData.id,
            "productos": productsL,
            "cliente": {
              "nombre": this.userData.name,
              "correo": this.userData.email,
              "telefono": this.userData.telefono,
            },
            "subtotal": this.subtotalStr,
            "comision": this.cargoBancario,
            "total": this.totalCobrarStr,
            "vendedor": {
              id: this.vendedorData.id,
              name: this.vendedorData.name,
              email: this.vendedorData.email
            },
          }
        
          this.cashservice.saleProduct(this.productPay).subscribe({
                
            next: (rest: any) => {
              
              this.alertService.success("Venta realizada con éxito");
              if(this.isCart){
                console.log("Se limpia el carrito");
                this.cashservice.clearCart().subscribe(r => {
                  
                });
              }

              this.cashservice.getCartCount().subscribe((response: any) =>{
          
                this.userService.cartCount = response.cart_count
                localStorage.setItem('cart', response.cart_count);
              });

              this.back();
              this.lottieService.hideLoader();

            },
            error: (err)  => {
              this.alertService.error(err.error.error);
              this.lottieService.hideLoader();
            }

          });

        } catch (error) {
          this.alertService.error("Hubo un error al obtener la autenticación", "La huella dactilar o FaceID no coincidieron correctamente, intente nuevamente.");
          this.lottieService.hideLoader();
        }

      }

    }

  }

  chanceCountry(eventOrCountry: Event | { target: { value: string } } | string): void {
    let id;
    let code;

    if ((eventOrCountry as { target: { value: string } }).target) {
        const target = (eventOrCountry as { target: { value: string } }).target;
        const selectedCountry = target.value;

        const selectedcountry = this.listCountries?.find((country: { name: any }) => {
            return country.name === selectedCountry;
        });

        if (selectedcountry) {
            id = selectedcountry.id;
            code = selectedcountry.code;
            this.countryCode = code;

            const selectedId = this.listCountries?.find((country: { id: any }) => country.id === this.me.country_id);
            this.banderaCambioEstado = true;

            if (selectedId) {
                this.countryCode = selectedId;
            }
        }
    } else {
        if (this.me.country == undefined || !this.me.country) {
            id = '142';
            this.countryCode = "MX";
        } else {
            const selectedCountry = this.listCountries?.find((country: { name: any }) => country.name === this.me.country);
            if (selectedCountry) {
                this.countryCode = selectedCountry.code;
                id = selectedCountry.id;
            }
        }
    }

    this.subscription.add(
        this.catalogosService.getStates(id).subscribe((c: any) => {
            this.listStates = c;
        }, (error: string | undefined) => {
            this.swal.error(error);
        })
    );
  }

  getCountries() {
    this.subscription.add(
        this.catalogosService.getCountries().subscribe(c => {
            this.listCountries = c;
        }, error => { this.alertService.error(error); })
    )
  }

  goCart(){
    this.navCtrl.navigateRoot('home/carrito');
  }

  async scanQR(){
    try {
      
      const code = await this.cashservice.scan();

      const key = `${this.userData.id}`;
      const bytes = CryptoJS.AES.decrypt(code, key);
      const plainText = bytes.toString(CryptoJS.enc.Utf8);

      try{
        const scan = JSON.parse(plainText);
        console.log(scan.userId, this.userData.id);
        if(scan.userId === `${this.userData.id}`){
          this.isQRconfirm = true;
        }else{
          this.isQRconfirm = false;
          this.alertService.error("El usuario no coincide", "El usuario no coincide con el cliente agregado, intente nuevamente.");
        }
        
      }catch{
        this.alertService.error("El usuario no coincide", "El usuario no coincide con el cliente agregado, intente nuevamente.");
      }
      
      
    } catch (error) {
      this.isQRconfirm = false;
      this.alertService.error("El usuario no coincide", "El usuario no coincide con el cliente agregado, intente nuevamente.");
    }
  }

  changeOpt(){
    this.isSearchEmail = false;
    this.searchEmail = "";

    this.isEfectiveOrTerminal = this.methodPay != 'monedero';

    if(this.methodPay != 'monedero'){
      this.isEfectiveOrTerminal = true;
      this.isQRconfirm = true;
    }

    this.userData = [
    {
      abonado: false,
      calle: "",
      city: "Mérida",
      country: "Mexico",
      country_id: null,
      colonia: "",
      cp: "",
      email: "",
      fechaNacimiento: "",
      id: 0,
      invitado: 0,
      mifel: false,
      monedero: "",
      name: "",
      numero: "",
      saldo_monedero: null,  
      state: "Yucatán",
      state_id: null,
      telefono: "",

      isValidNameTitular: '',
      isValidTelefonoTitular: '',
      isValidEmailTitular: '',
      isValidConfirmarEmail: '',
      isValidTarjeta: '',
      isValidFV: '',
      isValidCVV: ''
    }];

    this.comision();
  }
}
