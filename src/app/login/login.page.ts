import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginWebService } from 'src/services/loginWeb.service';
import { Subscription } from 'rxjs';
import { SweetAlertService } from 'src/services/sweet-alert.service';
import { LottieService } from 'src/services/lottie.service';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'src/services/UserDataService.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

interface Country {
    id: number;
    name: string;
}
interface State {
    id: number;
    name: string;
}
interface Citie {
    id: number;
    name: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})

export class LoginPage implements OnInit, OnDestroy {
  isDragging = false;
  initialMouseX = 0;
  initialScrollLeft = 0;
  tabS = 'login';

  //@ViewChild('menuList') menuList: ElementRef;
  private subscription: Subscription = new Subscription();
  userLogin: any = {
    email: '',
    password: ''
  };

  showPassword = false;
  idUser:any;
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter<boolean>();

  /* Variables para registro */

  formulario: FormGroup;
  showPassword2 = false;
  showPasswordConfirm = false;

  listCountries: Country[] = [];
  city: string | null = null;
  state: string | null = null;
  countryCode: string | null = null;
  codigoPais: string | null = null;
  listStates: State[] = [];
  listCities: Citie[] = [];
  validateName = false;
  validateState = false;
  validatePassword_confirmation = false;
  validatePassword = false;
  validateEmail2 = false;
  validateEmail = false;
  validateCountry = false;
  validateCity = false;

  userR: any = {
    name: "",
    email: "",
    password: "",
    country: "Mexico",
    state: "",
    city: "",
    verification_code: "",
    validate_code: false,
  };

