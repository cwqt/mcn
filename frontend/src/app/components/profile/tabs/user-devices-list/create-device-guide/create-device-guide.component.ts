import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { HardwareInformation } from '../../../../../../../../backend/lib/common/types/hardware.types';


@Component({
  selector: 'app-create-device-guide',
  templateUrl: './create-device-guide.component.html',
  styleUrls: ['./create-device-guide.component.scss']
})
export class CreateDeviceGuideComponent implements OnInit {
  deviceCreated:boolean = false
  createDeviceFormGroup: FormGroup;
  supportedDevices = HardwareInformation;

  constructor(
    public dialogRef: MatDialogRef<CreateDeviceGuideComponent>,
    private userService:UserService,
    private formBuilder:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) { }

  ngOnInit(): void {
    this.createDeviceFormGroup = this.formBuilder.group({ device_name: [''] }, {device_model:['']});
  }

  createDevice() {
    this.userService.createDevice(this.createDeviceFormGroup.value);
  }
}
