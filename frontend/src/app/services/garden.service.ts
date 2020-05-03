import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from './profile.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GardenService {

  constructor(private profileService:ProfileService,
    private userService:UserService,
    private http:HttpClient) {}
}
