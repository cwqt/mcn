import dbs, { cypher, sessionable } from "../common/dbs";
import { capitalize } from "../controllers/Node.controller";
import { NodeType, INode, DataModel } from "@cxss/interfaces";
import { Transaction, integer } from "neo4j-driver";
import { isNumber } from "util";

const create = async <T>(nodeType: NodeType, data: T, creator_id?: string): Promise<T> => {
  let res = await cypher(
    `
      ${creator_id && `MATCH (u:User {_id:'${creator_id}'})\n`}
      CREATE (n:${capitalize(nodeType)} $body)
      ${creator_id && `CREATE (u)-[:CREATED]->(n)\n`}
      RETURN n`,
    {
      body: data,
    }
  );

  return res.records[0].get("n").properties;
};

const read = async <T>(_id: string, nodeType?: NodeType): Promise<T> => {
  let res = await cypher(
    `
    MATCH (n:${nodeType ? capitalize(nodeType) : "Node"} {_id:$id})
    RETURN n
  `,
    { id: _id }
  );

  return res.records[0].get("n").properties as T;
};

const reduce = (data: INode): INode => {
  return {
    _id: data._id,
    created_at: data.created_at,
    type: data.type,
  };
};

const remove = async (_id: string, nodeType: NodeType, txc?: Transaction) => {
  return sessionable(async (t: Transaction) => {
    await t.run(
      ` MATCH (n:${nodeType ? capitalize(nodeType) : "Node"} {_id:$id})
        DETACH DELETE d
        RETURN p{._id, .type}`,
      {
        id: _id,
      }
    );
  }, txc);
};

const update = async (_id: string, body: { [index: string]: any }, nodeType?: NodeType) => {
  //convert from 53bit num to n4j 64bit num
  for (let [key, value] of Object.entries(body)) {
    if (isNumber(value)) body[key] = integer.toNumber(value);
  }

  let res = await cypher(
    ` MATCH (n:${nodeType ? capitalize(nodeType) : "Node"} {_id:$id})
      SET n += $body
      RETURN n`,
    {
      id: _id,
      body: body,
    }
  );

  return res.records[0]?.get("n")?.properties;
};

export default { create, read, update, reduce, remove };
