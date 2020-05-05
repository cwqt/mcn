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
  iconMap = {
    [Measurement.Temperature]: "ac_unit",
    [Measurement.Light]: "brightness_5",
    [Measurement.Humidity]: "waves",
    [Measurement.WaterLevel]: "opacity",
    [Measurement.Moisture]: "grain",
    [Measurement.Height]: "height",
    [Measurement.LightState]: "wb_incandescent",
    [Measurement.CameraState]: "linked_camera",
    [Measurement.PumpState]: "blur_linear",
    [Measurement.HeaterState]: "wb_sunny"
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
        this.parsedData[m][0].push(packet.created_at); //push date
        this.parsedData[m][1].push(packet.measurements[m]); //push value
      })
    }

    this.formattedData = Object.keys(this.parsedData).map(measurement => {
      console.log('-->', measurement)
      return {
        labels: this.parsedData[measurement][0],
        datasets: [{
          label: measurement,
          data: this.parsedData[measurement][1],
          fill: false
        }]
      }
    })

    console.log(this.parsedData);
    console.log(this.formattedData);
  }
}
