import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IUser, IUserStub } from '../../../../backend/lib/models/User.model';
import { IPost, IPostStub } from '../../../../backend/lib/models/Post.model';
import { IDeviceStub } from '../../../../backend/lib/models/Device/Device.model';

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
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  register(user:IUserStub) {
    return this.http.post('/api/users', user)
  }

  changeAvatar(formData:FormData):Observable<IUser> {
    return this.http.put<IUser>(`/api/users/${this.currentUserValue._id}/avatar`, formData);
  }
  
  updateUser(json:any) {
    return this.http.put(`/api/users/${this.currentUserValue._id}`, json)
  }

  setUser(user:IUser) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
  
  updateCurrentUser() {
    return this.http.get<IUser>(`/api/users/${this.currentUserValue._id}`)
      .pipe(map(user => { this.setUser(user)})).toPromise()
  }

  createPost(content:any) {
    return this.http.post<IPostStub>(`/api/users/${this.currentUserValue._id}/posts`, content)
  }

  createDevice(content:any) {
    return this.http.post<IDeviceStub>(`/api/users/${this.currentUserValue._id}/devices`, content).toPromise()
  }

  getUserByUsername(username:string):Promise<IUser> {
    return this.http.get<IUser>(`/api/users/u/${username}`).toPromise()
  }
}
