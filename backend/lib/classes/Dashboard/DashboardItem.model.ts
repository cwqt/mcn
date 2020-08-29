import { NodeType, IDashboardItem } from "@cxss/interfaces";
import { sessionable, cypher } from "../../common/dbs";
import { Transaction } from "neo4j-driver";
import { capitalize } from "../../controllers/Node.controller";

const create = async (data: IDashboardItem, dashboard_id: string): Promise<IDashboardItem> => {
  let body = <any>data;
  //parse into json for object storage
  body.position = JSON.stringify(body.position);
  body.source_fields = JSON.stringify(body.source_fields);

  let res = await cypher(
    ` MATCH (d:Dashboard {_id:$did})
      WHERE d IS NOT NULL
      CREATE (di:DashboardItem $body)<-[:HAS_ITEM]-(d)
      RETURN di`,
    {
      did: dashboard_id,
      body: body,
    }
  );

  let di = res.records[0].get("di").properties;
  return reduce(di);
};

const read = async (_id: string): Promise<IDashboardItem> => {
  let data;
  let res = await cypher(
    ` MATCH (d:DashboardItem {_id:$diid})
      RETURN d`,
    { diid: _id }
  );

  data = <IDashboardItem>res.records[0].get("d").properties;
  //parse back into object from json
  data.source_fields = JSON.parse(<any>data.source_fields);
  data.position = JSON.parse(<any>data.source_fields);

  return reduce(data);
};

const reduce = (data: IDashboardItem) => {
  return data;
};

const remove = async (_id: string, txc?: Transaction) => {
  await sessionable(async (t: Transaction) => {
    await t.run(
      ` MATCH (p:${capitalize(NodeType.DashboardItem)} {_id:$pid})
        DETACH DELETE p`,
      { pid: _id }
    );
  }, txc);
};

export default { create, read, reduce, remove };
