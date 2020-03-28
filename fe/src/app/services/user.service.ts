import { Injectable } from '@angular/core';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url:string = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  register(user) {
    return this.http.post(`${this.url}/users`, user)
  }
}
