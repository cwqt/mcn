import { Component, OnInit, Input } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { IPlant } from '../../../../../../../backend/lib/models/Plant.model';
import { IUser } from '../../../../../../../backend/lib/models/User.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-plants-list',
  templateUrl: './user-plants-list.component.html',
  styleUrls: ['./user-plants-list.component.scss']
})
export class UserPlantsListComponent implements OnInit {
  @Input() authorUser:IUser;
  @Input() currentUser:IUser;
  @Input() canLoad:BehaviorSubject<boolean>;
  @Input() currentIndex:number;
  @Input() selfIndex:number;

  initialised:boolean = false;
  loading:boolean = false;
  error:string;
  plants:IPlant[]  = [];
  
  constructor(private profileService:ProfileService) { }

  ngOnInit(): void {
    this.loading = true;
    this.canLoad.subscribe((canLoad:boolean) => {
      if(canLoad && this.currentIndex == this.selfIndex) {
        if(!this.initialised) this.initialise();
      }
    })
  }

  initialise() {
    this.initialised = true;
    this.profileService.getPlants()
      .then((plants:IPlant[]) => {
        this.plants = plants;
      })
      .catch(e => this.error = e)
      .finally(() => this.loading = false);
  }

  openCreatePlantDialog() {}
}
