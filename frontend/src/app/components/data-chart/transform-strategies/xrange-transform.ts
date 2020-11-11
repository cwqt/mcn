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
} from "@cxss/interfaces";
import * as Highcharts from "highcharts";
import { createAxes, createSeries, IAggregateData } from "./line-transform";

export default (
  req: IAggregateRequestGroup,
  res: IAggregateResponseGroup
): Highcharts.Options => {
  const categories = getCategories(res);
  console.log(categories);

  const options: Highcharts.Options = {
    chart: { type: ChartType.Xrange },
    title: { text: "" },
    xAxis: { type: "datetime" },
    yAxis: createAxes(req, res, categories).map(axis => {
        axis.labels.formatter = (that) => res.sources[that.value]?.name
        return axis;
    })[0],
    series: createSeries<Highcharts.SeriesLineOptions>(
      req,
      res,
      (r: IAggregateResponse, data: IAggregateData, axisIdx: number) => ({
        name: `${MeasurementInfo[r.measurement].title} (${
          DataFormatInfo[r.data_format]?.symbol || "~"
        })`,
        data: transformResponse(r, categories),
        pointWidth: 30
      })
    ),
  };

  return options;
};

const getCategories = (res: IAggregateResponseGroup): string[] => {
  // const categories = res.axes.reduce((acc, curr) => {
  //   curr.aggregation_points.forEach((p) => {
  //     acc = acc.concat(Object.keys(p.sources));
  //   });
  //   return acc;
  // }, []);

  // return [...new Set(categories)];
  return [];
};

const transformResponse = (r: IAggregateResponse, categories: string[]) => {
  return (
    Object.entries(r.sources)
      // map all sources into [[Date, value], [Date, value], [Date, value], ...]
      .reduce((acc, curr) => {
        acc.push(                        // time, value, source id
          curr[1].times.map((t, idx) => [t, curr[1].values[idx], curr[0]])
        );
        return acc;
      }, [])
      .flat()
      // sort by time added
      .sort((a, b) => b[0] - a[0])
      // get times between a  ...|true, false, ..., false, true|...
      .reduce(
        (acc, curr) => {
          if (curr[1]) {
            acc.isTrue = true;
            acc.lastTrue = curr[0];
          } else {
            if (acc.isTrue) { // start, end, source id
              acc.points.push([curr[0], acc.lastTrue, curr[2]]);
              acc.isTrue = false;
              acc.lastTrue = null;
            }
          }
          return acc;
        },
        { points: [], isTrue: false, lastTrue: null }
      )
      .points// map into highcharts format
      .map((x) => ({
        // color:  COLOR_MAP[r.color]["200"],
        x: new Date(x[0]).getTime(),
        x2: new Date(x[1]).getTime(),
        y: categories.findIndex((c) => x[2] == c),
      }))
  );
};
