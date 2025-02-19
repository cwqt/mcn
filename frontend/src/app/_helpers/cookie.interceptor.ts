import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class SessionInterceptor implements HttpInterceptor {
    constructor(private cookieService:CookieService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentSession = this.cookieService.get('connect.sid');
        console.log('COOKIE: ', currentSession)
        if (currentSession) {
            request = request.clone({
                setHeaders: { 
                    Cookie: `SESSION_ID=${currentSession}`
                }
            });
        }

        return next.handle(request);
    }
}