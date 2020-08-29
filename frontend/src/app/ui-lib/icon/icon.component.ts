import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Renderer2,
  Input,
} from "@angular/core";
import iconMap from "./iconMap";

@Component({
  selector: "ui-icon",
  templateUrl: "./icon.component.html",
  styleUrls: ["./icon.component.scss"],
})
export class IconComponent implements OnInit, AfterViewInit {
  @ViewChild("icon") icon: ElementRef;
  @Input() size: "s" | "m" | "l" = "m";
  dimensionMap = {
    s: 16,
    m: 24,
    l: 32,
  };

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.renderer.setAttribute(
      this.icon.nativeElement,
      "data-icon",
      `${iconMap[this.icon.nativeElement.innerText.toLowerCase()]}`
    );
    this.icon.nativeElement.innerHTML = "";

    let dimension = this.dimensionMap[this.size];
    this.renderer.setStyle(
      this.icon.nativeElement,
      "max-width",
      `${dimension}px`
    );
    this.renderer.setStyle(
      this.icon.nativeElement,
      "max-height",
      `${dimension}px`
    );
    this.renderer.setStyle(
      this.icon.nativeElement,
      "font-size",
      `${dimension}px`
    );
  }
}
