import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartType, COLOR_MAP, DataFormatInfo, IAggregateAxis, IAggregateRequestGroup, IAggregateResponse, IAggregateResponseGroup, IoTMeasurement, Measurement, MeasurementInfo, MeasurementUnits } from '@cxss/interfaces';
import * as Highcharts from "highcharts";
import { IoTService } from 'src/app/services/iot.service';
import xrange from "highcharts/modules/xrange";
import heatmap from "highcharts/modules/heatmap";

import lineTransform from './transform-strategies/line-transform';

xrange(Highcharts);
heatmap(Highcharts);

const transformStrategies:{[index in ChartType]: (req:IAggregateRequestGroup, res:IAggregateResponseGroup) => Highcharts.Options} = {
  [ChartType.Line]: lineTransform,
  [ChartType.Bar]: lineTransform,
  [ChartType.HeatMap]: lineTransform,
  [ChartType.Scatter]: lineTransform,
  [ChartType.Xrange]: lineTransform,
  [ChartType.Pie]: lineTransform,
}

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

  render() {
    this.chartData = transformStrategies[this.aggregationRequest.chart_type](this.aggregationRequest, this.aggregationData);
    if(this.chart) this.chart.chart.update();
  }

  async initialise(aggregationRequest?:IAggregateRequestGroup) {
    this.aggregationRequest = aggregationRequest ?? this.aggregationRequest;
    this.noData = !!!this.aggregationRequest;
    if(!this.noData) this.aggregationData = await this.fetchData();

    // https://www.highcharts.com/docs/chart-concepts/series
    // A list of arrays with two or more values. In this case, the first value is the x value and the second is the y value. If the first value is a string, it is applied as the name of the point, and the x value is incremented following the above rules. Some series, like arearange, accept more than two values. See API documentation for each series type.
    this.render();
  }

  reflow() {
    this.chartCallback(this.chart);
  }

  chartCallback(chart) {
    setTimeout(() => chart.reflow, 0)
  }
}
