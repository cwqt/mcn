import { Request, Response } from "express";
import { HTTP } from "../common/http";
import { cypher } from "../common/dbs";
import { NodeType, Paginated } from "@cxss/interfaces";
import config from "../config";

export const createPaginator = (
  nodeType: NodeType,
  results: any[],
  count: number,
  per_page: number,
  org_id?: string
): Paginated<any> => {
  count = count || 0;

  let pages: Paginated<any> = {
    results: results,
    next: `${config.API_URL}/${
      org_id && `orgs/${org_id}/`
    }${nodeType}s?page=1&per_page=${per_page}`,
    prev: `${config.API_URL}/${org_id && `orgs/${org_id}/`}${nodeType}s?page=${Math.ceil(
      count / per_page
    )}&per_page=${per_page}`,
    total: count,
    pages: Math.ceil(count / per_page),
  };

  return pages;
};

export const capitalize = (str: NodeType | string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const createNode = async (type: Node, body: any) => {
  let results = await cypher(
    `
    CREATE (n:${type} $body)
    RETURN n
  `,
    {
      body: body,
    }
  );
  return results.records[0].get("n").properties;
};

export const readNodes = async (type: NodeType, inOrg: boolean = false) => {
  let results = await cypher(
    `
        MATCH (n:${capitalize(type)})${inOrg ? "-[:IN]->(:Organisation)" : ""}
        RETURN n
    `,
    {}
  );

  return results.records.map((r: any) => r.get("n").properties);
};

export const readNode = async (type: NodeType, _id: string) => {
  let results = await cypher(
    `
        MATCH (n:${capitalize(type)} {_id:$nid})
        RETURN n
    `,
    { nid: _id }
  );

  return results.records[0]?.get("n")?.properties ?? {};
};

export const deleteNode = async (type: NodeType, _id: string) => {};
export const updateNode = async (type: NodeType, _id: string, body: any) => {
  let result = await cypher(
    `
    `,
    {
      nid: _id,
    }
  );
};
// export const addOrgItemToOrg = (type: OrgItemType, _id: string, orgId: string) => {};
// export const removeOrgItemFromOrg = (type: OrgItemType, _id: string, orgId: string) => {};

export const readNodeMiddleware = (type: NodeType, key: string) => {
  return async (req: Request, res: Response) => {
    let node = await readNode(type, req.params[key]);
    res.json(node);
  };
};

export const deleteNodeMiddleware = (type: NodeType, key: string) => {
  return async (req: Request, res: Response) => {
    await deleteNode(type, req.params[key]);
    res.status(HTTP.OK).end();
  };
};
