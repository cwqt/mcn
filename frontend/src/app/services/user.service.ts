import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { IUserModel } from '../../../../backend/lib/models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService:AuthenticationService) {
  }

  register(user) {
    return this.http.post('/api/users', user)
  }

  changeAvatar(formData) {
    return this.http.put(`/api/users/${this.authService.currentUserValue._id}/avatar`, formData);
  }
  
  updateUser(json) {
    return this.http.put(`/api/users/${this.authService.currentUserValue._id}`, json)
  }

  getUserByUsername(username:string) {
    return this.http.get<IUserModel>(`/api/users/u/${username}`);
  }
}
