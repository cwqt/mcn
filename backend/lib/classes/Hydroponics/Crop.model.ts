import { ICropStub, ICrop, DataModel, IRecordable, GrowthPhase } from "@cxss/interfaces";
import { cypher, sessionable } from "../../common/dbs";
import Recordable from "./Recordable.model";
import { Transaction } from "neo4j-driver";
import session from "express-session";

type TCrop = ICrop | ICropStub;

const create = async (data: ICropStub, rack_id: string, creator_id: string): Promise<ICrop> => {
  let res = await cypher(
    ` MATCH (u:User {_id:$uid})
      MATCH (r:Rack {_id:$did})
      WHERE u IS NOT NULL AND f IS NOT NULL
      CREATE (u)-[:CREATED]->(r:Crop $body)-[:IN]->(r)
      RETURN r`,
    {
      rid: rack_id,
      uid: creator_id,
      body: data,
    }
  );

  let crop = res.records[0].get("r").properties;
  return reduce<ICrop>(crop, DataModel.Full);
};

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

const remove = async (_id: string, txc?: Transaction) => {
  await sessionable(async (t: Transaction) => {
    await t.run(
      ` MATCH (r:Crop {_id:$cid})
        DETACH DELETE r`,
      { cid: _id }
    );
  }, txc);
};

export default { create, read, reduce, remove };
