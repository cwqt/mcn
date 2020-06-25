import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-sidebar-nav",
  templateUrl: "./sidebar-nav.component.html",
  styleUrls: ["./sidebar-nav.component.scss"],
})
export class SidebarNavComponent implements OnInit {
  nav = [
    {
      item: "Standard Workspaces",
      children: [
        {
          item: "Acquisition",
          children: [
            {
              item: "Something",
            },
          ],
        },
        {
          item: "Behaviour",
          children: [
            { item: "Elements " },
            { item: "Elements - Heirarchy" },
            { item: "Entry pages " },
            { item: "Exit Pages " },
          ],
        },
        {
          item: "Device & Technical",
          children: [{ item: "Events " }, { item: "Shit " }],
        },
      ],
    },
    {
      item: "Cock and ball torture",
      children: [
        {
          item: "fuck",
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
