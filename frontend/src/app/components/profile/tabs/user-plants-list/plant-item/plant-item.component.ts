import { Component, OnInit, Input } from '@angular/core';
import { IPlantModel } from '../../../../../../../../backend/lib/models/Plant.model';

@Component({
  selector: 'app-plant-item',
  templateUrl: './plant-item.component.html',
  styleUrls: ['./plant-item.component.scss']
})
export class PlantItemComponent implements OnInit {
  @Input() plant:IPlantModel;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    console.log('plants died')
  }

}
