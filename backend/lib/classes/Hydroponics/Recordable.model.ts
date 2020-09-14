import { DataModel, IRecordableStub, IRecordable, NodeType } from "@cxss/interfaces";
import Node from "../Node.model";

type TRecordable = IRecordableStub | IRecordable;

const read = async <T extends TRecordable>(
  _id: string,
  dataModel: DataModel = DataModel.Stub,
  nodeType?: NodeType
): Promise<T> => {
  let data;
  switch (dataModel) {
    case DataModel.Full:
    case DataModel.Stub: {
      data = (await Node.read(_id, nodeType || NodeType.Recordable)) as TRecordable;
    }
  }

  return reduce<T>(data, dataModel);
};

const reduce = <K extends TRecordable>(
  data: TRecordable,
  dataModel: DataModel = DataModel.Stub
): K => {
  switch (dataModel) {
    case DataModel.Stub: {
      let n: IRecordableStub = {
        ...Node.reduce(data),
        name: data.name,
        thumbnail: data.thumbnail,
        tagline: data.tagline,
      };
      return n as K;
    }

    case DataModel.Full: {
      let d = <IRecordable>data;
      let n: IRecordable = {
        ...reduce<IRecordableStub>(d, DataModel.Stub),
        images: d.images,
        recording: d.recording,
        feed_url: d.feed_url,
        parameters: d.parameters,
        description: d.description,
      };
      return n as K;
    }
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
