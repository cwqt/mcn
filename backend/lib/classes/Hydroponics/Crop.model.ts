import { ICropStub, ICrop, DataModel, IRecordable, GrowthPhase } from "@cxss/interfaces";
import { cypher } from "../../common/dbs";
import Recordable from "./Recordable.model";
import { Transaction } from "neo4j-driver";

type TCrop = ICrop | ICropStub;

const read = async <T extends TCrop>(
  _id: string,
  dataModel: DataModel = DataModel.Stub
): Promise<T> => {
  let data;
  switch (dataModel) {
    case DataModel.Full:
    case DataModel.Stub: {
      let res = await cypher(
        ` MATCH (c:Crop {_id:cid})
          RETURN c`,
        { cid: _id }
      );

      data = res.records[0].get("c");
      break;
    }
  }

  return reduce<T>(data, dataModel);
};

const reduce = <K extends TCrop>(data: TCrop, dataModel: DataModel = DataModel.Stub): K => {
  switch (dataModel) {
    case DataModel.Full:
    case DataModel.Stub: {
      let r: ICropStub = {
        ...Recordable.reduce<IRecordable>(data, DataModel.Full),
        species: data.species,
        phase: data.phase,
      };
      return r as K;
    }
  }
};

const remove = async (_id: string, txc: Transaction) => {
  await txc.run(
    ` MATCH (r:Crop {_id:$cid})
      DETACH DELETE r`,
    { cid: _id }
  );
};

export default { read, reduce, remove };
