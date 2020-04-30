import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from 'src/app/services/device.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss']
})
export class DeviceComponent implements OnInit {
  user_id:string;
  device_id:string;
  device:any;

  loading:boolean;
  success:boolean;

  constructor(private route:ActivatedRoute,
    private deviceService:DeviceService) {
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.user_id = params.username
      this.device_id = params.did
      this.getDevice();
    });
  }

  getDevice() {
    this.loading = true;
    this.deviceService.getDevice(this.user_id, this.device_id).subscribe(
      res => this.device = res
    );
  }
}
