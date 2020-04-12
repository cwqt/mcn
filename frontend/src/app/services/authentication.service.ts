import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient, private cookieService:CookieService, private router:Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  updateCurrentUser() {
    return this.http.get(`/api/users/${this.currentUserValue._id}`)
      .pipe(map(user => { this.setUser(user)})).toPromise()
  }

  setUser(user) {
    console.log(user)
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  login(formData) {
    return this.http.post<any>('/api/users/login', formData, { withCredentials:true })
      .pipe(map(user => {
          this.setUser(user);
          return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.cookieService.set('connect.sid', null)
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
    return this.http.post<any>('/api/users/logout', {})
  }
}
