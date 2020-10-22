import { I } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { categories } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChartType, IAggregateRequestGroup, IAggregateResponse, IAggregateResponseGroup } from '@cxss/interfaces';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import * as Highcharts from "highcharts";

@Component({
  selector: 'app-data-chart',
  templateUrl: './data-chart.component.html',
  styleUrls: ['./data-chart.component.scss']
})
export class DataChartComponent implements OnInit, AfterViewInit {
  @Input() title?:string;
  @Input() aggregationData:IAggregateResponseGroup;
  @Input() aggregationRequest: IAggregateRequestGroup;

  @ViewChild('chart') chart:any;

  Highcharts: typeof Highcharts = Highcharts; // required
  chartData:Highcharts.Options;

  constructor() { }


  ngAfterViewInit() {
    console.log(this.chart)
  }
  

  reflow(event) {
    console.log('chart loaded')
    setTimeout(() => {
      console.log('reflowing')
      this.chart.chart.reflow()
    }, 2000);
  }

  chartCallback(chart) {
    console.log(chart, 'reflow');
    setTimeout(() => {
        chart.reflow();
    },0)
  }

  ngOnInit(): void {
    console.log(this.aggregationData)
    
    // https://www.highcharts.com/docs/chart-concepts/series
    // A list of arrays with two or more values. In this case, the first value is the x value and the second is the y value. If the first value is a string, it is applied as the name of the point, and the x value is incremented following the above rules. Some series, like arearange, accept more than two values. See API documentation for each series type.

    console.log(this.chart)

    this.chartData = {  // a recordable instance
      series: (this.aggregationData.data.map((r:IAggregateResponse) => {
        return Object.entries(r.sources).reduce((acc, curr) => {
          // curr [stype-sid: {times, values}]

          let x = {
            data: curr[1].times.map((v, idx) => {
              let value = curr[1].values[idx];
              if(typeof(value) == 'boolean') value = value ? 1 : 0;

              return [new Date(v).getTime(), value];
            }),
            title: curr[0]
          }

          return [...acc, x];
        }, [])
      })).flat(),

      xAxis: {
        type: "datetime"
      },
      chart: {
        type: 'line',
      },
      title: {
        text: this.title
      }
    }

    console.log(this.chartData)
  }
}
