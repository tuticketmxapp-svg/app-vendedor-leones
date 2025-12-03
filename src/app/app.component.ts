import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LottieService } from 'src/services/lottie.service';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { EventService } from 'src/services/event.service';
import { LocalStorageService } from 'src/services/UserDataService.service';
import { AuthService } from 'src/services/auth.service';
import { LoginWebService } from 'src/services/loginWeb.service';
import { ModalCommunicationService } from 'src/services/modalService';
import { CashlessService } from 'src/services/cashless.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit, AfterViewInit {

  iconTitle = '';
  isAbondado = false;
  abonadomax = 0;
  me: any;
  subscription: Subscription | undefined; 
  modalSubscription: Subscription;
  isLoggedIn: boolean = false;

  showLoader: boolean = false;
  options = {
    path: './assets/animation/leones.json',
  };

  title = 'leones.accesototal.mx';
  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '280px',
    margin: '0 auto',
  };
  isIos: boolean = false; // Variable para detectar iOS

  constructor(
    private lottieService: LottieService,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private cookie: CookieService,
    private eventService: EventService,
    private userDataService: LocalStorageService,
    private authService: AuthService,
    private loginService: LoginWebService,
    private modalCommunicationService: ModalCommunicationService,
    private cashService: CashlessService, 
    public userService: UserService,
    
  ) {

    console.log('menu constructor');
    this.modalSubscription = this.modalCommunicationService.modalClosed$.subscribe((data: { loggedIn: boolean; seleccionados: any[] }) => {
      
      this.isLoggedIn = data.loggedIn;
      if (this.isLoggedIn != null) {
        
        this.onActivate(this.isLoggedIn);

      }

      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      });

      // Detecta si está en iOS
      this.isIos = Capacitor.getPlatform() === 'ios';
    }
  )}

  ngOnInit() {
    // this.lottieService.showLoader().subscribe((options) => {
    //   this.showLoader = options.show;
    // });
    this.setStatusBarColor();
    this.setStatusBarStyle();
    StatusBar.setOverlaysWebView({ overlay: false });

    this.userService.cartCount = Number(localStorage.getItem('cart'));

    if (this.authService.isLoggedIn()) {

      this.loginService.getMe().subscribe(response => {
        const user = response.data;
        this.me = user;

        this.cashService.getCartCount().subscribe((response: any) =>{
          
          this.userService.cartCount = response.cart_count
          localStorage.setItem('cart', response.cart_count);
        });

        console.log('this.me', this.me);


      });
      this.userDataService.userSubject$.subscribe((user) => {
        this.me = user;
      });

    }
  }

  ngAfterViewInit() {
    this.showLoader = false;
  }

  async setStatusBarColor() {
    // Cambia el color de la barra de estado
    await StatusBar.setBackgroundColor({ color: '#ffffffff' });
  }

  async setStatusBarStyle() {
    // Configura el estilo de la barra de estado para iOS
    await StatusBar.setStyle({ style: Style.Light }); // Usa texto oscuro en la barra de estado
  }

  onActivate(event: any) {
    const userData: any = this.userDataService.getItem('user_data');
    this.me = JSON.parse(userData);
}
  cerrarSesion() {
    this.cookie.deleteAll();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_data');
    this.router.navigate(['/'], { replaceUrl: true });
  }

  ngOnDestroy(): void {
    // Asegúrate de desuscribirte para evitar fugas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
