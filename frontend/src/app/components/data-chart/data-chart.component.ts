import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartType, COLOR_MAP, DataFormatInfo, IAggregateAxis, IAggregateRequestGroup, IAggregateResponse, IAggregateResponseGroup, IoTMeasurement, Measurement, MeasurementInfo, MeasurementUnits } from '@cxss/interfaces';
import * as Highcharts from "highcharts";
import { IoTService } from 'src/app/services/iot.service';
import xrange from "highcharts/modules/xrange";
import heatmap from "highcharts/modules/heatmap";
import noData from "highcharts/modules/no-data-to-display";

import lineTransform from './transform-strategies/line-transform';
import barTransform from './transform-strategies/bar-transform';
import xrangeTransform from './transform-strategies/xrange-transform';
import valueTransform from './transform-strategies/value-transform';
import gaugeTransform from './transform-strategies/gauge-transform';

noData(Highcharts);
xrange(Highcharts);
heatmap(Highcharts);

const transformStrategies:{[index in ChartType]: (req:IAggregateRequestGroup, res:IAggregateResponseGroup) => Highcharts.Options} = {
  [ChartType.Line]: lineTransform,
  [ChartType.Bar]: barTransform,
  [ChartType.HeatMap]: lineTransform,
  [ChartType.Scatter]: lineTransform,
  [ChartType.Xrange]: xrangeTransform,
  [ChartType.Pie]: lineTransform,
  [ChartType.Value]: valueTransform,
  [ChartType.Gauge]: gaugeTransform,
}

const highChartTypes:ChartType[] = [
  ChartType.Line,
  ChartType.Bar,
  ChartType.HeatMap,
  ChartType.Scatter,
  ChartType.Pie,
  ChartType.Xrange,
  ChartType.Gauge
]

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
    this.chartData = {};
    // this.chartData = transformStrategies[this.aggregationRequest.chart_type](this.aggregationRequest, this.aggregationData);
    setTimeout(() => {
      if(this.chart) this.chart.chart.update(this.chartData);
    }, 100)
  }

  async initialise(aggregationRequest?:IAggregateRequestGroup) {
    this.aggregationRequest = aggregationRequest ?? this.aggregationRequest;
    this.noData = !!!this.aggregationRequest;
    if(!this.noData) this.aggregationData = await this.fetchData();

    this.render();
  }

  reflow() {
    this.chartCallback(this.chart);
  }

  chartCallback(chart) {
    setTimeout(() => chart.reflow, 0)
  }
}
