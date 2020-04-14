import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IUserModel, IUser } from '../../../../backend/lib/models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }
  
  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<IUserModel>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  register(user) {
    return this.http.post('/api/users', user)
  }

  changeAvatar(formData) {
    return this.http.put(`/api/users/${this.currentUserValue._id}/avatar`, formData);
  }
  
  updateUser(json) {
    return this.http.put(`/api/users/${this.currentUserValue._id}`, json)
  }

  setUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  
  updateCurrentUser() {
    return this.http.get(`/api/users/${this.currentUserValue._id}`)
      .pipe(map(user => { this.setUser(user)})).toPromise()
  }
}
