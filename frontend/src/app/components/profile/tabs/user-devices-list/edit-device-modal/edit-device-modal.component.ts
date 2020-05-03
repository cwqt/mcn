import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { IDevice, IDeviceStub } from '../../../../../../../../backend/lib/models/Device.model';

@Component({
  selector: 'app-edit-device-modal',
  templateUrl: './edit-device-modal.component.html',
  styleUrls: ['./edit-device-modal.component.scss']
})
export class EditDeviceModalComponent implements OnInit {
  editDeviceForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditDeviceModalComponent>,
    private userService:UserService,
    private formBuilder:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public device:IDeviceStub,
  ) { }

  ngOnInit(): void {
    this.editDeviceForm = this.formBuilder.group(
      { device_name: [''] },
      { device_model:['']}
    );
  }

  updateDevice() {
    this.userService.createDevice(this.editDeviceForm.value);
  }
}
