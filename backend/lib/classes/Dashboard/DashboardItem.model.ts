import { NodeType, IDashboardItem } from "@cxss/interfaces";
import { sessionable, cypher } from "../../common/dbs";
import { Transaction } from "neo4j-driver";
import { capitalize as cap } from "../../controllers/Node.controller";
import Node from "../Node.model";

const create = async (data: IDashboardItem, section_id: string): Promise<IDashboardItem> => {
  let body = <any>Object.assign({}, data);
  //parse into json for object storage
  body.position = JSON.stringify(body.position);
  body.aggregation_request = JSON.stringify(body.aggregation_request);

  const res = await cypher(
    ` MATCH (ds:${cap(NodeType.DashboardSection)} {_id:$sid})
      WHERE ds IS NOT NULL
      CREATE (di:${cap(NodeType.DashboardItem)} $body)<-[:HAS_ITEM]-(ds)
      RETURN di`,
    {
      sid: section_id,
      body: body,
    }
  );

  return reduce(data);
};

const read = async (_id: string): Promise<IDashboardItem> => {
  const res = await cypher(
    ` MATCH (d:${cap(NodeType.DashboardItem)} {_id:$diid})
      RETURN d`,
    { diid: _id }
  );

  let data = <IDashboardItem>res.records[0].get("d").properties;
  //parse back into object from json
  data.aggregation_request = JSON.parse(<any>data.aggregation_request);
  data.position = JSON.parse(<any>data.position);
  return reduce(data);
};

const reduce = (data: IDashboardItem) => {
  return data;
};

const update = async (_id: string, newFieldValues: { [index: string]: any }) => {
  const updatableFields = ["position", "aggregation_request"];

  const filtered: { [index: string]: any } = updatableFields.reduce(
    (obj, key) => ({ ...obj, [key]: newFieldValues[key] }),
    {}
  );

  if (Object.keys(filtered).includes("position")) filtered.position = JSON.stringify(filtered.position);
  if (Object.keys(filtered).includes("aggregation_request")) filtered.aggregation_request = JSON.stringify(filtered.aggregation_request);

  await Node.update(_id, filtered, NodeType.DashboardItem);
};

const remove = async (_id: string, txc?: Transaction) => {
  await sessionable(async (t: Transaction) => {
    await t.run(
      ` MATCH (p:${cap(NodeType.DashboardItem)} {_id:$pid})
        DETACH DELETE p`,
      { pid: _id }
    );
  }, txc);
};

export default { create, read, reduce, remove, update };
