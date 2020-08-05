import dbs, { cypher, sessionable } from "../common/dbs";
import { capitalize } from "../controllers/Node.controller";
import { NodeType, INode, DataModel } from "@cxss/interfaces";
import { Transaction } from "neo4j-driver";

const create = async <T>(nodeType: NodeType, data: T): Promise<T> => {
  let res = await cypher(
    ` CREATE (n:${capitalize(nodeType)} $body)
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

export default { create, read, reduce, remove };
