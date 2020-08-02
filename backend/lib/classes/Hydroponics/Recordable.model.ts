import {
  Measurement,
  RecordableType,
  DataModel,
  IFarmStub,
  IFarm,
  IRecordableStub,
  IRecordable,
} from "@cxss/interfaces";
import Node from "../Node.model";

const read = <T extends IRecordable | IRecordableStub>(_id: string): Promise<T> => {
  return Node.read(_id);
};

const reduce = <T extends IRecordable | IRecordableStub>(
  data: T,
  dataModel: DataModel = DataModel.Stub
): T => {
  switch (dataModel) {
    case DataModel.Stub:
      return <T>{
        ...Node.reduce(data),
      };
  }
};

export default { read, reduce };

// export class Recordable<T extends IRecordable | IRecordableStub> extends Node {
//   name: string;
//   thumbnail?: string;
//   tagline?: string;

//   images: string[];
//   recording?: string[];
//   feed_url?: string;
//   parameters?: Map<Measurement, [number, number, number]>;
//   description?: string;

//   constructor(type: RecordableType, name: string) {
//     super(type);
//     this.name = name;
//     this.images = [];
//   }

//   async read(): Promise<T> {}

//   reduce(dt: Dt) {
//     return this.toStub();
//   }
// }
