import { NodeType, IDashboard, INode, Type } from "@cxss/interfaces";
import Node from "../Node.model";
import { sessionable, cypher } from "../../common/dbs";
import { Transaction } from "neo4j-driver";
import { capitalize } from "../../controllers/Node.controller";
import DashboardItem from "./DashboardItem.model";
import { Types } from "mongoose";

export const create = async (org_id: string): Promise<IDashboard> => {
  const dash: IDashboard = {
    _id: new Types.ObjectId().toHexString(),
    created_at: Date.now(),
    type: NodeType.Dashboard,
    rows: 3,
    columns: 5,
    items: [],
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

const read = async (org_id: string): Promise<IDashboard> => {
  let data;
  const res = await cypher(
    ` MATCH (o:${capitalize(NodeType.Organisation)} {_id:$oid})-->(d:Dashboard)
      OPTIONAL MATCH (d)-[:HAS_ITEM]->(di:${capitalize(NodeType.DashboardItem)})
      RETURN d, collect(di{._id}) as di`,
    { oid: org_id }
  );

  data = <IDashboard>res.records[0]?.get("d").properties;
  data.items = await Promise.all(
    res.records[0]?.get("di")?.map((di: INode) => DashboardItem.read(di._id))
  );

  return reduce(data);
};

const reduce = (data: IDashboard) => {
  return data;
};

const update = async (_id: string, newFieldValues: any): Promise<void> => {
  const updatableFields = ["rows", "columns"];

  const filtered = updatableFields.reduce(
    (obj, key) => ({ ...obj, [key]: newFieldValues[key] }),
    {}
  );

  await Node.update(_id, filtered, NodeType.Dashboard);
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
