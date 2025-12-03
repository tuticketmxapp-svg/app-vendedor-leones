import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CashlessService } from 'src/services/cashless.service';
import { LottieService } from 'src/services/lottie.service';
import { Router } from '@angular/router';
import { IonModal, MenuController, NavController } from '@ionic/angular';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  @ViewChild('scanModal') scanModal!: IonModal;
  private subscription: Subscription = new Subscription();
  
  tabS = 'home';
  categorySelected = 'none';
  isCategoriesTab = false;
  CategoriesList: any[] = []; 
  stringScan: string = "";

  ProductList: any[] = [];

  selectedItem: any = [];

  constructor(private lottie: LottieService, 
    private cashlessService: CashlessService, 
    private route: Router, 
    private navCtrl: NavController,
    public userService: UserService, ) { }

  ngOnInit() {
    this.getCategoriaConProductos();
  }

  getCategoriaConProductos() {
    this.lottie.showLoader();

    // en la url se añadio el paramsQuery
    this.subscription.add(
      this.cashlessService.getCategoriaConProductos().subscribe((response) => {

        this.CategoriesList = response.data;
        this.changeNoSelect();
        this.lottie.hideLoader();
      })
    );
    
  }

  goCart(){
    this.navCtrl.navigateRoot('home/carrito');
  }
  onSelect(item: any){
    //Condicion la cual muestra que categoría está seleccionada
    this.selectedItem = this.selectedItem === item ? [] : item;
    this.changeCategory(item.nombre);
  }

  changeCategory(name: string){
    this.ProductList = this.selectedItem.productos || [];
    this.categorySelected = this.categorySelected != name ? name : 'none';
    this.changeNoSelect();
  }

  changeNoSelect(){

    if(this.categorySelected === 'none'){
      
      this.CategoriesList.forEach(item => {

        const products = item.productos;

        products.forEach((product: any) => {
          this.ProductList.push(product);
        });
      });
    } 
  }

  onTab(){
    this.isCategoriesTab = this.tabS === 'category';
  }

  onSelectProduct(item: any){

    this.navCtrl.navigateForward(['home/producto'], {
      queryParams: { id_producto: item.id_producto, productoName: item.nombre },
      state: { from: '/' }
    });
  }
}
