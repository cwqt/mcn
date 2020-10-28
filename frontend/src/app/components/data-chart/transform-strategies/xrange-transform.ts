import {
    ChartType,
    COLOR_MAP,
    DataFormatInfo,
    IAggregateAxis,
    IAggregateRequestGroup,
    IAggregateResponse,
    IAggregateResponseGroup,
    IoTMeasurement,
    Measurement,
    MeasurementInfo,
    MeasurementUnits
} from '@cxss/interfaces';
import * as Highcharts from "highcharts";

export default (req:IAggregateRequestGroup, res:IAggregateResponseGroup):Highcharts.Options => {
    let options = {}

//   // takes in a response and returns a line
//     // number corresponds to yAxis category
//     let data:Array<{x:Date, x2:Date, y:number}> = Object.values(r.sources)
//       // map all sources into [[Date, value], [Date, value], [Date, value], ...]
//       .reduce((acc, curr) => {
//           acc.push(curr.times.map((t, idx) => [t, curr.values[idx]]));
//           return acc;
//         }, []).flat()
//       // sort by time added
//       .sort((a, b) => b[0] - a[0])
//       // get times between a  ...|true, false, ..., false, true|...
//       .reduce((acc, curr) => {
//           if(curr[1]) {
//             acc.isTrue = true;
//             acc.lastTrue = curr[0];
//           } else {
//             if(acc.isTrue) {
//               acc.points.push([curr[0], acc.lastTrue]);
//               acc.isTrue = false;
//               acc.lastTrue = null;
//             }
//           }
//           return acc;
//         }, { points:[], isTrue:false, lastTrue: null }).points
//       // map into highcharts format
//       .map(x => ({ x: x[0], x2: x[1], y: category }));

//       return data

    return options;
}
