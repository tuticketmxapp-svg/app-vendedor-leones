import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-menu', // Asegúrate de que esto sea 'app-menu'
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false
})
export class MenuComponent implements OnInit, OnDestroy {
  title = '';
  iconTitle = '';
  isAbondado = false;
  abonadomax = 0;
  me: any;
  subscription: Subscription | undefined; 
  modalSubscription: Subscription;
  isLoggedIn: boolean = false;

  constructor(
    private router: Router,
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
  });

  this.subscription = this.eventService.userUpdated$.subscribe(() => {
      const userData: any = this.userDataService.getItem('user_data');
      this.me = JSON.parse(userData);
    });
    this.subscription = this.eventService.userUpdated$.subscribe(() => {
      console.log('entre al subscription');
      const userData: any = this.userDataService.getItem('user_data');
      this.me = JSON.parse(userData);
      console.log('this.me', this.me);
    });
  }

  ngOnInit(): void {
    this.userService.cartCount = Number(localStorage.getItem('cart'));

    if (this.authService.isLoggedIn()) {

      this.loginService.getMe().subscribe(response => {
        const user = response.data;
        this.me = user;

        console.log('this.me', this.me);


      });
      this.userDataService.userSubject$.subscribe((user) => {
        this.me = user;
      });

      this.cashService.getCartCount().subscribe((response: any) =>{
          
        this.userService.cartCount = response.cart_count
        localStorage.setItem('cart', response.cart_count);
      });

    }
   
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
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  ngOnDestroy(): void {
    // Asegúrate de desuscribirte para evitar fugas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
