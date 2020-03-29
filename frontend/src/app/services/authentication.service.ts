import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private cookieService:CookieService) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(formData) {
    return this.http.post<any>('/api/users/login', formData, {withCredentials:true})
      .pipe(
        map(response => {
          // this.cookieService.set('SESSION_ID', response.headers.get('Set-Cookie'))
          this.currentUserSubject.next(response);
      }));
}

  logout() {
    return this.http.post<any>('/api/users/logout', {})
      .pipe(map(user => {
          this.cookieService.set('SESSION_ID', null)
          this.currentUserSubject.next(null);
          return user;
      }));
  }
}
