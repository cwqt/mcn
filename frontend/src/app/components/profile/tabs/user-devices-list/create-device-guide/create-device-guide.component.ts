import { Component, OnInit, Inject, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HardwareInformation } from '../../../../../../../../backend/lib/common/types/hardware.types';
import { MatSelect } from '@angular/material/select';
import { DeviceService } from 'src/app/services/device.service';
import { IDevice } from '../../../../../../../../backend/lib/models/Device/Device.model';
import { MatStepper } from '@angular/material/stepper';
import { IApiKey, IApiKeyPrivate } from '../../../../../../../../backend/lib/models/Device/ApiKey.model';
import { StepperSelectionEvent } from '@angular/cdk/stepper';


@Component({
  selector: 'app-create-device-guide',
  templateUrl: './create-device-guide.component.html',
  styleUrls: ['./create-device-guide.component.scss']
})
export class CreateDeviceGuideComponent implements OnInit {
  deviceCreated:boolean = false
  createDeviceFormGroup: FormGroup;
  supportedDevices = HardwareInformation;
  onAdd:EventEmitter<IDevice> = new EventEmitter();

  cache = {
    device: {
      data: null,
      error: "",
      loading: false
    },
    key: {
      data: null,
      error: "",
      loading: false
    }
  }

  @ViewChild(MatSelect) hardwareModelSelector:MatSelect;
  @ViewChild(MatStepper) matStepper:MatStepper;

  constructor(
    public dialogRef: MatDialogRef<CreateDeviceGuideComponent>,
    private deviceService:DeviceService,
    private fb:FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any,
  ) { }

  ngOnInit(): void {
    this.createDeviceFormGroup = this.fb.group({
      device_name:["", [ Validators.required ]],
      device_model: ["", [ Validators.required ]]
    })
  }

  ngAfterViewInit() {
    this.matStepper.selectionChange.subscribe((change:StepperSelectionEvent) => {
      if(change.selectedIndex == 2) { //step 3 is api key
        this.createApiKey()
      }
    })
  }

  createDevice() {
    let data = {
      hardware_model: this.createDeviceFormGroup.controls.device_model.value,
      name: this.createDeviceFormGroup.controls.device_name.value
    }

    this.cache.device.loading = true;
    return this.deviceService.createDevice(this.data.authorUser._id, data)
      .then((device:IDevice) => {
        this.onAdd.emit(device);
        this.cache.device.data = device;
        this.matStepper.next();
      })
      .catch(e => this.cache.device.error = e)
      .finally(() => this.cache.device.loading = false)
    }

    createApiKey() {
      let data = {
        key_name: this.cache.device.data.name + ' API key'
      }

      this.cache.key.loading = true;
      return this.deviceService.createApiKey(this.data.authorUser._id, this.cache.device.data._id, data)
        .then((key:IApiKeyPrivate) => {
          this.cache.key.data = key;
        })
        .catch(e => this.cache.key.error = e)
        .finally(() => this.cache.key.loading = false)  
    }
}
