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

export default (req:IAggregateRequestGroup, res:IAggregateResponseGroup):Highcharts.Options => { return  {} }
