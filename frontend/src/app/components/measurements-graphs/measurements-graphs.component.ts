import { Component, OnInit, Input } from '@angular/core';
import { IMeasurementModel, IMeasurement } from '../../../../../backend/lib/models/Measurement.model';
import { Measurement } from '../../../../../backend/lib/common/types/measurements.types';


@Component({
  selector: 'app-measurements-graphs',
  templateUrl: './measurements-graphs.component.html',
  styleUrls: ['./measurements-graphs.component.scss']
})
export class MeasurementsGraphsComponent implements OnInit {
  @Input() data:IMeasurementModel[];
  parsedData:{[index in Measurement]?:[any[], number[]]} = {};
  formattedData:any[] = [];

  measurementMap = {
    [Measurement.Temperature]:  ["Temperature",   "ac_unit",  "#ffa4a2", false],
    [Measurement.Light]:        ["Light",         "wb_sunny", "#ff94c2", false],
    [Measurement.Humidity]:     ["Humidity",      "waves",    "#ee98fb", false],
    [Measurement.WaterLevel]:   ["Water level",   "opacity",  "#aab6fe", false],
    [Measurement.Moisture]:     ["Soil moisture", "grain",    "#8bf6ff", false],
    [Measurement.Height]:       ["Plant height",  "height",   "#82e9de", false],
    [Measurement.LightState]:   ["Light state",   "wb_incandescent", "#e1ffb1", false],
    [Measurement.CameraState]:  ["Camera state",  "linked_camera", "#ffe97d", false],
    [Measurement.PumpState]:    ["Pump state",    "blur_linear", "#d3b8ae", false],
    [Measurement.HeaterState]:  ["Heater state",  "toggle_on", "#c1d5e0", false]
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
        }
      }],
      xAxes: [{
        type: 'time',
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20
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
      Object.keys(packet.measurements).forEach((m:Measurement) => {
        if(this.parsedData[m] == undefined) this.parsedData[m] = [[], []];
        this.parsedData[m][0].push(new Date(packet.created_at)); //push date
        this.parsedData[m][1].push(packet.measurements[m]); //push value
      })
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");

    this.formattedData = Object.keys(this.parsedData).map((measurement, idx) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradient.addColorStop(0,  this.measurementMap[measurement][2]+'ff');
      gradient.addColorStop(1,  this.measurementMap[measurement][2]+'00');

      //fudging last item full width because chrome is gay and hasn't added 
      //column-gap yet
      if(idx == Object.keys(this.parsedData).length-1) {
        this.measurementMap[measurement][3] = true;
      }

      return {
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