  constructor(
    private swal: SweetAlertService,
    private cdr: ChangeDetectorRef,
    private loginService: LoginWebService,
    private loaderService: LottieService,
    private route: Router,
    private cookie: CookieService,
    private userDataService: LocalStorageService,
    private fb: FormBuilder,
    private modalController: ModalController
  ) {
    //const firebase = this.firebaseService.getFirebase();

    this.formulario = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      email2: ['', [Validators.required, Validators.email]],
    },
      { validators: [this.CoincidenValidator, this.ContraseñaValidator], },

    );
  }

  ngOnInit(): void {
    this.getCountries();
    this.chanceCountry('Mexico');
    this.scrollToTop();
  }

  onTab(){
    console.log(this.tabS);
  }

  login() {
    this.loaderService.showLoader();
    this.subscription.add(

    );

  }
  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('user_data')?? '[]');

  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  startDrag(event: MouseEvent): void {
    this.isDragging = true;
    this.initialMouseX = event.clientX;
    this.initialScrollLeft = document.getElementById('scrollContainer')?.scrollLeft || 0;
  }
  stopDrag(): void {
    this.isDragging = false;
  }
  scrollLeft(): void {
    this.scrollContainer(-175);
  }

  scrollRight(): void {
    this.scrollContainer(175);
  }
  scrollContainer(offset: number): void {
    const scrollContainer = document.getElementById('scrollContainer');
    if (scrollContainer) {
      const newScrollLeft = scrollContainer.scrollLeft + offset;
      scrollContainer.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
    this.cdr.detectChanges()
  }

  signOut(): void {
    
  }

  generateVerificationCode(length: number = 6): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let verificationCode = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      verificationCode += charset[randomIndex];
    }
    return verificationCode;
  }

  forgetPassword() {
    this.route.navigate(['/login/forgotPassword']);
  }

  /* ---------- Apartado de Registrar ----------- */
  getCountries() {
    this.subscription.add(
        this.loginService.getCountries().subscribe(c => {
            this.listCountries = c;
        }, error => { })
    )
  }

    chanceCountry(eventOrCountry: Event | { target: { value: string } } | string): void {
      let id: number;
      let selectedCountryName: string | null = null;

      if (typeof eventOrCountry === 'string') {

        selectedCountryName = eventOrCountry;

      } else if ('target' in eventOrCountry && eventOrCountry.target) {
          
        const target = eventOrCountry.target;

        if (target instanceof HTMLInputElement) {
          
          selectedCountryName = target.value;

        } else if ('value' in target) {

          selectedCountryName = (target as { value: string }).value;

        }
      }

      if (selectedCountryName) {
        this.countryCode = selectedCountryName;

        const selectedCountry = this.listCountries.find(
          (country) => country.name === selectedCountryName
        );

        if (selectedCountry) {
          this.userR.country = selectedCountry.name;
          id = selectedCountry.id;
        } else {
          console.warn('País no encontrado en la lista.');
          id = 142;
        }
      } else {
        id = 142;
      }
      this.subscription.add(
        this.loginService.getStates(id).subscribe(
          (states) => {
              this.listStates = states;
          },
          (error) => {
              this.swal.error(error);
          }
        )
      );
  }

  chanceStates(state: Event | { target: { value: string } }): void {
    let selectedStateId: number | null = null;
    let selectedStateName: string | null = null;
    if ('target' in state && state.target) {
        const target = state.target;

        if (target instanceof HTMLInputElement) {
            selectedStateName = target.value;
        } else if ('value' in target) {
            selectedStateName = (target as { value: string }).value;
        }
    }

    if (selectedStateName) {
        const selectedState = this.listStates.find((state) => state.name === selectedStateName);

        if (selectedState) {
            this.userR.state = selectedState.name;
            selectedStateId = selectedState.id;
        } else {
            console.warn('Estado no encontrado en la lista.');
        }
    }
    if (!selectedStateId) {
        console.warn('ID de estado no encontrado. Abortando solicitud de ciudades.');
        return;
    }
    this.subscription.add(
        this.loginService.getCities(selectedStateId).subscribe(
            (cities) => {
                this.listCities = cities;
            },
            (error) => {
                this.swal.error(error);
            }
        )
    );
  }

  registro() {

    //Primero verifica si el formulario es válido
    if (this.formulario.valid) {
      
      const code = this.generateVerificationCode();

      this.loaderService.showLoader();

      this.userR.verification_code = code;

      this.subscription.add(
        this.loginService.register(this.userR).subscribe(async u => {

          this.loaderService.hideLoader();

          this.swal.success(u.message);
        }, error => {
          this.loaderService.hideLoader();
          console.log('error', error);
          if (error.error.message) {
              this.swal.error('Error', error.error.message);
          } else {
              if (error.error.error.email) {
                  this.swal.error('Error', error.error.error.email);
              }
              if (error.error.error.password) {
                  this.swal.error('Error', error.error.error.password);
              }
          }
        })
      );
    } else {

      if (this.formulario.value.name == '') {
        
        document.getElementById('name')?.classList.add('input-error');
        this.validateName = true;

      } else {
        document.getElementById('name')?.classList.remove('input-error');
      }

      if (this.formulario.value.city == '') {
        document.getElementById('city')?.classList.add('input-error');
        this.validateCity = true;

      } else {
        document.getElementById('city')?.classList.remove('input-error');
      }

      if (this.formulario.value.country == '') {
        document.getElementById('country')?.classList.add('input-error');
        this.validateCountry = true;

      } else {
        document.getElementById('country')?.classList.remove('input-error');
      }

      if (this.formulario.value.email == '') {
        document.getElementById('email')?.classList.add('input-error');
        this.validateEmail = true;

      } else {
        document.getElementById('email')?.classList.remove('input-error');
      }

      if (this.formulario.value.email2 == undefined) {
        document.getElementById('email2')?.classList.add('input-error');
        this.validateEmail2 = true;

      } else {
        document.getElementById('email2')?.classList.remove('input-error');
      }

      if (this.formulario.value.password == '') {
        document.getElementById('password')?.classList.add('input-error');
        this.validatePassword = true;

      } else {
        document.getElementById('password')?.classList.remove('input-error');
      }

      if (this.formulario.value.password_confirmation == '') {
        document.getElementById('password_confirmation')?.classList.add('input-error');
        this.validatePassword_confirmation = true;

      } else {
        document.getElementById('password_confirmation')?.classList.remove('input-error');
      }
      
      if (this.formulario.value.state == '') {
        document.getElementById('state')?.classList.add('input-error');
        this.validateState = true;

      } else {
        document.getElementById('state')?.classList.remove('input-error');
      }
    }
  }

  CoincidenValidator(form: FormGroup) {
    const correo1 = form.get('email')?.value;
    const correo2 = form.get('email2')?.value;
    return correo1 === correo2 ? null : { correosNoCoinciden: true };
  }

  ContraseñaValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const password_confirmation = form.get('password_confirmation')?.value;
    return password === password_confirmation ? null : { passwordNoCoinciden: true };
  }

  togglePassword2() {
    //Oculta o muestra los botones 
    this.showPassword2 = !this.showPassword2;
  }
  togglePasswordConfirm() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }
}