import { Component, OnInit, Input } from '@angular/core';
import { IPlant } from '../../../../../../../../backend/lib/models/Plant.model';
import { Router } from '@angular/router';
import { IUser } from '../../../../../../../../backend/lib/models/User.model';
import { PlantService } from 'src/app/services/plant.service';
import { IRecordableStub } from '../../../../../../../../backend/lib/models/Recordable.model';

@Component({
  selector: 'app-plant-thumb',
  templateUrl: './plant-thumb.component.html',
  styleUrls: ['./plant-thumb.component.scss']
})
export class PlantThumbComponent implements OnInit {
  @Input() plant:IRecordableStub;
  @Input() authorUser:IUser;
  @Input() currentUser:IUser;

  cache = {
    plant: {
      loading: false,
      data: undefined,
      error: ""
    },
  }


  constructor(private router:Router, private plantService:PlantService) { }

  ngOnInit(): void {

  }

  ngOnDestroy(){
    console.log('plants died')
  }

  getPlantMeta() {
    this.cache.plant.loading = true;
    this.plantService.getPlant(this.currentUser._id, this.plant._id)
      .then((plant:IPlant) => {
        this.cache.plant.data = plant;
      })
      .catch(e => this.cache.plant.error = e)
      .finally(() => this.cache.plant.loading = false);
  }

  gotoPlant() {
    this.router.navigate([`/${this.currentUser.username}/plants/${this.plant._id}`])
  }
}
