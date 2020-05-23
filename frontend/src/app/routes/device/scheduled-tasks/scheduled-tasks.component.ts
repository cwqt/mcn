import { Component, OnInit, Input } from '@angular/core';
import { IUser } from '../../../../../../backend/lib/models/User.model';
import { IDevice } from '../../../../../../backend/lib/models/Device.model';

@Component({
  selector: 'app-scheduled-tasks',
  templateUrl: './scheduled-tasks.component.html',
  styleUrls: ['./scheduled-tasks.component.scss']
})
export class ScheduledTasksComponent implements OnInit {
  @Input() currentUser:IUser;
  @Input() authorUser:IUser;
  @Input() device:IDevice;

  constructor() { }

  ngOnInit(): void {
  }

}
