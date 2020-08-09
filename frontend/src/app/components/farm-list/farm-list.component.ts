import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
} from "@angular/core";
import { IFarmStub, Paginated, IFarm } from "@cxss/interfaces";
import { OrganisationService } from "src/app/services/organisation.service";
import {
  Router,
  ActivatedRoute,
  ActivationEnd,
  NavigationEnd,
} from "@angular/router";

import { filter, map, distinctUntilChanged, switchMap } from "rxjs/operators";
import { FarmComponent } from "./farm/farm.component";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { of } from "rxjs";
import { getTreeMultipleDefaultNodeDefsError } from "@angular/cdk/tree";

@Component({
  selector: "app-farm-list",
  templateUrl: "./farm-list.component.html",
  styleUrls: ["./farm-list.component.scss"],
  animations: [
    trigger("detailExpand", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate(".2s ease-out", style({ opacity: 1 })),
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate(".2s ease-in", style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class FarmListComponent implements OnInit, AfterViewInit {
  farms = {
    data: <IFarmStub[]>[],
    error: <string>"",
    loading: <boolean>false,
    tableRows: ["name", "_id", "racks", "location"],
  };

  model: any;
  isOutletting: boolean = false;

  constructor(
    private orgService: OrganisationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.farms.loading = true;
    this.orgService
      .getFarms()
      .then((paginated: Paginated<IFarmStub>) => {
        this.farms.data = paginated.results;
      })
      .catch((e) => (this.farms.error = e))
      .finally(() => (this.farms.loading = false));

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        switchMap(
          () =>
            (this.route.firstChild && this.route.firstChild.params) || of({})
        )
      )
      .subscribe((params) => {
        console.log(params);
        this.isOutletting = Object.keys(params).includes("fid");
      });

    this.route.params
      .subscribe((params) => {
        this.isOutletting = this.route.children.length ? true : false;
      })
      .unsubscribe();
  }

  ngAfterViewInit() {}

  openFarmDetail(farm: IFarmStub) {
    this.router.navigate([`/farms`, farm._id]);
  }
}
