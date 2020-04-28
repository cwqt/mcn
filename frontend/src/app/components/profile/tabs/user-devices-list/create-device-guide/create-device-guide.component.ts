import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-create-device-guide',
  templateUrl: './create-device-guide.component.html',
  styleUrls: ['./create-device-guide.component.scss']
})
export class CreateDeviceGuideComponent implements OnInit {
  createDeviceFormGroup: FormGroup;
  devices = [
    { model:"mcn-wd1m" },
    { model:"mcn-garden" },
    { model:"mcn-esp32" },
    { model:"mcn-rpi3" },
  ]

  constructor(
    public dialogRef: MatDialogRef<CreateDeviceGuideComponent>,
    private formBuilder:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) { }

  ngOnInit(): void {
    this.createDeviceFormGroup = this.formBuilder.group({ device_name: [''] }, {device_model:['']});
  }
}
