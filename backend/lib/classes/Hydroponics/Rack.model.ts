import { IRack, IRackStub, DataModel, ICropStub, IRecordable } from "@cxss/interfaces";
import Crop from "./Crop.model";
import Recordable from "./Recordable.model";
import dbs, { cypher, sessionable } from "../../common/dbs";
import { Transaction } from "neo4j-driver";

type TRack = IRack | IRackStub;

const create = async (data: IRackStub, farm_id: string, creator_id: string): Promise<IRack> => {
  let res = await cypher(
    ` MATCH (u:User {_id:$uid})
      MATCH (f:Farm {_id:$fid})
      WHERE u IS NOT NULL AND f IS NOT NULL
      CREATE (u)-[:CREATED]->(r:Rack $body)-[:IN]->(f)
      RETURN r`,
    {
      fid: farm_id,
      uid: creator_id,
      body: data,
    }
  );

  let rack = res.records[0].get("r").properties;
  rack.crops = [];

  return reduce<IRack>(rack, DataModel.Full);
};

const read = async <T extends TRack>(
  _id: string,
  dataModel: DataModel = DataModel.Stub
): Promise<T> => {
  let data;
  switch (dataModel) {
    case DataModel.Full:
    case DataModel.Stub: {
      let res = await cypher(
        ` MATCH (r:Rack {_id:$rid})
          OPTIONAL MATCH (r)-[:HAS_CROP]->(c:Crop)
          RETURN r, c`,
        { rid: _id }
      );
      console.log(_id, res.records);

      let rack = res.records[0].get("r").properties;
      // rack.crops = Promise.all(
      //   res.records[0].get("c").map((c: any) => Crop.read<ICropStub>(c.properties._id))
      // );
      data = rack;
    }
  }

  return reduce<T>(data, dataModel);
};

const reduce = <T extends TRack>(data: T, dataModel: DataModel = DataModel.Stub): T => {
  switch (dataModel) {
    case DataModel.Stub: {
      let r: IRackStub = {
        ...Recordable.reduce<IRecordable>(data, DataModel.Full),
        crops: data.crops,
      };
      return r as T;
    }

    case DataModel.Full: {
      let r: IRack = {
        ...reduce<IRackStub>(data, DataModel.Stub),
        crops: data.crops,
      };
      console.log(r);
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

export default { create, read, reduce, remove };
