import {
  Measurement,
  Unit,
  IoTState,
  IoTMeasurement,
  NodeType,
  IDeviceProperty,
  Type,
  HardwareDevice,
  DataModel,
} from "@cxss/interfaces";
import Node from "../Node.model";
import { sessionable } from "../../common/dbs";
import { Transaction } from "neo4j-driver";
import { capitalize } from "../..//controllers/Node.controller";

type TDeviceProperty = NodeType.Metric | NodeType.Sensor | NodeType.State;

const read = async <T extends IDeviceProperty<TDeviceProperty>>(
  _id: string,
  propType: TDeviceProperty
): Promise<T> => {
  let data = await Node.read<T>(_id, propType);
  return reduce<T>(data);
};

const reduce = <K extends IDeviceProperty<TDeviceProperty>>(data: K): K => {
  return {
    _id: data._id,
    created_at: data.created_at,
    type: data.type,
    ref: data.ref,
    value: data.value,
    name: data.name,
    description: data.description,
    measures: data.measures,
    data_format: data.data_format,
  } as K;
};

const remove = async (_id: string, propType: TDeviceProperty, txc?: Transaction) => {
  await sessionable(async (t: Transaction) => {
    await t.run(
      ` MATCH (p:${capitalize(propType)} {_id:$pid})
        DETACH DELETE p`,
      { pid: _id }
    );
  }, txc);
};

export default { read, reduce, remove };
