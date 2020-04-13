import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class RecordablesService {

  constructor(private http:HttpClient, private authService:AuthenticationService) { }

  getAllPlants() {
    return this.http.get(`/api/users/${this.authService.currentUserValue._id}/plants`)
  }

  getAllGardens() {
    return this.http.get(`/api/users/${this.authService.currentUserValue._id}/gardens`)
  }
}
