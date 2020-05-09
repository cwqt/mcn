import { Component, OnInit, Input } from '@angular/core';
import { IPlant } from '../../../../../../../../backend/lib/models/Plant.model';
import { Router } from '@angular/router';
import { IUser } from '../../../../../../../../backend/lib/models/User.model';

@Component({
  selector: 'app-plant-item',
  templateUrl: './plant-item.component.html',
  styleUrls: ['./plant-item.component.scss']
})
export class PlantItemComponent implements OnInit {
  @Input() plant:IPlant;
  @Input() user:IUser;
  @Input() currentUser:IUser;

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    console.log('plants died')
  }

  gotoPlant() {
    this.router.navigate([`/${this.currentUser.username}/plants/${this.plant._id}`])
  }
}
