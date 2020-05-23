import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IMeasurementModel, IMeasurement } from '../../../../../backend/lib/models/Measurement.model';
import { PlantService } from 'src/app/services/plant.service';
import { IPlant } from '../../../../../backend/lib/models/Plant.model';
import { IUser } from '../../../../../backend/lib/models/User.model';


@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent implements OnInit {
  cache = {
    user: {
      data: undefined,
      loading: false,
      error: ""
    },
    plant: {
      data: undefined,
      loading: true,
      error: ""
    },
    measurements: {
      data: undefined,
      loading: true,
      error: ""
    }
  }

  constructor(private route:ActivatedRoute,
    private router:Router,
    private userService:UserService,
    private plantService:PlantService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getUser(params.username)
        .then(user => {
          this.getPlant(params.rid)
            .then(plant => {
              this.getPlantMeasurements()
            })
        })
    });
  }

  getUser(username:string):Promise<IUser> {
    this.cache.user.loading = true;
    return this.userService.getUserByUsername(username)
      .then(user => this.cache.user.data = user)
      .catch(e => this.cache.user.error = e)
      .finally(() => this.cache.user.loading = false)
  }

  getPlant(plant_id:string) {
    this.cache.plant.loading = true;
    return this.plantService.getPlant(this.cache.user.data._id, plant_id)
      .then((plant:IPlant) => this.cache.plant.data = plant)
      .catch(e => this.cache.plant.error = e)
      .finally(() => this.cache.plant.loading = false)
  }
  
  getPlantMeasurements() {
    this.cache.measurements.loading = true;
    this.plantService.getMeasurements(this.cache.user.data._id, this.cache.plant.data._id)
      .then((measurements:IMeasurementModel[]) => this.cache.measurements.data = measurements)
      .catch(e => this.cache.measurements.error = e)
      .finally(() => this.cache.measurements.loading = false)
  }
}
