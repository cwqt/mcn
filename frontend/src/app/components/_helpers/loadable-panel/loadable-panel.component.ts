import { Component, OnInit, Input, ViewChild, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { getSupportedInputTypes } from '@angular/cdk/platform';

@Component({
  selector: 'app-loadable-panel',
  templateUrl: './loadable-panel.component.html',
  styleUrls: ['./loadable-panel.component.scss']
})
export class LoadablePanelComponent implements OnInit {
  @Input() hasData:boolean = false;
  @Input() loading:boolean = false;
  @Input() title:string;
  @Input() description:string;
  @Output() onClick = new EventEmitter();

  @ViewChild('panelRef') panelRef:MatExpansionPanel;

  constructor() { }

  ngOnInit():void {
  }

  ngOnChanges(changes:SimpleChanges):void {
    if('hasData' in changes) {
      if(changes.hasData.currentValue && !changes.loading.currentValue) {
        this.panelRef.open()
      }
    }
  }

  click(event):void {
    if(!this.loading) {
      if(!this.hasData) {
        this.panelRef.toggle();
        this.loading = true;
        this.description = "No data";
        setTimeout(() => {
          this.onClick.emit();
          console.log('emeit')
        }, 100)
      } else {
        console.log('yayo')
        this.onClick.emit();
      }  
    }
  }
}
