import { Component, OnInit, Input } from '@angular/core';
import { IPlant } from '../../../../../../../backend/lib/models/Plant.model';
import { IDevice, IDeviceStub } from '../../../../../../../backend/lib/models/Device.model';
import { IRecordableStub, RecordableType } from '../../../../../../../backend/lib/models/Recordable.model';

@Component({
  selector: 'app-thumb-wrapper',
  templateUrl: './thumb-wrapper.component.html',
  styleUrls: ['./thumb-wrapper.component.scss']
})
export class ThumbWrapperComponent implements OnInit {
  @Input() thumbItem:IRecordableStub | IDeviceStub;
  @Input() type:RecordableType;
  
  thumbPlaceholderIcon:string;

  constructor() {}

  ngOnInit(): void {
    switch(this.type){
      case RecordableType.Plant:
        this.thumbPlaceholderIcon = 'eco';
        break;
      case RecordableType.Garden:
        this.thumbPlaceholderIcon = 'group_work';
        break;
      case RecordableType.Device:
        this.thumbPlaceholderIcon = 'device_hub';
        break;
      default:
        this.thumbPlaceholderIcon = 'help'
        break;
    }
  }
}
