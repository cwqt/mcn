import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from './profile.service';
import { UserService } from './user.service';
import { RecordableType } from '../../../../backend/lib/models/Recordable.model';
import { RecorderType } from '../../../../backend/lib/models/Measurement.model';

@Injectable({
  providedIn: 'root'
})
export class RecordableService {

  constructor(private profileService:ProfileService,
    private userService:UserService,
    private http:HttpClient) {}
}
