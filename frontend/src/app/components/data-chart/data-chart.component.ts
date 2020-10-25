import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartType, DataFormatInfo, IAggregateRequestGroup, IAggregateResponse, IAggregateResponseGroup, MeasurementInfo, MeasurementUnits } from '@cxss/interfaces';
import * as Highcharts from "highcharts";

@Component({
  selector: 'app-data-chart',
  templateUrl: './data-chart.component.html',
  styleUrls: ['./data-chart.component.scss']
})
export class DataChartComponent implements OnInit {
  @Input() aggregationData:IAggregateResponseGroup;
  @Input() aggregationRequest: IAggregateRequestGroup;

  @ViewChild('chart') chart:any;

  Highcharts: typeof Highcharts = Highcharts; // required
  chartData:Highcharts.Options;

  constructor() { }  

  ngOnInit(): void {
    // console.log('--->', this.aggregationData)
    
    // https://www.highcharts.com/docs/chart-concepts/series
    // A list of arrays with two or more values. In this case, the first value is the x value and the second is the y value. If the first value is a string, it is applied as the name of the point, and the x value is incremented following the above rules. Some series, like arearange, accept more than two values. See API documentation for each series type.

    this.chartData = {  // a recordable instance
      series: (this.aggregationData.data.map((r:IAggregateResponse) => {
        return Object.entries(r.sources).reduce((acc, curr) => {
          // curr [stype-sid: {times, values}]
          let line = {
            data: curr[1].times.map((v, idx) => {
              let value = curr[1].values[idx];
              if(typeof(value) == 'boolean') value = value ? 1 : 0;

              return [new Date(v).getTime(), value, 10];
            }),
            name: `${MeasurementInfo[r.measurement].title} (${DataFormatInfo[r.data_format]?.symbol || '~'})`//curr[0]
          }

          return [...acc, line];
        }, [])
      })).flat(),

      xAxis: {
        type: "datetime"
      },
      chart: {
        type: 'line',
      },
      title: {
        text: ''//no title
      }
    }
  }

  reflow() {
    this.chartCallback(this.chart);
  }

  chartCallback(chart) {
    setTimeout(() => chart.reflow, 0)
  }
}
