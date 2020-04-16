import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { IPlantModel } from '../../../../../../../backend/lib/models/Plant.model';
import { IUserModel } from '../../../../../../../backend/lib/models/User.model';

@Component({
  selector: 'app-user-plants-list',
  templateUrl: './user-plants-list.component.html',
  styleUrls: ['./user-plants-list.component.scss']
})
export class UserPlantsListComponent implements OnInit {
  @Input() user:IUserModel;
  @Input() currentUser:IUserModel;

  isActive:boolean      = false;
  initialised:boolean   = false;
  loading:boolean       = false;
  plants:IPlantModel[]  = [];
  
  constructor(private profileService:ProfileService) { }

  ngOnInit(): void {
    this.profileService.selectedTab.subscribe(key => {
      this.isActive = false;
      if(key == "plants") this.isActive = true;
      if(this.isActive && !this.initialised) this.initialise();
    })
  }

  initialise() {
    this.loading = true;
    this.initialised = true;
    this.profileService.getPlants().then((plants:IPlantModel[]) => {
      this.plants = plants;
      this.loading = false;
    });
  }
}
