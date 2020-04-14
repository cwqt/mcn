import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { IPlantModel } from '../../../../../../../backend/lib/models/Plant.model';

@Component({
  selector: 'app-user-plants-list',
  templateUrl: './user-plants-list.component.html',
  styleUrls: ['./user-plants-list.component.css']
})
export class UserPlantsListComponent implements OnInit {
  isActive:boolean = false;
  initialised:boolean = false;
  plants:IPlantModel[] = [];
  loading = false;
  
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
