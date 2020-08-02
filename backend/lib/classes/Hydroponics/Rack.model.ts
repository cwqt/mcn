import { IRack, IRackStub, DataModel, ICropStub, IRecordable } from "@cxss/interfaces";
import Crop from "./Crop.model";
import Recordable from "./Recordable.model";
import dbs, { cypher } from "../../common/dbs";
import { Transaction } from "neo4j-driver";
import { sessionable } from "../Node.model";

type TRack = IRack | IRackStub;

const read = async <T extends TRack>(
  _id: string,
  dataModel: DataModel = DataModel.Stub
): Promise<T> => {
  let data;
  switch (dataModel) {
    case DataModel.Full:
    case DataModel.Stub: {
      let res = await cypher(
        ` MATCH (r:Rack {_id:rid})
          MATCH (r)-[:HAS_CROP]->(c:Crop)
          RETURN r, c`,
        { rid: _id }
      );

      let rack = res.records[0].get("r");
      rack.crops = Promise.all(
        res.records[0].get("c").map((c: any) => Crop.read<ICropStub>(c.properties._id))
      );
      data = rack;
    }
  }

  return reduce<T>(data, dataModel);
};

const reduce = <T extends TRack>(data: T, dataModel: DataModel = DataModel.Stub): T => {
  switch (dataModel) {
    case DataModel.Stub: {
      let r: IRackStub = {
        ...Recordable.reduce<IRecordable>(data, dataModel),
        crops: data.crops,
      };
      return r as T;
    }

    case DataModel.Full: {
      let r: IRack = {
        ...Recordable.reduce<IRecordable>(data, dataModel),
        crops: data.crops,
      };
      return r as T;
    }
  }
};

const remove = async (_id: string, txc?: Transaction) => {
  await sessionable(async (t: Transaction) => {
    let res = await t.run(
      ` MATCH (r:Rack {_id:$rid})
        MATCH (r)-[:HAS_CROP]->(c:Crop)
        DETACH DELETE r
        RETURN c{._id}`,
      { rid: _id }
    );

    for (let cid of res.records[0].get("c")) {
      await Crop.remove(cid, t);
    }
  }, txc);
};

export default { read, reduce, remove };
