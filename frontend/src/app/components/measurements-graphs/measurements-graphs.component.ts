import { Component, OnInit, Input } from '@angular/core';
import { IMeasurementModel, IMeasurement } from '../../../../../backend/lib/models/Measurement.model';
import { Measurement, IoTMeasurement } from '../../../../../backend/lib/common/types/measurements.types';
import { IDevice } from '../../../../../backend/lib/models/Device.model';
import {
  HardwareInformation,
  HardwareDevice } from '../../../../../backend/lib/common/types/hardware.types';
import moment from 'moment';

import ChartjsPluginAnnotation from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-measurements-graphs',
  templateUrl: './measurements-graphs.component.html',
  styleUrls: ['./measurements-graphs.component.scss']
})
export class MeasurementsGraphsComponent implements OnInit {
  @Input() data:IMeasurementModel[];
  @Input() bounds?:{[index in (Measurement | IoTMeasurement)]:[number, number, number]}//lower, avg, upper bounds
  @Input() device?:IDevice;
  plugins = [ChartjsPluginAnnotation]
  parsedData:{[index in Measurement]?:[any[], number[]]} = {};
  formattedData = {};
  deviceInfo;

  measurementMap = {
    [Measurement.AirTemperature]:  ["Air Temperature",   "ac_unit",  "#ffa4a2", false],
    [Measurement.SoilTemperature]: ["Soil Temperature",   "ac_unit",  "#ffa4a2", false],
    [Measurement.Light]:           ["Light",         "wb_sunny", "#ff94c2", false],
    [Measurement.Humidity]:        ["Humidity",      "waves",    "#ee98fb", false],
    [Measurement.WaterLevel]:      ["Water level",   "opacity",  "#aab6fe", false],
    [Measurement.Moisture]:        ["Soil moisture", "grain",    "#8bf6ff", false],
    [Measurement.Height]:          ["Plant height",  "height",   "#82e9de", false],
    [IoTMeasurement.LightState]:   ["Light state",   "wb_incandescent", "#e1ffb1", false],
    [IoTMeasurement.CameraState]:  ["Camera state",  "linked_camera", "#ffe97d", false],
    [IoTMeasurement.PumpState]:    ["Pump state",    "blur_linear", "#d3b8ae", false],
    [IoTMeasurement.HeaterState]:  ["Heater state",  "toggle_on", "#c1d5e0", false],
    [IoTMeasurement.Voltage]:      ["Voltage",       "flash_on", "#ffb74d", false],
    [IoTMeasurement.Current]:      ["Current",       "show_chart", "#c1d5e0", false],
    [IoTMeasurement.Power]:        ["Power",         "power_input", "#e6ceff", false],
    [IoTMeasurement.SignalStrength]: ["Connection strength", "network_check", "#81c784", false],
  }

  chartOptions = {
    animation: {
      duration: 0 // general animation time
    },
    hover: {
        animationDuration: 0 // duration of animations when hovering an item
    },
    responsiveAnimationDuration: 0,
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        ticks: {
          autoSkip: true,
          maxTicksLimit: 5
        }
      }],
      xAxes: [{
        type: 'time',
        time: {
          unit: 'minute'
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 5,
          maxRotation: 20
        },
        gridLines : {
          display : false
        }
      }]
    }
  }

  constructor() { }

  ngOnInit(): void {
    console.log(this.data);
    this.formatDataForNgxCharts(this.data);
    console.log(this.measurementMap)
    if(this.device) this.deviceInfo = HardwareInformation[this.device.hardware_model];
  }

  // const data = {
  //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  //   datasets: [
  //     {
  //       label: 'My First Dataset',
  //       data: [65, 59, 80, 81, 56, 55, 40],
  //     },
  //   ],
  // };
  formatDataForNgxCharts(data:IMeasurementModel[]) {
    for(let i=0; i<data.length; i++) {
      let packet:IMeasurementModel = data[i];
      Object.keys(packet.data).forEach((m:Measurement) => {
        if(this.parsedData[m] == undefined) this.parsedData[m] = [[], []];
        this.parsedData[m][0].push(moment.unix(packet.created_at)); //push date
        this.parsedData[m][1].push(packet.data[m]); //push value
      })
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");

    Object.keys(this.parsedData).slice().reverse().forEach((measurement, idx) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradient.addColorStop(0,  this.measurementMap[measurement][2]+'ff');
      gradient.addColorStop(1,  this.measurementMap[measurement][2]+'00');

      //fudging last item full width because chrome is gay and hasn't added 
      //column-gap yet
      if(idx == Object.keys(this.parsedData).length-1 && Object.keys(this.parsedData).length % 2 == 1) {
        this.measurementMap[measurement][3] = true;
      }

      if(this.bounds && measurement in this.bounds) {
        let options:any = Object.assign({}, this.chartOptions);
        //draw range
        options = {...options, 
          annotation: {
            annotations: [{
                type: 'box',
                drawTime: 'beforeDatasetsDraw',
                yScaleID: 'y-axis-0',
                yMin: this.bounds[measurement][0],
                yMax: this.bounds[measurement][2],
                backgroundColor: 'rgba(0, 255, 0, 0.2)'
            }]
          },      
        }
        this.measurementMap[measurement].push(options);
      }

      this.formattedData[measurement] = {
        labels: this.parsedData[measurement][0],
        datasets: [{
          backgroundColor: gradient,
          borderColor : this.measurementMap[measurement][2],
          pointBorderColor : this.measurementMap[measurement][2],
          pointBackgroundColor : "#fff",
          label: measurement,
          data: this.parsedData[measurement][1],
        }],
      }
    })
  }
}