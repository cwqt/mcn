import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import { IFarmStub, IRack, IRackStub, ICropStub } from "@cxss/interfaces";
import { FarmService } from "src/app/services/farm.service";
import { ActivatedRoute } from "@angular/router";
import { identifierModuleUrl } from "@angular/compiler";

@Component({
  selector: "app-farm",
  templateUrl: "./farm.component.html",
  styleUrls: ["./farm.component.scss"],
})
export class FarmComponent implements OnInit, AfterViewInit {
  cache = {
    farm: {
      data: null,
      racks: null,
      loading: false,
      error: "",
    },
  };

  constructor(
    private farmService: FarmService,
    private route: ActivatedRoute
  ) {}

  get farm() {
    return this.cache.farm.data;
  }

  ngOnInit(): void {
    this.route.params
      .subscribe((params) => {
        this.getFarm(params.fid);
      })
      .unsubscribe();
  }

  ngAfterViewInit() {}

  getFarm(farm_id: string) {
    this.cache.farm.loading = true;
    this.farmService
      .getFarm(farm_id)
      .then((farm) => {
        this.cache.farm.data = farm;

        //FIXME: should not contain [null]
        farm.racks = farm.racks.map((r: IRackStub) => {
          if (r.crops[0] == null) r.crops = [];
          return r;
        });

        this.cache.farm.racks = farm.racks.reduce(
          (acc: any, curr: IRackStub) => {
            //FIXME: should not contained undefined
            acc[curr.name] = curr.crops
              .map((c: ICropStub) => c.species?.name)
              .filter((x) => x !== undefined);
            return acc;
          },
          {}
        );
        console.log("-->", this.cache.farm.racks);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => (this.cache.farm.loading = false));
  }
}
