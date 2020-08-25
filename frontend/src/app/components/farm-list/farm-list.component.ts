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
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class FarmListComponent implements OnInit {
  farms = {
    data: <IFarmStub[]>[],
    error: <string>"",
    loading: <boolean>false,
    tableRows: ["name", "_id", "racks", "location"],
  };

  selectedFarm: string;
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

  openFarmDetail(farm: IFarmStub) {
    this.selectedFarm = farm._id;
    this.router.navigate([`/org/farms`, farm._id]);
  }
}
