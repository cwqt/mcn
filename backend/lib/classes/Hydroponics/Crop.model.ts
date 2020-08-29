import { ICropStub, ICrop, DataModel, IRecordable, GrowthPhase, NodeType } from "@cxss/interfaces";
import { cypher, sessionable } from "../../common/dbs";
import Recordable from "./Recordable.model";
import { Transaction } from "neo4j-driver";
import Species from "./Species.model";
import Node from "../Node.model";

type TCrop = ICrop | ICropStub;

const create = async (data: ICropStub, rack_id: string, creator_id: string): Promise<ICrop> => {
  let res = await cypher(
    ` MATCH (u:User {_id:$uid})
      MATCH (r:Rack {_id:$rid})
      WHERE u IS NOT NULL AND r IS NOT NULL
      CREATE (u)-[:CREATED]->(c:Crop $body)<-[:HAS_CROP]-(r)
      RETURN c`,
    {
      rid: rack_id,
      uid: creator_id,
      body: data,
    }
  );

  let crop = res.records[0].get("c").properties;
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
        ` MATCH (c:Crop {_id:$cid})
          OPTIONAL MATCH (c)-[:IS_SPECIES]->(s:Species)
          RETURN c, s{._id}`,
        { cid: _id }
      );

      data = <ICrop>res.records[0].get("c").properties;
      if (res.records[0].get("s")) {
        data.species = await Species.read(res.records[0].get("s")._id, DataModel.Stub);
      }
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
  await Node.remove(_id, NodeType.Crop, txc);
};

export default { create, read, reduce, remove };
