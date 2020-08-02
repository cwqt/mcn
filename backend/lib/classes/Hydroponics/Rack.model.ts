import { IRack, IRackStub, DataModel, ICropStub, IRecordable } from "@cxss/interfaces";
import Crop from "./Crop.model";
import Recordable from "./Recordable.model";
import { cypher } from "../../common/dbs";

const read = async <T extends IRack | IRackStub>(
  _id: string,
  dataModel: DataModel = DataModel.Stub
): Promise<T> => {
  let data;
  switch (dataModel) {
    case DataModel.Stub || DataModel.Full: {
      let res = await cypher(
        `
            MATCH (r:Rack {_id:rid})
            MATCH (r)-[:HAS_CROP]->(c:Crop)
            RETURN r, c`,
        { rid: _id }
      );

      let rack = res.records[0].get("r");
      rack.crops = res.records[0]
        .get("c")
        .map((crop: any) => Crop.reduce<ICropStub>(crop.properties, DataModel.Stub));
      return rack;
    }
  }
};

const reduce = <T extends IRack | IRackStub>(data: T, dataModel: DataModel = DataModel.Stub): T => {
  switch (dataModel) {
    case DataModel.Stub: {
      let r: IRackStub = {
        ...Recordable.reduce<IRecordable>(data, dataModel),
        crops: data.crops,
      };
      return r as T;
    }
  }
};

export default { read, reduce };
