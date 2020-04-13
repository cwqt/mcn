import { Component, OnInit } from '@angular/core';
import { RecordablesService } from 'src/app/services/recordables.service';

@Component({
  selector: 'app-recordables-list',
  templateUrl: './recordables-list.component.html',
  styleUrls: ['./recordables-list.component.css']
})
export class RecordablesListComponent implements OnInit {
  plants:any;
  gardens:any;

  constructor(private recordablesService:RecordablesService) { }

  ngOnInit(): void {
    // this.recordablesService.getAllPlants().subscribe(
    //   res => this.plants = res
    // )

    // this.recordablesService.getAllGardens().subscribe(
    //   res => this.gardens = res
    // )
  }

}
