import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookie: CookieService,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (req.url.includes('/api/v1/login')) {
        return next.handle(req);
    }

    const authToken = this.authService.currentToken;

    if (authToken) {
        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${authToken}`)
        });
        return next.handle(authReq).pipe(
            tap(() => {}, error => {
                if (error.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user_id');
                    localStorage.removeItem('user_data');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('storage');
                    this.cookie.delete('access_token');
                    this.router.navigate(['/login']); 
                }
            })
        );
    }
    else {
        return next.handle(req);
    }
  }
}
