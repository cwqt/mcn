import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DeviceService } from 'src/app/services/device.service';
import { UserService } from 'src/app/services/user.service';
import { IDevice } from '../../../../../backend/lib/models/Device.model';
import { IMeasurementModel, IMeasurement } from '../../../../../backend/lib/models/Measurement.model';
import { PlantService } from 'src/app/services/plant.service';
import {
  HardwareInformation,
  HardwareDevice } from '../../../../../backend/lib/common/types/hardware.types';
import { IPlant } from '../../../../../backend/lib/models/Plant.model';


@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent implements OnInit {
  user_id:string;
  plant_id:string;

  cache = {
    plant: {
      data: {} as IPlant,
      loading: true,
      error: ""
    },
    measurements: {
      data: [] as IMeasurementModel[],
      loading: true,
      error: ""
    }
  }

  constructor(private route:ActivatedRoute,
    private router:Router,
    private plantService:PlantService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.user_id = params.username
      this.plant_id = params.rid
      this.getPlant().then(() => {
        this.getPlantMeasurements();
      })
    });
  }

  getPlant() {
    this.cache.plant.loading = true;
    return this.plantService.getPlant(this.user_id, this.plant_id)
      .then((plant:IPlant) => this.cache.plant.data = plant)
      .catch(e => this.cache.plant.error = e)
      .finally(() => this.cache.plant.loading = false)
  }
  
  getPlantMeasurements() {
    this.cache.measurements.loading = true;
    this.plantService.getMeasurements(this.user_id, this.plant_id)
      .then((measurements:IMeasurementModel[]) => this.cache.measurements.data = measurements)
      .catch(e => this.cache.measurements.error = e)
      .finally(() => this.cache.measurements.loading = false)
  }
}
