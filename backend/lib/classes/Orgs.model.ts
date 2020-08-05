import { NodeType, IOrg, IOrgStub, DataModel } from "@cxss/interfaces";
import Node from "./Node.model";
import { Transaction } from "neo4j-driver";
import { cypher } from "../common/dbs";
import { Access } from "../mcnr";

type TOrg = IOrgStub | IOrg;

const create = async (org: IOrgStub, creator_id: string): Promise<IOrg> => {
  let result = await cypher(
    ` MATCH (u:User {_id:$uid})
      CREATE (o:Organisation $org)<-[:CREATED]-(u)
      CREATE (o)<-[:IN {role: $role}]-(u)
      RETURN o`,
    {
      org: org,
      uid: creator_id,
      role: Access.OrgAdmin,
    }
  );

  return reduce<IOrg>(result.records[0].get("o"), DataModel.Full);
};

const read = async <T extends TOrg>(
  _id: string,
  dataModel: DataModel = DataModel.Stub
): Promise<T> => {
  let data;
  switch (dataModel) {
    case DataModel.Stub:
    case DataModel.Full:
    case DataModel.Private: {
      data = await Node.read<IOrg>(_id, NodeType.Organisation);
    }
  }

  return reduce<T>(data, dataModel);
};

const reduce = <K extends TOrg>(data: TOrg, dataModel: DataModel = DataModel.Stub): K => {
  switch (dataModel) {
    case DataModel.Stub: {
      let r: IOrgStub = {
        ...Node.reduce(data),
        name: data.name,
        avatar: data.avatar,
      };
      return r as K;
    }

    case DataModel.Full: {
      let d = <IOrg>data;
      let r: IOrg = {
        ...reduce<IOrgStub>(data, DataModel.Stub),
      };
      return r as K;
    }
  }
};

const remove = async (_id: string, txc?: Transaction) => {
  return await Node.remove(_id, NodeType.Organisation, txc);
};

const update = async (_id: string, potentialUpdates: any): Promise<IOrg> => {
  return {} as IOrg;
};

export default { create, read, reduce, remove, update };
