import { NodeType, IDashboardItem, INode } from "@cxss/interfaces";
import { sessionable, cypher } from "../../common/dbs";
import { Transaction } from "neo4j-driver";
import { capitalize as cap } from "../../controllers/Node.controller";
import Node from "../Node.model";
import { IDashboardSection } from "@cxss/interfaces/lib/Dashboard.model";
import DashboardItemModel from "./DashboardItem.model";

const create = async (data: IDashboardSection, dash_id: string): Promise<IDashboardSection> => {
  const body = Object.assign({}, data);
  await cypher(
    ` MATCH (d:${cap(NodeType.Dashboard)} {_id:$did})
      WHERE ds IS NOT NULL
      CREATE (ds:${cap(NodeType.DashboardSection)} $body)<-[:HAS_ITEM]-(d)
      RETURN ds`,
    {
      did: dash_id,
      body: body,
    }
  );

  return reduce(data);
};

const read = async (section_id: string): Promise<IDashboardSection> => {
  const res = await cypher(
    ` MATCH (d:${NodeType.DashboardSection} {_id:$dsid})
      OPTIONAL MATCH (d)-[:HAS_ITEM]->(di:${cap(NodeType.DashboardItem)})
      RETURN d, collect(di{._id}) as di`,
    { dsid: section_id }
  );

  let data = <IDashboardSection>res.records[0]?.get("d").properties;
  data.items = await Promise.all(
    res.records[0]?.get("di")?.map((di: INode) => DashboardItemModel.read(di._id))
  );

  return reduce(data);
};

const reduce = (data: IDashboardSection) => {
  return data;
};

const update = async (_id: string, newFieldValues: { [index: string]: any }) => {
  await Node.update(_id, newFieldValues, NodeType.DashboardItem);
};

const remove = async (_id: string, txc?: Transaction) => {
  await sessionable(async (t: Transaction) => {
    await t.run(
      ` MATCH (p:${cap(NodeType.DashboardSection)} {_id:$pid})
        DETACH DELETE p`,
      { pid: _id }
    );
  }, txc);
};

export default { create, read, reduce, remove, update };
