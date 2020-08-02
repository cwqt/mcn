import { ICropStub, ICrop, DataModel, IRecordable, GrowthPhase } from "@cxss/interfaces";
import { cypher } from "../../common/dbs";
import Recordable from "./Recordable.model";

const read = async <T extends ICrop | ICropStub>(
  _id: string,
  dataModel: DataModel = DataModel.Stub
): Promise<T> => {
  let data;
  switch (dataModel) {
    case DataModel.Stub || DataModel.Full: {
      let res = await cypher(
        `
              MATCH (c:Crop {_id:cid})
              RETURN c`,
        { cid: _id }
      );

      return res.records[0].get("c");
    }
  }
};

const reduce = <T extends ICrop | ICropStub>(data: T, dataModel: DataModel = DataModel.Stub): T => {
  switch (dataModel) {
    case DataModel.Stub || DataModel.Full: {
      let r: ICropStub = {
        ...Recordable.reduce<IRecordable>(data, DataModel.Full),
        species: data.species,
        phase: data.phase,
      };
      return r as T;
    }
  }
};

export default { read, reduce };
