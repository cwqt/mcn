import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterContentChecked,
} from "@angular/core";

import { IDeviceStub, Paginated } from "@cxss/interfaces";
import { OrganisationService } from "src/app/services/organisation.service";
import { Router, ActivatedRoute } from "@angular/router";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { DeviceService } from "src/app/services/device.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-devices",
  templateUrl: "./devices.component.html",
  styleUrls: ["./devices.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class DevicesComponent implements OnInit, AfterContentChecked {
  selectedId: string;
  selection = new SelectionModel<IDeviceStub>(true, []);
  dataSource = new MatTableDataSource<IDeviceStub>();

  devices = {
    data: <IDeviceStub[]>[],
    error: <string>"",
    loading: <boolean>false,
    tableRows: ["select", "name", "_id", "last_ping", "state"],
  };

  isLoadingDevice: boolean = false;
  expandedElement: IDeviceStub;

  midTransition: boolean = false;

  constructor(
    private orgService: OrganisationService,
    private router: Router,
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.deviceService.isLoadingDevice.subscribe((x) => {
      this.isLoadingDevice = x;
      console.log("devices loading", x);
    });

    this.devices.loading = true;
    this.orgService
      .getDevices()
      .then((paginated: Paginated<IDeviceStub>) => {
        this.devices.data = paginated.results;
        this.dataSource = new MatTableDataSource<IDeviceStub>(
          this.devices.data
        );
      })
      .catch((e) => (this.devices.error = e))
      .finally(() => (this.devices.loading = false));

    this.route.firstChild?.params.subscribe((params) => {
      this.expandedElement = this.devices.data.find((d) => {
        return d._id == params.did;
      });
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  openDeviceDetail(device: IDeviceStub) {
    if (this.isLoadingDevice) return;

    // console.log(device);
    // this.selectedId = device._id;
    if (this.expandedElement) {
      this.midTransition = true;
      console.log(device, this.expandedElement);
      if (device._id !== this.expandedElement._id) {
        // this.router.navigate([`/devices/${device._id}`]);
        console.log("navi");
      }
      setTimeout(() => {
        this.expandedElement = this.expandedElement === device ? null : device;
        this.midTransition = false;
      }, 225);
    } else {
      // this.router.navigate([`/devices/${device._id}`]);
      console.log("navielse");
      this.expandedElement = this.expandedElement === device ? null : device;
    }
  }
}
