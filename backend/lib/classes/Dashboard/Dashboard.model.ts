import { NodeType, IDashboard, INode, Type } from "@cxss/interfaces";
import Node from "../Node.model";
import { sessionable, cypher } from "../../common/dbs";
import { Transaction } from "neo4j-driver";
import { capitalize } from "../../controllers/Node.controller";
import DashboardItem from "./DashboardItem.model";
import { Types } from "mongoose";
import DashboardSection from "./DashboardSection.model";

export const create = async (body:{[index:string]:string}, org_id: string): Promise<IDashboard> => {
  const dash: IDashboard = {
    _id: new Types.ObjectId().toHexString(),
    title: body.title,
    icon: body.icon,
    created_at: Date.now(),
    type: NodeType.Dashboard,
    sections: [],
  };

  const res = await cypher(
    ` MATCH (o:Organisation {_id:$oid})
      CREATE (o)-[:HAS_DASHBOARD]->(d:Dashboard $body)
      RETURN d`,
    {
      oid: org_id,
      body: dash,
    }
  );

  const data: IDashboard = res.records[0].get("d").properties;
  return reduce(data);
};

const read = async (dash_id: string): Promise<IDashboard> => {
  const res = await cypher(
    ` MATCH (d:Dashboard {_id:$did})
      OPTIONAL MATCH (d)-[:HAS_SECTION]->(ds:${capitalize(NodeType.DashboardSection)})
      RETURN d, collect(ds{._id}) as ds`,
    { did: dash_id }
  );

  let data = <IDashboard>res.records[0]?.get("d").properties;
  data.sections = await Promise.all(
    res.records[0]?.get("ds")?.map((ds: INode) => DashboardSection.read(ds._id))
  );

  return reduce(data);
};

const reduce = (data: IDashboard) => {
  return data;
};

const update = async (_id: string, newFieldValues: any): Promise<void> => {
  const updatableFields = ["title", "icon"];

  await Node.update(_id,
    updatableFields.reduce((obj, key) => ({ ...obj, [key]: newFieldValues[key] }), {}),
    NodeType.Dashboard);
};

const remove = async (_id: string, txc?: Transaction) => {
  await sessionable(async (t: Transaction) => {
    await t.run(
      ` MATCH (p:${capitalize(NodeType.Dashboard)} {_id:$pid})
        DETACH DELETE p`,
      { pid: _id }
    );
  }, txc);
};

export default { create, read, update, reduce, remove };
