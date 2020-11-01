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
  MeasurementUnits,
  Primitive,
} from "@cxss/interfaces";
import * as Highcharts from "highcharts";

export type IAggregateData = {times:Date[], values:Primitive[]};

export default (
  req: IAggregateRequestGroup,
  res: IAggregateResponseGroup
): Highcharts.Options => {
  const options: Highcharts.Options = {
    chart: { type: 'area' },
    plotOptions: {
      area: { fillOpacity: 0.2 },
      series: {
        marker: {
          enabled: false
        }
      }
    },
    tooltip: {
      shared: true,
    },
    title: { text: "" },
    xAxis: { type: "datetime" },
    yAxis: createAxes(req, res).map(x => ({...x, gridLineColor: 'transparent'})),
    series: createSeries<Highcharts.SeriesLineOptions>(req, res,
      (r:IAggregateResponse, data:IAggregateData, axisIdx:number) => ({
        yAxis: axisIdx, // multi-axis support
        name: `${MeasurementInfo[r.measurement].title} (${DataFormatInfo[r.data_format]?.symbol || '~'})`,
        color: COLOR_MAP[r.color]['200'],
        data: data.times.map((v, idx) => {
          let t = new Date(v).getTime();
          let value = data.values[idx];
          if(typeof(value) == "boolean") return value ? [t, 1] : [t, 0];
          return [t, value];
        })
      })
    ),
  };

  return options;
};

// let line = {
//   data: curr.times.map((v, idx) => {
//     let value = curr.values[idx];
//     if(typeof(value) == 'boolean') value = value ? 1 : 0;

//     if(aggregationRequest.chart_type == ChartType.Xrange) {
//     } else {
//       return [new Date(v).getTime(), value];
//     }
//   }),
//   yAxis: idx,
//   color: COLOR_MAP[r.color]['200'],
//   name: `${MeasurementInfo[r.measurement].title} (${DataFormatInfo[r.data_format]?.symbol || '~'})`//curr[0]
// }


export const createSeries = <T>(
  aggregationRequest: IAggregateRequestGroup,
  aggregationData: IAggregateResponseGroup,
  dataTransformer:(r:IAggregateResponse, data:IAggregateData, axisIdx:number) => any,
):T[] => {
  return aggregationData ? (aggregationData.axes.map((axis:IAggregateAxis<IAggregateResponse>, idx) => {
    return axis.aggregation_points.map((r:IAggregateResponse) => {
      return Object.values(r.sources).reduce((acc, curr) => {
        return [...acc, dataTransformer(r, curr, idx)];
      }, [])  
    }).flat()
  })).flat() : [{ data:[], name: "No data" }];
}

export const createAxes = (
  aggregationRequest: IAggregateRequestGroup,
  aggregationData: IAggregateResponseGroup,
  categories: string[] = []
): Highcharts.YAxisOptions[] => {
  return aggregationData
    ? aggregationData.axes.map<Highcharts.YAxisOptions>(
        (axis: IAggregateAxis<IAggregateResponse>, idx) => {
          return {
            labels: {
              format: `{value}${axis.label_format}`,
            },
            title: {
              text: axis.title,
            },
            categories: categories
          };
        }
      )
    : [];
};
