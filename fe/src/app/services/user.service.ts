import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url:string = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  register(user) {
    return this.http.post(`${this.url}/users`, user)
  }

  logIn(res) {return of()}
}
