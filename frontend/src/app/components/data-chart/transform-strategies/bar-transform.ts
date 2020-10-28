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
import lineTransform from './line-transform';

export default (req:IAggregateRequestGroup, res:IAggregateResponseGroup):Highcharts.Options => {
    let options = lineTransform(req, res);
    options.chart.type = ChartType.Bar;
    return options
}
