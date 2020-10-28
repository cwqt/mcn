import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartType, COLOR_MAP, DataFormatInfo, IAggregateRequestGroup, IAggregateResponse, IAggregateResponseGroup, MeasurementInfo, MeasurementUnits } from '@cxss/interfaces';
import * as Highcharts from "highcharts";
import { IoTService } from 'src/app/services/iot.service';

@Component({
  selector: 'app-data-chart',
  templateUrl: './data-chart.component.html',
  styleUrls: ['./data-chart.component.scss']
})
export class DataChartComponent implements OnInit {
  @ViewChild('chart') chart:any;
  @Input() aggregationRequest: IAggregateRequestGroup;

  Highcharts: typeof Highcharts = Highcharts; // required
  chartData:Highcharts.Options;
  aggregationData:IAggregateResponseGroup;

  noData:boolean = true;
  loading:boolean = false;
  error:string;
  chartType:ChartType;

  constructor(private iotService:IoTService) { }  

  ngOnInit(): void {   
    this.initialise(); 
  }

  async fetchData() {
    this.loading = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await this.iotService.getAggregateData(this.aggregationRequest);      
    } catch (error) {
      this.error = error;
    } finally {
      this.loading = false;
    }
  }

  setChartType(type:ChartType) {
  }

  async initialise(aggregationRequest?:IAggregateRequestGroup) {
    this.aggregationRequest = aggregationRequest ?? this.aggregationRequest;
    this.noData = !!!this.aggregationRequest;
    if(!this.noData) this.aggregationData = await this.fetchData();

    console.log('==>', this.aggregationRequest)
    console.log('--->', this.aggregationData)

    // https://www.highcharts.com/docs/chart-concepts/series
    // A list of arrays with two or more values. In this case, the first value is the x value and the second is the y value. If the first value is a string, it is applied as the name of the point, and the x value is incremented following the above rules. Some series, like arearange, accept more than two values. See API documentation for each series type.
    this.chartData = null;
    this.chartData = {  // a recordable instance
      series: this.aggregationData ? (this.aggregationData.data.map((r:IAggregateResponse) => {
        return Object.entries(r.sources).reduce((acc, curr) => {
          // curr [stype-sid: {times, values}]
          let line = {
            data: curr[1].times.map((v, idx) => {
              let value = curr[1].values[idx];
              if(typeof(value) == 'boolean') value = value ? 1 : 0;

              return [new Date(v).getTime(), value, 10];
            }),
            color: COLOR_MAP[r.color]['200'],
            name: `${MeasurementInfo[r.measurement].title} (${DataFormatInfo[r.data_format]?.symbol || '~'})`//curr[0]
          }

          return [...acc, line];
        }, [])
      })).flat() : [{data:[], name:"No data"}],
      xAxis: {
        type: "datetime"
      },
      chart: {
        type: this.chartType,
      },
      title: {
        text: ''//no title
      }
    }

    console.log(this.chartData)
  }

  reflow() {
    this.chartCallback(this.chart);
  }

  chartCallback(chart) {
    setTimeout(() => chart.reflow, 0)
  }
}
